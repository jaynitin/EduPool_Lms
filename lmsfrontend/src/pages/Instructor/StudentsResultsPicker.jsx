import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { BookOpen, Users, ChevronRight } from 'lucide-react';

export default function StudentsResultsPicker() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [counts, setCounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  async function fetchCourses() {
    setLoading(true);
    setError('');
    try {
      const [coursesRes, countsRes] = await Promise.all([
        axiosClient.get('/courses/my-courses'),
        axiosClient.get('/purchase/instructor/my-courses/students'),
      ]);
      setCourses(coursesRes.data);
      setCounts(countsRes.data);
    } catch (err) {
      setError('Failed to load courses.');
    } finally {
      setLoading(false);
    }
  }

  function studentCountFor(courseId) {
    return counts.find((c) => c.courseId === courseId)?.studentCount ?? 0;
  }

  return (
    <div className="min-h-screen bg-[#F7F5F2] font-body flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar active="Students & Results" />

        <main className="flex-1 px-8 py-6 overflow-y-auto">

          <h1 className="font-display text-2xl text-primary mb-1">Students & Results</h1>
          <p className="text-secondary/60 text-sm mb-6">
            Select a course to view student progress.
          </p>

          {error && (
            <div className="mb-6 rounded-lg bg-quaternary/10 border border-quaternary/30 text-quaternary text-sm px-4 py-2.5">
              {error}
            </div>
          )}

          {loading && <p className="text-sm text-secondary/50">Loading courses...</p>}

          {!loading && courses.length === 0 && (
            <div className="bg-white rounded-xl border border-secondary/10 p-10 text-center">
              <BookOpen size={32} className="text-secondary/30 mx-auto mb-3" />
              <p className="text-sm text-secondary/50">You haven't created any courses yet.</p>
            </div>
          )}

          {!loading && courses.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {courses.map((course) => (
                <button
                  key={course.id}
                  onClick={() => navigate(`/instructor/students/${course.id}`)}
                  className="bg-white rounded-xl border border-secondary/10 overflow-hidden text-left hover:border-tertiary/40 transition"
                >
                  <div className="aspect-video bg-primary flex items-center justify-center">
                    <BookOpen size={26} className="text-tertiary" />
                  </div>
                  <div className="p-4">
                    <span className="inline-block text-xs bg-tertiary/15 text-tertiary px-2.5 py-0.5 rounded-full font-medium mb-2">
                      {course.category ?? 'General'}
                    </span>
                    <p className="text-sm font-semibold text-primary leading-tight mb-2">{course.title}</p>

                    <div className="flex items-center justify-between text-xs text-secondary/60">
                      <span className="flex items-center gap-1.5">
                        <Users size={13} /> {studentCountFor(course.id)} students
                      </span>
                      <span className="flex items-center gap-1 text-tertiary font-medium">
                        View <ChevronRight size={13} />
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}