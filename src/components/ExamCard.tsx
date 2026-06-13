import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Fonts, BorderRadius, Spacing, Shadows } from '../theme/colors';
import { Exam } from '../types';
import { formatDate, getReminderLabel } from '../utils/dateUtils';

interface ExamCardProps {
  exam: Exam;
  onPress?: () => void;
  onToggleComplete?: () => void;
}

export const ExamCard: React.FC<ExamCardProps> = ({ exam, onPress, onToggleComplete }) => {
  const isCompleted = exam.completed;
  const isPast = new Date(`${exam.date}T${exam.endTime}`) < new Date();

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.card, isCompleted && styles.completedCard]}>
        <View style={styles.header}>
          <View style={styles.titleSection}>
            <Text style={[styles.name, isCompleted && styles.completedText]}>
              {exam.courseName}
            </Text>
            <Text style={styles.duration}>{exam.duration} 分钟</Text>
          </View>
          <TouchableOpacity
            onPress={onToggleComplete}
            style={[styles.checkButton, isCompleted && styles.checkButtonActive]}
          >
            <Text style={isCompleted ? styles.checkTextActive : styles.checkText}>
              {isCompleted ? '✓' : '○'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.details}>
          <View style={styles.row}>
            <Text style={styles.label}>日期：</Text>
            <Text style={styles.value}>{formatDate(exam.date)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>时间：</Text>
            <Text style={styles.value}>
              {exam.startTime} - {exam.endTime}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>地点：</Text>
            <Text style={styles.value}>{exam.location}</Text>
          </View>
          {exam.reminder > 0 && (
            <View style={styles.row}>
              <Text style={styles.label}>提醒：</Text>
              <Text style={styles.reminder}>{getReminderLabel(exam.reminder)}</Text>
            </View>
          )}
        </View>

        {isPast && !isCompleted && (
          <View style={styles.missedBadge}>
            <Text style={styles.missedText}>已结束</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.small,
  },
  completedCard: {
    opacity: 0.7,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  titleSection: {
    flex: 1,
  },
  name: {
    fontSize: Fonts.sizeLarge,
    fontWeight: Fonts.weightBold as any,
    color: Colors.text,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: Colors.textLight,
  },
  duration: {
    fontSize: Fonts.sizeSmall,
    color: Colors.primary,
    marginTop: Spacing.xs,
  },
  checkButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.md,
  },
  checkButtonActive: {
    borderColor: Colors.success,
    backgroundColor: Colors.success,
  },
  checkText: {
    fontSize: 18,
    color: Colors.border,
  },
  checkTextActive: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  details: {
    gap: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
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
  reminder: {
    fontSize: Fonts.sizeSmall,
    color: Colors.warning,
    fontWeight: Fonts.weightMedium as any,
  },
  missedBadge: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.lg,
    backgroundColor: Colors.danger + '20',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  missedText: {
    fontSize: Fonts.sizeSmall,
    color: Colors.danger,
    fontWeight: Fonts.weightMedium as any,
  },
});
