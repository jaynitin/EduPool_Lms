import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import StudentSidebar from '../../components/StudentSidebar';
import {
  ArrowLeft, Download, Share2, Calendar, Clock, BookOpen,
  Trophy, Hash, ShieldCheck, ArrowRight,
} from 'lucide-react';

// NOTE: mock data — matches the single certificate shown in Certifications.jsx.
// Once a real endpoint exists (GET /certificates/:id), fetch by the :id
// route param below instead of using this static object.
const CERTIFICATE = {
  studentName: 'Ankit Das',
  course: 'Node.js Fundamentals',
  instructor: 'Sarah Smith',
  category: 'Web Development',
  completedOn: 'May 18, 2025',
  duration: '12.5 Hours',
  lessonsCompleted: 78,
  totalLessons: 78,
  score: 92,
  certificateId: 'EDP-NJS-2025-51872',
};

export default function CertificateDetail() {
  const navigate = useNavigate();
  const { id } = useParams(); // available once this is wired to a real fetch

  return (
    <div className="min-h-screen bg-[#F7F5F2] font-body flex flex-col">
      <Navbar active="For Student" />
      <div className="flex flex-1 overflow-hidden">
        <StudentSidebar active="Certifications" />

        <main className="flex-1 px-8 py-6 overflow-y-auto">

          <button
            onClick={() => navigate('/student/certifications')}
            className="flex items-center gap-2 text-sm text-tertiary font-medium mb-4 hover:underline"
          >
            <ArrowLeft size={16} /> Back to Certifications
          </button>

          <h1 className="font-display text-2xl text-primary mb-1">Your Certificate</h1>
          <p className="text-secondary/60 text-sm mb-6">
            Congratulations! You've successfully completed the course.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">

            {/* Left — certificate + actions */}
            <div>
              {/* Certificate card */}
              <div className="relative rounded-xl overflow-hidden border-4 border-primary bg-[#FBF8F1] p-10 mb-4">
                {/* Decorative corner accents */}
                <div className="absolute top-0 left-0 w-40 h-40 bg-primary rounded-br-[100%] opacity-90" />
                <div className="absolute bottom-0 right-0 w-40 h-40 bg-primary rounded-tl-[100%] opacity-90" />
                <div className="absolute top-3 left-3 w-40 h-40 border-2 border-quaternary rounded-br-[100%]" />
                <div className="absolute bottom-3 right-3 w-40 h-40 border-2 border-quaternary rounded-tl-[100%]" />

                <div className="relative text-center">
                  <div className="flex items-center justify-center gap-1 mb-6">
                    <span className="font-display text-2xl font-bold text-primary">Edu</span>
                    <span className="font-display text-2xl font-bold text-quaternary">Pool</span>
                  </div>

                  <p className="font-display text-4xl text-primary tracking-wide mb-1">CERTIFICATE</p>
                  <p className="flex items-center justify-center gap-3 text-sm tracking-[0.3em] text-secondary/70 mb-8">
                    <span className="w-8 h-px bg-quaternary" /> OF COMPLETION <span className="w-8 h-px bg-quaternary" />
                  </p>

                  <p className="text-sm text-secondary/70 mb-2">This is to certify that</p>
                  <p className="font-display text-4xl text-tertiary italic mb-3">{CERTIFICATE.studentName}</p>
                  <div className="w-64 h-px bg-secondary/30 mx-auto mb-6" />

                  <p className="text-sm text-secondary/70 mb-1">has successfully completed the course</p>
                  <p className="font-display text-2xl text-primary mb-3">{CERTIFICATE.course}</p>
                  <p className="text-sm text-secondary/70 mb-10">
                    and has demonstrated the required skills and knowledge.
                  </p>

                  <div className="flex items-end justify-between px-6">
                    <div className="text-left">
                      <p className="text-sm text-primary border-b border-secondary/30 pb-1 mb-1 min-w-[140px]">
                        {CERTIFICATE.completedOn}
                      </p>
                      <p className="text-xs text-secondary/50">Date of Completion</p>
                    </div>

                    <div className="w-16 h-16 rounded-full border-2 border-quaternary flex items-center justify-center">
                      <Trophy size={24} className="text-quaternary" />
                    </div>

                    <div className="text-right">
                      <p className="font-display text-lg text-primary italic border-b border-secondary/30 pb-1 mb-1 min-w-[140px]">
                        {CERTIFICATE.instructor}
                      </p>
                      <p className="text-xs text-secondary/50">Instructor</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-3">
                <button className="flex-1 flex items-center justify-center gap-2 border border-secondary/20 rounded-lg py-2.5 text-sm font-medium text-primary bg-white hover:bg-secondary/5 transition">
                  <Download size={15} /> Download Certificate
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 border border-secondary/20 rounded-lg py-2.5 text-sm font-medium text-primary bg-white hover:bg-secondary/5 transition">
                  <Share2 size={15} /> Share Certificate
                </button>
              </div>
            </div>

            {/* Right — details + actions */}
            <div className="space-y-5">
              <div className="bg-white rounded-xl border border-secondary/10 p-5">
                <h2 className="font-display text-base text-primary mb-4">Certificate Details</h2>

                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-secondary/10">
                  <div className="w-11 h-11 rounded-lg bg-primary flex items-center justify-center shrink-0">
                    <BookOpen size={18} className="text-tertiary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-primary truncate">{CERTIFICATE.course}</p>
                    <p className="text-xs text-secondary/50">{CERTIFICATE.category}</p>
                    <p className="text-xs text-secondary/50">By {CERTIFICATE.instructor}</p>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <DetailRow icon={Calendar} label="Completed On" value={CERTIFICATE.completedOn} />
                  <DetailRow icon={Clock} label="Course Duration" value={CERTIFICATE.duration} />
                  <DetailRow icon={BookOpen} label="Lessons Completed"
                    value={`${CERTIFICATE.lessonsCompleted} / ${CERTIFICATE.totalLessons}`} />
                  <DetailRow icon={Trophy} label="Score" value={`${CERTIFICATE.score}%`} />
                  <DetailRow icon={Hash} label="Certificate ID" value={CERTIFICATE.certificateId} />
                </div>
              </div>

              <div className="bg-white rounded-xl border border-secondary/10 p-5">
                <h2 className="font-display text-base text-primary mb-1">What's Next?</h2>
                <p className="text-xs text-secondary/60 mb-4">Keep learning and upgrade your skills.</p>
                <button
                  onClick={() => navigate('/student/browse')}
                  className="w-full flex items-center justify-center gap-2 bg-tertiary text-white text-sm font-medium py-2.5 rounded-lg hover:opacity-90 transition"
                >
                  Browse More Courses <ArrowRight size={15} />
                </button>
              </div>

              <div className="bg-white rounded-xl border border-secondary/10 p-5">
                <h2 className="font-display text-base text-primary mb-1">Verify Certificate</h2>
                <p className="text-xs text-secondary/60 mb-4">
                  Share your certificate ID to let others verify your achievement.
                </p>
                <button className="w-full flex items-center justify-center gap-2 border border-secondary/20 rounded-lg py-2.5 text-sm font-medium text-primary bg-white hover:bg-secondary/5 transition">
                  <ShieldCheck size={15} /> Verify Now
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-2 text-secondary/60">
        <Icon size={14} /> {label}
      </span>
      <span className="text-primary font-medium">{value}</span>
    </div>
  );
}