import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { useTasks } from '../context/taskContext';
import background from '../assets/img/background.png';
import workStartSoundFile from '../assets/sounds/workstart.wav';
import breakStartSoundFile from '../assets/sounds/beepstart.wav';
import { motion } from 'framer-motion';
import '../App.css';

const AnimatedBar = (props) => {
  const { fill, x, y, width, height } = props;
  return (
    <motion.rect
      initial={{ height: 0, y: y + height }}
      animate={{ height, y }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      fill={fill}
      x={x}
      width={width}
      radius={4}
    />
  );
};

const PomodoroPage = () => {
  const { logPomodoroTime, dailyPomodoroLog } = useTasks();

  const [workMinutes, setWorkMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [seconds, setSeconds] = useState(workMinutes * 60);
  const [isBreak, setIsBreak] = useState(false);
  const [active, setActive] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  const workStartSound = new Audio(workStartSoundFile);
  const breakStartSound = new Audio(breakStartSoundFile);

  useEffect(() => {
    setSeconds(workMinutes * 60);
  }, [workMinutes]);

  useEffect(() => {
    let timer = null;
    if (active) {
      timer = setInterval(() => {
        setSeconds((prev) => {
          if (prev === 0) {
            const next = isBreak ? workMinutes * 60 : breakMinutes * 60;
            setIsBreak(!isBreak);
            isBreak ? workStartSound.play() : breakStartSound.play();
            return next;
          }
          if (!isBreak) logPomodoroTime(1);
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [active, isBreak, workMinutes, breakMinutes, logPomodoroTime]);

  const handleReset = () => {
    setActive(false);
    setIsBreak(false);
    setSeconds(workMinutes * 60);
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const percentage = ((isBreak ? breakMinutes * 60 - seconds : workMinutes * 60 - seconds) /
    (isBreak ? breakMinutes * 60 : workMinutes * 60)) * 100;

  const getProgressData = (days) => {
    const data = [];
    const today = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const key = date.toISOString().split('T')[0];
      const label = 
        days === 7
          ? date.toLocaleDateString('en-UK', { weekday: 'short' }) // 'Mon', 'Tue'
          : date.toLocaleDateString('en-UK', { month: 'short', day: 'numeric' });
      const seconds = dailyPomodoroLog[key] || 0;
      const hours = +(seconds / 3600).toFixed(2);
      data.push({ name: label, hours });
    }
    return data;
  };

  const totalTodayMinutes = Math.floor(
    (dailyPomodoroLog[new Date().toISOString().split('T')[0]] || 0) / 60
  );
  const totalTodayHours = Math.floor(totalTodayMinutes / 60);

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - percentage / 100);

  const getMonthCalendar = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const calendar = [];

    let day = 1;
    const startDay = firstDay.getDay(); // 0 = Sunday
    const totalDays = lastDay.getDate();

    for (let i = 0; i < 6; i++) {
      const week = [];
      for (let j = 0; j < 7; j++) {
        if ((i === 0 && j < startDay) || day > totalDays) {
          week.push(null);
        } else {
          const dateKey = new Date(year, month, day).toISOString().split('T')[0];
          const minutes = Math.floor((dailyPomodoroLog[dateKey] || 0) / 60);
          week.push({ day, minutes });
          day++;
        }
      }
      calendar.push(week);
    }
    return calendar;
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center p-6 flex items-center justify-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="w-full max-w-7xl bg-[#4d2c3d]/80 text-white backdrop-blur-l border border-pink-200 shadow-xl rounded-xl p-8 flex flex-col lg:flex-row gap-10">

        {/* Timer Section */}
        <div className="lg:w-1/2 w-full">
          <h2 className="text-5xl font-extrabold mb-8 text-center text-pink-200 drop-shadow-lg">⏱️ Pomodoro Timer</h2>

          <div className="flex justify-center gap-12 mb-8">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-medium mb-1">Work</span>
              <input
                type="number"
                min="1"
                max="180"
                value={workMinutes}
                onChange={(e) =>
                  setWorkMinutes(Math.max(1, Math.min(180, Number(e.target.value)))
                )}
                className="text-2xl w-24 text-center rounded-lg border border-violet-500 focus:outline-none focus:ring-4 focus:ring-violet-300 transition-all shadow-md bg-white text-black"
              />
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-medium mb-1">Break</span>
              <input
                type="number"
                min="1"
                max="60"
                value={breakMinutes}
                onChange={(e) =>
                  setBreakMinutes(Math.max(1, Math.min(60, Number(e.target.value)))
                )}
                className="text-2xl w-24 text-center rounded-lg border border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-200 transition-all shadow-md bg-white text-black"
              />
            </div>
          </div>

          <div className="flex justify-center my-10">
            <motion.div
              className="w-80 h-80 relative"
              animate={{ scale: active ? 1.15 : 1 }}
              transition={{ duration: 0.5 }}
            >
              <svg className="w-full h-full" viewBox="0 0 160 160">
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="#E5E7EB"
                  strokeWidth="10"
                  fill="none"
                />
                <motion.circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke={isBreak ? '#34D399' : '#a78bfa'}
                  strokeWidth="10"
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  style={{
                    transform: 'rotate(-90deg)',
                    transformOrigin: 'center'
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-white text-5xl font-mono font-bold drop-shadow-lg">
                {formatTime(seconds)}
              </div>
            </motion.div>
          </div>

          <div className="flex justify-center gap-6 mb-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActive(!active)}
              className="bg-green-600 hover:bg-green-700 text-white text-xl font-semibold px-8 py-3 rounded-xl shadow-lg transition-all"
            >
              {active ? 'Pause' : 'Start'}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReset}
              className="bg-red-500 hover:bg-red-600 text-white text-xl font-semibold px-8 py-3 rounded-xl shadow-lg transition-all"
            >
              Reset
            </motion.button>
          </div>

          <motion.p
            className="text-3xl text-center text-pink-300 font-semibold mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            You've focused <strong>{totalTodayMinutes} minutes</strong> <br />
            AND <strong>{totalTodayHours} Hours</strong> today!!!
          </motion.p>
        </div>

        {/* Progress Charts */}
        <div className="lg:w-1/2 w-full flex flex-col items-center justify-center gap-6">
          {[
            {
              title: '📅 Weekly Progress',
              barColor: '#fbbf24',
              bgColor: 'bg-yellow-100'
            },
            {
              title: '🗓️ Monthly Progress',
              barColor: '#f472b6',
              bgColor: 'bg-pink-100'
            }
          ].map(({ title, barColor, bgColor }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className={`relative w-full max-w-md p-6 rounded-md border border-gray-300 shadow-lg sticky-note ${bgColor}`}
            >
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl">
                📌
              </div>
              <h4 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                {title}
              </h4>
              <BarChart
                width={300}
                height={200}
                data={getProgressData(i === 0 ? 7 : 30)}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  stroke="#111"
                  interval={i === 0 ? 0 : 2}
                  angle={-45}
                  textAnchor="end"
                />
                <YAxis stroke="#111" />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="hours"
                  fill={barColor}
                  shape={<AnimatedBar />}
                  barSize={20}
                />
              </BarChart>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PomodoroPage;
