// src/pages/LoginPage.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const COPY = {
  STUDENT: {
    eyebrow: "For students",
    headline: "Pick up right where you left off.",
    sub: "Your courses, your pace, your progress — all in one place.",
  },
  INSTRUCTOR: {
    eyebrow: "For instructors",
    headline: "Your courses, in your hands.",
    sub: "Upload, manage, and track every course you teach.",
  },
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("STUDENT");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // AFTER
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const user = await login(email, password, role);
      navigate(
        user.role === "INSTRUCTOR"
          ? "/instructor/dashboard"
          : "/student/dashboard",
      );
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Invalid email or password");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  const copy = COPY[role];

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-body">
      {/* Left panel — brand + dynamic copy */}
      <div className="relative md:w-1/2 bg-primary text-white flex flex-col justify-between px-10 py-12 overflow-hidden">
        {/* line-art path motif */}
        <svg
          className="absolute inset-0 h-full w-full opacity-[0.15] pointer-events-none"
          viewBox="0 0 600 800"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
        >
          <path
            d="M-20 700 C 150 650, 180 500, 320 480 S 500 350, 480 200 S 650 50, 700 -20"
            stroke="#44A1A4"
            strokeWidth="2"
          />
          <path
            d="M-40 780 C 130 720, 220 600, 260 560 S 480 420, 460 280 S 620 120, 660 40"
            stroke="#44A1A4"
            strokeWidth="1"
            opacity="0.6"
          />
          {[120, 320, 460].map((cy, i) => (
            <circle
              key={i}
              cx={i === 1 ? 320 : i === 0 ? 200 : 500}
              cy={cy}
              r="4"
              fill="#44A1A4"
            />
          ))}
        </svg>

        <div className="relative">
          <span className="text-sm tracking-wide text-tertiary font-medium">
            Learning Management System
          </span>
        </div>

        <div className="relative max-w-md">
          <p className="text-quaternary text-sm font-medium tracking-wide uppercase mb-4">
            {copy.eyebrow}
          </p>
          <h1 className="font-display text-4xl md:text-5xl leading-tight mb-4 transition-all duration-300">
            {copy.headline}
          </h1>
          <p className="text-white/70 text-base leading-relaxed">{copy.sub}</p>
        </div>

        <p className="relative text-white/40 text-xs">
          © {new Date().getFullYear()} — Built for learning that moves.
        </p>
      </div>

      {/* Right panel — form */}
      <div className="md:w-1/2 bg-[#F7F5F2] flex items-center justify-center px-6 py-12">
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="font-display text-3xl font-bold text-primary tracking-wide">
              EduPool
            </span>
          </div>
          <h2 className="font-display text-2xl text-primary mb-1">
            Welcome back
          </h2>
          <p className="text-secondary/70 text-sm mb-8">Sign in to continue.</p>

          {error && (
            <div className="mb-5 rounded-lg bg-quaternary/10 border border-quaternary/30 text-quaternary text-sm px-4 py-2.5">
              {error}
            </div>
          )}

          {/* Role toggle — sliding amber pill */}
          <div
            role="radiogroup"
            aria-label="Login as"
            className="relative grid grid-cols-2 bg-secondary/10 rounded-full p-1 mb-7"
          >
            <span
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full bg-quaternary shadow-sm transition-transform duration-300 ease-out ${
                role === "INSTRUCTOR"
                  ? "translate-x-[calc(100%+8px)]"
                  : "translate-x-0"
              }`}
              aria-hidden="true"
            />
            <button
              type="button"
              role="radio"
              aria-checked={role === "STUDENT"}
              onClick={() => setRole("STUDENT")}
              className={`relative z-10 py-2 text-sm font-medium rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
                role === "STUDENT" ? "text-primary" : "text-secondary/60"
              }`}
            >
              Student
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={role === "INSTRUCTOR"}
              onClick={() => setRole("INSTRUCTOR")}
              className={`relative z-10 py-2 text-sm font-medium rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
                role === "INSTRUCTOR" ? "text-primary" : "text-secondary/60"
              }`}
            >
              Instructor
            </button>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label
                className="block text-xs font-medium text-secondary mb-1.5"
                htmlFor="email"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full rounded-lg border border-secondary/20 bg-white px-4 py-2.5 text-primary text-sm placeholder:text-secondary/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus:border-tertiary transition"
                placeholder="jane@example.com"
              />
            </div>
            <div>
              <label
                className="block text-xs font-medium text-secondary mb-1.5"
                htmlFor="password"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full rounded-lg border border-secondary/20 bg-white px-4 py-2.5 text-primary text-sm placeholder:text-secondary/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus:border-tertiary transition"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-primary text-white text-sm font-medium py-3 transition hover:bg-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting
              ? "Signing in…"
              : `Continue as ${role === "INSTRUCTOR" ? "Instructor" : "Student"}`}
          </button>
          <p className="text-center text-sm text-secondary/70 mt-6">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-tertiary font-medium hover:underline"
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
