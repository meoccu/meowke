import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors, Fonts, BorderRadius, Spacing } from '../theme/colors';
import { useSemesterStore } from '../store';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Card } from '../components/common/Card';
import { RootStackParamList } from '../navigation/AppNavigator';
import { COURSE_COLORS, WEEK_DAYS, DayOfWeek } from '../types';
import { getRandomColor } from '../utils/dateUtils';

type AddCourseScreenProps = NativeStackScreenProps<RootStackParamList, 'AddCourse'>;

export const AddCourseScreen: React.FC<AddCourseScreenProps> = ({ route, navigation }) => {
  const { semesterId, courseId } = route.params;
  const semester = useSemesterStore((state) => state.semesters.find((s) => s.id === semesterId));
  const addCourse = useSemesterStore((state) => state.addCourse);
  const updateCourse = useSemesterStore((state) => state.updateCourse);
  const existingCourse = courseId ? semester?.courses.find((c) => c.id === courseId) : null;

  const [name, setName] = useState(existingCourse?.name || '');
  const [teacher, setTeacher] = useState(existingCourse?.teacher || '');
  const [location, setLocation] = useState(existingCourse?.location || '');
  const [dayOfWeek, setDayOfWeek] = useState<DayOfWeek>(existingCourse?.dayOfWeek || 1);
  const [startPeriod, setStartPeriod] = useState(existingCourse?.startPeriod?.toString() || '1');
  const [endPeriod, setEndPeriod] = useState(existingCourse?.endPeriod?.toString() || '2');
  const [startWeek, setStartWeek] = useState(existingCourse?.startWeek?.toString() || '1');
  const [endWeek, setEndWeek] = useState(existingCourse?.endWeek?.toString() || (semester?.totalWeeks || '16').toString());
  const [weekType, setWeekType] = useState<'all' | 'odd' | 'even'>(existingCourse?.weekType || 'all');
  const [color, setColor] = useState(existingCourse?.color || getRandomColor());

  const handleSave = () => {
    if (!name.trim() || !teacher.trim() || !location.trim()) {
      Alert.alert('提示', '请填写完整信息');
      return;
    }

    const courseData = {
      name: name.trim(),
      teacher: teacher.trim(),
      location: location.trim(),
      dayOfWeek,
      startPeriod: parseInt(startPeriod),
      endPeriod: parseInt(endPeriod),
      startWeek: parseInt(startWeek),
      endWeek: parseInt(endWeek),
      weekType,
      color,
    };

    if (existingCourse) {
      updateCourse(semesterId, courseId!, courseData);
      Alert.alert('成功', '课程已更新');
    } else {
      addCourse(semesterId, courseData);
      Alert.alert('成功', '课程已添加');
    }
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{existingCourse ? '编辑课程' : '添加课程'}</Text>
      </View>

      <Card title="基本信息" style={styles.card}>
        <Input label="课程名称" value={name} onChangeText={setName} placeholder="如：高等数学" />
        <Input label="任课教师" value={teacher} onChangeText={setTeacher} placeholder="如：张三" />
        <Input label="上课地点" value={location} onChangeText={setLocation} placeholder="如：A301" />
      </Card>

      <Card title="上课时间" style={styles.card}>
        <Text style={styles.sectionLabel}>星期</Text>
        <View style={styles.chipRow}>
          {WEEK_DAYS.map((day, index) => {
            const dayNum = (index + 1) as DayOfWeek;
            return (
              <TouchableOpacity
                key={day}
                onPress={() => setDayOfWeek(dayNum)}
                style={[styles.chip, dayOfWeek === dayNum && styles.chipActive]}
              >
                <Text style={[styles.chipText, dayOfWeek === dayNum && styles.chipTextActive]}>
                  {day}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.row}>
          <View style={styles.halfInput}>
            <Input label="开始节次" value={startPeriod} onChangeText={setStartPeriod} keyboardType="numeric" />
          </View>
          <View style={styles.halfInput}>
            <Input label="结束节次" value={endPeriod} onChangeText={setEndPeriod} keyboardType="numeric" />
          </View>
        </View>
      </Card>

      <Card title="周次设置" style={styles.card}>
        <View style={styles.row}>
          <View style={styles.halfInput}>
            <Input label="开始周" value={startWeek} onChangeText={setStartWeek} keyboardType="numeric" />
          </View>
          <View style={styles.halfInput}>
            <Input label="结束周" value={endWeek} onChangeText={setEndWeek} keyboardType="numeric" />
          </View>
        </View>

        <Text style={styles.sectionLabel}>周次类型</Text>
        <View style={styles.chipRow}>
          {[
            { label: '全周', value: 'all' as const },
            { label: '单周', value: 'odd' as const },
            { label: '双周', value: 'even' as const },
          ].map((type) => (
            <TouchableOpacity
              key={type.value}
              onPress={() => setWeekType(type.value)}
              style={[styles.chip, weekType === type.value && styles.chipActive]}
            >
              <Text style={[styles.chipText, weekType === type.value && styles.chipTextActive]}>
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Card>

      <Card title="课程颜色" style={styles.card}>
        <View style={styles.colorRow}>
          {COURSE_COLORS.map((c) => (
            <TouchableOpacity
              key={c}
              onPress={() => setColor(c)}
              style={[styles.colorCircle, { backgroundColor: c }, color === c && styles.colorCircleActive]}
            />
          ))}
        </View>
      </Card>

      <View style={styles.actions}>
        <Button title="保存" onPress={handleSave} size="large" />
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
  colorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  colorCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  colorCircleActive: {
    borderWidth: 3,
    borderColor: Colors.text,
  },
  actions: {
    padding: Spacing.lg,
  },
});
