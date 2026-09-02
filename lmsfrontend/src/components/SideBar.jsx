// src/components/InstructorSidebar.jsx
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, BookOpen, PlusSquare, PlayCircle, Users,
  LogOut, HelpCircle, Crown,
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/instructor/dashboard' },
  { label: 'My Courses', icon: BookOpen, path: '/instructor/courses' },
  { label: 'Create / Edit Course', icon: PlusSquare, path: '/instructor/courses/new' },
  // { label: 'Lesson Management', icon: PlayCircle, path: '/instructor/lessons' },
  { label: 'Students & Results', icon: Users, path: '/instructor/students' },
];

export default function Sidebar({ active }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <aside className="w-64 bg-white border-r border-secondary/10 flex flex-col justify-between px-4 py-6 shrink-0">
      <div>
        <div className="flex items-center gap-1 px-2 mb-8">
          <span className="font-display text-2xl font-bold text-primary">Edu</span>
          <span className="font-display text-2xl font-bold text-quaternary">Pool</span>
        </div>

        <nav className="space-y-1">
          {NAV_ITEMS.map(({ label, icon: Icon, path }) => (
            <button
              key={label}
              onClick={() => { console.log('clicked', path); navigate(path); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                active === label
                  ? 'bg-tertiary/10 text-primary'
                  : 'text-secondary/70 hover:bg-secondary/5'
              }`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>
      </div>

      <div className="space-y-4">

        <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-secondary/70 hover:text-primary transition">
          <HelpCircle size={16} />
          Contact Support
        </button>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-secondary/70 hover:text-primary transition"
        >
          <LogOut size={16} />
          Log out
        </button>
      </div>
    </aside>
  );
}