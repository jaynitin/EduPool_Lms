import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import {
  ArrowLeft,
  BookOpen,
  Clock3,
  Edit,
  IndianRupee,
  PlayCircle,
  Plus,
  MoreVertical,
  Trash2,
} from "lucide-react";
import Navbar from "../../components/Navbar";

export default function InstructorCourseView() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  async function fetchCourse() {
    try {
      setLoading(true);
      setError("");

      const [courseResponse, lessonsResponse] = await Promise.all([
        axiosClient.get(`/courses/my/${courseId}`),
        axiosClient.get(`/lessons/course/${courseId}`),
      ]);

      setCourse(courseResponse.data);
      setLessons(lessonsResponse.data);
    } catch (error) {
      console.error("Failed to load course:", error);
      setError("Failed to load course.");
    } finally {
      setLoading(false);
    }
  }

  function handleEdit() {
    navigate(`/instructor/courses/${courseId}/edit`);
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${course.title}"?\n\nThis action cannot be undone.`,
    );

    if (!confirmed) return;

    try {
      setLoading(true);

      await axiosClient.delete(`/courses/delete/${courseId}`);

      // Course deleted successfully
      navigate("/instructor/courses");
    } catch (error) {
      console.error("Failed to delete course:", error);

      setLoading(false);

      const message =
        error.response?.data || "Failed to delete course. Please try again.";

      setError(message);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary/5 flex items-center justify-center">
        <div className="text-primary font-medium">Loading course...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-secondary/5 flex flex-col items-center justify-center">
        <BookOpen size={48} className="text-secondary mb-4" />

        <h2 className="text-xl font-semibold text-primary">Course not found</h2>

        <button
          onClick={() => navigate("/instructor/courses")}
          className="mt-5 px-5 py-2.5 rounded-lg bg-primary text-white"
        >
          Back to Courses
        </button>
      </div>
    );
  }

  const totalLessons = lessons.length;

  return (
    <div className="min-h-screen bg-secondary/5">
      <Navbar />
      {/* Main content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Back */}
        <button
          onClick={() => navigate("/instructor/courses")}
          className="flex items-center gap-2 text-sm text-primary/70 hover:text-primary transition mb-6"
        >
          <ArrowLeft size={17} />
          Back to My Courses
        </button>

        {/* Course Hero */}
        <section className="bg-primary rounded-2xl overflow-hidden mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px]">
            {/* Course information */}
            <div className="p-8 lg:p-10 text-white">
              <div className="flex items-center gap-3 mb-5">
                {course.category && (
                  <span className="px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs font-semibold">
                    {course.category}
                  </span>
                )}
              </div>

              <h1 className="font-display text-3xl lg:text-4xl font-bold mb-4">
                {course.title}
              </h1>

              <p className="text-white/70 leading-7 max-w-3xl mb-7">
                {course.description}
              </p>

              <div className="flex flex-wrap gap-6 text-sm text-white/75">
                <div className="flex items-center gap-2">
                  <PlayCircle size={17} />
                  {totalLessons} Lessons
                </div>

                <div className="flex items-center gap-2">
                  <Clock3 size={17} />
                  {course.duration ?? 0} Hours
                </div>

                <div className="flex items-center gap-2">
                  <IndianRupee size={17} />₹{course.price ?? 0}
                </div>
              </div>
            </div>

            <div className="bg-black/20 min-h-[240px] lg:min-h-full flex items-center justify-center">
              <BookOpen size={80} strokeWidth={1} className="text-white/30" />
            </div>
          </div>
        </section>

        {/* Action bar */}
        <div className="bg-white border border-secondary/10 rounded-xl px-5 py-4 mb-6 flex flex-wrap items-center justify-between gap-4 shadow-sm">
          <div>
            <p className="font-semibold text-primary">Course Management</p>

            <p className="text-sm text-primary/50 mt-1">
              Manage your course content and settings
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* <button
              onClick={() => navigate(`/courses/${courseId}`)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-primary/15 text-primary text-sm font-medium hover:bg-primary/5 transition"
            >
              <Eye size={16} />
              Preview
            </button> */}

            <button
              onClick={handleEdit}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-quaternary text-white text-sm font-semibold hover:opacity-90 transition"
            >
              <Edit size={16} />
              Edit Course
            </button>
          </div>
        </div>

        {/* Stats */}
        <section className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-7">
          <StatCard
            icon={<PlayCircle size={19} />}
            label="Lessons"
            value={lessons.length}
          />

          <StatCard
            icon={<Clock3 size={19} />}
            label="Duration"
            value={`${course.duration ?? 0} Hours`}
          />

          <StatCard
            icon={<IndianRupee size={19} />}
            label="Course Price"
            value={`₹${course.price ?? 0}`}
          />
        </section>

        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* Curriculum */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-display text-2xl font-bold text-primary">
                  Course Content
                </h2>

                <p className="text-sm text-primary/50 mt-1">
                  {totalLessons} lessons
                </p>
              </div>

              <button
                onClick={() => navigate(`/instructor/courses/${course.id}/lessons`)}
                className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-lg border border-primary/15 text-primary text-sm font-medium hover:bg-primary/5 transition"
              >
                <Plus size={16} />
                Manage Lessons
              </button>
            </div>

            <div className="bg-white border border-secondary/10 rounded-xl overflow-hidden shadow-sm">
              {lessons.length === 0 ? (
                <div className="p-8 text-center">
                  <BookOpen
                    size={35}
                    className="mx-auto text-secondary/30 mb-3"
                  />

                  <p className="text-sm text-primary/50">
                    No lessons have been added to this course yet.
                  </p>

                  <button
                    onClick={() => navigate(`/instructor/lessons/${courseId}`)}
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium"
                  >
                    <Plus size={15} />
                    Add First Lesson
                  </button>
                </div>
              ) : (
                lessons.map((lesson, index) => (
                  <div
                    key={lesson.id}
                    className="px-5 py-4 flex items-center justify-between border-b last:border-b-0 border-secondary/10 hover:bg-secondary/[0.02] transition"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-9 h-9 rounded-lg bg-primary/5 flex items-center justify-center text-primary font-semibold text-sm">
                        {index + 1}
                      </div>

                      <div>
                        <p className="text-sm font-medium text-primary">
                          {lesson.title}
                        </p>

                        <p className="text-xs text-primary/40 mt-1">
                          Lesson {index + 1}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {lesson.videoUrl && (
                        <PlayCircle size={17} className="text-primary/40" />
                      )}

                      <button
                        onClick={() =>
                          navigate(`/instructor/lessons/${courseId}`)
                        }
                        className="text-primary/40 hover:text-primary"
                      >
                        <MoreVertical size={17} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Right sidebar */}
          <aside className="space-y-5">
            <div className="bg-white border border-secondary/10 rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold text-primary mb-4">
                Course Management
              </h3>

              <div className="space-y-2">
                <SettingButton
                  icon={<Edit size={17} />}
                  label="Edit Course"
                  onClick={handleEdit}
                />

                <SettingButton
                  icon={<PlayCircle size={17} />}
                  label="Manage Lessons"
                  onClick={() => navigate(`/instructor/courses/${course.id}/lessons`)}
                />
              </div>
            </div>

            <div className="bg-white border border-secondary/10 rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold text-primary mb-4">
                Course Information
              </h3>

              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-xs text-primary/40 mb-1">Category</p>
                  <p className="text-primary font-medium">{course.category}</p>
                </div>

                <div>
                  <p className="text-xs text-primary/40 mb-1">Price</p>
                  <p className="text-primary font-medium">₹{course.price}</p>
                </div>

                <div>
                  <p className="text-xs text-primary/40 mb-1">Duration</p>
                  <p className="text-primary font-medium">
                    {course.duration} Hours
                  </p>
                </div>

                <div>
                  <p className="text-xs text-primary/40 mb-1">Created</p>
                  <p className="text-primary font-medium">
                    {new Date(course.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={handleDelete}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition"
            >
              <Trash2 size={16} />
              Delete Course
            </button>
          </aside>
        </div>
      </main>
    </div>
  );
}

/* --------------------------------
   Stat Card
-------------------------------- */

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-white border border-secondary/10 rounded-xl p-5 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
          {icon}
        </div>

        <span className="text-sm text-primary/50">{label}</span>
      </div>

      <p className="font-display text-2xl font-bold text-primary">{value}</p>
    </div>
  );
}

/* --------------------------------
   Settings Button
-------------------------------- */

function SettingButton({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-primary hover:bg-primary/5 transition"
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
