import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import LessonModal from "../../components/LessonModal"
import {
  ArrowLeft,
  ExternalLink,
  Plus,
  ChevronDown,
  ChevronRight,
  GripVertical,
  Pencil,
  Trash2,
  PlayCircle,
  Clock,
  CheckCircle2,
  PenLine,
  Lightbulb,
  ChevronLeft,
  BookOpen,
} from "lucide-react";

// NOTE: mock data — no lesson endpoints exist on the backend yet.
// Once available (likely GET /api/courses/:id/lessons and a sections
// equivalent), replace these with a useEffect + axiosClient fetch,
// same pattern as MyCourses.jsx.

const SECTIONS = [
  {
    id: 1,
    title: "1. Getting Started",
    lessonCount: 4,
    expanded: true,
    lessons: [
      { title: "1. Introduction to React", duration: "08:12" },
      { title: "2. Setting Up Environment", duration: "10:45" },
      { title: "3. Your First React Component", duration: "12:30" },
      { title: "4. JSX Basics", duration: "09:18" },
    ],
  },
  {
    id: 2,
    title: "2. Core Concepts",
    lessonCount: 4,
    expanded: false,
    lessons: [],
  },
  {
    id: 3,
    title: "3. Working with Data",
    lessonCount: 2,
    expanded: false,
    lessons: [],
  },
  {
    id: 4,
    title: "4. Advanced Topics",
    lessonCount: 2,
    expanded: false,
    lessons: [],
  },
];

const TABS = ["Lessons", "Sections", "Resources"];
const PAGE_SIZE = 8;

export default function LessonManagement() {
  console.log("LESSON MANAGEMENT RENDERED");
  const navigate = useNavigate();

  const { courseId } = useParams(); // requires route to become /instructor/lessons/:courseId
  const [activeTab, setActiveTab] = useState("Lessons");
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [sections, setSections] = useState(SECTIONS);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");

  const [lessonModalOpen, setLessonModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);

  useEffect(() => {
    console.log("USE EFFECT RAN");
    console.log("courseId:", courseId);

    if (courseId) {
      fetchCourseAndLessons();
    }
  }, [courseId]);

  //

  async function fetchCourseAndLessons() {
    try {
      setLoading(true);
      setError("");

      console.log("courseId:", courseId);

      const coursesRes = await axiosClient.get("/courses/my-courses");

      console.log("MY COURSES RESPONSE:", coursesRes.data);

      const lessonsRes = await axiosClient.get(`/lessons/course/${courseId}`);

      console.log("LESSONS RESPONSE:", lessonsRes.data);

      const courses = coursesRes.data;

      const currentCourse = courses.find(
        (c) => String(c.id) === String(courseId),
      );

      console.log("CURRENT COURSE:", currentCourse);

      if (!currentCourse) {
        setError("Course not found.");
        return;
      }

      setCourse(currentCourse);
      setLessons(lessonsRes.data);
    } catch (err) {
      console.error("FETCH ERROR:", err);
      console.error("STATUS:", err.response?.status);
      console.error("DATA:", err.response?.data);

      setError(err.response?.data || "Failed to load course.");
    } finally {
      console.log("SETTING LOADING FALSE");
      setLoading(false);
    }
  }

  async function fetchLesson(lessonId) {
    try {
      const res = await axiosClient.get(`/lessons/${lessonId}`);

      console.log("Lesson:", res.data);

      return res.data;
    } catch (err) {
      console.error("Failed to fetch lesson:", err);
    }
  }

  async function handleDeleteLesson(lessonId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this lesson?",
    );

    if (!confirmed) return;

    try {
      await axiosClient.delete(`/lessons/${lessonId}`);

      setLessons((prev) => prev.filter((lesson) => lesson.id !== lessonId));
    } catch (err) {
      console.error("Failed to delete lesson:", err);
    }
  }

  async function handleCreateLesson(lessonData) {
    try {
      const res = await axiosClient.post(
        `/lessons/course/${courseId}`,
        lessonData,
      );

      setLessons((prev) => [...prev, res.data]);

      return res.data;
    } catch (err) {
      console.error("Failed to create lesson:", err);
      throw err;
    }
  }

  async function handleUpdateLesson(lessonId, lessonData) {
    try {
      const res = await axiosClient.put(`/lessons/${lessonId}`, lessonData);

      setLessons((prev) =>
        prev.map((lesson) => (lesson.id === lessonId ? res.data : lesson)),
      );

      return res.data;
    } catch (err) {
      console.error("Failed to update lesson:", err);
      throw err;
    }
  }

  function toggleSection(id) {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, expanded: !s.expanded } : s)),
    );
  }

  function handleAddLesson() {
    setEditingLesson(null);
    setLessonModalOpen(true);
  }

  function handleEditLesson(lesson) {
    setEditingLesson(lesson);
    setLessonModalOpen(true);
  }

  function handleCloseLessonModal() {
    setLessonModalOpen(false);
    setEditingLesson(null);
  }

  const totalPages = Math.max(1, Math.ceil(lessons.length / PAGE_SIZE));
  const pageItems = lessons.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const publishedCount = lessons.filter((l) => l.status === "Published").length;
  const draftCount = lessons.filter((l) => l.status === "Draft").length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F5F2]">
        <p className="text-secondary">Loading course...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F5F2]">
        <p className="text-quaternary">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F5F2] font-body flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden bg-[#F7F5F2] font-body">
        <Sidebar active="Lesson Management" />

        <main className="flex-1 px-8 py-6 overflow-y-auto">
          {/* Header */}
          <button
            onClick={() => navigate("/instructor/courses")}
            className="flex items-center gap-2 text-sm text-tertiary font-medium mb-4 hover:underline"
          >
            <ArrowLeft size={16} /> Back to My Courses
          </button>

          <h1 className="font-display text-2xl text-primary mb-1">
            Lesson Management
          </h1>
          <p className="text-secondary/60 text-sm mb-6">
            Organize and manage lessons for your course.
          </p>

          {/* Course banner */}
          <div className="bg-white rounded-xl border border-secondary/10 p-5 flex items-center justify-between mb-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-lg bg-primary flex items-center justify-center shrink-0">
                <BookOpen size={22} className="text-tertiary" />
              </div>
              <div>
                <p className="font-display text-lg text-primary">
                  {course?.title}
                </p>
                <p className="text-xs text-secondary/60 mt-0.5">
                  {course?.category} &nbsp;•&nbsp; {course?.lessonCount} Lessons
                  &nbsp;•&nbsp; {course?.studentCount} Students
                </p>
              </div>
            </div>
            <button className="flex items-center gap-2 text-sm font-medium border border-secondary/20 rounded-lg px-4 py-2 text-primary bg-white hover:bg-secondary/5 transition">
              View Course <ExternalLink size={14} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-secondary/10 mb-5">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 transition ${
                  activeTab === tab
                    ? "border-tertiary text-primary"
                    : "border-transparent text-secondary/50 hover:text-secondary"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
            {/* Left — main panel */}
            <div>
              {activeTab === "Lessons" && (
                <div className="bg-white rounded-xl border border-secondary/10 p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="font-display text-lg text-primary">
                        All Lessons ({lessons.length})
                      </h2>
                      <p className="text-xs text-secondary/50 mt-0.5">
                        Drag and drop to reorder lessons
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleAddLesson}
                        className="flex items-center gap-2 text-sm font-medium bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary transition"
                      >
                        <Plus size={15} /> Add New Lesson
                      </button>
                      <button className="flex items-center gap-2 text-sm font-medium border border-secondary/20 rounded-lg px-3 py-2 text-primary bg-white">
                        Bulk Actions <ChevronDown size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-[2fr_0.8fr_0.7fr_0.8fr_auto] gap-4 px-2 py-2 text-xs font-medium text-secondary/50 border-b border-secondary/10">
                    <span>Lesson</span>
                    <span>Type</span>
                    <span>Duration</span>
                    <span>Status</span>
                    <span>Actions</span>
                  </div>

                  <div className="divide-y divide-secondary/10">
                    {pageItems.map((lesson, i) => (
                      <div
                        key={lesson.id}
                        className="grid grid-cols-[2fr_0.8fr_0.7fr_0.8fr_auto] gap-4 px-2 py-3.5 items-center"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <GripVertical
                            size={15}
                            className="text-secondary/30 shrink-0 cursor-grab"
                          />
                          <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-medium flex items-center justify-center shrink-0">
                            {(page - 1) * PAGE_SIZE + i + 1}
                          </span>
                          <span className="text-sm font-medium text-primary truncate">
                            {lesson.title}
                          </span>
                        </div>

                        <span className="flex items-center gap-1.5 text-sm text-secondary/70">
                          <PlayCircle size={14} /> {lesson.type}
                        </span>

                        <span className="text-sm text-secondary/70">
                          {lesson.duration}
                        </span>

                        <span
                          className={`w-fit text-xs px-2.5 py-1 rounded-full font-medium ${
                            lesson.status === "Draft"
                              ? "bg-quaternary/15 text-quaternary"
                              : "bg-tertiary/15 text-tertiary"
                          }`}
                        >
                          {lesson.status}
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditLesson(lesson)}
                            className="text-secondary/50 hover:text-primary"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => handleDeleteLesson(lesson.id)}
                            className="text-secondary/50 hover:text-quaternary"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-xs text-secondary/60">
                      Showing {(page - 1) * PAGE_SIZE + 1} to{" "}
                      {Math.min(page * PAGE_SIZE, lessons.length)} of{" "}
                      {lessons.length} lessons
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
                        onClick={() =>
                          setPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={page === totalPages}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-secondary/20 text-secondary/60 disabled:opacity-40"
                      >
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "Sections" && (
                <div className="bg-white rounded-xl border border-secondary/10 p-5 flex items-center justify-center py-16 text-sm text-secondary/40 border-dashed">
                  Section management — reorder and rename sections here.
                </div>
              )}

              {activeTab === "Resources" && (
                <div className="bg-white rounded-xl border border-secondary/10 p-5 flex items-center justify-center py-16 text-sm text-secondary/40 border-dashed">
                  Downloadable resources (PDFs, code files) go here.
                </div>
              )}
            </div>

            {/* Right — course structure + summary */}
            <div className="space-y-5">
              <div className="bg-white rounded-xl border border-secondary/10 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-base text-primary">
                    Course Structure
                  </h2>
                  <button className="flex items-center gap-1.5 text-xs font-medium bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-secondary transition">
                    <Plus size={13} /> Add Section
                  </button>
                </div>

                <div className="space-y-1">
                  {sections.map((section) => (
                    <div key={section.id}>
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="w-full flex items-center justify-between py-2 text-sm"
                      >
                        <span className="flex items-center gap-1.5 text-primary font-medium">
                          {section.expanded ? (
                            <ChevronDown size={14} />
                          ) : (
                            <ChevronRight size={14} />
                          )}
                          {section.title}
                        </span>
                        <span className="text-xs bg-secondary/10 text-secondary/70 px-2 py-0.5 rounded-full">
                          {section.lessonCount} Lessons
                        </span>
                      </button>

                      {section.expanded && section.lessons.length > 0 && (
                        <div className="pl-6 pb-2 space-y-1.5">
                          {section.lessons.map((l, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between text-xs text-secondary/70"
                            >
                              <span className="flex items-center gap-1.5">
                                <PlayCircle size={12} /> {l.title}
                              </span>
                              <span>{l.duration}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-secondary/10 p-5">
                <h2 className="font-display text-base text-primary mb-4">
                  Lesson Summary
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  <SummaryStat
                    icon={PlayCircle}
                    iconBg="bg-tertiary/15"
                    iconColor="text-tertiary"
                    value={course?.lessonCount}
                    label="Total Lessons"
                  />
                  <SummaryStat
                    icon={Clock}
                    iconBg="bg-secondary/15"
                    iconColor="text-secondary"
                    value="2h 05m"
                    label="Total Duration"
                  />
                  <SummaryStat
                    icon={CheckCircle2}
                    iconBg="bg-tertiary/15"
                    iconColor="text-tertiary"
                    value={publishedCount}
                    label="Published Lessons"
                  />
                  <SummaryStat
                    icon={PenLine}
                    iconBg="bg-quaternary/15"
                    iconColor="text-quaternary"
                    value={draftCount}
                    label="Draft Lessons"
                  />
                </div>
              </div>

              <div className="bg-tertiary/10 border border-tertiary/20 rounded-xl p-4 flex gap-3">
                <Lightbulb
                  size={18}
                  className="text-tertiary shrink-0 mt-0.5"
                />
                <div>
                  <p className="text-sm font-medium text-primary mb-0.5">Tip</p>
                  <p className="text-xs text-secondary/70">
                    Use drag and drop to reorder lessons within a section.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <LessonModal
        open={lessonModalOpen}
        lesson={editingLesson}
        onClose={handleCloseLessonModal}
        onCreate={handleCreateLesson}
        onUpdate={handleUpdateLesson}
      />
    </div>
  );
}

function SummaryStat({ icon: Icon, iconBg, iconColor, value, label }) {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`w-9 h-9 rounded-lg ${iconBg} flex items-center justify-center shrink-0`}
      >
        <Icon size={16} className={iconColor} />
      </div>
      <div>
        <p className="font-display text-base text-primary leading-none">
          {value}
        </p>
        <p className="text-xs text-secondary/50 mt-0.5">{label}</p>
      </div>
    </div>
  );
}
