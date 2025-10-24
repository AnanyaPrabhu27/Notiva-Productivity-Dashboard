import { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import background from '../assets/img/background.png';

export default function AddTaskPage() {
  const [title, setTitle] = useState('');
  const [day, setDay] = useState('Monday');
  const [category, setCategory] = useState('Study');
  const [time, setTime] = useState('');
  const [date, setDate] = useState(''); // <-- New date state

  const { addTask } = useTasks();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!time.trim()) {
      alert('Please specify a time for the task');
      return;
    }

    if (!date) {
      alert('Please specify a date for the task');
      return;
    }

    const normalizedTime = time.padStart(5, '0');
    addTask({ title, day, category, time: normalizedTime, date, completed: false }); // <-- Added date
    navigate('/');
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4 py-12"
      style={{ backgroundImage: `url(${background})` }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="w-full max-w-3xl h-[90vh] bg-[#4d2c3d]/80 text-white backdrop-blur-xl border-2 border-pink-300/60 shadow-2xl rounded-2xl p-10 sm:p-12 relative overflow-hidden"
      >
        <div className="absolute inset-0 rounded-2xl border-4 border-transparent z-[-1] animate-glow-border" />

        <h2 className="text-4xl sm:text-5xl font-bold text-center mb-6 text-pink-200 drop-shadow-lg tracking-wide">
          ➕ Add New Task
        </h2>

        <div className="h-[calc(100%-4rem)] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-pink-400 scrollbar-track-pink-200">
          <form onSubmit={handleSubmit} className="space-y-6 text-lg sm:text-xl">
            <div>
              <label className="block font-semibold text-pink-200 mb-2">Task Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. coding practice"
                required
                className="w-full p-3 sm:p-4 rounded-xl text-black bg-white border border-pink-300 focus:ring-2 focus:ring-pink-400 shadow-md"
              />
            </div>

            <div>
              <label className="block font-semibold text-pink-200 mb-2">Day</label>
              <select
                value={day}
                onChange={(e) => setDay(e.target.value)}
                className="w-full p-3 sm:p-4 rounded-xl text-black bg-white border border-pink-300 focus:ring-2 focus:ring-pink-400 shadow-md"
              >
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-pink-200 mb-2">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full p-3 sm:p-4 rounded-xl text-black bg-white border border-pink-300 focus:ring-2 focus:ring-pink-400 shadow-md"
              />
            </div>

            <div>
              <label className="block font-semibold text-pink-200 mb-2">Time</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                className="w-full p-3 sm:p-4 rounded-xl text-black bg-white border border-pink-300 focus:ring-2 focus:ring-pink-400 shadow-md"
              />
            </div>

            <div>
              <label className="block font-semibold text-pink-200 mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 sm:p-4 rounded-xl text-black bg-white border border-pink-300 focus:ring-2 focus:ring-pink-400 shadow-md"
              >
                {['Study', 'Work', 'Personal'].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full bg-gradient-to-r from-pink-500 via-pink-400 to-pink-500 hover:from-pink-400 hover:to-pink-600 text-white py-3 sm:py-4 rounded-xl font-semibold text-xl transition-all duration-300 shadow-lg"
            >
              ➕ Add Task
            </motion.button>
          </form>
        </div>
      </motion.div>

      <style>
        {`
          @keyframes glow {
            0% { box-shadow: 0 0 10px rgba(255, 192, 203, 0.3); }
            50% { box-shadow: 0 0 30px rgba(255, 192, 203, 0.6); }
            100% { box-shadow: 0 0 10px rgba(255, 192, 203, 0.3); }
          }
          .animate-glow-border {
            animation: glow 3s ease-in-out infinite;
          }
        `}
      </style>
    </div>
  );
}
