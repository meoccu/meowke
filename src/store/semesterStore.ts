import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Semester, Course, Exam, ClassTime, School, DEFAULT_SCHOOLS } from '../types';
import { STORAGE_KEYS, DEFAULT_CLASS_TIMES } from '../utils/constants';
import { generateId, getCurrentWeek, calculateTotalWeeks } from '../utils/dateUtils';

interface SemesterState {
  semesters: Semester[];
  currentSemesterId: string | null;
  schools: School[];
  
  // 学期操作
  addSemester: (semester: Omit<Semester, 'id' | 'courses' | 'exams' | 'classTimes' | 'totalWeeks'>) => string;
  updateSemester: (id: string, updates: Partial<Semester>) => void;
  deleteSemester: (id: string) => void;
  setCurrentSemester: (id: string) => void;
  getCurrentSemester: () => Semester | null;
  
  // 课程操作
  addCourse: (semesterId: string, course: Omit<Course, 'id'>) => void;
  updateCourse: (semesterId: string, courseId: string, updates: Partial<Course>) => void;
  deleteCourse: (semesterId: string, courseId: string) => void;
  getCoursesByWeek: (semesterId: string, week: number) => Course[];
  
  // 考试操作
  addExam: (semesterId: string, exam: Omit<Exam, 'id'>) => void;
  updateExam: (semesterId: string, examId: string, updates: Partial<Exam>) => void;
  deleteExam: (semesterId: string, examId: string) => void;
  toggleExamComplete: (semesterId: string, examId: string) => void;
  
  // 学校操作
  getSchools: () => School[];
  addSchool: (school: Omit<School, 'id'>) => void;
}

export const useSemesterStore = create<SemesterState>()(
  persist(
    (set, get) => ({
      semesters: [],
      currentSemesterId: null,
      schools: DEFAULT_SCHOOLS,
      
      addSemester: (data) => {
        const id = generateId();
        const totalWeeks = calculateTotalWeeks(data.startDate, data.endDate);
        const semester: Semester = {
          ...data,
          id,
          totalWeeks,
          courses: [],
          exams: [],
          classTimes: DEFAULT_CLASS_TIMES,
        };
        set((state) => ({
          semesters: [...state.semesters, semester],
          currentSemesterId: state.currentSemesterId || id,
        }));
        return id;
      },
      
      updateSemester: (id, updates) => {
        set((state) => ({
          semesters: state.semesters.map((s) => {
            if (s.id !== id) return s;
            const newS = { ...s, ...updates };
            if (updates.startDate || updates.endDate) {
              newS.totalWeeks = calculateTotalWeeks(newS.startDate, newS.endDate);
            }
            return newS;
          }),
        }));
      },
      
      deleteSemester: (id) => {
        set((state) => {
          const filtered = state.semesters.filter((s) => s.id !== id);
          const newCurrentId = state.currentSemesterId === id
            ? (filtered[0]?.id || null)
            : state.currentSemesterId;
          return { semesters: filtered, currentSemesterId: newCurrentId };
        });
      },
      
      setCurrentSemester: (id) => {
        set({ currentSemesterId: id });
      },
      
      getCurrentSemester: () => {
        const { semesters, currentSemesterId } = get();
        return semesters.find((s) => s.id === currentSemesterId) || semesters[0] || null;
      },
      
      addCourse: (semesterId, course) => {
        const id = generateId();
        set((state) => ({
          semesters: state.semesters.map((s) =>
            s.id === semesterId
              ? { ...s, courses: [...s.courses, { ...course, id }] }
              : s
          ),
        }));
      },
      
      updateCourse: (semesterId, courseId, updates) => {
        set((state) => ({
          semesters: state.semesters.map((s) =>
            s.id === semesterId
              ? {
                  ...s,
                  courses: s.courses.map((c) =>
                    c.id === courseId ? { ...c, ...updates } : c
                  ),
                }
              : s
          ),
        }));
      },
      
      deleteCourse: (semesterId, courseId) => {
        set((state) => ({
          semesters: state.semesters.map((s) =>
            s.id === semesterId
              ? { ...s, courses: s.courses.filter((c) => c.id !== courseId) }
              : s
          ),
        }));
      },
      
      getCoursesByWeek: (semesterId, week) => {
        const { semesters } = get();
        const semester = semesters.find((s) => s.id === semesterId);
        if (!semester) return [];
        return semester.courses.filter((c) => {
          if (week < c.startWeek || week > c.endWeek) return false;
          if (c.weekType === 'odd') return week % 2 === 1;
          if (c.weekType === 'even') return week % 2 === 0;
          return true;
        });
      },
      
      addExam: (semesterId, exam) => {
        const id = generateId();
        set((state) => ({
          semesters: state.semesters.map((s) =>
            s.id === semesterId
              ? { ...s, exams: [...s.exams, { ...exam, id }] }
              : s
          ),
        }));
      },
      
      updateExam: (semesterId, examId, updates) => {
        set((state) => ({
          semesters: state.semesters.map((s) =>
            s.id === semesterId
              ? {
                  ...s,
                  exams: s.exams.map((e) =>
                    e.id === examId ? { ...e, ...updates } : e
                  ),
                }
              : s
          ),
        }));
      },
      
      deleteExam: (semesterId, examId) => {
        set((state) => ({
          semesters: state.semesters.map((s) =>
            s.id === semesterId
              ? { ...s, exams: s.exams.filter((e) => e.id !== examId) }
              : s
          ),
        }));
      },
      
      toggleExamComplete: (semesterId, examId) => {
        set((state) => ({
          semesters: state.semesters.map((s) =>
            s.id === semesterId
              ? {
                  ...s,
                  exams: s.exams.map((e) =>
                    e.id === examId ? { ...e, completed: !e.completed } : e
                  ),
                }
              : s
          ),
        }));
      },
      
      getSchools: () => get().schools,
      
      addSchool: (school) => {
        const id = generateId();
        set((state) => ({
          schools: [...state.schools, { ...school, id }],
        }));
      },
    }),
    {
      name: STORAGE_KEYS.SEMESTERS,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
