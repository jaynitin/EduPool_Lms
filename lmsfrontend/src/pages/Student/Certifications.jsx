// src/pages/Student/Certifications.jsx
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';
import Navbar from '../../components/Navbar';
import StudentSidebar from '../../components/StudentSidebar';
import { generateCertificate } from '../../utils/generateCertificate';
import { Award, Download, BookOpen } from 'lucide-react';

export default function Certifications() {
  const { user } = useAuth();
  const [completedCourses, setCompletedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCompletedCourses();
  }, []);

  async function fetchCompletedCourses() {
    try {
      const [purchasesRes, coursesRes] = await Promise.all([
        axiosClient.get('/purchase/my-purchases'),
        axiosClient.get('/courses/student/all'),
      ]);

      const allCourses = coursesRes.data;

      const withProgress = await Promise.all(
        purchasesRes.data.map(async (purchase) => {
          const course = allCourses.find((c) => c.id === purchase.courseId);
          try {
            const progressRes = await axiosClient.get(`/progress/course/${purchase.courseId}`);
            return {
              courseId: purchase.courseId,
              title: course?.title ?? progressRes.data.courseName,
              category: course?.category ?? 'General',
              instructor: course?.instructor?.name,
              progress: progressRes.data.progress ?? 0,
              completedDate: purchase.purchaseDate, // no real completion date field yet — using purchase date as fallback
            };
          } catch {
            return null;
          }
        })
      );

      setCompletedCourses(withProgress.filter((c) => c && c.progress >= 100));
    } catch (err) {
      setError('Failed to load certificates.');
    } finally {
      setLoading(false);
    }
  }

  function handleDownload(course) {
    generateCertificate({
      studentName: user?.name ?? 'Student',
      courseTitle: course.title,
      instructorName: course.instructor,
      completionDate: new Date(course.completedDate).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
      }),
    });
  }

  return (
    <div className="min-h-screen bg-[#F7F5F2] font-body flex flex-col">
      <Navbar active="For Student" />
      <div className="flex flex-1 overflow-hidden">
        <StudentSidebar active="Certifications" />

        <main className="flex-1 px-8 py-6 overflow-y-auto">
          <h1 className="font-display text-2xl text-primary mb-1">Certifications</h1>
          <p className="text-secondary/60 text-sm mb-6">
            Certificates you've earned by completing courses.
          </p>

          {error && (
            <div className="mb-6 rounded-lg bg-quaternary/10 border border-quaternary/30 text-quaternary text-sm px-4 py-2.5">
              {error}
            </div>
          )}

          {loading && <p className="text-sm text-secondary/50">Loading...</p>}

          {!loading && completedCourses.length === 0 && (
            <div className="bg-white rounded-xl border border-secondary/10 p-10 text-center">
              <Award size={32} className="text-secondary/30 mx-auto mb-3" />
              <p className="text-sm text-secondary/50">
                Complete a course to earn your first certificate.
              </p>
            </div>
          )}

          {!loading && completedCourses.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {completedCourses.map((course) => (
                <div key={course.courseId} className="bg-white rounded-xl border border-secondary/10 overflow-hidden">
                  <div className="aspect-video bg-primary flex items-center justify-center relative">
                    <BookOpen size={26} className="text-tertiary" />
                    <span className="absolute top-3 right-3 w-8 h-8 rounded-full bg-quaternary/90 flex items-center justify-center">
                      <Award size={15} className="text-white" />
                    </span>
                  </div>
                  <div className="p-4">
                    <span className="inline-block text-xs bg-tertiary/15 text-tertiary px-2.5 py-0.5 rounded-full font-medium mb-2">
                      {course.category}
                    </span>
                    <p className="text-sm font-semibold text-primary leading-tight mb-1">{course.title}</p>
                    {course.instructor && (
                      <p className="text-xs text-secondary/50 mb-4">By {course.instructor}</p>
                    )}

                    <button
                      onClick={() => handleDownload(course)}
                      className="w-full flex items-center justify-center gap-1.5 bg-primary text-white text-xs font-medium py-2 rounded-lg hover:bg-secondary transition"
                    >
                      <Download size={13} /> Download Certificate
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}