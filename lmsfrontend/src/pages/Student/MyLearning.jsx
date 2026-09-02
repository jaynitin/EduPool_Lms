// src/pages/Student/MyLearning.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import Navbar from "../../components/Navbar";
import StudentSidebar from "../../components/StudentSidebar";
import VideoPlayer from "../../components/VideoPlayer";
import { ArrowLeft, Check, Circle } from "lucide-react";

export default function MyLearning() {
  const navigate = useNavigate();
  const { courseId: routeCourseId } = useParams();

  const [courseId, setCourseId] = useState(routeCourseId ?? null);
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [progress, setProgress] = useState({
    progress: 0,
    completedLessons: 0,
    totalLessons: 0,
  });
  const [activeLesson, setActiveLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [marking, setMarking] = useState(false);

  useEffect(() => {
    if (routeCourseId) {
      setCourseId(routeCourseId);
    } else {
      resolveFirstPurchasedCourse();
    }
  }, [routeCourseId]);

  useEffect(() => {
    if (courseId) {
      fetchCourseData();
    }
  }, [courseId]);

  async function resolveFirstPurchasedCourse() {
    try {
      const res = await axiosClient.get("/purchase/my-purchases");

      if (res.data.length > 0) {
        setCourseId(res.data[0].courseId);
      } else {
        setError("You are not enrolled in any courses yet.");
        setLoading(false);
      }
    } catch (err) {
      console.error("Failed to resolve purchased course:", err);
      setError("Failed to load your courses.");
      setLoading(false);
    }
  }

  async function fetchCourseData() {
    setLoading(true);
    setError("");

    try {
      const [lessonsRes, progressRes] = await Promise.all([
        axiosClient.get(`/lessons/course/${courseId}`),
        axiosClient.get(`/progress/course/${courseId}`),
      ]);

      const fetchedLessons = lessonsRes.data;
      const fetchedProgress = progressRes.data;

      setLessons(fetchedLessons);
      setProgress(fetchedProgress);

      // Get course information from the first lesson
      if (fetchedLessons.length > 0 && fetchedLessons[0].course) {
        setCourse(fetchedLessons[0].course);
      } else {
        setCourse({
          title: fetchedProgress.courseName ?? "Course",
        });
      }

      // Select first lesson by default
      setActiveLesson(fetchedLessons[0] ?? null);
    } catch (err) {
      console.error("Failed to load course content:", err);
      setError("Failed to load course content.");
    } finally {
      setLoading(false);
    }
  }

  async function handleMarkComplete() {
    if (!activeLesson) return;

    setMarking(true);

    try {
      await axiosClient.post(`/progress/lesson/${activeLesson.id}/complete`);

      const progressRes = await axiosClient.get(`/progress/course/${courseId}`);

      setProgress(progressRes.data);
    } catch (err) {
      console.error("Failed to mark lesson complete:", err);
      alert("Failed to mark lesson complete.");
    } finally {
      setMarking(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F5F2]">
        <p className="text-secondary">Loading course...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F5F2] font-body flex flex-col">
      <Navbar active="For Student" />

      <div className="flex flex-1 overflow-hidden">
        <StudentSidebar active="My Learning" />

        <main className="flex-1 px-8 py-6 overflow-y-auto">
          <button
            onClick={() => navigate("/student/courses")}
            className="flex items-center gap-2 text-sm text-tertiary font-medium mb-4 hover:underline"
          >
            <ArrowLeft size={16} />
            Back to My Courses
          </button>

          {error && (
            <div className="mb-6 rounded-lg bg-quaternary/10 border border-quaternary/30 text-quaternary text-sm px-4 py-2.5">
              {error}
            </div>
          )}

          {!error && (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
              {/* Left — video + lesson content */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="font-display text-2xl text-primary">
                      {course?.title ?? "Course"}
                    </h1>

                    <p className="text-secondary/60 text-sm mt-1">
                      {activeLesson?.title ?? "No lesson selected"}
                    </p>
                  </div>

                  <button
                    onClick={handleMarkComplete}
                    disabled={marking || !activeLesson}
                    className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg border border-tertiary text-tertiary hover:bg-tertiary/5 transition disabled:opacity-60"
                  >
                    <Check size={15} />

                    {marking ? "Saving..." : "Mark Complete"}
                  </button>
                </div>

                <VideoPlayer url={activeLesson?.videoUrl} />

                {activeLesson && (
                  <>
                    <h2 className="font-display text-xl text-primary mt-6 mb-2">
                      {activeLesson.title}
                    </h2>

                    <p className="text-sm text-secondary/70 leading-relaxed mb-5">
                      {activeLesson.description}
                    </p>

                    {activeLesson.notesUrl && (
                      <a
                        href={activeLesson.notesUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-tertiary font-medium hover:underline"
                      >
                        Download lesson notes →
                      </a>
                    )}
                  </>
                )}
              </div>

              {/* Right — progress + lesson list */}
              <div className="space-y-5">
                {/* Progress */}
                <div className="bg-white rounded-xl border border-secondary/10 p-5">
                  <h3 className="font-display text-base text-primary mb-3">
                    Course Progress
                  </h3>

                  <div className="h-2 rounded-full bg-secondary/10 mb-2">
                    <div
                      className="h-2 rounded-full bg-tertiary"
                      style={{
                        width: `${progress.progress ?? 0}%`,
                      }}
                    />
                  </div>

                  <p className="text-xs text-secondary/60">
                    {progress.completedLessons ?? 0}/
                    {progress.totalLessons ?? 0} lessons •{" "}
                    {progress.progress ?? 0}% Complete
                  </p>
                </div>

                {/* Lessons */}
                <div className="bg-white rounded-xl border border-secondary/10 p-5">
                  <h3 className="font-display text-base text-primary mb-3">
                    Lessons
                  </h3>

                  <div className="space-y-1">
                    {lessons.length === 0 && (
                      <p className="text-xs text-secondary/50">
                        No lessons added to this course yet.
                      </p>
                    )}

                    {lessons.map((lesson) => (
                      <button
                        key={lesson.id}
                        onClick={() => setActiveLesson(lesson)}
                        className={`w-full flex items-center gap-2 px-2 py-2 rounded-lg text-left text-sm transition ${
                          activeLesson?.id === lesson.id
                            ? "bg-tertiary/10"
                            : "hover:bg-secondary/5"
                        }`}
                      >
                        <Circle
                          size={14}
                          className="text-secondary/30 shrink-0"
                        />

                        <span
                          className={
                            activeLesson?.id === lesson.id
                              ? "text-primary font-medium"
                              : "text-secondary/70"
                          }
                        >
                          {lesson.title}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
