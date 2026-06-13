import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors, Fonts, BorderRadius, Spacing } from '../theme/colors';
import { useSemesterStore } from '../store';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { RootStackParamList } from '../navigation/AppNavigator';
import { getWeekTypeLabel } from '../utils/dateUtils';

type CourseDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'CourseDetail'>;

export const CourseDetailScreen: React.FC<CourseDetailScreenProps> = ({ route, navigation }) => {
  const { courseId, semesterId } = route.params;
  const semester = useSemesterStore((state) => state.semesters.find((s) => s.id === semesterId));
  const course = semester?.courses.find((c) => c.id === courseId);
  const deleteCourse = useSemesterStore((state) => state.deleteCourse);
  const classTimes = semester?.classTimes || [];

  if (!course || !semester) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>课程不存在</Text>
      </View>
    );
  }

  const startTime = classTimes.find((ct) => ct.period === course.startPeriod)?.startTime;
  const endTime = classTimes.find((ct) => ct.period === course.endPeriod)?.endTime;

  const handleDelete = () => {
    Alert.alert('确认删除', `确定删除课程 "${course.name}" 吗？`, [
      { text: '取消', style: 'cancel' },
      {
        text: '删除',
        style: 'destructive',
        onPress: () => {
          deleteCourse(semesterId, courseId);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={[styles.header, { backgroundColor: course.color }]}>
        <Text style={styles.headerTitle}>{course.name}</Text>
        <Text style={styles.headerSubtitle}>
          {course.teacher} · {course.location}
        </Text>
      </View>

      <Card title="课程信息">
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>课程名称</Text>
          <Text style={styles.infoValue}>{course.name}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>任课教师</Text>
          <Text style={styles.infoValue}>{course.teacher}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>上课地点</Text>
          <Text style={styles.infoValue}>{course.location}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>上课时间</Text>
          <Text style={styles.infoValue}>
            周{['一', '二', '三', '四', '五', '六', '日'][course.dayOfWeek - 1]} 第{course.startPeriod}-{course.endPeriod}节
          </Text>
        </View>
        {startTime && endTime && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>具体时段</Text>
            <Text style={styles.infoValue}>{startTime} - {endTime}</Text>
          </View>
        )}
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>周次范围</Text>
          <Text style={styles.infoValue}>
            第 {course.startWeek} - {course.endWeek} 周
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>周次类型</Text>
          <Text style={styles.infoValue}>{getWeekTypeLabel(course.weekType)}</Text>
        </View>
      </Card>

      <View style={styles.actions}>
        <Button
          title="编辑课程"
          onPress={() => navigation.navigate('AddCourse', { semesterId, courseId })}
          variant="secondary"
        />
        <Button
          title="删除课程"
          onPress={handleDelete}
          variant="danger"
        />
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
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  headerTitle: {
    fontSize: Fonts.sizeTitle,
    fontWeight: Fonts.weightBold as any,
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: Fonts.sizeNormal,
    color: '#fff',
    opacity: 0.9,
    marginTop: Spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  infoLabel: {
    fontSize: Fonts.sizeNormal,
    color: Colors.textLight,
  },
  infoValue: {
    fontSize: Fonts.sizeNormal,
    color: Colors.text,
    fontWeight: Fonts.weightMedium as any,
    flex: 1,
    textAlign: 'right',
  },
  actions: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  errorText: {
    fontSize: Fonts.sizeLarge,
    color: Colors.danger,
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
});
