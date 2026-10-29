# 🎨 Notiva – Productivity Workspace

> _a beautifully designed productivity suite built for modern creators and students._

---
## 🌐Check out the demo

<p align="center">
  <a href="https://notiva-productivity-dashboard-y2t6.vercel.app/" target="_blank">
    <img src="https://img.shields.io/badge/LIVE%20DEMO-Click%20Here-brightgreen?style=for-the-badge" alt="Live Demo"/>
  </a>
</p>

## 🌟 Overview

**Notiva** is a responsive web application built with **React** and **Tailwind CSS**, designed to help users:

- Manage tasks across the week 📝
- Track Pomodoro sessions and productivity stats ⏱️📊
- Add and organize personal links 🔗
- Visualize tasks on an interactive calendar 🗓️

Every feature is wrapped in a cohesive aesthetic with animations, gradients, and smooth UX flows.

---

## 🚀 Features at a Glance

| Feature | Description |
|--------|-------------|
| 🧠 **Overview Page** | View total tasks, completed vs. remaining breakdowns, categorized lists, and quick-access links |
| ⏳ **Pomodoro Timer** | Start/stop customizable Pomodoro sessions with audio cues, focus logs, and weekly/monthly charts |
| ➕ **Add Task** | Quick-add new tasks with date, time, category, and intuitive form validation |
| 📅 **Timetable** | View tasks in a weekly grid layout by time/day, complete with delete and calendar-based filtering |

---

## ✨ Pages Breakdown

### 🏠 Overview Page
<img width="1846" height="996" alt="notivaDashboard" src="https://github.com/user-attachments/assets/aefc820f-0e7b-465c-9115-da98f3405f88" />

- 🌈 **Lottie animation** hero with app branding
- 📊 **Task insights**: Pie chart, task counter
- 📋 **Categorized task list** with checkboxes and delete buttons
- 🔗 **Quick Links Manager**: Add and delete external URLs
- 💎 **Design**: Pastel gradients, glowing glassmorphism, soft transitions

### ⏱️ Pomodoro Timer Page
<img width="1294" height="833" alt="PomodoroTimer" src="https://github.com/user-attachments/assets/db14296d-17d5-451f-96fc-755dc7ec38ea" />

- ⏲️ **Customizable durations** (1–180 min work, up to 60 min break)
- 🎶 **Audio notifications** on session changes
- 📈 **Focus tracking**: Total time today, weekly bar chart, monthly grid
- 🌐 **Responsive SVG timer** with animated progress ring
- 📅 **Daily logs** integrated with charts using Recharts

### 🗂️ Add Task Page
<img width="712" height="926" alt="AddTask" src="https://github.com/user-attachments/assets/2307021e-9e9d-433c-ad8f-005ae82b00b2" />


- 🧾 **Input fields**: title, day, date (calendar), time, category
- 🧠 Built-in validation to prevent incomplete entries
- ✨ Animated form box with soft glow borders
- 🧭 Seamless navigation after submission

### 📆 Timetable Page
<img width="1833" height="993" alt="WeeklyTimetable" src="https://github.com/user-attachments/assets/264efca7-5f32-4fa7-af20-338bf10c56ad" />

- 📋 **Weekly view**: Rows = time slots, Columns = days
- 🔍 **Task cards** in each cell with delete option
- 📅 **Calendar Modal**: Filter tasks by selected date
- ❌ **ErrorBoundary** catches rendering bugs gracefully
- 🧼 Clean UI with scrollable overflow, sticky headers, and subtle motion

---

🛠️ Tech Stack

| Tech                         | Usage                             |
| ---------------------------- | --------------------------------- |
| **React**                    | Component-based UI architecture   |
| **Tailwind CSS**             | Styling and responsive design     |
| **Framer Motion**            | Smooth animations and transitions |
| **Recharts**                 | Interactive data visualizations   |
| **React Calendar**           | Date picking and calendar modal   |
| **Lottie React**             | Background animations and flair   |
| **Web Audio API**            | Custom Pomodoro alert sounds      |
| **LocalStorage (in future)** | Planned persistence layer         |
>>>>>>> d1bedf909a9c6e82bbea45cf3a9647e2f64e9b2f
