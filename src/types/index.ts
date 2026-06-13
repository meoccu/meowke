export type DayOfWeek = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface Course {
  id: string;
  name: string;
  teacher: string;
  location: string;
  dayOfWeek: DayOfWeek;
  startPeriod: number;
  endPeriod: number;
  startWeek: number;
  endWeek: number;
  weekType: 'all' | 'odd' | 'even';
  color: string;
}

export interface Exam {
  id: string;
  courseName: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  duration: number;
  completed: boolean;
  reminder: number;
}

export interface Semester {
  id: string;
  name: string;
  schoolName: string;
  startDate: string;
  endDate: string;
  totalWeeks: number;
  isCurrent: boolean;
  courses: Course[];
  exams: Exam[];
  classTimes: ClassTime[];
}

export interface ClassTime {
  period: number;
  startTime: string;
  endTime: string;
  duration: number;
  breakDuration: number;
}

export interface School {
  id: string;
  name: string;
  jwSystemUrl?: string;
  region: string;
}

export interface UserSettings {
  currentSemesterId: string | null;
  syncToCalendar: boolean;
  defaultReminder: number;
  themeColor: string;
}

export interface PeriodSettings {
  classDuration: number;
  breakDuration: number;
  morningPeriods: number;
  afternoonPeriods: number;
  eveningPeriods: number;
}

export const DEFAULT_SCHOOLS: School[] = [
  { id: 'hlju', name: '黑龙江大学', jwSystemUrl: 'https://jwxt.hlju.edu.cn', region: '黑龙江' },
  { id: 'neau', name: '东北农业大学', jwSystemUrl: 'https://jwxt.neau.edu.cn', region: '黑龙江' },
  { id: 'hrbust', name: '哈尔滨理工大学', jwSystemUrl: 'https://jwxt.hrbust.edu.cn', region: '黑龙江' },
  { id: 'hrbnu', name: '哈尔滨师范大学', jwSystemUrl: 'https://jwxt.hrbnu.edu.cn', region: '黑龙江' },
  { id: 'hrbeu', name: '哈尔滨工程大学', jwSystemUrl: 'https://jwxt.hrbeu.edu.cn', region: '黑龙江' },
  { id: 'custom', name: '其他学校', region: '全国' },
];

export const COURSE_COLORS = [
  '#FF8C42', '#42A5F5', '#66BB6A', '#AB47BC', '#EF5350',
  '#26A69A', '#FFCA28', '#8D6E63', '#78909C', '#EC407A',
  '#7E57C2', '#5C6BC0', '#29B6F6', '#9CCC65', '#FF7043'
];

export const REMINDER_OPTIONS = [
  { label: '不提醒', value: 0 },
  { label: '课前 5 分钟', value: 5 },
  { label: '课前 15 分钟', value: 15 },
  { label: '课前 30 分钟', value: 30 },
];

export const WEEK_DAYS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
