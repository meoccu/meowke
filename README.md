# 喵课 (MeowKe) - 高校课表与学期管理工具

> 版本：v1.0.0 | 跨平台移动端应用（iOS / Android）

## 项目概述

喵课是一款面向高校学生的课表与学期管理工具，支持教务系统课表导入、考试日程管理、日历同步等功能，帮助用户高效管理学业安排。特别针对黑龙江省高校提供快速教务系统导入支持。

## 技术栈

- **React Native** (0.76.0) + **Expo** (52.0.0) — 跨平台移动开发框架
- **TypeScript** — 类型安全
- **Zustand** + **AsyncStorage** — 状态管理与本地持久化存储
- **React Navigation** — 页面导航
- **React Native Calendars** — 日历组件

## 功能特性

### 1. 学校与学期管理
- 支持快速选择已收录高校（黑龙江大学、东北农业大学、哈尔滨理工大学等）
- 未收录学校可手动输入教务系统网址导入课表
- 创建 / 导入多个学期，可切换当前学期、删除学期
- 自动根据开学时间计算当前周次
- 自定义学期名称、开学时间、入学时间

### 2. 课表管理
- 从高校教务系统导入课表（支持预配置学校一键导入）
- 自动解析课程信息（名称、教师、时间、地点、周次）
- 列表视图 + 课表视图双模式展示
- 支持按周查看课程安排
- 节次时间自定义（默认 45 分钟/节，12 节课时段）
- 课程详情查看与编辑

### 3. 考试日程管理
- 手动添加或导入考试安排
- 展示考试科目、时间、地点、时长
- 考前提醒（不提醒 / 5 / 15 / 30 分钟）
- 已完成考试标记与筛选
- 区分未完成 / 已完成 / 已过期状态

### 4. 系统日历同步
- 将课表、考试日程导入手机系统日历（需授权）
- 自定义提醒时间

### 5. 个人中心
- 展示当前学期、学校、周次、假期倒计时
- 学期管理入口
- QQ 群反馈渠道（656803742）
- 软件版本、官网、隐私政策、用户协议、ICP 备案

## 项目结构

```
meowke/
├── App.tsx                    # 应用入口
├── app.json                   # Expo 配置
├── package.json               # 依赖配置
├── tsconfig.json              # TypeScript 配置
├── babel.config.js            # Babel 配置
├── assets/                    # 静态资源
│   ├── icon.png               # 应用图标
│   ├── splash.png             # 启动屏
│   ├── adaptive-icon.png      # Android 自适应图标
│   └── favicon.png            # Web 图标
└── src/
    ├── types/                 # 类型定义
    ├── theme/                 # 主题配色
    ├── utils/                 # 工具函数
    ├── store/                 # 状态管理（Zustand）
    ├── navigation/            # 导航配置
    ├── components/            # 可复用组件
    │   ├── common/            # 通用组件（Button/Input/Card/ListItem/EmptyState）
    │   ├── CourseCard.tsx     # 课程卡片
    │   ├── ExamCard.tsx       # 考试卡片
    │   ├── WeekSelector.tsx   # 周选择器
    │   └── ScheduleTable.tsx  # 课表表格
    └── screens/               # 页面
        ├── ScheduleScreen.tsx       # 课表首页
        ├── ExamScreen.tsx           # 考试日程
        ├── ProfileScreen.tsx        # 个人中心
        ├── SemesterScreen.tsx       # 学期管理
        ├── CourseDetailScreen.tsx   # 课程详情
        ├── AddCourseScreen.tsx      # 添加/编辑课程
        ├── AddExamScreen.tsx        # 添加/编辑考试
        ├── ImportScreen.tsx         # 导入课表
        ├── ClassTimeScreen.tsx      # 节次时间设置
        └── SettingsScreen.tsx       # 系统设置
```

## 快速开始

### 环境要求

- Node.js >= 18
- npm / yarn / pnpm
- Expo Go App（iOS/Android 手机安装，用于真机预览）

### 安装步骤

```bash
# 1. 进入项目目录
cd meowke

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npx expo start

# 4. 按提示在手机上用 Expo Go 扫描 QR 码预览
#    或按 'a' 启动 Android 模拟器
#    或按 'i' 启动 iOS 模拟器（仅限 macOS）
```

### 构建发布版本

```bash
# Android APK
npx expo prebuild
npx expo run:android --variant release

# iOS（需要 macOS + Xcode）
npx expo prebuild
npx expo run:ios --configuration Release
```

## 使用说明

1. **首次使用**：打开应用后，进入「我的」→「学期管理」，创建一个学期并设置开学时间
2. **导入课表**：在学期管理中选择学校，支持黑龙江大学、东北农业大学、哈尔滨理工大学等快速导入，其他学校可手动输入教务系统网址
3. **添加考试**：在「考试」页面点击右下角 + 按钮，填写考试信息并设置提醒
4. **查看课表**：在「课表」页面可切换列表/表格视图，按周查看课程安排
5. **设置提醒**：在「设置」中开启日历同步，设置默认提醒时间

## 已知限制

- 部分未收录高校需手动输入教务系统网址导入课表，导入成功率取决于教务系统接口兼容性
- 日历同步功能依赖手机系统权限，需用户授权日历访问权限
- 学期周次计算基于开学时间，需用户准确设置开学日期以保证周次显示正确

## 开源与反馈

- **开源仓库**：https://github.com/meowke/app
- **QQ 反馈群**：656803742
- **官网**：https://meowke.app

## 许可证

MIT License

---

<p align="center">Made with 🐱 by 喵课团队</p>
