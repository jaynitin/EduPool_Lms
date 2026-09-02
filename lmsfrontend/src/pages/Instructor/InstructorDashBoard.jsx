// src/pages/InstructorDashboard.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import Navbar from "../../components/Navbar";
import SideBar from "../../components/Sidebar";

import {
  BookOpen,
  Users,
  Plus,
  Star,
  ChevronDown,
  MoreHorizontal,
  LayoutDashboard,
  PlayCircle,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

// Placeholder — replace once backend exposes a performance-over-time endpoint
const PERFORMANCE_DATA = [
  { day: "Mon", value: 20 },
  { day: "Tue", value: 45 },
  { day: "Wed", value: 38 },
  { day: "Thu", value: 55 },
  { day: "Fri", value: 60 },
  { day: "Sat", value: 58 },
  { day: "Sun", value: 82 },
];

// Placeholder — replace once backend exposes an activity feed
const RECENT_ACTIVITY = [
  { icon: BookOpen, text: "New enrollment in a course", time: "2 min ago" },
  { icon: Users, text: "New review received", time: "1 hour ago" },
  { icon: PlayCircle, text: "New lesson added", time: "3 hours ago" },
];

export default function InstructorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCourses();
  }, []);

  async function fetchCourses() {
    setLoading(true);
    setError("");
    try {
      const [coursesRes, countsRes] = await Promise.all([
        axiosClient.get("/courses/my-courses"),
        axiosClient.get("/purchase/instructor/my-courses/students"),
      ]);

      const counts = countsRes.data;

      const merged = coursesRes.data.map((course) => {
        const match = counts.find((c) => c.courseId === course.id);
        return {
          ...course,
          enrolledCount: match?.studentCount ?? 0,
        };
      });

      setCourses(merged);
    } catch (err) {
      setError("Failed to load courses");
    } finally {
      setLoading(false);
    }
  }
  // Derived from real course data where possible
  const totalCourses = courses.length;
  const totalStudents = courses.reduce(
    (sum, c) => sum + (c.enrolledCount ?? 0),
    0,
  );
  const topCourse = [...courses].sort(
    (a, b) => (b.enrolledCount ?? 0) - (a.enrolledCount ?? 0),
  )[0];

  return (
    <div className="min-h-screen bg-[#F7F5F2] font-body flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden bg-[#F7F5F2] font-body">
        {/* Sidebar */}
        <SideBar active="Dashboard" />
        {/* Main content */}
        <main className="flex-1 px-8 py-6 overflow-y-auto">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="font-display text-2xl text-primary">
                Welcome back, {user?.name ?? "Instructor"}!
              </h1>
              <p className="text-secondary/60 text-sm mt-1">
                Here's an overview of your teaching activity.
              </p>
            </div>
            <button className="flex items-center gap-2 border border-secondary/20 rounded-lg px-4 py-2 text-sm text-primary bg-white">
              This Week <ChevronDown size={16} />
            </button>
          </div>

          {error && (
            <div className="mb-6 rounded-lg bg-quaternary/10 border border-quaternary/30 text-quaternary text-sm px-4 py-2.5">
              {error}
            </div>
          )}

          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              icon={BookOpen}
              iconBg="bg-tertiary/15"
              iconColor="text-tertiary"
              label="Total Courses"
              value={loading ? "—" : totalCourses}
              sub="Active courses"
            />
            <StatCard
              icon={Users}
              iconBg="bg-quaternary/15"
              iconColor="text-quaternary"
              label="Total Students"
              value={loading ? "—" : totalStudents}
              sub="Across all courses"
            />
            <StatCard
              icon={Star}
              iconBg="bg-secondary/15"
              iconColor="text-secondary"
              label="Total Enrollments"
              value={loading ? "—" : totalStudents}
              sub="All time"
            />
            <StatCard
              icon={LayoutDashboard}
              iconBg="bg-primary/10"
              iconColor="text-primary"
              label="Course Rating"
              value="4.8"
              sub="Average"
            />
          </div>

          {/* Chart + top course */}
          {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2 bg-white rounded-xl border border-secondary/10 p-5">
              <h2 className="font-display text-lg text-primary mb-4">
                Course Performance
              </h2>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={PERFORMANCE_DATA}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#325E6A20"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 12, fill: "#325E6A" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#325E6A" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#44A1A4"
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl border border-secondary/10 p-5">
              <h2 className="font-display text-lg text-primary mb-4">
                Top Performing Course
              </h2>
              {topCourse ? (
                <div>
                  <div className="w-full aspect-video rounded-lg bg-primary flex items-center justify-center mb-3">
                    <BookOpen className="text-tertiary" size={32} />
                  </div>
                  <p className="font-medium text-primary text-sm mb-2">
                    {topCourse.title}
                  </p>
                  <div className="flex justify-between text-xs text-secondary/70 mb-4">
                    <span>{topCourse.enrolledCount ?? 0} enrollments</span>
                    <span className="flex items-center gap-1">
                      <Star
                        size={12}
                        className="text-quaternary fill-quaternary"
                      />{" "}
                      4.8
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      navigate(`/instructor/courses/${topCourse.id}`)
                    }
                    className="w-full border border-primary/20 text-primary text-sm py-2 rounded-lg hover:bg-primary/5 transition"
                  >
                    View Course
                  </button>
                </div>
              ) : (
                <p className="text-sm text-secondary/50">No course data yet.</p>
              )}
            </div>
          </div> */}

          {/* My Courses + Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl border border-secondary/10 p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-display text-lg text-primary">
                  My Courses
                </h2>
                <button
                  onClick={() => navigate("/instructor/courses/new")}
                  className="flex items-center gap-1 text-sm text-tertiary font-medium hover:underline"
                >
                  <Plus size={14} /> New Course
                </button>
              </div>

              {loading && (
                <p className="text-sm text-secondary/50">Loading courses...</p>
              )}
              {!loading && courses.length === 0 && (
                <p className="text-sm text-secondary/50">
                  You haven't uploaded any courses yet.
                </p>
              )}

              <div className="divide-y divide-secondary/10">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="flex items-center justify-between py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <BookOpen size={18} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-primary">
                          {course.title}
                        </p>
                        <p className="text-xs text-secondary/60">
                          {course.enrolledCount ?? 0} students
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs bg-tertiary/15 text-tertiary px-2.5 py-1 rounded-full font-medium">
                        Active
                      </span>
                      <button className="text-secondary/50 hover:text-primary">
                        <MoreHorizontal size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-secondary/10 p-5">
              <h2 className="font-display text-lg text-primary mb-4">
                Recent Activity
              </h2>
              <div className="space-y-4">
                {RECENT_ACTIVITY.map(({ icon: Icon, text, time }, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                      <Icon size={14} className="text-secondary" />
                    </div>
                    <div>
                      <p className="text-xs text-primary">{text}</p>
                      <p className="text-xs text-secondary/50">{time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, iconBg, iconColor, label, value, sub }) {
  return (
    <div className="bg-white rounded-xl border border-secondary/10 p-5">
      <div
        className={`w-10 h-10 rounded-full ${iconBg} flex items-center justify-center mb-3`}
      >
        <Icon size={18} className={iconColor} />
      </div>
      <p className="text-xs text-secondary/60 mb-1">{label}</p>
      <p className="font-display text-2xl text-primary mb-2">{value}</p>
      <span className="text-xs bg-secondary/10 text-secondary/70 px-2 py-0.5 rounded-full">
        {sub}
      </span>
    </div>
  );
}
