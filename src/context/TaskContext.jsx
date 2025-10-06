import { createContext, useContext, useState, useEffect } from 'react';
import { format, startOfMonth } from 'date-fns';

const TaskContext = createContext();

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [links, setLinks] = useState(() => {
    const saved = localStorage.getItem('links');
    return saved ? JSON.parse(saved) : [];
  });

  const [pomodoroTime, setPomodoroTime] = useState(() => {
    const saved = localStorage.getItem('pomodoroTime');
    return saved ? parseInt(saved) : 0;
  });

  const [dailyPomodoroLog, setDailyPomodoroLog] = useState(() => {
    const saved = localStorage.getItem('dailyPomodoroLog');
    return saved ? JSON.parse(saved) : {};
  });

  // Persist state to localStorage
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('links', JSON.stringify(links));
  }, [links]);

  useEffect(() => {
    localStorage.setItem('pomodoroTime', pomodoroTime.toString());
  }, [pomodoroTime]);

  useEffect(() => {
    localStorage.setItem('dailyPomodoroLog', JSON.stringify(dailyPomodoroLog));
  }, [dailyPomodoroLog]);

  // Task functions
  const addTask = (task) => setTasks([...tasks, task]);
  const toggleTask = (index) =>
    setTasks(tasks.map((task, i) => i === index ? { ...task, completed: !task.completed } : task));
  const deleteTask = (index) =>
    setTasks(tasks.filter((_, i) => i !== index));

  // Link functions
  const addLink = (link) => setLinks([...links, link]);
  const deleteLink = (index) =>
    setLinks(links.filter((_, i) => i !== index));

  // Pomodoro functions
  const logPomodoroTime = (seconds) => {
    setPomodoroTime((prev) => prev + seconds);
    const today = format(new Date(), 'yyyy-MM-dd');
    setDailyPomodoroLog((prevLog) => ({
      ...prevLog,
      [today]: (prevLog[today] || 0) + seconds,
    }));
  };

  // 📊 Chart Data Generators
  const getWeeklyData = () => {
    const data = [];
    const order = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const key = format(date, 'yyyy-MM-dd');
      const label = format(date, 'EEE'); // Mon, Tue, etc.
      const seconds = dailyPomodoroLog[key] || 0;

      data.push({ name: label, minutes: Math.floor(seconds / 60) });
    }

    data.sort((a, b) => order.indexOf(a.name) - order.indexOf(b.name));
    return data;
  };

  const getMonthlyData = () => {
    const grouped = {};

    Object.entries(dailyPomodoroLog).forEach(([dateStr, seconds]) => {
      const date = new Date(dateStr);
      const monthLabel = format(startOfMonth(date), 'MMM'); // Jan, Feb, etc.

      if (!grouped[monthLabel]) {
        grouped[monthLabel] = 0;
      }
      grouped[monthLabel] += seconds;
    });

    const monthsOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return monthsOrder
      .filter((m) => grouped[m])
      .map((month) => ({
        name: month,
        minutes: Math.floor(grouped[month] / 60),
      }));
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        toggleTask,
        deleteTask,
        links,
        addLink,
        deleteLink,
        pomodoroTime,
        logPomodoroTime,
        dailyPomodoroLog,
        getWeeklyData,
        getMonthlyData,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  return useContext(TaskContext);
}
