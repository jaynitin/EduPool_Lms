import { useState,useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Bell, ChevronDown, LogOut, User } from "lucide-react";

const NAV_LINKS = [
  // { label: "Home", path: "/" },
  { label: "Courses", path: "/instructor/courses" },
  // { label: "For Instructors", path: "/instructor/dashboard" },
  // { label: "For Student", path: "/student/dashboard" },
  { label: "About Us", path: "/about" }, // no page yet
  { label: "Contact", path: "/contact" }, // no page yet
];

export default function Navbar({ active = "For Instructors" }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  async function handleLogout() {
    setMenuOpen(false);
    await logout();
    navigate("/login");
  }

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayName = user?.name ?? "Instructor Demo";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="h-16 bg-primary flex items-center justify-between px-8 shrink-0 relative z-20">
      {/* Brand */}
      <div className="flex items-center gap-1">
        <span className="font-display text-xl font-bold text-white">Edu</span>
        <span className="font-display text-xl font-bold text-quaternary">
          Pool
        </span>
      </div>
      {/* Nav links */}
      <nav className="hidden md:flex items-center gap-7">
        {NAV_LINKS.map(({ label, path }) => (
          <button
            key={label}
            onClick={() => path && navigate(path)}
            disabled={!path}
            className={`text-sm font-medium pb-1 border-b-2 transition ${
              active === label
                ? "text-quaternary border-quaternary"
                : path
                  ? "text-white/80 border-transparent hover:text-white"
                  : "text-white/30 border-transparent cursor-not-allowed"
            }`}
          >
            {label}
          </button>
        ))}
      </nav>
      {/* Right side — bell + user menu */}
      <div className="flex items-center gap-5">
        <button className="text-white/80 hover:text-white transition">
          <Bell size={19} />
        </button>

        <div className="w-px h-6 bg-white/20" />

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-full bg-tertiary flex items-center justify-center text-xs font-semibold text-white shrink-0">
              {initials}
            </div>
            <span className="hidden sm:block text-sm font-medium text-white">
              {displayName}
            </span>
            <ChevronDown size={15} className="text-white/70" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-lg border border-secondary/10 shadow-lg overflow-hidden">
              <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-primary hover:bg-secondary/5 transition">
                <User size={15} /> Profile
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-quaternary hover:bg-quaternary/5 transition"
              >
                <LogOut size={15} /> Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
