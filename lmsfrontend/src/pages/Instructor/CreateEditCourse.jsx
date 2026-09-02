// src/pages/Instructor/CreateEditCourse.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import {
  ArrowLeft,
  FileText,
  Calendar,
  Tag,
  Layers,
  Clock,
} from "lucide-react";

const TABS = [
  { id: "basic", label: "1. Basic Information", icon: FileText },
  { id: "curriculum", label: "2. Curriculum", icon: Calendar },
  { id: "pricing", label: "3. Pricing", icon: Tag },
  { id: "publish", label: "4. Preview & Publish", icon: Layers },
];

const CATEGORIES = [
  "Web Development",
  "Design",
  "Programming",
  "Database",
  "Marketing",
];

export default function CreateEditCourse() {
  const navigate = useNavigate();
  const { id } = useParams(); // present when editing, undefined when creating

  const [activeTab, setActiveTab] = useState("basic");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [loadingCourse, setLoadingCourse] = useState(!!id);

  useEffect(() => {
    if (id) fetchCourse();
  }, [id]);

  async function fetchCourse() {
    try {
      const res = await axiosClient.get(`/courses/my/${id}`);
      const course = res.data;
      setTitle(course.title ?? "");
      setCategory(course.category ?? CATEGORIES[0]);
      setDuration(course.duration != null ? String(course.duration) : "");
      setDescription(course.description ?? "");
      setPrice(course.price != null ? String(course.price) : "");
    } catch (err) {
      setError("Failed to load course.");
    } finally {
      setLoadingCourse(false);
    }
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError("");
    try {
      const payload = {
        title,
        category,
        duration: duration ? Number(duration) : null,
        description,
        price: price ? Number(price) : null,
      };
      if (id) {
        await axiosClient.put(`/courses/update/${id}`, payload);
      } else {
        await axiosClient.post("/courses/create", payload);
      }
      navigate("/instructor/courses");
    } catch (err) {
      setError("Failed to save course. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F5F2] font-body flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden bg-[#F7F5F2] font-body">
        <Sidebar active="Create / Edit Course" />

        <main className="flex-1 px-8 py-6 overflow-y-auto">
          <button
            onClick={() => navigate("/instructor/courses")}
            className="flex items-center gap-2 text-sm text-tertiary font-medium mb-4 hover:underline"
          >
            <ArrowLeft size={16} /> Back to My Courses
          </button>

          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="font-display text-2xl text-primary">
                {id ? "Edit Course" : "Create Course"}
              </h1>
              <p className="text-secondary/60 text-sm mt-1">
                Build a high-quality course that helps students learn and grow.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="text-sm font-medium px-4 py-2.5 rounded-lg bg-primary text-white hover:bg-secondary transition disabled:opacity-60"
              >
                {submitting ? "Saving…" : id ? "Save Changes" : "Create Course"}
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-6 rounded-lg bg-quaternary/10 border border-quaternary/30 text-quaternary text-sm px-4 py-2.5">
              {error}
            </div>
          )}
          {loadingCourse ? (
            <p className="text-sm text-secondary/50">Loading course...</p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
              <div className="bg-white rounded-xl border border-secondary/10 overflow-hidden">
                <div className="flex border-b border-secondary/10 px-2">
                  {TABS.map(({ id: tabId, label, icon: Icon }) => (
                    <button
                      key={tabId}
                      onClick={() => setActiveTab(tabId)}
                      className={`flex items-center gap-2 px-4 py-3.5 text-sm font-medium border-b-2 transition ${
                        activeTab === tabId
                          ? "border-tertiary text-primary"
                          : "border-transparent text-secondary/50 hover:text-secondary"
                      }`}
                    >
                      <Icon size={15} /> {label}
                    </button>
                  ))}
                </div>

                <div className="p-6">
                  {activeTab === "basic" && (
                    <div className="space-y-5">
                      <Field label="Course Title" required>
                        <input
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="e.g. React.js for Beginners"
                          className={inputClass}
                        />
                      </Field>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <Field label="Course Category" required>
                          <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className={inputClass}
                          >
                            {CATEGORIES.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                        </Field>
                        <Field label="Course Duration">
                          <div className="relative">
                            <Clock
                              size={15}
                              className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/40"
                            />
                            <input
                              value={duration}
                              onChange={(e) => setDuration(e.target.value)}
                              placeholder="12"
                              className={`${inputClass} pl-9`}
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-secondary/50">
                              Hours
                            </span>
                          </div>
                        </Field>
                      </div>

                      <Field label="Short Description" required>
                        <textarea
                          value={description}
                          onChange={(e) =>
                            e.target.value.length <= 200 &&
                            setDescription(e.target.value)
                          }
                          rows={4}
                          placeholder="Describe what this course is about..."
                          className={`${inputClass} resize-none`}
                        />
                        <span className="block text-right text-xs text-secondary/40 mt-1">
                          {description.length}/200
                        </span>
                      </Field>
                    </div>
                  )}

                  {activeTab === "curriculum" && (
                    <div className="border border-secondary/10 rounded-lg p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-semibold text-primary">
                            Course Lessons
                          </h3>

                          <p className="text-sm text-secondary/50 mt-1">
                            Add, edit, and organize the lessons for this course.
                          </p>
                        </div>

                        <button
                          onClick={() =>
                            navigate(`/instructor/courses/${id}/lessons`)
                          }
                          disabled={!id}
                          className="text-sm font-medium px-4 py-2.5 rounded-lg bg-primary text-white hover:bg-secondary transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Manage Lessons
                        </button>
                      </div>

                      {!id && (
                        <p className="text-xs text-quaternary mt-4">
                          Save the course first before adding lessons.
                        </p>
                      )}
                    </div>
                  )}
                  {activeTab === "pricing" && (
                    <Field label="Price (₹)">
                      <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="e.g. 499"
                        className={inputClass}
                      />
                    </Field>
                  )}
                  {activeTab === "publish" && (
                    <div className="space-y-5">
                      <div className="border border-secondary/20 rounded-lg p-5 space-y-3 text-sm">
                        <PreviewRow label="Title" value={title || "—"} />
                        <PreviewRow label="Category" value={category} />
                        <PreviewRow
                          label="Duration"
                          value={duration ? `${duration} Hours` : "—"}
                        />
                        <PreviewRow
                          label="Price"
                          value={price ? `₹${price}` : "—"}
                        />
                        <PreviewRow
                          label="Description"
                          value={description || "—"}
                        />
                      </div>

                      <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="w-full text-sm font-medium px-4 py-3 rounded-lg bg-primary text-white hover:bg-secondary transition disabled:opacity-60"
                      >
                        {submitting
                          ? "Saving…"
                          : id
                            ? "Save Changes"
                            : "Create Course"}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-secondary/10 p-5 h-fit">
                <p className="text-sm font-semibold text-primary mb-4">
                  Course Preview
                </p>
                <div className="space-y-3 text-sm">
                  <PreviewRow label="Title" value={title || "—"} />
                  <PreviewRow label="Category" value={category} />
                  <PreviewRow
                    label="Duration"
                    value={duration ? `${duration} Hours` : "—"}
                  />
                  <PreviewRow label="Price" value={price ? `₹${price}` : "—"} />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-secondary/20 bg-white px-3.5 py-2.5 text-sm text-primary placeholder:text-secondary/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus:border-tertiary transition";

function Field({ label, required, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-primary mb-1.5">
        {label} {required && <span className="text-quaternary">*</span>}
      </label>
      {children}
    </div>
  );
}

function PreviewRow({ label, value }) {
  return (
    <div>
      <p className="text-xs text-secondary/50 mb-0.5">{label}</p>
      <p className="text-primary font-medium">{value}</p>
    </div>
  );
}

function PlaceholderTab({ text }) {
  return (
    <div className="flex items-center justify-center py-16 text-sm text-secondary/40 border border-dashed border-secondary/20 rounded-lg">
      {text}
    </div>
  );
}
