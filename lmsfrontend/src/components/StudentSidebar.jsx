// src/components/StudentSidebar.jsx
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Search,
  BookOpen,
  ClipboardList,
  Heart,
  Award,
  Mail,
  Settings,
  Crown,
  HelpCircle,
} from "lucide-react";

import { Sparkles } from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/student/dashboard" },
  { label: "Browse Courses", icon: Search, path: "/student/browse" },
  { label: "My Learning", icon: ClipboardList, path: "/student/learning" },
  { label: "My Courses", icon: BookOpen, path: "/student/courses" },
  //   { label: 'Wishlist', icon: Heart, path: '/student/wishlist' },
  { label: "Certifications", icon: Award, path: "/student/certifications" },
  //   { label: 'Messages', icon: Mail, path: '/student/messages' },
  //   { label: 'Settings', icon: Settings, path: '/student/settings' },
  { label: "Quiz Generator", icon: Sparkles, path: "/student/quiz" },
];

export default function StudentSidebar({ active }) {
  const navigate = useNavigate();

  return (
    <aside className="w-64 bg-white border-r border-secondary/10 flex flex-col justify-between px-4 py-6 shrink-0">
      <nav className="space-y-1">
        {NAV_ITEMS.map(({ label, icon: Icon, path }) => (
          <button
            key={label}
            onClick={() => navigate(path)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
              active === label
                ? "bg-tertiary/10 text-primary"
                : "text-secondary/70 hover:bg-secondary/5"
            }`}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </nav>

      <div className="space-y-4">
        <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-secondary/70 hover:text-primary transition">
          <HelpCircle size={16} />
          Contact Support
        </button>
      </div>
    </aside>
  );
}
