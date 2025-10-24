import React, { useState, useRef, useEffect, Component } from 'react';
import { useTasks } from '../context/TaskContext';
import background from '../assets/img/background.png';
import deleteIcon from '../assets/img/delete-web.png';
import { motion } from 'framer-motion';
import Calendar from 'react-calendar';
import '../App.css'; // Import global styles
import 'react-calendar/dist/Calendar.css';

// Error boundary to catch rendering errors and show fallback UI instead of blank page
class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-red-100 text-red-800">
          <h2>Something went wrong:</h2>
          <pre>{this.state.error?.message}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function TimetablePage() {
  const { tasks: tasksFromContext, deleteTask } = useTasks();

  // Ensure tasks is always an array to avoid runtime errors
  const tasks = Array.isArray(tasksFromContext) ? tasksFromContext : [];

  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const defaultTimes = [
    '07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00'
  ];

  const taskTimes = Array.from(new Set(tasks.map(task => task.time)));

  const allTimes = Array.from(new Set([...defaultTimes, ...taskTimes])).sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true })
  );

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const tasksByDayAndTime = {};
  days.forEach(day => {
    tasksByDayAndTime[day] = {};
    allTimes.forEach(time => {
      tasksByDayAndTime[day][time] = tasks.filter(task => task.day === day && task.time === time);
    });
  });

  const getTasksForDate = (date) => {
    const selectedDateStr = date.toISOString().split('T')[0];
    return tasks.filter(task => task.day === selectedDateStr);
  };

  // Reference to calendar container to detect outside clicks
  const calendarRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (showCalendar && calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCalendar]);

  return (
    <ErrorBoundary>
      <div
        className="min-h-screen bg-cover bg-center flex items-center justify-center px-4 py-12 relative"
        style={{ backgroundImage: `url(${background})` }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="w-full max-w-8xl bg-[#4d2c3d]/90 text-white backdrop-blur-xl border border-pink-300 rounded-2xl p-10 relative overflow-hidden shadow-2xl"
        >
          <div className="absolute inset-0 rounded-2xl border-4 border-transparent z-[-1] animate-glow-border" />

          <div className="flex justify-between items-center mb-10">
            <h2 className="text-4xl sm:text-5xl font-bold text-center text-pink-200 tracking-wide drop-shadow-lg">
              🗓️ Weekly Timetable
            </h2>
            <button
              onClick={() => setShowCalendar(prev => !prev)}
              className="bg-pink-300 text-pink-900 font-bold px-4 py-2 rounded-xl shadow hover:bg-pink-400 transition duration-300"
            >
              {showCalendar ? 'Hide Calendar' : 'Show Calendar'}
            </button>
          </div>

          {/* Calendar Popup Modal */}
          {showCalendar && (
            <div className="calendar-popup" style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center'
            }}>
              <motion.div
                ref={calendarRef}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white text-pink-900 rounded-xl shadow-2xl p-6 w-[300px] sm:w-[340px] relative"
              >
                <button
                  onClick={() => setShowCalendar(false)}
                  className="absolute top-3 right-3 text-pink-700 hover:text-pink-900 font-bold text-xl"
                  aria-label="Close Calendar"
                  type="button"
                >
                  ×
                </button>

                <Calendar
                  onChange={setSelectedDate}
                  value={selectedDate}
                />
                <div>
                  Selected Data: {selectedDate.toDateString()}
                </div>

                <div className="mt-4 max-h-60 overflow-y-auto">
                  <h3 className="text-pink-700 font-semibold mb-2">
                    Tasks on {selectedDate.toDateString()}
                  </h3>
                  {getTasksForDate(selectedDate).length ? (
                    getTasksForDate(selectedDate).map((task, idx) => (
                      <div
                        key={idx}
                        className="bg-pink-100 text-pink-900 rounded-lg px-3 py-2 mb-2 text-sm shadow"
                      >
                        <p className="font-bold">{task.title}</p>
                        <p className="italic">{task.time} – {task.category}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm italic text-pink-500">No tasks on this day.</p>
                  )}
                </div>
              </motion.div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full border-collapse rounded-xl overflow-hidden text-lg sm:text-xl">
              <thead>
                <tr>
                  <th className="p-4 border border-pink-300 bg-gradient-to-r from-pink-100 to-pink-200 text-pink-900 font-bold shadow-md sticky left-0 z-10 backdrop-blur-xl">
                    Time
                  </th>
                  {days.map(day => (
                    <th
                      key={day}
                      className="p-4 border border-pink-300 bg-pink-100 text-pink-900 font-semibold shadow-sm"
                    >
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allTimes.map(time => (
                  <tr key={time}>
                    <td className="p-3 border border-pink-300 bg-white text-pink-900 font-bold sticky left-0 backdrop-blur-md z-10">
                      {time}
                    </td>
                    {days.map(day => (
                      <td
                        key={day}
                        className="p-4 border border-pink-300 bg-white text-pink-900 align-top min-w-[160px]"
                      >
                        {tasksByDayAndTime[day][time].length > 0 ? (
                          tasksByDayAndTime[day][time].map((task, index) => (
                            <motion.div
                              key={index}
                              whileHover={{ scale: 1.03 }}
                              className="mb-3 p-3 bg-pink-100 text-pink-900 rounded-xl shadow-md transition-all relative"
                            >
                              <p className="font-bold text-base">{task.title}</p>
                              <p className="text-sm text-pink-700 italic">{task.category}</p>
                              <button
                                onClick={() => deleteTask(task)}
                                className="absolute top-2 right-2"
                                title="Delete Task"
                              >
                                <img
                                  src={deleteIcon}
                                  alt="Delete"
                                  className="w-5 h-5 hover:scale-110 transition-transform duration-200"
                                />
                              </button>
                            </motion.div>
                          ))
                        ) : (
                          <p className="text-sm text-pink-400 italic">—</p>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <style>
          {`
            @keyframes glow {
              0% { box-shadow: 0 0 10px rgba(255, 192, 203, 0.2); }
              50% { box-shadow: 0 0 30px rgba(255, 192, 203, 0.5); }
              100% { box-shadow: 0 0 10px rgba(255, 192, 203, 0.2); }
            }
            .animate-glow-border {
              animation: glow 3.5s ease-in-out infinite;
            }
          `}
        </style>
      </div>
    </ErrorBoundary>
  );
}
