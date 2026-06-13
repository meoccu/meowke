import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Alert, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors, Fonts, BorderRadius, Spacing } from '../theme/colors';
import { useSettingsStore } from '../store/settingsStore';
import { Card } from '../components/common/Card';
import { ListItem } from '../components/common/ListItem';
import { RootStackParamList } from '../navigation/AppNavigator';
import { REMINDER_OPTIONS, COURSE_COLORS } from '../types';
import { APP_VERSION } from '../utils/constants';

type SettingsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Settings'>;
};

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const settings = useSettingsStore();

  const requestCalendarPermission = async () => {
    Alert.alert(
      '日历同步',
      '开启日历同步后，喵课会将课程和考试自动添加到系统日历中。请确保授权日历访问权限。',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '开启',
          onPress: () => settings.setSyncToCalendar(true),
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>设置</Text>
      </View>

      <Card title="日历同步">
        <ListItem
          title="同步到系统日历"
          subtitle={settings.syncToCalendar ? '已开启' : '未开启'}
          onPress={() => {
            if (!settings.syncToCalendar) {
              requestCalendarPermission();
            } else {
              settings.setSyncToCalendar(false);
            }
          }}
          rightElement={
            <Switch
              value={settings.syncToCalendar}
              onValueChange={(v) => {
                if (v) requestCalendarPermission();
                else settings.setSyncToCalendar(false);
              }}
              trackColor={{ false: Colors.border, true: Colors.primary }}
            />
          }
        />
      </Card>

      <Card title="提醒设置">
        <Text style={styles.cardSubtitle}>默认考前提醒时间</Text>
        <View style={styles.chipRow}>
          {REMINDER_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.value}
              onPress={() => settings.setDefaultReminder(option.value)}
              style={[
                styles.chip,
                settings.defaultReminder === option.value && styles.chipActive,
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  settings.defaultReminder === option.value && styles.chipTextActive,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Card>

      <Card title="外观主题">
        <Text style={styles.cardSubtitle}>主题颜色</Text>
        <View style={styles.colorRow}>
          {COURSE_COLORS.map((c) => (
            <TouchableOpacity
              key={c}
              onPress={() => settings.setThemeColor(c)}
              style={[
                styles.colorCircle,
                { backgroundColor: c },
                settings.themeColor === c && styles.colorCircleActive,
              ]}
            />
          ))}
        </View>
      </Card>

      <Card title="数据管理">
        <ListItem
          title="重置所有设置"
          subtitle="恢复默认设置（不会删除课表数据）"
          onPress={() =>
            Alert.alert('确认重置', '确定恢复默认设置吗？', [
              { text: '取消', style: 'cancel' },
              { text: '重置', style: 'destructive', onPress: () => settings.resetToDefaults() },
            ])
          }
        />
      </Card>

      <View style={styles.aboutSection}>
        <Text style={styles.aboutText}>喵课 v{APP_VERSION}</Text>
        <Text style={styles.aboutText}>轻量级课表管理工具</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  headerTitle: {
    fontSize: Fonts.sizeXXLarge,
    fontWeight: Fonts.weightBold as any,
    color: '#fff',
  },
  cardSubtitle: {
    fontSize: Fonts.sizeNormal,
    color: Colors.textLight,
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: Fonts.sizeNormal,
    color: Colors.text,
    fontWeight: Fonts.weightMedium as any,
  },
  chipTextActive: {
    color: '#fff',
  },
  colorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
  },
  colorCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  colorCircleActive: {
    borderWidth: 3,
    borderColor: Colors.text,
  },
  aboutSection: {
    alignItems: 'center',
    padding: Spacing.xl,
  },
  aboutText: {
    fontSize: Fonts.sizeSmall,
    color: Colors.textLight,
    marginBottom: Spacing.xs,
  },
});
