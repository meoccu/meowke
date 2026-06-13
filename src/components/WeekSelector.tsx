import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Fonts, BorderRadius, Spacing } from '../theme/colors';

interface WeekSelectorProps {
  currentWeek: number;
  totalWeeks: number;
  onSelectWeek: (week: number) => void;
}

export const WeekSelector: React.FC<WeekSelectorProps> = ({ currentWeek, totalWeeks, onSelectWeek }) => {
  const weeks = Array.from({ length: totalWeeks }, (_, i) => i + 1);
  const displayWeeks = weeks.slice(Math.max(0, currentWeek - 3), Math.min(totalWeeks, currentWeek + 3));

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => onSelectWeek(Math.max(1, currentWeek - 1))}
        style={styles.arrowButton}
      >
        <Text style={styles.arrow}>◀</Text>
      </TouchableOpacity>

      <View style={styles.weeksRow}>
        {displayWeeks.map((week) => (
          <TouchableOpacity
            key={week}
            onPress={() => onSelectWeek(week)}
            style={[
              styles.weekButton,
              week === currentWeek && styles.activeWeekButton,
            ]}
          >
            <Text
              style={[
                styles.weekText,
                week === currentWeek && styles.activeWeekText,
              ]}
            >
              {week}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        onPress={() => onSelectWeek(Math.min(totalWeeks, currentWeek + 1))}
        style={styles.arrowButton}
      >
        <Text style={styles.arrow}>▶</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.card,
  },
  arrowButton: {
    padding: Spacing.sm,
  },
  arrow: {
    fontSize: 16,
    color: Colors.primary,
  },
  weeksRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  weekButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  activeWeekButton: {
    backgroundColor: Colors.primary,
  },
  weekText: {
    fontSize: Fonts.sizeNormal,
    color: Colors.text,
    fontWeight: Fonts.weightMedium as any,
  },
  activeWeekText: {
    color: '#fff',
    fontWeight: Fonts.weightBold as any,
  },
});
