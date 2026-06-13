import { Platform } from 'react-native';

export const APP_VERSION = '1.0.0';
export const APP_NAME = '喵课';
export const FEEDBACK_QQ_GROUP = '656803742';
export const PRIVACY_URL = 'https://meowke.app/privacy';
export const TERMS_URL = 'https://meowke.app/terms';
export const ICP_NUMBER = '黑ICP备XXXXXXXX号';
export const GITHUB_URL = 'https://github.com/meowke/app';

export const STORAGE_KEYS = {
  SEMESTERS: 'meowke_semesters',
  SETTINGS: 'meowke_settings',
  SCHOOLS: 'meowke_schools',
};

export const DEFAULT_CLASS_TIMES = [
  { period: 1, startTime: '08:00', endTime: '08:45', duration: 45, breakDuration: 10 },
  { period: 2, startTime: '08:55', endTime: '09:40', duration: 45, breakDuration: 10 },
  { period: 3, startTime: '09:50', endTime: '10:35', duration: 45, breakDuration: 10 },
  { period: 4, startTime: '10:45', endTime: '11:30', duration: 45, breakDuration: 10 },
  { period: 5, startTime: '11:40', endTime: '12:25', duration: 45, breakDuration: 10 },
  { period: 6, startTime: '13:30', endTime: '14:15', duration: 45, breakDuration: 10 },
  { period: 7, startTime: '14:25', endTime: '15:10', duration: 45, breakDuration: 10 },
  { period: 8, startTime: '15:20', endTime: '16:05', duration: 45, breakDuration: 10 },
  { period: 9, startTime: '16:15', endTime: '17:00', duration: 45, breakDuration: 10 },
  { period: 10, startTime: '17:10', endTime: '17:55', duration: 45, breakDuration: 10 },
  { period: 11, startTime: '18:30', endTime: '19:15', duration: 45, breakDuration: 10 },
  { period: 12, startTime: '19:25', endTime: '20:10', duration: 45, breakDuration: 10 },
];

export const DEFAULT_SETTINGS = {
  syncToCalendar: false,
  defaultReminder: 15,
  themeColor: '#FF8C42',
};

export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';
