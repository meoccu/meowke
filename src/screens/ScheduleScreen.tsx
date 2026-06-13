import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors, Fonts, BorderRadius, Spacing } from '../theme/colors';
import { useSemesterStore } from '../store';
import { WeekSelector } from '../components/WeekSelector';
import { ScheduleTable } from '../components/ScheduleTable';
import { CourseCard } from '../components/CourseCard';
import { EmptyState } from '../components/common/EmptyState';
import { Button } from '../components/common/Button';
import { WEEK_DAYS } from '../types';
import { getCurrentWeek, getWeekDateRange } from '../utils/dateUtils';
import { RootStackParamList } from '../navigation/AppNavigator';

type ScheduleScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Main'>;
};

export const ScheduleScreen: React.FC<ScheduleScreenProps> = ({ navigation }) => {
  const semester = useSemesterStore((state) => state.getCurrentSemester());
  const getCoursesByWeek = useSemesterStore((state) => state.getCoursesByWeek);

  const [currentWeek, setCurrentWeek] = useState(1);
  const [selectedDay, setSelectedDay] = useState(new Date().getDay() || 1);
  const [viewMode, setViewMode] = useState<'list' | 'table'>('list');

  useFocusEffect(
    useCallback(() => {
      if (semester) {
        const week = getCurrentWeek(semester.startDate);
        setCurrentWeek(Math.max(1, Math.min(week, semester.totalWeeks)));
      }
    }, [semester])
  );

  const weekCourses = semester ? getCoursesByWeek(semester.id, currentWeek) : [];
  const dayCourses = weekCourses.filter((c) => c.dayOfWeek === selectedDay);

  const { start, end } = semester
    ? getWeekDateRange(semester.startDate, currentWeek)
    : { start: '', end: '' };

  if (!semester) {
    return (
      <View style={styles.container}>
        <EmptyState title="暂无学期" subtitle="请先创建或导入一个学期" />
        <View style={styles.buttonContainer}>
          <Button title="创建学期" onPress={() => navigation.navigate('Semester')} size="large" />
        </View>
      </View>
    );
  }

  const weekLabel = currentWeek === getCurrentWeek(semester.startDate) ? '本周' : `第${currentWeek}周`;

  return (
    <View style={styles.container}>
      {/* 顶部信息栏 */}
      <View style={styles.header}>
        <View style={styles.headerInfo}>
          <Text style={styles.schoolName}>{semester.schoolName}</Text>
          <Text style={styles.semesterName}>{semester.name}</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Semester')} style={styles.semesterButton}>
          <Text style={styles.semesterButtonText}>切换学期</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.weekInfo}>
        <Text style={styles.weekLabel}>
          {weekLabel} · {start} ~ {end}
        </Text>
      </View>

      {/* 周选择器 */}
      <WeekSelector currentWeek={currentWeek} totalWeeks={semester.totalWeeks} onSelectWeek={setCurrentWeek} />

      {/* 视图切换 */}
      <View style={styles.viewToggle}>
        <TouchableOpacity
          onPress={() => setViewMode('list')}
          style={[styles.viewButton, viewMode === 'list' && styles.viewButtonActive]}
        >
          <Text style={[styles.viewButtonText, viewMode === 'list' && styles.viewButtonTextActive]}>列表</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setViewMode('table')}
          style={[styles.viewButton, viewMode === 'table' && styles.viewButtonActive]}
        >
          <Text style={[styles.viewButtonText, viewMode === 'table' && styles.viewButtonTextActive]}>课表</Text>
        </TouchableOpacity>
      </View>

      {viewMode === 'list' ? (
        <>
          {/* 星期选择 */}
          <View style={styles.daySelector}>
            {WEEK_DAYS.map((day, index) => {
              const dayNum = index + 1;
              const isSelected = dayNum === selectedDay;
              const isToday = dayNum === (new Date().getDay() || 1);
              const dayCourseCount = weekCourses.filter((c) => c.dayOfWeek === dayNum).length;

              return (
                <TouchableOpacity
                  key={day}
                  onPress={() => setSelectedDay(dayNum)}
                  style={[
                    styles.dayButton,
                    isSelected && styles.dayButtonSelected,
                    isToday && !isSelected && styles.dayButtonToday,
                  ]}
                >
                  <Text
                    style={[
                      styles.dayName,
                      isSelected && styles.dayNameSelected,
                      isToday && !isSelected && styles.dayNameToday,
                    ]}
                  >
                    {day}
                  </Text>
                  <Text style={[styles.dayCount, isSelected && styles.dayCountSelected]}>{dayCourseCount}节</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* 课程列表 */}
          <ScrollView style={styles.courseList} showsVerticalScrollIndicator={false}>
            {dayCourses.length === 0 ? (
              <EmptyState
                title="今天没有课程"
                subtitle={`${WEEK_DAYS[selectedDay - 1]} 第 ${currentWeek} 周暂无课程安排`}
              />
            ) : (
              dayCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  semesterId={semester.id}
                  onPress={() =>
                    navigation.navigate('CourseDetail', { courseId: course.id, semesterId: semester.id })
                  }
                />
              ))
            )}
          </ScrollView>
        </>
      ) : (
        <View style={styles.tableContainer}>
          <ScheduleTable
            semesterId={semester.id}
            week={currentWeek}
            onCoursePress={(course) =>
              navigation.navigate('CourseDetail', { courseId: course.id, semesterId: semester.id })
            }
          />
        </View>
      )}

      {/* 底部操作栏 */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => setViewMode(viewMode === 'list' ? 'table' : 'list')} style={styles.footerButton}>
          <Text style={styles.footerButtonText}>{viewMode === 'list' ? '📊 课表视图' : '📋 列表视图'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('AddCourse', { semesterId: semester.id })}
          style={[styles.footerButton, styles.footerButtonPrimary]}
        >
          <Text style={[styles.footerButtonText, styles.footerButtonTextPrimary]}>+ 添加课程</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg, paddingBottom: Spacing.md,
    backgroundColor: Colors.primary,
  },
  headerInfo: { flex: 1 },
  schoolName: { fontSize: Fonts.sizeLarge, fontWeight: '700', color: '#fff' },
  semesterName: { fontSize: Fonts.sizeSmall, color: '#fff', opacity: 0.8, marginTop: 2 },
  semesterButton: { backgroundColor: '#fff', paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: BorderRadius.md },
  semesterButtonText: { fontSize: Fonts.sizeSmall, color: Colors.primary, fontWeight: '700' },
  weekInfo: { backgroundColor: Colors.primary, paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md },
  weekLabel: { fontSize: Fonts.sizeNormal, color: '#fff', opacity: 0.9 },
  viewToggle: {
    flexDirection: 'row', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm,
    backgroundColor: Colors.card, gap: Spacing.md, justifyContent: 'center',
  },
  viewButton: { flex: 1, alignItems: 'center', paddingVertical: Spacing.sm, borderRadius: BorderRadius.md, backgroundColor: Colors.background },
  viewButtonActive: { backgroundColor: Colors.primary },
  viewButtonText: { fontSize: Fonts.sizeNormal, color: Colors.text, fontWeight: '500' },
  viewButtonTextActive: { color: '#fff', fontWeight: '700' },
  daySelector: {
    flexDirection: 'row', paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    backgroundColor: Colors.card, borderBottomWidth: 1, borderBottomColor: Colors.divider,
  },
  dayButton: { flex: 1, alignItems: 'center', paddingVertical: Spacing.sm, borderRadius: BorderRadius.md },
  dayButtonSelected: { backgroundColor: Colors.primary },
  dayButtonToday: { backgroundColor: Colors.primary + '15' },
  dayName: { fontSize: Fonts.sizeNormal, color: Colors.text, fontWeight: '500' },
  dayNameSelected: { color: '#fff', fontWeight: '700' },
  dayNameToday: { color: Colors.primary },
  dayCount: { fontSize: 10, color: Colors.textLight, marginTop: 2 },
  dayCountSelected: { color: '#fff', opacity: 0.8 },
  courseList: { flex: 1, paddingTop: Spacing.sm },
  tableContainer: { flex: 1 },
  footer: {
    flexDirection: 'row', padding: Spacing.md, backgroundColor: Colors.card,
    borderTopWidth: 1, borderTopColor: Colors.divider, gap: Spacing.md,
  },
  footerButton: { flex: 1, paddingVertical: Spacing.md, alignItems: 'center', borderRadius: BorderRadius.md, backgroundColor: Colors.background },
  footerButtonPrimary: { backgroundColor: Colors.primary },
  footerButtonText: { fontSize: Fonts.sizeNormal, color: Colors.text, fontWeight: '700' },
  footerButtonTextPrimary: { color: '#fff' },
  buttonContainer: { padding: Spacing.lg },
});
