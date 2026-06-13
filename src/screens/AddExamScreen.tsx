import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors, Fonts, BorderRadius, Spacing } from '../theme/colors';
import { useSemesterStore } from '../store';
import { useSettingsStore } from '../store/settingsStore';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Card } from '../components/common/Card';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Exam, REMINDER_OPTIONS } from '../types';

type AddExamScreenProps = NativeStackScreenProps<RootStackParamList, 'AddExam'>;

export const AddExamScreen: React.FC<AddExamScreenProps> = ({ route, navigation }) => {
  const { semesterId, examId } = route.params;
  const semester = useSemesterStore((state) => state.semesters.find((s) => s.id === semesterId));
  const addExam = useSemesterStore((state) => state.addExam);
  const updateExam = useSemesterStore((state) => state.updateExam);
  const deleteExam = useSemesterStore((state) => state.deleteExam);
  const defaultReminder = useSettingsStore((state) => state.defaultReminder);
  const existingExam = examId ? semester?.exams.find((e) => e.id === examId) : null;

  const [courseName, setCourseName] = useState(existingExam?.courseName || '');
  const [date, setDate] = useState(existingExam?.date || '');
  const [startTime, setStartTime] = useState(existingExam?.startTime || '');
  const [endTime, setEndTime] = useState(existingExam?.endTime || '');
  const [location, setLocation] = useState(existingExam?.location || '');
  const [duration, setDuration] = useState(existingExam?.duration?.toString() || '120');
  const [reminder, setReminder] = useState(existingExam?.reminder ?? defaultReminder);

  const handleSave = () => {
    if (!courseName.trim() || !date.trim() || !startTime.trim() || !endTime.trim()) {
      Alert.alert('提示', '请填写完整信息');
      return;
    }

    const examData = {
      courseName: courseName.trim(),
      date,
      startTime,
      endTime,
      location: location.trim(),
      duration: parseInt(duration) || 120,
      completed: existingExam?.completed || false,
      reminder,
    };

    if (existingExam) {
      updateExam(semesterId, examId!, examData);
      Alert.alert('成功', '考试已更新');
    } else {
      addExam(semesterId, examData);
      Alert.alert('成功', '考试已添加');
    }
    navigation.goBack();
  };

  const handleDelete = () => {
    Alert.alert('确认删除', `确定删除考试 "${courseName}" 吗？`, [
      { text: '取消', style: 'cancel' },
      {
        text: '删除',
        style: 'destructive',
        onPress: () => {
          deleteExam(semesterId, examId!);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{existingExam ? '编辑考试' : '添加考试'}</Text>
      </View>

      <Card title="考试信息" style={styles.card}>
        <Input label="科目名称" value={courseName} onChangeText={setCourseName} placeholder="如：高等数学" />
        <Input label="考试日期" value={date} onChangeText={setDate} placeholder="YYYY-MM-DD" />
        <View style={styles.row}>
          <View style={styles.halfInput}>
            <Input label="开始时间" value={startTime} onChangeText={setStartTime} placeholder="HH:MM" />
          </View>
          <View style={styles.halfInput}>
            <Input label="结束时间" value={endTime} onChangeText={setEndTime} placeholder="HH:MM" />
          </View>
        </View>
        <Input label="考试地点" value={location} onChangeText={setLocation} placeholder="如：A301" />
        <Input label="考试时长（分钟）" value={duration} onChangeText={setDuration} keyboardType="numeric" />
      </Card>

      <Card title="提醒设置" style={styles.card}>
        <Text style={styles.sectionLabel}>考前提醒</Text>
        <View style={styles.chipRow}>
          {REMINDER_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.value}
              onPress={() => setReminder(option.value)}
              style={[styles.chip, reminder === option.value && styles.chipActive]}
            >
              <Text style={[styles.chipText, reminder === option.value && styles.chipTextActive]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Card>

      <View style={styles.actions}>
        <Button title="保存" onPress={handleSave} size="large" />
        {existingExam && (
          <Button title="删除" onPress={handleDelete} variant="danger" />
        )}
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
  card: {
    margin: Spacing.lg,
    marginBottom: 0,
  },
  sectionLabel: {
    fontSize: Fonts.sizeNormal,
    color: Colors.text,
    fontWeight: Fonts.weightMedium as any,
    marginBottom: Spacing.sm,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: Fonts.sizeNormal,
    color: Colors.text,
    fontWeight: Fonts.weightMedium as any,
  },
  chipTextActive: {
    color: '#fff',
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  halfInput: {
    flex: 1,
  },
  actions: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
});
