// src/pages/Student/StudentMyCourses.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import Navbar from "../../components/Navbar";
import StudentSidebar from "../../components/StudentSidebar";
import {
  Search,
  ChevronDown,
  BookOpen,
  Star,
  PlayCircle,
  CheckCircle2,
  Clock,
  Award,
} from "lucide-react";

// NOTE: mock data — no enrollment endpoint exists on the backend yet.
// Once available (likely GET /students/:id/courses), replace with a
// useEffect + axiosClient fetch, same pattern as MyCourses.jsx on the
// instructor side.

const TABS = ["All Courses", "In Progress", "Completed", "Not Started"];

const STATUS_STYLES = {
  Completed: "bg-tertiary/15 text-tertiary",
  "In Progress": "bg-secondary/15 text-secondary",
  "Not Started": "bg-quaternary/15 text-quaternary",
};

export default function StudentMyCourses() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("All Courses");

  useEffect(() => {
    fetchPurchasedCourses();
  }, []);

  async function fetchPurchasedCourses() {
    try {
      const [purchasesRes, coursesRes] = await Promise.all([
        axiosClient.get("/purchase/my-purchases"),
        axiosClient.get("/courses/student/all"),
      ]);

      const allCourses = coursesRes.data;

      const merged = await Promise.all(
        purchasesRes.data.map(async (purchase) => {
          const course = allCourses.find((c) => c.id === purchase.courseId);

          let progress = 0;
          let completedLessons = 0;
          let totalLessons = 0;
          try {
            const progressRes = await axiosClient.get(
              `/progress/course/${purchase.courseId}`,
            );
            progress = progressRes.data.progress ?? 0;
            completedLessons = progressRes.data.completedLessons ?? 0;
            totalLessons = progressRes.data.totalLessons ?? 0;
          } catch (err) {
            // no progress yet for this course — defaults above stand
          }

          const status =
            progress >= 100
              ? "Completed"
              : progress > 0
                ? "In Progress"
                : "Not Started";

          return {
            purchaseId: purchase.id,
            courseId: purchase.courseId,
            title: course?.title ?? "Unknown Course",
            category: course?.category ?? "General",
            instructor: course?.instructor?.name ?? "Instructor",
            purchaseDate: purchase.purchaseDate,
            progress,
            completedLessons,
            totalLessons,
            status,
          };
        }),
      );

      setCourses(merged);
    } catch (err) {
      setError("Couldn't load your courses.");
    } finally {
      setLoading(false);
    }
  }

  const filtered = courses.filter((c) => {
    const matchesSearch = (c.title ?? "")
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesTab = activeTab === "All Courses" || c.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const counts = {
    "All Courses": courses.length,
    "In Progress": courses.filter((c) => c.status === "In Progress").length,
    Completed: courses.filter((c) => c.status === "Completed").length,
    "Not Started": courses.filter((c) => c.status === "Not Started").length,
  };

  return (
    <div className="min-h-screen bg-[#F7F5F2] font-body flex flex-col">
      <Navbar active="For Student" />
      <div className="flex flex-1 overflow-hidden">
        <StudentSidebar active="My Courses" />

        <main className="flex-1 px-8 py-6 overflow-y-auto">
          <h1 className="font-display text-2xl text-primary mb-1">
            My Courses
          </h1>
          <p className="text-secondary/60 text-sm mb-6">
            All the courses you're enrolled in, in one place.
          </p>

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
              value={courses.length}
              label="Total Courses"
            />
            <StatCard
              icon={PlayCircle}
              iconBg="bg-secondary/15"
              iconColor="text-secondary"
              value={counts["In Progress"]}
              label="In Progress"
            />
            <StatCard
              icon={CheckCircle2}
              iconBg="bg-tertiary/15"
              iconColor="text-tertiary"
              value={counts.Completed}
              label="Completed"
            />
            <StatCard
              icon={Award}
              iconBg="bg-quaternary/15"
              iconColor="text-quaternary"
              value={counts.Completed}
              label="Certificates Earned"
            />
          </div>

          {/* Search */}
          <div className="relative mb-5">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/40"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your courses..."
              className="w-full max-w-md pl-9 pr-4 py-2.5 rounded-lg border border-secondary/20 bg-white text-sm text-primary placeholder:text-secondary/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-tertiary transition"
            />
          </div>

          {/* Tabs */}
          <div className="flex border-b border-secondary/10 mb-5">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition ${
                  activeTab === tab
                    ? "border-tertiary text-primary"
                    : "border-transparent text-secondary/50 hover:text-secondary"
                }`}
              >
                {tab}
                <span className="text-xs bg-secondary/10 text-secondary/60 px-1.5 py-0.5 rounded-full">
                  {counts[tab]}
                </span>
              </button>
            ))}
          </div>

          {/* Course grid */}
          {filtered.length === 0 ? (
            <p className="text-sm text-secondary/50">
              No courses match your search.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-xl border border-secondary/10 overflow-hidden"
                >
                  <div className="aspect-video bg-primary flex items-center justify-center">
                    <BookOpen size={26} className="text-tertiary" />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs bg-tertiary/15 text-tertiary px-2.5 py-0.5 rounded-full font-medium">
                        {course.category}
                      </span>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${STATUS_STYLES[course.status]}`}
                      >
                        {course.status}
                      </span>
                    </div>

                    <p className="text-sm font-semibold text-primary leading-tight mb-1">
                      {course.title}
                    </p>
                    <p className="text-xs text-secondary/50 mb-3">
                      {course.instructor}
                    </p>

                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex-1 h-1.5 rounded-full bg-secondary/10">
                        <div
                          className="h-1.5 rounded-full bg-tertiary"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-primary shrink-0">
                        {course.progress}%
                      </span>
                    </div>
                    <p className="text-xs text-secondary/50 mb-3">
                      {course.completedLessons}/{course.totalLessons} lessons
                    </p>

                    <div className="flex items-center justify-between text-xs text-secondary/50 mb-3">
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> Purchased{" "}
                        {new Date(course.purchaseDate).toLocaleDateString()}
                      </span>
                    </div>

                    <button
                      onClick={() => navigate(`/student/learning/${course.courseId}`)}
                      className="w-full bg-primary text-white text-sm font-medium py-2 rounded-lg hover:bg-secondary transition"
                    >
                      {course.status === "Completed"
                        ? "Review Course"
                        : course.status === "Not Started"
                          ? "Start Course"
                          : "Continue Learning"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, iconBg, iconColor, value, label }) {
  return (
    <div className="bg-white rounded-xl border border-secondary/10 p-5">
      <div
        className={`w-10 h-10 rounded-full ${iconBg} flex items-center justify-center mb-3`}
      >
        <Icon size={18} className={iconColor} />
      </div>
      <p className="font-display text-2xl text-primary mb-1">{value}</p>
      <p className="text-xs text-secondary/60">{label}</p>
    </div>
  );
}
