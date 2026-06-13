import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, StyleSheet } from 'react-native';
import { Colors, Fonts } from '../theme/colors';
import { ScheduleScreen } from '../screens/ScheduleScreen';
import { ExamScreen } from '../screens/ExamScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { SemesterScreen } from '../screens/SemesterScreen';
import { CourseDetailScreen } from '../screens/CourseDetailScreen';
import { AddCourseScreen } from '../screens/AddCourseScreen';
import { AddExamScreen } from '../screens/AddExamScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { ImportScreen } from '../screens/ImportScreen';
import { ClassTimeScreen } from '../screens/ClassTimeScreen';

export type RootStackParamList = {
  Main: undefined;
  Semester: undefined;
  CourseDetail: { courseId: string; semesterId: string };
  AddCourse: { semesterId: string; courseId?: string };
  AddExam: { semesterId: string; examId?: string };
  Settings: undefined;
  Import: { semesterId: string };
  ClassTime: { semesterId: string };
};

export type MainTabParamList = {
  课表: undefined;
  考试: undefined;
  我的: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

const TabBarIcon = ({ focused, label }: { focused: boolean; label: string }) => (
  <Text style={[styles.tabIcon, focused && styles.tabIconActive]}>{label}</Text>
);

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textLight,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: Colors.divider,
          height: 60,
          paddingBottom: 8,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="课表"
        component={ScheduleScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} label="📅" />,
        }}
      />
      <Tab.Screen
        name="考试"
        component={ExamScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} label="📝" />,
        }}
      />
      <Tab.Screen
        name="我的"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} label="👤" />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '700', fontSize: Fonts.sizeLarge },
        }}
      >
        <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen name="Semester" component={SemesterScreen} options={{ title: '学期管理' }} />
        <Stack.Screen name="CourseDetail" component={CourseDetailScreen} options={{ title: '课程详情' }} />
        <Stack.Screen name="AddCourse" component={AddCourseScreen} options={{ title: '添加课程' }} />
        <Stack.Screen name="AddExam" component={AddExamScreen} options={{ title: '添加考试' }} />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: '设置' }} />
        <Stack.Screen name="Import" component={ImportScreen} options={{ title: '导入课表' }} />
        <Stack.Screen name="ClassTime" component={ClassTimeScreen} options={{ title: '节次时间' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabIcon: {
    fontSize: 20,
  },
  tabIconActive: {
    opacity: 1,
  },
});
