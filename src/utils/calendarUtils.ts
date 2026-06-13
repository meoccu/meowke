import * as Calendar from 'expo-calendar';
import { Alert, Platform } from 'react-native';
import { Course, Exam, ClassTime } from '../types';
import { getDayOfWeek, addDays } from './dateUtils';

/**
 * 请求日历权限
 */
export async function requestCalendarPermissions(): Promise<boolean> {
  const { status } = await Calendar.requestCalendarPermissionsAsync();
  return status === 'granted';
}

/**
 * 获取默认日历 ID
 */
export async function getDefaultCalendarId(): Promise<string | null> {
  const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
  const defaultCalendar = calendars.find((cal) => cal.allowsModifications);
  return defaultCalendar?.id || null;
}

/**
 * 将课程同步到日历
 */
export async function syncCourseToCalendar(
  course: Course,
  semesterStartDate: string,
  classTimes: ClassTime[],
  reminderMinutes: number = 15
): Promise<string | null> {
  try {
    const hasPermission = await requestCalendarPermissions();
    if (!hasPermission) {
      Alert.alert('权限不足', '需要日历访问权限才能同步课程');
      return null;
    }

    const calendarId = await getDefaultCalendarId();
    if (!calendarId) {
      Alert.alert('错误', '找不到可写入的日历');
      return null;
    }

    const startClassTime = classTimes.find((ct) => ct.period === course.startPeriod);
    const endClassTime = classTimes.find((ct) => ct.period === course.endPeriod);
    if (!startClassTime || !endClassTime) return null;

    // 计算课程在学期中的具体日期
    const dayOffset = course.dayOfWeek - getDayOfWeek(semesterStartDate);
    const firstDate = addDays(semesterStartDate, dayOffset + (course.startWeek - 1) * 7);

    const startDate = new Date(`${firstDate}T${startClassTime.startTime}:00`);
    const endDate = new Date(`${firstDate}T${endClassTime.endTime}:00`);

    const eventId = await Calendar.createEventAsync(calendarId, {
      title: course.name,
      location: course.location,
      startDate,
      endDate,
      notes: `教师：${course.teacher}，周次：${course.startWeek}-${course.endWeek}周`,
      alarms: reminderMinutes > 0 ? [{ relativeOffset: -reminderMinutes }] : undefined,
      recurrenceRule: {
        frequency: Calendar.Frequency.WEEKLY,
        interval: course.weekType === 'all' ? 1 : 2,
        occurrence: course.endWeek - course.startWeek + 1,
      },
    });

    return eventId;
  } catch (error) {
    console.error('Sync course failed:', error);
    return null;
  }
}

/**
 * 将考试同步到日历
 */
export async function syncExamToCalendar(
  exam: Exam,
  reminderMinutes: number = 15
): Promise<string | null> {
  try {
    const hasPermission = await requestCalendarPermissions();
    if (!hasPermission) {
      Alert.alert('权限不足', '需要日历访问权限才能同步考试');
      return null;
    }

    const calendarId = await getDefaultCalendarId();
    if (!calendarId) {
      Alert.alert('错误', '找不到可写入的日历');
      return null;
    }

    const startDate = new Date(`${exam.date}T${exam.startTime}:00`);
    const endDate = new Date(`${exam.date}T${exam.endTime}:00`);

    const eventId = await Calendar.createEventAsync(calendarId, {
      title: `考试：${exam.courseName}`,
      location: exam.location,
      startDate,
      endDate,
      notes: `考试时长：${exam.duration} 分钟`,
      alarms: reminderMinutes > 0 ? [{ relativeOffset: -reminderMinutes }] : undefined,
    });

    return eventId;
  } catch (error) {
    console.error('Sync exam failed:', error);
    return null;
  }
}

/**
 * 删除日历事件
 */
export async function deleteCalendarEvent(eventId: string): Promise<boolean> {
  try {
    await Calendar.deleteEventAsync(eventId);
    return true;
  } catch (error) {
    console.error('Delete event failed:', error);
    return false;
  }
}
