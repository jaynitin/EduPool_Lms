import Navbar from "../components/Navbar";

export default function About() {
  return (
    <div className="min-h-screen bg-secondary/5">
        <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white rounded-2xl shadow-sm border border-secondary/10 p-8 md:p-12">
          <h1 className="font-display text-3xl font-bold text-primary mb-6">
            About Edu<span className="text-quaternary">Pool</span>
          </h1>

          <p className="text-gray-600 text-lg leading-8">
            EduPool is a Learning Management Platform created by the students
            of Techno Main Salt Lake as a part of their FSP program. The platform is designed to provide a simple and
            accessible environment where students can discover, purchase, and
            learn from courses while instructors can create and share
            educational content.
          </p>
        </div>
      </div>
    </div>
  );
}