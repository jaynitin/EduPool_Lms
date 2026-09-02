// src/pages/Student/BrowseCourses.jsx
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import StudentSidebar from "../../components/StudentSidebar";
import axiosClient from "../../api/axiosClient";
import EnrollModal from "../../components/EnrollModal";
import {
  Search,
  ChevronDown,
  LayoutGrid,
  List,
  RotateCcw,
  Heart,
  Star,
  ChevronLeft,
  ChevronRight,
  BookOpen,
} from "lucide-react";

const PAGE_SIZE = 8;

const FILTERS = ["All Categories", "All Levels", "All Durations", "All Prices"];

export default function BrowseCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [view, setView] = useState("grid"); // 'grid' | 'list'
  const [page, setPage] = useState(1);
  const [wishlist, setWishlist] = useState(new Set());
  const [enrollTarget, setEnrollTarget] = useState(null); // course being confirmed
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  async function fetchCourses() {
    setLoading(true);
    setError("");
    try {
      const res = await axiosClient.get("/courses/student/all");
      setCourses(res.data);
    } catch (err) {
      setError("Failed to load courses");
    } finally {
      setLoading(false);
    }
  }

  function openEnrollModal(course) {
    setEnrollTarget(course);
  }

  function closeEnrollModal() {
    setEnrollTarget(null);
  }

  async function confirmEnroll() {
    if (!enrollTarget) return;
    setEnrolling(true);
    try {
      // Simulated payment step — swap this block for real Razorpay
      // checkout + signature verification when going to production.
      await new Promise((resolve) => setTimeout(resolve, 900));

      await axiosClient.post(`/purchase/buy/${enrollTarget.id}`);
      setEnrollTarget(null);
      alert("Payment successful — enrolled!");
    } catch (err) {
      const data = err.response?.data;
      const message =
        typeof data === "string" ? data : data?.message || "Failed to enroll.";
      alert(message);
    } finally {
      setEnrolling(false);
    }
  }

  // async function handleEnroll(courseId) {
  //   try {
  //     await axiosClient.post(`/purchase/buy/${courseId}`);
  //     alert("Enrolled successfully!");
  //   } catch (err) {
  //     const data = err.response?.data;
  //     const message =
  //       typeof data === "string" ? data : data?.message || "Failed to enroll.";
  //     alert(message);
  //   }
  // }

  function toggleWishlist(id) {
    setWishlist((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const filtered = courses.filter((c) =>
    c.title?.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="min-h-screen bg-[#F7F5F2] font-body flex flex-col">
      <Navbar active="For Student" />
      <div className="flex flex-1 overflow-hidden">
        <StudentSidebar active="Browse Courses" />

        <main className="flex-1 px-8 py-6 overflow-y-auto">
          <h1 className="font-display text-2xl text-primary mb-1">
            Browse Courses
          </h1>
          <p className="text-secondary/60 text-sm mb-6">
            Explore top courses and learn from expert instructors.
          </p>

          {/* Search + sort + view toggle */}
          <div className="flex flex-col lg:flex-row gap-3 mb-4">
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
                placeholder="Search for courses, skills or instructors..."
                className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-secondary/20 bg-white text-sm text-primary placeholder:text-secondary/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-tertiary transition"
              />
            </div>

            <div className="flex items-center gap-2 text-sm text-secondary/60">
              <span className="whitespace-nowrap">Sort by:</span>
              <button className="flex items-center gap-2 border border-secondary/20 rounded-lg px-3 py-2.5 text-primary bg-white">
                Most Popular <ChevronDown size={15} />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-secondary/60">View:</span>
              <div className="flex border border-secondary/20 rounded-lg overflow-hidden">
                <button
                  onClick={() => setView("grid")}
                  className={`p-2.5 ${view === "grid" ? "bg-tertiary/15 text-tertiary" : "bg-white text-secondary/50"}`}
                >
                  <LayoutGrid size={16} />
                </button>
                <button
                  onClick={() => setView("list")}
                  className={`p-2.5 border-l border-secondary/20 ${view === "list" ? "bg-tertiary/15 text-tertiary" : "bg-white text-secondary/50"}`}
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Filter row — visual only for now, no backend filter params confirmed */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            {FILTERS.map((f) => (
              <button
                key={f}
                className="flex items-center gap-2 border border-secondary/20 rounded-lg px-3.5 py-2 text-sm text-primary bg-white"
              >
                {f} <ChevronDown size={14} />
              </button>
            ))}
            <button
              onClick={() => setSearch("")}
              className="ml-auto flex items-center gap-1.5 text-sm text-tertiary font-medium hover:underline"
            >
              <RotateCcw size={13} /> Clear Filters
            </button>
          </div>

          {error && (
            <div className="mb-6 rounded-lg bg-quaternary/10 border border-quaternary/30 text-quaternary text-sm px-4 py-2.5">
              {error}
            </div>
          )}

          {loading && (
            <p className="text-sm text-secondary/50">Loading courses...</p>
          )}
          {!loading && pageItems.length === 0 && (
            <p className="text-sm text-secondary/50">
              No courses match your search.
            </p>
          )}

          {/* Grid view */}
          {!loading && view === "grid" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
              {pageItems.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  wishlisted={wishlist.has(course.id)}
                  onToggleWishlist={() => toggleWishlist(course.id)}
                  onEnroll={() => openEnrollModal(course)}
                />
              ))}
            </div>
          )}

          {/* List view */}
          {!loading && view === "list" && (
            <div className="space-y-3 mb-6">
              {pageItems.map((course) => (
                <CourseRow
                  key={course.id}
                  course={course}
                  wishlisted={wishlist.has(course.id)}
                  onToggleWishlist={() => toggleWishlist(course.id)}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && pageItems.length > 0 && (
            <div className="flex items-center justify-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-secondary/20 text-secondary/60 disabled:opacity-40"
              >
                <ChevronLeft size={15} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition ${
                    page === n
                      ? "bg-tertiary text-white"
                      : "border border-secondary/20 text-secondary/60"
                  }`}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-secondary/20 text-secondary/60 disabled:opacity-40"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          )}
        </main>
      </div>
      <EnrollModal
        open={!!enrollTarget}
        course={enrollTarget}
        submitting={enrolling}
        onClose={closeEnrollModal}
        onConfirm={confirmEnroll}
      />
    </div>
  );
}

function CourseCard({ course, wishlisted, onToggleWishlist, onEnroll }) {
  return (
    <div className="bg-white rounded-xl border border-secondary/10 overflow-hidden">
      <div className="relative aspect-video bg-primary flex items-center justify-center">
        <BookOpen size={28} className="text-tertiary" />
        <button
          onClick={onToggleWishlist}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center"
        >
          <Heart
            size={15}
            className={
              wishlisted
                ? "text-quaternary fill-quaternary"
                : "text-secondary/50"
            }
          />
        </button>
      </div>
      <div className="p-4">
        <span className="inline-block text-xs bg-tertiary/15 text-tertiary px-2.5 py-1 rounded-full font-medium mb-2">
          {course.category ?? "General"}
        </span>
        <p className="text-sm font-semibold text-primary leading-tight mb-2">
          {course.title}
        </p>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-5 h-5 rounded-full bg-secondary/15 shrink-0" />
          <span className="text-xs text-secondary/60">
            {course.instructorName ?? "Instructor"}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1 text-primary font-medium">
            {course.rating ? (
              <>
                <Star size={12} className="text-quaternary fill-quaternary" />
                {course.rating}
              </>
            ) : (
              <span className="text-secondary/40">No ratings yet</span>
            )}
            {course.enrolledCount != null && (
              <span className="text-secondary/50 font-normal">
                • {course.enrolledCount} students
              </span>
            )}
          </span>
          <span className="font-semibold text-tertiary">
            {course.price != null ? `₹${course.price}` : "—"}
          </span>
        </div>
        <button
          onClick={onEnroll}
          className="w-full bg-primary text-white text-xs font-medium py-2 rounded-lg hover:bg-secondary transition"
        >
          Enroll Now
        </button>
      </div>
    </div>
  );
}

function CourseRow({ course, wishlisted, onToggleWishlist }) {
  return (
    <div className="bg-white rounded-xl border border-secondary/10 p-4 flex items-center gap-4">
      <div className="w-32 aspect-video rounded-lg bg-primary flex items-center justify-center shrink-0">
        <BookOpen size={22} className="text-tertiary" />
      </div>
      <div className="flex-1 min-w-0">
        <span className="inline-block text-xs bg-tertiary/15 text-tertiary px-2.5 py-0.5 rounded-full font-medium mb-1.5">
          {course.category ?? "General"}
        </span>
        <p className="text-sm font-semibold text-primary truncate">
          {course.title}
        </p>
        <p className="text-xs text-secondary/60 mt-1">
          {course.instructorName ?? "Instructor"}
        </p>
      </div>
      <div className="flex items-center gap-6 shrink-0">
        <span className="flex items-center gap-1 text-sm font-medium text-primary">
          {course.rating ? (
            <>
              <Star size={13} className="text-quaternary fill-quaternary" />{" "}
              {course.rating}
            </>
          ) : (
            <span className="text-secondary/40 text-xs">No ratings</span>
          )}
        </span>
        <span className="font-semibold text-tertiary text-sm">
          {course.price != null ? `₹${course.price}` : "—"}
        </span>
        <button onClick={onToggleWishlist}>
          <Heart
            size={17}
            className={
              wishlisted
                ? "text-quaternary fill-quaternary"
                : "text-secondary/40"
            }
          />
        </button>
      </div>
    </div>
  );
}
