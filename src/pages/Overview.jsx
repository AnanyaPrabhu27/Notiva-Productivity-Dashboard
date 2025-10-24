import { useTasks } from '../context/TaskContext';
import { useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import Lottie from 'lottie-react';
import dashboardAnimation from '../assets/animations/dashboard.json';
import logo from '../assets/img/notiva-logo.png';
import studyIcon from '../assets/img/study.png';
import workIcon from '../assets/img/work.png';
import personalIcon from '../assets/img/personal.png';
import deleteIcon from '../assets/img/delete-web.png';
import backgroundAnimation from '../assets/animations/background.json';
import { motion } from 'framer-motion';
import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';


export default function OverviewPage() {
  const { tasks, toggleTask, deleteTask, links, addLink, deleteLink } = useTasks();
  const [newLink, setNewLink] = useState('');

  const completed = tasks.filter((t) => t.completed).length;
  const remaining = tasks.length - completed;

  const taskData = [
    { name: 'Completed', value: completed },
    { name: 'Remaining', value: remaining },
  ];

  const COLORS = ['#34d399', '#fbbf24'];

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Study':
        return studyIcon;
      case 'Work':
        return workIcon;
      case 'Personal':
        return personalIcon;
      default:
        return studyIcon;
    }
  };
  const backgroundRef = useRef();
  useEffect(() => {
    if (backgroundRef.current) {
      backgroundRef.current.setSpeed(0.5); // Half speed
    }
  }, []);

  return (
    <div
      className="min-h-screen w-full px-6 py-12 text-white relative overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, #5a2a38, #704050)',
      }}
    >


      {/* Hero Section */}
      <div className="relative z-10 flex flex-col-reverse lg:flex-row items-center justify-between gap-12 mb-20 px-4 lg:px-10">
        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          className="lg:w-1/2 w-full"
        >
          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-4xl md:text-8xl font-extrabold drop-shadow-md text-white">
              🎓 Welcome to Notiva
            </h1>
          </div>
          <p className="text-lg md:text-4xl text-pink-100 mb-8">
            Your elegant workspace for managing tasks, visualizing progress, and boosting productivity.
          </p>

          {/* Add Task Button */}
          <Link to="/add-task">
            <button className="flex items-center gap-4 bg-gradient-to-r from-rose-800 to-pink-600 hover:from-pink-700 hover:to-rose-700 text-white font-bold py-5 px-10 rounded-2xl shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 font-chalk text-2xl ml-10">
              ➕ Add a Task
              <ArrowRight className="w-7 h-7" />
            </button>
          </Link>
        </motion.div>


        {/* Animation Section */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          viewport={{ once: true }}
          className="lg:w-3/4 w-full max-w-2xl flex justify-center items-center relative"
        >
          <div className="relative w-full aspect-[16/10] overflow-hidden shadow-xl backdrop-blur-sm ">
            <Lottie
              lottieRef={backgroundRef}
              animationData={dashboardAnimation}
              loop
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>
      </div>


      {/* Sticky Notes Section */}
      <div className="relative z-10 w-full flex mb-12 px-4 gap-6">
      <div className="w-2/5 flex flex-col gap-6">
        {/* Completed & Remaining */}
        <div className="flex gap-4">
          <div className="flex-1 p-4 border-2 border-dashed border-pink-200 bg-[#2a2a2a] text-center text-white shadow-inner font-chalk">
            <h3 className="text-lg mb-1 text-rose-300">✅ Completed</h3>
            <p className="text-4xl font-bold text-white text-shadow">{completed}</p>
          </div>
          <div className="flex-1 p-4 border-2 border-dashed border-orange-200 bg-[#2a2a2a] text-center text-white shadow-inner font-chalk">
            <h3 className="text-lg mb-1 text-orange-300">📌 Remaining</h3>
            <p className="text-4xl font-bold text-white text-shadow">{remaining}</p>
          </div>
        </div>

        {/* Progress - Sticky Note Style */}
        <div className="sticky-note p-4 shadow-md border border-yellow-100">
          <h3 className="text-lg font-bold text-yellow-900 mb-2 font-chalk">📈 Progress</h3>
          <div className="flex justify-center">
            <PieChart width={180} height={180}>
              <Pie
                data={taskData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={5}
                dataKey="value"
                label
              >
                {taskData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>
        </div>
      </div>


        {/* Right Side - Weekly Tasks */}
        <div className="w-3/5">
          <h3 className="text-3xl font-bold mb-4 text-pink-100">🗂️ Weekly Tasks</h3>
          {tasks.length === 0 ? (
            <div className="bg-yellow-100 text-yellow-900 p-6 shadow-lg border-2 border-yellow-300 font-chalk text-xl text-center w-full max-w-x1 max-w-md mx-auto min-h-[200px]">
              📝 No tasks yet!
              <br />
              <span className="text-lg text-center">Click <Link to="/add-task" className="underline text-pink-600 hover:text-pink-800">here</Link> to add your first task and start your productivity journey.</span>
            </div>
          ) : (
            <ul className="space-y-3">
              {tasks.map((task, i) => (
                <li
                  key={i}
                  className="flex justify-between items-center bg-[#fff0f6] text-rose-900 p-4 rounded-xl shadow-md border border-rose-200 hover:rotate-[2deg] transition"
                >
                  <div className="flex items-center gap-3">
                    <img src={getCategoryIcon(task.category)} alt={task.category} className="w-8 h-8" />
                    <input
                      type="checkbox"
                      className="accent-pink-500 scale-125"
                      checked={task.completed}
                      onChange={() => toggleTask(i)}
                    />
                    <span className={task.completed ? 'line-through text-gray-400' : 'text-lg'}>
                      {task.title} <span className="text-sm text-rose-400">({task.day})</span>
                    </span>
                  </div>
                  <button
                    className="text-rose-500 hover:text-red-600 transition"
                    onClick={() => deleteTask(i)}
                  >
                    <img src={deleteIcon} alt="Delete Task" className="w-12 h-12" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>


      {/* Quick Links Section */}
      <h3 className="text-3xl font-bold mb-3 text-pink-200 relative z-10">🔗 Quick Links</h3>
      <div className="flex flex-col sm:flex-row gap-2 mb-4 relative z-10">
        <input
          type="text"
          placeholder="https://example.com"
          className="bg-[#4d1222] border border-rose-400 text-white p-2 rounded w-full placeholder:text-rose-300"
          value={newLink}
          onChange={(e) => setNewLink(e.target.value)}
        />
        <button
          className="bg-rose-500 text-white px-4 py-2 rounded hover:bg-rose-600 transition"
          onClick={() => {
            if (newLink) {
              addLink(newLink);
              setNewLink('');
            }
          }}
        >
          Add
        </button>
      </div>

      <ul className="space-y-2 relative z-10">
        {links.map((link, i) => (
          <li
            key={i}
            className="flex justify-between items-center bg-[#ffe5ec] text-rose-900 p-3 rounded-xl shadow border border-pink-300 hover:rotate-0 transition"
          >
            <a href={link} className="underline" target="_blank" rel="noreferrer">
              {link}
            </a>
            <button className="text-red-500 hover:text-red-700" onClick={() => deleteLink(i)}>
              <img src={deleteIcon} alt="Delete Link" className="w-12 h-12" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
 
