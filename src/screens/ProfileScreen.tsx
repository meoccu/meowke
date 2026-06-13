import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors, Fonts, BorderRadius, Spacing } from '../theme/colors';
import { useSemesterStore } from '../store';
import { useSettingsStore } from '../store/settingsStore';
import { Card } from '../components/common/Card';
import { ListItem } from '../components/common/ListItem';
import { Button } from '../components/common/Button';
import { RootStackParamList } from '../navigation/AppNavigator';
import { getCurrentWeek, getHolidayCountdown, formatDate } from '../utils/dateUtils';
import {
  APP_VERSION,
  APP_NAME,
  FEEDBACK_QQ_GROUP,
  PRIVACY_URL,
  TERMS_URL,
  ICP_NUMBER,
  GITHUB_URL,
} from '../utils/constants';

type ProfileScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Main'>;
};

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const semester = useSemesterStore((state) => state.getCurrentSemester());
  const semesters = useSemesterStore((state) => state.semesters);
  const currentWeek = semester ? getCurrentWeek(semester.startDate) : 0;
  const holidayCountdown = semester ? getHolidayCountdown(semester.endDate) : '';
  const settings = useSettingsStore();

  const openQQGroup = () => {
    const qqUrl = `mqqapi://card/show_pslcard?src_type=internal&version=1&uin=${FEEDBACK_QQ_GROUP}&card_type=group&source=external`;
    Linking.canOpenURL(qqUrl).then((supported) => {
      if (supported) {
        Linking.openURL(qqUrl);
      } else {
        Alert.alert('提示', `请手动搜索加入 QQ 群：${FEEDBACK_QQ_GROUP}`);
      }
    });
  };

  const openLink = (url: string) => {
    Linking.openURL(url).catch(() => {
      Alert.alert('提示', '无法打开链接，请检查网络连接');
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 用户信息卡片 */}
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>🐱</Text>
        </View>
        <Text style={styles.appName}>{APP_NAME}</Text>
        <Text style={styles.version}>v{APP_VERSION}</Text>
      </View>

      {/* 学期信息卡片 */}
      <Card title="当前学期" headerRight={
        <TouchableOpacity onPress={() => navigation.navigate('Semester')}>
          <Text style={styles.linkText}>管理</Text>
        </TouchableOpacity>
      }>
        {semester ? (
          <View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>学校</Text>
              <Text style={styles.infoValue}>{semester.schoolName}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>学期</Text>
              <Text style={styles.infoValue}>{semester.name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>当前周</Text>
              <Text style={styles.infoValue}>第 {currentWeek} 周 / 共 {semester.totalWeeks} 周</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>开学日期</Text>
              <Text style={styles.infoValue}>{formatDate(semester.startDate)}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>假期倒计时</Text>
              <Text style={[styles.infoValue, styles.highlight]}>{holidayCountdown}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.emptySemester}>
            <Text style={styles.emptyText}>暂无学期，请先创建</Text>
            <Button
              title="创建学期"
              onPress={() => navigation.navigate('Semester')}
              size="small"
              style={styles.createButton}
            />
          </View>
        )}
      </Card>

      {/* 学期管理 */}
      <Card title="学期列表">
        {semesters.length === 0 ? (
          <Text style={styles.emptyText}>暂无学期</Text>
        ) : (
          semesters.map((s) => (
            <ListItem
              key={s.id}
              title={s.name}
              subtitle={`${s.schoolName} · ${s.courses.length} 门课程 · ${s.exams.length} 场考试`}
              onPress={() => {
                useSemesterStore.getState().setCurrentSemester(s.id);
                Alert.alert('提示', `已切换到 ${s.name}`);
              }}
              rightElement={
                s.id === semester?.id ? (
                  <View style={styles.currentBadge}>
                    <Text style={styles.currentBadgeText}>当前</Text>
                  </View>
                ) : null
              }
            />
          ))
        )}
      </Card>

      {/* 功能设置 */}
      <Card title="功能设置">
        <ListItem
          title="日历同步"
          subtitle={settings.syncToCalendar ? '已开启' : '未开启'}
          onPress={() => navigation.navigate('Settings')}
          rightElement={<Text style={styles.arrow}>›</Text>}
        />
        <ListItem
          title="默认提醒"
          subtitle={settings.defaultReminder === 0 ? '不提醒' : `课前 ${settings.defaultReminder} 分钟`}
          onPress={() => navigation.navigate('Settings')}
          rightElement={<Text style={styles.arrow}>›</Text>}
        />
        <ListItem
          title="课表导入"
          onPress={() => semester && navigation.navigate('Import', { semesterId: semester.id })}
          rightElement={<Text style={styles.arrow}>›</Text>}
        />
      </Card>

      {/* 反馈与关于 */}
      <Card title="反馈与支持">
        <ListItem
          title="QQ 反馈群"
          subtitle={`群号：${FEEDBACK_QQ_GROUP}`}
          onPress={openQQGroup}
          rightElement={<Text style={styles.arrow}>›</Text>}
        />
        <ListItem
          title="开源仓库"
          onPress={() => openLink(GITHUB_URL)}
          rightElement={<Text style={styles.arrow}>›</Text>}
        />
        <ListItem
          title="隐私政策"
          onPress={() => openLink(PRIVACY_URL)}
          rightElement={<Text style={styles.arrow}>›</Text>}
        />
        <ListItem
          title="用户协议"
          onPress={() => openLink(TERMS_URL)}
          rightElement={<Text style={styles.arrow}>›</Text>}
        />
      </Card>

      {/* 关于信息 */}
      <View style={styles.aboutSection}>
        <Text style={styles.aboutText}>
          {APP_NAME} v{APP_VERSION}
        </Text>
        <Text style={styles.aboutText}>官网：meowke.app</Text>
        <Text style={styles.aboutText}>{ICP_NUMBER}</Text>
        <Text style={styles.aboutText}>© 2025 喵课团队</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    backgroundColor: Colors.primary,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  avatarText: {
    fontSize: 40,
  },
  appName: {
    fontSize: Fonts.sizeXXLarge,
    fontWeight: Fonts.weightBold as any,
    color: '#fff',
  },
  version: {
    fontSize: Fonts.sizeNormal,
    color: '#fff',
    opacity: 0.8,
    marginTop: Spacing.xs,
  },
  linkText: {
    fontSize: Fonts.sizeNormal,
    color: Colors.primary,
    fontWeight: Fonts.weightMedium as any,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  infoLabel: {
    fontSize: Fonts.sizeNormal,
    color: Colors.textLight,
  },
  infoValue: {
    fontSize: Fonts.sizeNormal,
    color: Colors.text,
    fontWeight: Fonts.weightMedium as any,
  },
  highlight: {
    color: Colors.primary,
  },
  emptySemester: {
    alignItems: 'center',
    padding: Spacing.md,
  },
  emptyText: {
    fontSize: Fonts.sizeNormal,
    color: Colors.textLight,
    marginBottom: Spacing.md,
  },
  createButton: {
    width: 120,
  },
  currentBadge: {
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  currentBadgeText: {
    fontSize: Fonts.sizeSmall,
    color: Colors.primary,
    fontWeight: Fonts.weightMedium as any,
  },
  arrow: {
    fontSize: 20,
    color: Colors.textLight,
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
