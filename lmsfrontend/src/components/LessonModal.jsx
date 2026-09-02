import { useState, useEffect } from "react";

function LessonModal({
  open,
  lesson,
  onClose,
  onCreate,
  onUpdate,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const isEditing = Boolean(lesson);

  useEffect(() => {
    if (lesson) {
      setTitle(lesson.title ?? "");
      setDescription(lesson.description ?? "");
      setVideoUrl(lesson.videoUrl ?? "");
    } else {
      setTitle("");
      setDescription("");
      setVideoUrl("");
    }
  }, [lesson]);

  if (!open) return null;

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);

    try {
      const lessonData = {
        title,
        description,
        videoUrl,
      };

      if (isEditing) {
        await onUpdate(lesson.id, lessonData);
      } else {
        await onCreate(lessonData);
      }

      onClose();
    } catch (err) {
      console.error("Failed to save lesson:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

      <div className="w-full max-w-lg bg-white rounded-xl shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-secondary/10">

          <div>
            <h2 className="font-display text-xl font-bold text-primary">
              {isEditing ? "Edit Lesson" : "Add New Lesson"}
            </h2>

            <p className="text-xs text-secondary/60 mt-1">
              {isEditing
                ? "Update the lesson details"
                : "Add a new lesson to this course"}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-secondary/50 hover:text-primary text-xl"
          >
            ×
          </button>

        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Lesson Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter lesson title"
              required
              className="w-full px-3 py-2.5 rounded-lg border border-secondary/20 text-sm outline-none focus:border-primary"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter lesson description"
              rows={4}
              className="w-full px-3 py-2.5 rounded-lg border border-secondary/20 text-sm outline-none focus:border-primary resize-none"
            />
          </div>

          {/* Video URL */}
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Video URL
            </label>

            <input
              type="text"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2.5 rounded-lg border border-secondary/20 text-sm outline-none focus:border-primary"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg border border-secondary/20 text-sm font-medium text-primary hover:bg-secondary/5"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-secondary disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : isEditing
                  ? "Save Changes"
                  : "Create Lesson"}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}

export default LessonModal;