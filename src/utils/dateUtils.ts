import { COURSE_COLORS } from '../types';

export function getRandomColor(): string {
  return COURSE_COLORS[Math.floor(Math.random() * COURSE_COLORS.length)];
}

export function getCurrentWeek(startDate: string): number {
  const start = new Date(startDate);
  const now = new Date();
  const diff = now.getTime() - start.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const week = Math.floor(days / 7) + 1;
  return week > 0 ? week : 1;
}

export function formatDate(date: string | Date): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDateTime(date: string, time: string): string {
  return `${formatDate(date)} ${time}`;
}

export function formatTimeRange(start: string, end: string): string {
  return `${start} - ${end}`;
}

export function getDayOfWeek(date: string): number {
  const d = new Date(date);
  let day = d.getDay();
  return day === 0 ? 7 : day;
}

export function addDays(date: string, days: number): string {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return formatDate(d);
}

export function getWeekDateRange(startDate: string, week: number): { start: string; end: string } {
  const start = new Date(startDate);
  const weekStart = new Date(start.getTime() + (week - 1) * 7 * 24 * 60 * 60 * 1000);
  const weekEnd = new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000);
  return { start: formatDate(weekStart), end: formatDate(weekEnd) };
}

export function getDaysUntilHoliday(endDate: string): number {
  const end = new Date(endDate);
  const now = new Date();
  const diff = end.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function parseCourseTime(timeStr: string): { start: string; end: string } {
  const parts = timeStr.split('-');
  if (parts.length === 2) {
    return { start: parts[0].trim(), end: parts[1].trim() };
  }
  return { start: timeStr, end: timeStr };
}

export function isWeekActive(week: number, startWeek: number, endWeek: number, weekType: string): boolean {
  if (week < startWeek || week > endWeek) return false;
  if (weekType === 'odd') return week % 2 === 1;
  if (weekType === 'even') return week % 2 === 0;
  return true;
}

export function getWeekTypeLabel(weekType: string): string {
  switch (weekType) {
    case 'odd': return '单周';
    case 'even': return '双周';
    default: return '全周';
  }
}

export function getReminderLabel(minutes: number): string {
  switch (minutes) {
    case 0: return '不提醒';
    case 5: return '课前 5 分钟';
    case 15: return '课前 15 分钟';
    case 30: return '课前 30 分钟';
    default: return `${minutes} 分钟`;
  }
}

export function getSemesterName(year: number, term: number): string {
  return `${year}-${year + 1} 第${term === 1 ? '一' : '二'}学期`;
}

export function calculateTotalWeeks(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diff = end.getTime() - start.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24 * 7));
}

export function getHolidayCountdown(endDate: string): string {
  const days = getDaysUntilHoliday(endDate);
  if (days < 0) return '假期已结束';
  if (days === 0) return '今天放假！';
  if (days === 1) return '明天放假！';
  return `还有 ${days} 天放假`;
}
