// src/pages/Student/StudentDashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axiosClient from "../../api/axiosClient";
import Navbar from "../../components/Navbar";
import StudentSidebar from "../../components/StudentSidebar";
import {
  BookOpen,
  Clock,
  Trophy,
  Flame,
  MoreVertical,
  ClipboardList,
  Calendar,
  FileText,
  Smartphone,
  Star,
} from "lucide-react";

// NOTE: mock data — no enrollment/progress/certificate endpoints exist on
// the backend yet. Once available (likely GET /students/:id/enrollments,
// /students/:id/stats), replace with a useEffect + axiosClient fetch,
// same pattern as MyCourses.jsx on the instructor side.
const STATS = {
  learningHours: 24.5,
  streak: 7,
};

const UPCOMING = [
  {
    icon: ClipboardList,
    type: "Quiz",
    title: "React Components Quiz",
    due: "Due in 2 days",
  },
  {
    icon: Calendar,
    type: "Live Class",
    title: "Node.js Live Session",
    due: "Tomorrow, 10:00 AM",
  },
  {
    icon: FileText,
    type: "Assignment",
    title: "UI/UX Design Project",
    due: "Due in 5 days",
  },
];

const RECOMMENDED = [
  {
    title: "Python Programming",
    instructor: "Michael Lee",
    rating: 4.9,
    price: "₹499",
  },
  {
    title: "MongoDB Basics",
    instructor: "Emma Wilson",
    rating: 4.7,
    price: "₹599",
  },
  {
    title: "Figma for Beginners",
    instructor: "David Brown",
    rating: 4.8,
    price: "₹399",
  },
];

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

          return {
            id: purchase.id,
            courseId: purchase.courseId,
            title: course?.title ?? "Unknown Course",
            instructor: course?.instructor?.name ?? "Instructor",
            progress,
            completedLessons,
            totalLessons,
          };
        }),
      );

      setCourses(merged);
    } catch (err) {
      setError("Couldn't load your enrolled courses.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F5F2] font-body flex flex-col">
      <Navbar active="For Student" />
      <div className="flex flex-1 overflow-hidden">
        <StudentSidebar active="Dashboard" />

        <main className="flex-1 px-8 py-6 overflow-y-auto">
          {/* Header */}
          <h1 className="font-display text-2xl text-primary mb-1">
            Welcome back, {user?.name ?? "Student"}! 👋
          </h1>
          <p className="text-secondary/60 text-sm mb-6">
            Keep learning and achieve your goals.
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
              label="Enrolled Courses"
              value={loading ? "—" : courses.length}
              sub={`${courses.filter((c) => c.progress > 0 && c.progress < 100).length} in progress`}
              subColor="text-tertiary"
            />
            {/* <StatCard
              icon={Clock}
              iconBg="bg-quaternary/15"
              iconColor="text-quaternary"
              label="Learning Hours"
              value={STATS.learningHours}
              sub="This month"
              subColor="text-quaternary"
            /> */}
            <StatCard
              icon={Trophy}
              iconBg="bg-secondary/15"
              iconColor="text-secondary"
              label="Certificates Earned"
              value={
                loading ? "—" : courses.filter((c) => c.progress >= 100).length
              }
              sub="Keep learning!"
              subColor="text-secondary"
            />
            {/* <StatCard
              icon={Flame}
              iconBg="bg-quaternary/15"
              iconColor="text-quaternary"
              label="Current Streak"
              value={STATS.streak}
              sub="Days in a row 🔥"
              subColor="text-quaternary"
            /> */}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 mb-6">
            {/* Left column */}
            <div className="space-y-6">
              {/* Continue Learning */}
              <div className="bg-white rounded-xl border border-secondary/10 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-lg text-primary">
                    Continue Learning
                  </h2>
                  <button
                    className="text-sm text-tertiary font-medium hover:underline"
                    onClick={() =>
                      navigate(`/student/learning/${course.courseId}`)
                    }
                  >
                    View All
                  </button>
                </div>
                {(() => {
                  const inProgress =
                    courses.find((c) => c.progress > 0 && c.progress < 100) ??
                    courses[0];
                  if (!inProgress) {
                    return (
                      <p className="text-sm text-secondary/50">
                        No courses in progress yet.
                      </p>
                    );
                  }
                  return (
                    <div className="flex items-center gap-4">
                      <div className="w-32 aspect-video rounded-lg bg-primary flex items-center justify-center shrink-0">
                        <BookOpen size={24} className="text-tertiary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-primary text-sm mb-1">
                          {inProgress.title}
                        </p>
                        <p className="text-xs text-secondary/60 mb-3">
                          {inProgress.completedLessons}/
                          {inProgress.totalLessons} lessons completed
                        </p>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-1.5 rounded-full bg-secondary/10">
                            <div
                              className="h-1.5 rounded-full bg-tertiary"
                              style={{ width: `${inProgress.progress}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-primary">
                            {inProgress.progress}%
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* My Courses */}
              <div className="bg-white rounded-xl border border-secondary/10 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-lg text-primary">
                    My Courses
                  </h2>
                  <button
                    onClick={() => navigate("/student/courses")}
                    className="text-sm text-tertiary font-medium hover:underline"
                  >
                    View All
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {courses.slice(0, 3).map((course) => (
                    <div
                      key={course.id}
                      className="border border-secondary/10 rounded-lg overflow-hidden"
                    >
                      <div className="aspect-video bg-primary flex items-center justify-center">
                        <BookOpen size={22} className="text-tertiary" />
                      </div>
                      <div className="p-3">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className="text-sm font-medium text-primary leading-tight">
                            {course.title}
                          </p>
                          <button className="text-secondary/40 hover:text-primary shrink-0">
                            <MoreVertical size={14} />
                          </button>
                        </div>
                        <p className="text-xs text-secondary/50 mb-2">
                          {course.instructor}
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 rounded-full bg-secondary/10">
                            <div
                              className="h-1.5 rounded-full bg-tertiary"
                              style={{ width: `${course.progress}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-primary">
                            {course.progress}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended for You */}
              {/* <div className="bg-white rounded-xl border border-secondary/10 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-lg text-primary">
                    Recommended for You
                  </h2>
                  <button className="text-sm text-tertiary font-medium hover:underline">
                    View All
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {RECOMMENDED.map((course, i) => (
                    <div
                      key={i}
                      className="border border-secondary/10 rounded-lg p-3"
                    >
                      <div className="w-full aspect-square rounded-lg bg-primary flex items-center justify-center mb-3">
                        <BookOpen size={20} className="text-tertiary" />
                      </div>
                      <p className="text-sm font-medium text-primary leading-tight mb-0.5">
                        {course.title}
                      </p>
                      <p className="text-xs text-secondary/50 mb-2">
                        {course.instructor}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-xs font-medium text-primary">
                          <Star
                            size={11}
                            className="text-quaternary fill-quaternary"
                          />{" "}
                          {course.rating}
                        </span>
                        <span className="text-xs font-semibold text-tertiary">
                          {course.price}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div> */}

            </div>

            {/* Right column */}
            <div className="space-y-6">
              {/* Upcoming Activities */}
              {/* <div className="bg-white rounded-xl border border-secondary/10 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-base text-primary">
                    Upcoming Activities
                  </h2>
                  <button className="text-xs text-tertiary font-medium hover:underline">
                    View All
                  </button>
                </div>
                <div className="space-y-4">
                  {UPCOMING.map(({ icon: Icon, type, title, due }, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-tertiary/10 flex items-center justify-center shrink-0">
                        <Icon size={16} className="text-tertiary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-secondary/50">{type}</p>
                        <p className="text-sm font-medium text-primary truncate">
                          {title}
                        </p>
                        <p className="text-xs text-quaternary mt-0.5">{due}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div> */}

              {/* Mobile app promo */}
              {/* <div className="bg-tertiary/10 border border-tertiary/20 rounded-xl p-5">
                <Smartphone size={22} className="text-tertiary mb-3" />
                <p className="font-display text-base text-primary mb-1">
                  Learn Anywhere, Anytime
                </p>
                <p className="text-xs text-secondary/60 mb-4">
                  Access your courses on the go and never stop learning.
                </p>
                <button className="bg-primary text-white text-xs font-medium px-4 py-2 rounded-lg hover:bg-secondary transition">
                  Get Mobile App
                </button>
              </div> */}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  iconBg,
  iconColor,
  label,
  value,
  sub,
  subColor,
}) {
  return (
    <div className="bg-white rounded-xl border border-secondary/10 p-5">
      <div className="flex items-center gap-3 mb-3">
        <div
          className={`w-10 h-10 rounded-full ${iconBg} flex items-center justify-center shrink-0`}
        >
          <Icon size={18} className={iconColor} />
        </div>
        <p className="text-xs text-secondary/60">{label}</p>
      </div>
      <p className="font-display text-2xl text-primary mb-1">{value}</p>
      <p className={`text-xs font-medium ${subColor}`}>{sub}</p>
    </div>
  );
}
