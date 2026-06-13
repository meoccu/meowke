import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors, Fonts, BorderRadius, Spacing } from '../theme/colors';
import { useSemesterStore } from '../store';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Card } from '../components/common/Card';
import { RootStackParamList } from '../navigation/AppNavigator';
import { DEFAULT_CLASS_TIMES } from '../utils/constants';
import { ClassTime } from '../types';

type ClassTimeScreenProps = NativeStackScreenProps<RootStackParamList, 'ClassTime'>;

export const ClassTimeScreen: React.FC<ClassTimeScreenProps> = ({ route, navigation }) => {
  const { semesterId } = route.params;
  const semester = useSemesterStore((state) => state.semesters.find((s) => s.id === semesterId));
  const updateSemester = useSemesterStore((state) => state.updateSemester);

  const [classTimes, setClassTimes] = useState<ClassTime[]>(semester?.classTimes || DEFAULT_CLASS_TIMES);
  const [classDuration, setClassDuration] = useState('45');
  const [breakDuration, setBreakDuration] = useState('10');
  const [editingPeriod, setEditingPeriod] = useState<number | null>(null);
  const [editStart, setEditStart] = useState('');
  const [editEnd, setEditEnd] = useState('');

  const handleAutoGenerate = () => {
    const duration = parseInt(classDuration) || 45;
    const breakTime = parseInt(breakDuration) || 10;
    const baseTimes = [
      { base: '08:00', periods: [1, 2, 3, 4, 5] },
      { base: '13:30', periods: [6, 7, 8, 9, 10] },
      { base: '18:30', periods: [11, 12] },
    ];

    const newTimes: ClassTime[] = [];
    let currentTime = 0;

    baseTimes.forEach((session) => {
      const [h, m] = session.base.split(':').map(Number);
      currentTime = h * 60 + m;
      session.periods.forEach((period) => {
        const startH = Math.floor(currentTime / 60);
        const startM = currentTime % 60;
        const endTime = currentTime + duration;
        const endH = Math.floor(endTime / 60);
        const endM = endTime % 60;

        newTimes.push({
          period,
          startTime: `${startH.toString().padStart(2, '0')}:${startM.toString().padStart(2, '0')}`,
          endTime: `${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`,
          duration,
          breakDuration: breakTime,
        });

        currentTime = endTime + breakTime;
      });
    });

    setClassTimes(newTimes);
  };

  const handleSavePeriod = (period: number) => {
    setClassTimes((prev) =>
      prev.map((ct) =>
        ct.period === period
          ? { ...ct, startTime: editStart, endTime: editEnd }
          : ct
      )
    );
    setEditingPeriod(null);
  };

  const handleSaveAll = () => {
    if (!semester) return;
    updateSemester(semesterId, { classTimes });
    Alert.alert('成功', '节次时间已保存');
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>节次时间设置</Text>
        <Text style={styles.headerSubtitle}>{semester?.name}</Text>
      </View>

      <Card title="自动生成" style={styles.card}>
        <View style={styles.row}>
          <View style={styles.halfInput}>
            <Input
              label="单节课时长（分钟）"
              value={classDuration}
              onChangeText={setClassDuration}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.halfInput}>
            <Input
              label="课间休息（分钟）"
              value={breakDuration}
              onChangeText={setBreakDuration}
              keyboardType="numeric"
            />
          </View>
        </View>
        <Button title="按时段自动生成" onPress={handleAutoGenerate} variant="secondary" />
      </Card>

      <Card title="各节次时间" style={styles.card}>
        {classTimes.map((ct) => (
          <View key={ct.period} style={styles.periodRow}>
            <Text style={styles.periodNumber}>第 {ct.period} 节</Text>
            {editingPeriod === ct.period ? (
              <View style={styles.editRow}>
                <Input
                  value={editStart}
                  onChangeText={setEditStart}
                  placeholder="开始"
                  style={styles.timeInput}
                />
                <Text style={styles.separator}>~</Text>
                <Input
                  value={editEnd}
                  onChangeText={setEditEnd}
                  placeholder="结束"
                  style={styles.timeInput}
                />
                <TouchableOpacity
                  onPress={() => handleSavePeriod(ct.period)}
                  style={styles.saveSmall}
                >
                  <Text style={styles.saveSmallText}>✓</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  setEditingPeriod(ct.period);
                  setEditStart(ct.startTime);
                  setEditEnd(ct.endTime);
                }}
                style={styles.timeDisplay}
              >
                <Text style={styles.timeText}>
                  {ct.startTime} - {ct.endTime}
                </Text>
                <Text style={styles.editHint}>点击编辑</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </Card>

      <View style={styles.actions}>
        <Button title="保存设置" onPress={handleSaveAll} size="large" />
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
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  halfInput: {
    flex: 1,
  },
  periodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  periodNumber: {
    fontSize: Fonts.sizeNormal,
    color: Colors.text,
    fontWeight: Fonts.weightMedium as any,
    width: 70,
  },
  timeDisplay: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: Fonts.sizeNormal,
    color: Colors.text,
  },
  editHint: {
    fontSize: Fonts.sizeSmall,
    color: Colors.primary,
  },
  editRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  timeInput: {
    flex: 1,
    marginBottom: 0,
  },
  separator: {
    fontSize: Fonts.sizeNormal,
    color: Colors.textLight,
  },
  saveSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveSmallText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  actions: {
    padding: Spacing.lg,
  },
});
