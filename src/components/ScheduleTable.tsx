import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Colors, Fonts, BorderRadius, Spacing } from '../theme/colors';
import { Course, WEEK_DAYS } from '../types';
import { useSemesterStore } from '../store';
import { CourseCard } from './CourseCard';

const { width } = Dimensions.get('window');
const DAY_WIDTH = (width - 48) / 7;
const PERIOD_HEIGHT = 60;

interface ScheduleTableProps {
  semesterId: string;
  week: number;
  onCoursePress?: (course: Course) => void;
}

export const ScheduleTable: React.FC<ScheduleTableProps> = ({ semesterId, week, onCoursePress }) => {
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDay() || 1);
  const semester = useSemesterStore((state) => state.semesters.find((s) => s.id === semesterId));
  const courses = useSemesterStore((state) => state.getCoursesByWeek(semesterId, week));
  const classTimes = semester?.classTimes || [];

  const dayCourses = useMemo(() => {
    return courses.filter((c) => c.dayOfWeek === selectedDay);
  }, [courses, selectedDay]);

  const getCoursesForSlot = (period: number) => {
    return dayCourses.filter((c) => c.startPeriod <= period && c.endPeriod >= period);
  };

  const periods = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <View style={styles.container}>
      {/* 星期标题 */}
      <View style={styles.dayHeader}>
        {WEEK_DAYS.map((day, index) => {
          const dayNum = index + 1;
          const isToday = dayNum === (new Date().getDay() || 1);
          const isSelected = dayNum === selectedDay;
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
                  styles.dayText,
                  isSelected && styles.dayTextSelected,
                  isToday && !isSelected && styles.dayTextToday,
                ]}
              >
                {day}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 课程时段 */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.periodsContainer}>
          {/* 时间列 */}
          <View style={styles.timeColumn}>
            {periods.map((period) => {
              const ct = classTimes.find((c) => c.period === period);
              return (
                <View key={period} style={styles.timeCell}>
                  <Text style={styles.periodNumber}>{period}</Text>
                  {ct && (
                    <>
                      <Text style={styles.timeText}>{ct.startTime}</Text>
                      <Text style={styles.timeText}>{ct.endTime}</Text>
                    </>
                  )}
                </View>
              );
            })}
          </View>

          {/* 课程列 */}
          <View style={styles.courseColumn}>
            {periods.map((period) => {
              const slotCourses = getCoursesForSlot(period);
              const mainCourse = slotCourses.find((c) => c.startPeriod === period);

              return (
                <View key={period} style={styles.periodCell}>
                  {mainCourse && (
                    <TouchableOpacity
                      onPress={() => onCoursePress?.(mainCourse)}
                      style={[
                        styles.courseBlock,
                        {
                          backgroundColor: mainCourse.color + '20',
                          borderColor: mainCourse.color,
                          height: (mainCourse.endPeriod - mainCourse.startPeriod + 1) * PERIOD_HEIGHT - 4,
                        },
                      ]}
                    >
                      <Text style={[styles.courseBlockText, { color: mainCourse.color }]} numberOfLines={1}>
                        {mainCourse.name}
                      </Text>
                      <Text style={[styles.courseBlockSub, { color: mainCourse.color }]} numberOfLines={1}>
                        {mainCourse.location}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  dayHeader: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.card,
  },
  dayButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  dayButtonSelected: {
    backgroundColor: Colors.primary,
  },
  dayButtonToday: {
    backgroundColor: Colors.primary + '15',
  },
  dayText: {
    fontSize: Fonts.sizeSmall,
    color: Colors.text,
    fontWeight: Fonts.weightMedium as any,
  },
  dayTextSelected: {
    color: '#fff',
    fontWeight: Fonts.weightBold as any,
  },
  dayTextToday: {
    color: Colors.primary,
    fontWeight: Fonts.weightBold as any,
  },
  scrollView: {
    flex: 1,
  },
  periodsContainer: {
    flexDirection: 'row',
    padding: Spacing.sm,
  },
  timeColumn: {
    width: 50,
  },
  timeCell: {
    height: PERIOD_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: Colors.divider,
  },
  periodNumber: {
    fontSize: Fonts.sizeSmall,
    fontWeight: Fonts.weightBold as any,
    color: Colors.text,
  },
  timeText: {
    fontSize: 10,
    color: Colors.textLight,
  },
  courseColumn: {
    flex: 1,
  },
  periodCell: {
    height: PERIOD_HEIGHT,
    paddingHorizontal: 2,
    paddingVertical: 2,
  },
  courseBlock: {
    borderRadius: BorderRadius.sm,
    borderLeftWidth: 3,
    padding: 6,
    justifyContent: 'center',
  },
  courseBlockText: {
    fontSize: 12,
    fontWeight: Fonts.weightBold as any,
  },
  courseBlockSub: {
    fontSize: 10,
    marginTop: 2,
  },
});
