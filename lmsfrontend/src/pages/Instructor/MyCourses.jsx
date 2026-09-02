import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axiosClient from "../../api/axiosClient";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import {
  Search,
  ChevronDown,
  Filter,
  Plus,
  BookOpen,
  Users,
  GraduationCap,
  Star,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const PAGE_SIZE = 5;

export default function MyCourses() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

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

  const filtered = courses.filter((c) =>
    c.title?.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const totalStudents = courses.reduce(
    (sum, c) => sum + (c.enrolledCount ?? 0),
    0,
  );

  return (
    <div className="min-h-screen bg-[#F7F5F2] font-body flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden bg-[#F7F5F2] font-body">
        <Sidebar active="My Courses" />

        <main className="flex-1 px-8 py-6 overflow-y-auto">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="font-display text-2xl text-primary">My Courses</h1>
              <p className="text-secondary/60 text-sm mt-1">
                Manage all your courses in one place.
              </p>
            </div>
            <button
              onClick={() => navigate("/instructor/courses/new")}
              className="flex items-center gap-2 bg-primary text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-secondary transition"
            >
              <Plus size={16} /> Create New Course
            </button>
          </div>

          {error && (
            <div className="mb-6 rounded-lg bg-quaternary/10 border border-quaternary/30 text-quaternary text-sm px-4 py-2.5">
              {error}
            </div>
          )}

          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <StatCard
              icon={BookOpen}
              iconBg="bg-tertiary/15"
              iconColor="text-tertiary"
              label="Total Courses"
              value={loading ? "—" : courses.length}
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
              icon={GraduationCap}
              iconBg="bg-secondary/15"
              iconColor="text-secondary"
              label="Total Enrollments"
              value={loading ? "—" : totalStudents}
              sub="All time"
            />
          </div>

          {/* Search + filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/40"
              />
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search courses..."
                className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-secondary/20 bg-white text-sm text-primary placeholder:text-secondary/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-tertiary transition"
              />
            </div>
            <button className="flex items-center gap-2 border border-secondary/20 rounded-lg px-4 py-2.5 text-sm text-primary bg-white">
              All Status <ChevronDown size={16} />
            </button>
            <button className="flex items-center gap-2 border border-secondary/20 rounded-lg px-4 py-2.5 text-sm text-primary bg-white">
              Sort by: Newest <ChevronDown size={16} />
            </button>
          </div>

          {/* Course table */}
          <div className="bg-white rounded-xl border border-secondary/10 overflow-hidden">
            <div className="grid grid-cols-[2fr_0.7fr_0.7fr_0.7fr_0.8fr_auto] gap-4 px-5 py-3 border-b border-secondary/10 text-xs font-medium text-secondary/60">
              <span>Course</span>
              <span>Students</span>
              <span>Enrolled</span>
              <span>Rating</span>
              <span>Status</span>
              <span>Actions</span>
            </div>

            {loading && (
              <p className="px-5 py-6 text-sm text-secondary/50">
                Loading courses...
              </p>
            )}
            {!loading && filtered.length === 0 && (
              <p className="px-5 py-6 text-sm text-secondary/50">
                {courses.length === 0
                  ? "You haven't created any courses yet."
                  : "No courses match your search."}
              </p>
            )}

            <div className="divide-y divide-secondary/10">
              {pageItems.map((course) => (
                <div
                  key={course.id}
                  className="grid grid-cols-[2fr_0.7fr_0.7fr_0.7fr_0.8fr_auto] gap-4 px-5 py-4 items-center"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-lg bg-primary flex items-center justify-center shrink-0">
                      <BookOpen size={18} className="text-tertiary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-primary truncate">
                        {course.title}
                      </p>
                      <p className="text-xs text-secondary/60 truncate">
                        {course.category ?? "General"}
                      </p>
                    </div>
                  </div>

                  <span className="text-sm font-medium text-primary">
                    {course.enrolledCount ?? 0}
                  </span>
                  <span className="text-sm font-medium text-primary">
                    {course.enrolledCount ?? 0}
                  </span>

                  <span className="flex items-center gap-1 text-sm font-medium text-primary">
                    {course.rating ?? "—"}
                    {course.rating && (
                      <Star
                        size={12}
                        className="text-quaternary fill-quaternary"
                      />
                    )}
                  </span>

                  <span
                    className={`w-fit text-xs px-2.5 py-1 rounded-full font-medium ${
                      course.status === "DRAFT"
                        ? "bg-quaternary/15 text-quaternary"
                        : "bg-tertiary/15 text-tertiary"
                    }`}
                  >
                    {course.status === "DRAFT" ? "Draft" : "Published"}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        navigate(`/instructor/courses/${course.id}`)
                      }
                      className="text-xs border border-secondary/20 rounded-lg px-3 py-1.5 text-primary hover:bg-secondary/5 transition"
                    >
                      View
                    </button>
                    <button
                      onClick={() =>
                        navigate(`/instructor/courses/${course.id}/edit`)
                      }
                      className="text-xs border border-secondary/20 rounded-lg px-3 py-1.5 text-primary hover:bg-secondary/5 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        navigate(`/instructor/courses/${course.id}/lessons`)
                      }
                      className="text-xs border border-secondary/20 rounded-lg px-3 py-1.5 text-primary hover:bg-secondary/5 transition"
                    >
                      Lessons
                    </button>

                    <button
                      onClick={() =>
                        navigate(`/instructor/students/${course.id}`)
                      }
                      className="text-xs border border-secondary/20 rounded-lg px-3 py-1.5 text-primary hover:bg-secondary/5 transition"
                    >
                      Students
                    </button>

                    <button className="text-secondary/50 hover:text-primary">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination */}
          {!loading && filtered.length > 0 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-xs text-secondary/60">
                Showing {(page - 1) * PAGE_SIZE + 1} to{" "}
                {Math.min(page * PAGE_SIZE, filtered.length)} of{" "}
                {filtered.length} courses
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-secondary/20 text-secondary/60 disabled:opacity-40"
                >
                  <ChevronLeft size={14} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (n) => (
                    <button
                      key={n}
                      onClick={() => setPage(n)}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition ${
                        page === n
                          ? "bg-tertiary text-white"
                          : "border border-secondary/20 text-secondary/60"
                      }`}
                    >
                      {n}
                    </button>
                  ),
                )}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-secondary/20 text-secondary/60 disabled:opacity-40"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
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
