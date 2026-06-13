import React, { useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors, Fonts, BorderRadius, Spacing, Shadows } from '../theme/colors';
import { useSemesterStore } from '../store';
import { ExamCard } from '../components/ExamCard';
import { EmptyState } from '../components/common/EmptyState';
import { Button } from '../components/common/Button';
import { RootStackParamList } from '../navigation/AppNavigator';
import { getCurrentWeek } from '../utils/dateUtils';

type ExamScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Main'>;
};

export const ExamScreen: React.FC<ExamScreenProps> = ({ navigation }) => {
  const semester = useSemesterStore((state) => state.getCurrentSemester());
  const toggleExamComplete = useSemesterStore((state) => state.toggleExamComplete);
  const deleteExam = useSemesterStore((state) => state.deleteExam);

  const [filter, setFilter] = React.useState<'all' | 'upcoming' | 'completed'>('all');

  const exams = semester?.exams || [];
  const now = new Date();

  const filteredExams = exams.filter((exam) => {
    const examDate = new Date(`${exam.date}T${exam.endTime}`);
    if (filter === 'upcoming') return !exam.completed && examDate >= now;
    if (filter === 'completed') return exam.completed;
    return true;
  });

  const sortedExams = [...filteredExams].sort((a, b) => {
    return new Date(`${a.date}T${a.startTime}`).getTime() - new Date(`${b.date}T${b.startTime}`).getTime();
  });

  const upcomingCount = exams.filter((e) => {
    const d = new Date(`${e.date}T${e.endTime}`);
    return !e.completed && d >= now;
  }).length;

  const completedCount = exams.filter((e) => e.completed).length;

  if (!semester) {
    return (
      <View style={styles.container}>
        <EmptyState title="暂无学期" subtitle="请先创建学期后再添加考试" />
        <View style={styles.buttonContainer}>
          <Button title="创建学期" onPress={() => navigation.navigate('Semester')} size="large" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 头部信息 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>考试日程</Text>
        <Text style={styles.headerSubtitle}>
          {semester.name} · 共 {exams.length} 场考试
        </Text>
      </View>

      {/* 筛选标签 */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          onPress={() => setFilter('all')}
          style={[styles.filterButton, filter === 'all' && styles.filterActive]}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
            全部 ({exams.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setFilter('upcoming')}
          style={[styles.filterButton, filter === 'upcoming' && styles.filterActive]}
        >
          <Text style={[styles.filterText, filter === 'upcoming' && styles.filterTextActive]}>
            待考 ({upcomingCount})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setFilter('completed')}
          style={[styles.filterButton, filter === 'completed' && styles.filterActive]}
        >
          <Text style={[styles.filterText, filter === 'completed' && styles.filterTextActive]}>
            已考 ({completedCount})
          </Text>
        </TouchableOpacity>
      </View>

      {/* 考试列表 */}
      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {sortedExams.length === 0 ? (
          <EmptyState
            title="暂无考试"
            subtitle={filter === 'upcoming' ? '没有待考考试' : filter === 'completed' ? '没有已完成考试' : '点击右下角添加考试'}
          />
        ) : (
          sortedExams.map((exam) => (
            <ExamCard
              key={exam.id}
              exam={exam}
              onPress={() => navigation.navigate('AddExam', { semesterId: semester.id, examId: exam.id })}
              onToggleComplete={() => toggleExamComplete(semester.id, exam.id)}
            />
          ))
        )}
      </ScrollView>

      {/* 添加按钮 */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddExam', { semesterId: semester.id })}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
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
  filterRow: {
    flexDirection: 'row',
    padding: Spacing.md,
    gap: Spacing.sm,
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  filterButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background,
  },
  filterActive: {
    backgroundColor: Colors.primary,
  },
  filterText: {
    fontSize: Fonts.sizeSmall,
    color: Colors.text,
    fontWeight: Fonts.weightMedium as any,
  },
  filterTextActive: {
    color: '#fff',
  },
  list: {
    flex: 1,
    paddingTop: Spacing.sm,
  },
  addButton: {
    position: 'absolute',
    right: Spacing.lg,
    bottom: Spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.medium,
  },
  addButtonText: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonContainer: {
    padding: Spacing.lg,
  },
});
