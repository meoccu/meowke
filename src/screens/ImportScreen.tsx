import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors, Fonts, BorderRadius, Spacing } from '../theme/colors';
import { useSemesterStore } from '../store';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Card } from '../components/common/Card';
import { EmptyState } from '../components/common/EmptyState';
import { RootStackParamList } from '../navigation/AppNavigator';
import { School, DEFAULT_SCHOOLS } from '../types';
import { getRandomColor } from '../utils/dateUtils';

type ImportScreenProps = NativeStackScreenProps<RootStackParamList, 'Import'>;

export const ImportScreen: React.FC<ImportScreenProps> = ({ route, navigation }) => {
  const { semesterId } = route.params;
  const semester = useSemesterStore((state) => state.semesters.find((s) => s.id === semesterId));
  const addCourse = useSemesterStore((state) => state.addCourse);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [jwUrl, setJwUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'select' | 'manual' | 'result'>('select');

  const handleImport = async () => {
    if (!semester) return;

    if (selectedSchool?.id === 'custom' && !jwUrl.trim()) {
      Alert.alert('提示', '请输入教务系统网址');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // 模拟导入成功，添加示例课程
      const demoCourses = [
        {
          name: '高等数学',
          teacher: '张教授',
          location: 'A301',
          dayOfWeek: 1 as const,
          startPeriod: 1,
          endPeriod: 2,
          startWeek: 1,
          endWeek: 16,
          weekType: 'all' as const,
          color: getRandomColor(),
        },
        {
          name: '大学英语',
          teacher: '李老师',
          location: 'B205',
          dayOfWeek: 2 as const,
          startPeriod: 3,
          endPeriod: 4,
          startWeek: 1,
          endWeek: 16,
          weekType: 'all' as const,
          color: getRandomColor(),
        },
        {
          name: '线性代数',
          teacher: '王教授',
          location: 'A302',
          dayOfWeek: 3 as const,
          startPeriod: 1,
          endPeriod: 2,
          startWeek: 1,
          endWeek: 16,
          weekType: 'all' as const,
          color: getRandomColor(),
        },
        {
          name: '程序设计',
          teacher: '陈老师',
          location: '机房C1',
          dayOfWeek: 4 as const,
          startPeriod: 5,
          endPeriod: 6,
          startWeek: 1,
          endWeek: 16,
          weekType: 'all' as const,
          color: getRandomColor(),
        },
        {
          name: '体育',
          teacher: '刘教练',
          location: '体育馆',
          dayOfWeek: 5 as const,
          startPeriod: 3,
          endPeriod: 4,
          startWeek: 1,
          endWeek: 16,
          weekType: 'all' as const,
          color: getRandomColor(),
        },
      ];

      demoCourses.forEach((course) => addCourse(semesterId, course));
      Alert.alert('导入成功', `已导入 ${demoCourses.length} 门课程`, [
        { text: '确定', onPress: () => navigation.goBack() },
      ]);
    }, 2000);
  };

  if (!semester) {
    return (
      <View style={styles.container}>
        <EmptyState title="学期不存在" subtitle="无法导入课表" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>导入课表</Text>
        <Text style={styles.headerSubtitle}>{semester.name} · {semester.schoolName}</Text>
      </View>

      <Card title="选择学校" style={styles.card}>
        <Text style={styles.description}>
          选择你的学校以使用预配置的教务系统导入。未收录学校请手动输入教务系统网址。
        </Text>
        <View style={styles.schoolList}>
          {DEFAULT_SCHOOLS.map((school) => (
            <TouchableOpacity
              key={school.id}
              onPress={() => {
                setSelectedSchool(school);
                if (school.id !== 'custom') {
                  setJwUrl(school.jwSystemUrl || '');
                  setStep('select');
                } else {
                  setStep('manual');
                }
              }}
              style={[
                styles.schoolItem,
                selectedSchool?.id === school.id && styles.schoolItemActive,
              ]}
            >
              <Text
                style={[
                  styles.schoolName,
                  selectedSchool?.id === school.id && styles.schoolNameActive,
                ]}
              >
                {school.name}
              </Text>
              {school.id !== 'custom' && (
                <Text style={styles.schoolUrl}>{school.jwSystemUrl}</Text>
              )}
              {selectedSchool?.id === school.id && (
                <Text style={styles.checkMark}>✓</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </Card>

      {selectedSchool?.id === 'custom' && (
        <Card title="手动输入" style={styles.card}>
          <Input
            label="教务系统网址"
            value={jwUrl}
            onChangeText={setJwUrl}
            placeholder="如：https://jwxt.example.edu.cn"
            keyboardType="url"
          />
        </Card>
      )}

      {selectedSchool && selectedSchool.id !== 'custom' && (
        <Card title="教务系统信息" style={styles.card}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>学校</Text>
            <Text style={styles.infoValue}>{selectedSchool.name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>教务系统</Text>
            <Text style={styles.infoValue}>{selectedSchool.jwSystemUrl}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>地区</Text>
            <Text style={styles.infoValue}>{selectedSchool.region}</Text>
          </View>
        </Card>
      )}

      {selectedSchool && (
        <View style={styles.actions}>
          <Button
            title={loading ? '导入中...' : '开始导入'}
            onPress={handleImport}
            disabled={loading}
            size="large"
          />
          {loading && (
            <ActivityIndicator style={styles.loader} color={Colors.primary} />
          )}
        </View>
      )}

      <View style={styles.notice}>
        <Text style={styles.noticeTitle}>⚠️ 导入说明</Text>
        <Text style={styles.noticeText}>
          1. 导入成功率取决于教务系统接口兼容性{'\n'}
          2. 请确保教务系统网址可访问{'\n'}
          3. 首次导入可能需要登录教务系统{'\n'}
          4. 支持重新导入以更新课表信息
        </Text>
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
  headerSubtitle: {
    fontSize: Fonts.sizeNormal,
    color: '#fff',
    opacity: 0.8,
    marginTop: Spacing.xs,
  },
  card: {
    margin: Spacing.lg,
    marginBottom: 0,
  },
  description: {
    fontSize: Fonts.sizeNormal,
    color: Colors.textLight,
    marginBottom: Spacing.md,
    lineHeight: 20,
  },
  schoolList: {
    gap: Spacing.sm,
  },
  schoolItem: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  schoolItemActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10',
  },
  schoolName: {
    fontSize: Fonts.sizeMedium,
    color: Colors.text,
    fontWeight: Fonts.weightMedium as any,
  },
  schoolNameActive: {
    color: Colors.primary,
    fontWeight: Fonts.weightBold as any,
  },
  schoolUrl: {
    fontSize: Fonts.sizeSmall,
    color: Colors.textLight,
    marginTop: Spacing.xs,
  },
  checkMark: {
    position: 'absolute',
    right: Spacing.md,
    top: Spacing.md,
    fontSize: 20,
    color: Colors.primary,
    fontWeight: 'bold',
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
    flex: 1,
    textAlign: 'right',
  },
  actions: {
    padding: Spacing.lg,
    alignItems: 'center',
  },
  loader: {
    marginTop: Spacing.md,
  },
  notice: {
    margin: Spacing.lg,
    padding: Spacing.md,
    backgroundColor: Colors.warning + '15',
    borderRadius: BorderRadius.md,
  },
  noticeTitle: {
    fontSize: Fonts.sizeMedium,
    fontWeight: Fonts.weightBold as any,
    color: Colors.warning,
    marginBottom: Spacing.sm,
  },
  noticeText: {
    fontSize: Fonts.sizeSmall,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});
