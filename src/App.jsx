import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import OverviewPage from './pages/Overview.jsx';
import TimetablePage from './pages/Timetable.jsx';
import PomodoroPage from './pages/PomodoroTimer.jsx';
import AddTaskPage from './pages/AddTask.jsx';
import { TaskProvider } from './context/taskContext';

// Helper component to place routing + AnimatePresence properly
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<OverviewPage />} />
        <Route path="/timetable" element={<TimetablePage />} />
        <Route path="/pomodoro" element={<PomodoroPage />} />
        <Route path="/add-task" element={<AddTaskPage />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <TaskProvider>
      <Router>
        <div className="min-h-screen w-full max-w-8xl mx-auto px-4 py-8">
          <nav className="sticky top-0 z-50 bg-white shadow flex gap-4 px-6 py-3 text-lg font-medium">
            <Link to="/" className="hover:text-blue-600 transition">Overview</Link>
            <Link to="/timetable" className="hover:text-blue-600 transition">Timetable</Link>
            <Link to="/pomodoro" className="hover:text-blue-600 transition">Pomodoro</Link>
            <Link to="/add-task" className="hover:text-blue-600 transition">Add Task</Link>
          </nav>
          <AnimatedRoutes />
        </div>
      </Router>
    </TaskProvider>
  );
}
