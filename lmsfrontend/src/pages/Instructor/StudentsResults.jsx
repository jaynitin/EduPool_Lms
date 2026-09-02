import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import {
  ArrowLeft, Search, Users, GraduationCap, TrendingUp, CheckCircle2,
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export default function StudentsResults() {
  const navigate = useNavigate();
  const { courseId } = useParams();

  const [course, setCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (courseId) fetchData();
  }, [courseId]);

  async function fetchData() {
    setLoading(true);
    setError('');
    try {
      const [coursesRes, studentsRes] = await Promise.all([
        axiosClient.get('/courses/my-courses'),
        axiosClient.get(`/progress/course/${courseId}/students`),
      ]);

      const currentCourse = coursesRes.data.find((c) => String(c.id) === String(courseId));
      setCourse(currentCourse ?? null);
      setStudents(studentsRes.data);
    } catch (err) {
      setError('Failed to load student progress.');
    } finally {
      setLoading(false);
    }
  }

  const filtered = students.filter((s) =>
    s.studentName?.toLowerCase().includes(search.toLowerCase())
  );

  const completedCount = students.filter((s) => s.progress >= 100).length;
  const inProgressCount = students.filter((s) => s.progress > 0 && s.progress < 100).length;
  const notStartedCount = students.filter((s) => s.progress === 0).length;

  const avgCompletion = students.length
    ? Math.round(students.reduce((sum, s) => sum + s.progress, 0) / students.length)
    : 0;

  const breakdown = [
    { name: 'Completed', value: completedCount, color: '#44A1A4' },
    { name: 'In Progress', value: inProgressCount, color: '#325E6A' },
    { name: 'Not Started', value: notStartedCount, color: '#B9A8D9' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F5F2]">
        <p className="text-secondary">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F5F2] font-body flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar active="Students & Results" />

        <main className="flex-1 px-8 py-6 overflow-y-auto">

          <button
            onClick={() => navigate('/instructor/courses')}
            className="flex items-center gap-2 text-sm text-tertiary font-medium mb-4 hover:underline"
          >
            <ArrowLeft size={16} /> Back to My Courses
          </button>

          <h1 className="font-display text-2xl text-primary mb-1">Students & Results</h1>
          <p className="text-secondary/60 text-sm mb-6">
            {course?.title ?? 'Course'} — track student progress.
          </p>

          {error && (
            <div className="mb-6 rounded-lg bg-quaternary/10 border border-quaternary/30 text-quaternary text-sm px-4 py-2.5">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">

            {/* Left — student table */}
            <div>
              <div className="relative mb-4">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/40" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search students..."
                  className="w-full max-w-md pl-9 pr-4 py-2.5 rounded-lg border border-secondary/20 bg-white text-sm text-primary placeholder:text-secondary/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-tertiary transition"
                />
              </div>

              <div className="bg-white rounded-xl border border-secondary/10 overflow-hidden">
                <div className="grid grid-cols-[1.5fr_1fr_1fr] gap-3 px-5 py-3 border-b border-secondary/10 text-xs font-medium text-secondary/60">
                  <span>Student</span>
                  <span>Lessons Completed</span>
                  <span>Progress</span>
                </div>

                {filtered.length === 0 && (
                  <p className="px-5 py-6 text-sm text-secondary/50">
                    {students.length === 0 ? 'No students enrolled yet.' : 'No students match your search.'}
                  </p>
                )}

                <div className="divide-y divide-secondary/10">
                  {filtered.map((s) => (
                    <div key={s.studentId} className="grid grid-cols-[1.5fr_1fr_1fr] gap-3 px-5 py-3.5 items-center">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-full bg-tertiary/20 text-tertiary flex items-center justify-center text-xs font-semibold shrink-0">
                          {s.studentName?.slice(0, 2).toUpperCase()}
                        </div>
                        <p className="text-sm font-medium text-primary truncate">{s.studentName}</p>
                      </div>

                      <span className="text-sm text-secondary/70">
                        {s.completedLessons}/{s.totalLessons}
                      </span>

                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-secondary/10 max-w-[100px]">
                          <div
                            className="h-1.5 rounded-full bg-tertiary"
                            style={{ width: `${s.progress}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-primary shrink-0">{s.progress}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right — stats + chart */}
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <StatCard icon={Users} iconBg="bg-tertiary/15" iconColor="text-tertiary"
                  value={students.length} label="Total Students" />
                <StatCard icon={GraduationCap} iconBg="bg-secondary/15" iconColor="text-secondary"
                  value={completedCount} label="Completed" />
                <StatCard icon={TrendingUp} iconBg="bg-quaternary/15" iconColor="text-quaternary"
                  value={inProgressCount} label="In Progress" />
                <StatCard icon={CheckCircle2} iconBg="bg-primary/10" iconColor="text-primary"
                  value={`${avgCompletion}%`} label="Avg. Progress" />
              </div>

              <div className="bg-white rounded-xl border border-secondary/10 p-5">
                <h2 className="font-display text-base text-primary mb-3">Progress Overview</h2>

                {students.length === 0 ? (
                  <p className="text-sm text-secondary/50">No data yet.</p>
                ) : (
                  <div className="flex items-center gap-4">
                    <div className="relative w-28 h-28 shrink-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={breakdown}
                            dataKey="value"
                            innerRadius={34}
                            outerRadius={52}
                            paddingAngle={2}
                            stroke="none"
                          >
                            {breakdown.map((entry, i) => (
                              <Cell key={i} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <p className="font-display text-base text-primary leading-none">{students.length}</p>
                        <p className="text-[10px] text-secondary/50 mt-0.5">Students</p>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs">
                      {breakdown.map((entry) => (
                        <div key={entry.name} className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
                          <span className="text-secondary/70">{entry.name} ({entry.value})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, iconBg, iconColor, value, label }) {
  return (
    <div className="bg-white rounded-xl border border-secondary/10 p-4">
      <div className={`w-9 h-9 rounded-full ${iconBg} flex items-center justify-center mb-2`}>
        <Icon size={16} className={iconColor} />
      </div>
      <p className="font-display text-xl text-primary leading-none">{value}</p>
      <p className="text-xs text-secondary/50 mt-1">{label}</p>
    </div>
  );
}