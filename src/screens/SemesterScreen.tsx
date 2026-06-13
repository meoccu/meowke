import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors, Fonts, BorderRadius, Spacing } from '../theme/colors';
import { useSemesterStore } from '../store';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Card } from '../components/common/Card';
import { ListItem } from '../components/common/ListItem';
import { EmptyState } from '../components/common/EmptyState';
import { RootStackParamList } from '../navigation/AppNavigator';
import { School, DEFAULT_SCHOOLS } from '../types';
import { getCurrentWeek, calculateTotalWeeks, formatDate } from '../utils/dateUtils';

type SemesterScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Semester'>;
};

export const SemesterScreen: React.FC<SemesterScreenProps> = ({ navigation }) => {
  const semesters = useSemesterStore((state) => state.semesters);
  const addSemester = useSemesterStore((state) => state.addSemester);
  const deleteSemester = useSemesterStore((state) => state.deleteSemester);
  const setCurrentSemester = useSemesterStore((state) => state.setCurrentSemester);
  const currentSemesterId = useSemesterStore((state) => state.currentSemesterId);

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [customSchool, setCustomSchool] = useState(false);

  const handleAdd = () => {
    if (!name.trim() || !schoolName.trim() || !startDate.trim() || !endDate.trim()) {
      Alert.alert('提示', '请填写完整信息');
      return;
    }
    const totalWeeks = calculateTotalWeeks(startDate, endDate);
    if (totalWeeks <= 0) {
      Alert.alert('提示', '结束日期必须晚于开始日期');
      return;
    }
    const id = addSemester({
      name: name.trim(),
      schoolName: schoolName.trim(),
      startDate,
      endDate,
      isCurrent: semesters.length === 0,
    });
    setCurrentSemester(id);
    Alert.alert('成功', '学期已创建');
    setShowForm(false);
    setName('');
    setSchoolName('');
    setStartDate('');
    setEndDate('');
  };

  const handleDelete = (id: string, name: string) => {
    Alert.alert('确认删除', `确定删除学期 "${name}" 吗？`, [
      { text: '取消', style: 'cancel' },
      {
        text: '删除',
        style: 'destructive',
        onPress: () => deleteSemester(id),
      },
    ]);
  };

  const selectSchool = (school: School) => {
    setSelectedSchool(school);
    setSchoolName(school.name);
    if (school.id === 'custom') {
      setCustomSchool(true);
    } else {
      setCustomSchool(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>学期管理</Text>
        <Text style={styles.headerSubtitle}>管理你的学期和课表</Text>
      </View>

      {/* 添加按钮 */}
      {!showForm && (
        <View style={styles.addButtonContainer}>
          <Button title="+ 创建新学期" onPress={() => setShowForm(true)} size="large" />
        </View>
      )}

      {/* 创建表单 */}
      {showForm && (
        <Card title="创建新学期" style={styles.formCard}>
          <Text style={styles.sectionLabel}>选择学校</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.schoolScroll}>
            {DEFAULT_SCHOOLS.map((school) => (
              <TouchableOpacity
                key={school.id}
                onPress={() => selectSchool(school)}
                style={[
                  styles.schoolChip,
                  selectedSchool?.id === school.id && styles.schoolChipActive,
                ]}
              >
                <Text
                  style={[
                    styles.schoolChipText,
                    selectedSchool?.id === school.id && styles.schoolChipTextActive,
                  ]}
                >
                  {school.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {customSchool && (
            <Input
              label="学校名称"
              value={schoolName}
              onChangeText={setSchoolName}
              placeholder="请输入学校名称"
            />
          )}

          <Input
            label="学期名称"
            value={name}
            onChangeText={setName}
            placeholder="如：2025-2026 第二学期"
          />

          <Input
            label="开学日期"
            value={startDate}
            onChangeText={setStartDate}
            placeholder="YYYY-MM-DD"
          />

          <Input
            label="结束日期"
            value={endDate}
            onChangeText={setEndDate}
            placeholder="YYYY-MM-DD"
          />

          <View style={styles.formActions}>
            <Button title="取消" onPress={() => setShowForm(false)} variant="outline" />
            <Button title="创建" onPress={handleAdd} />
          </View>
        </Card>
      )}

      {/* 学期列表 */}
      <Card title="我的学期">
        {semesters.length === 0 ? (
          <EmptyState title="暂无学期" subtitle="点击上方按钮创建新学期" />
        ) : (
          semesters.map((semester) => {
            const currentWeek = getCurrentWeek(semester.startDate);
            const isCurrent = semester.id === currentSemesterId;

            return (
              <ListItem
                key={semester.id}
                title={semester.name}
                subtitle={`${semester.schoolName} · 第 ${currentWeek}/${semester.totalWeeks} 周 · ${semester.courses.length} 门课程`}
                onPress={() => {
                  setCurrentSemester(semester.id);
                  Alert.alert('提示', `已切换到 ${semester.name}`);
                }}
                rightElement={
                  <View style={styles.rowActions}>
                    {isCurrent && (
                      <View style={styles.currentBadge}>
                        <Text style={styles.currentBadgeText}>当前</Text>
                      </View>
                    )}
                    <TouchableOpacity
                      onPress={() => handleDelete(semester.id, semester.name)}
                      style={styles.deleteButton}
                    >
                      <Text style={styles.deleteText}>删除</Text>
                    </TouchableOpacity>
                  </View>
                }
              />
            );
          })
        )}
      </Card>
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
  addButtonContainer: {
    padding: Spacing.lg,
  },
  formCard: {
    margin: Spacing.lg,
  },
  sectionLabel: {
    fontSize: Fonts.sizeNormal,
    color: Colors.text,
    fontWeight: Fonts.weightMedium as any,
    marginBottom: Spacing.sm,
  },
  schoolScroll: {
    marginBottom: Spacing.md,
  },
  schoolChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background,
    marginRight: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  schoolChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  schoolChipText: {
    fontSize: Fonts.sizeNormal,
    color: Colors.text,
    fontWeight: Fonts.weightMedium as any,
  },
  schoolChipTextActive: {
    color: '#fff',
  },
  formActions: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  rowActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
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
  deleteButton: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  deleteText: {
    fontSize: Fonts.sizeSmall,
    color: Colors.danger,
  },
});
