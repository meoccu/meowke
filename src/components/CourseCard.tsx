import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Fonts, BorderRadius, Spacing, Shadows } from '../../theme/colors';
import { Course } from '../../types';
import { formatTimeRange, getWeekTypeLabel } from '../../utils/dateUtils';
import { useSemesterStore } from '../../store';

interface CourseCardProps {
  course: Course;
  onPress?: () => void;
  compact?: boolean;
  semesterId: string;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onPress, compact, semesterId }) => {
  const semester = useSemesterStore((state) => state.semesters.find((s) => s.id === semesterId));
  const classTime = semester?.classTimes.find((ct) => ct.period === course.startPeriod);

  const timeText = classTime
    ? `${classTime.startTime} - ${semester?.classTimes.find((ct) => ct.period === course.endPeriod)?.endTime || classTime.endTime}`
    : `第 ${course.startPeriod} - ${course.endPeriod} 节`;

  if (compact) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        <View style={[styles.compactCard, { backgroundColor: course.color + '15', borderLeftColor: course.color }]}>
          <Text style={[styles.compactName, { color: course.color }]} numberOfLines={1}>
            {course.name}
          </Text>
          <Text style={styles.compactInfo} numberOfLines={1}>
            {course.location}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.card, { borderLeftColor: course.color }]}>
        <View style={styles.header}>
          <Text style={styles.name}>{course.name}</Text>
          <View style={[styles.weekBadge, { backgroundColor: course.color + '20' }]}>
            <Text style={[styles.weekText, { color: course.color }]}>
              {course.startWeek}-{course.endWeek}周 {getWeekTypeLabel(course.weekType)}
            </Text>
          </View>
        </View>
        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Text style={styles.label}>教师：</Text>
            <Text style={styles.value}>{course.teacher}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>时间：</Text>
            <Text style={styles.value}>{timeText}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>地点：</Text>
            <Text style={styles.value}>{course.location}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderLeftWidth: 4,
    ...Shadows.small,
  },
  compactCard: {
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
    marginBottom: 2,
    borderLeftWidth: 3,
  },
  compactName: {
    fontSize: Fonts.sizeSmall,
    fontWeight: Fonts.weightBold as any,
    marginBottom: 2,
  },
  compactInfo: {
    fontSize: 10,
    color: Colors.textLight,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  name: {
    fontSize: Fonts.sizeLarge,
    fontWeight: Fonts.weightBold as any,
    color: Colors.text,
    flex: 1,
  },
  weekBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  weekText: {
    fontSize: Fonts.sizeSmall,
    fontWeight: Fonts.weightMedium as any,
  },
  details: {
    gap: Spacing.xs,
  },
  detailRow: {
    flexDirection: 'row',
  },
  label: {
    fontSize: Fonts.sizeNormal,
    color: Colors.textLight,
    width: 48,
  },
  value: {
    fontSize: Fonts.sizeNormal,
    color: Colors.text,
    flex: 1,
  },
});
