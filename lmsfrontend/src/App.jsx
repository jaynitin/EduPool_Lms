// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import InstructorDashboard from "./pages/Instructor/InstructorDashboard";
import MyCourses from "./pages/Instructor/MyCourses";
import CreateEditCourse from "./pages/Instructor/CreateEditCourse";
import LessonManagement from "./pages/Instructor/LessonManagement";
import StudentsResults from "./pages/Instructor/StudentsResults";
import InstructorCourseView from "./pages/instructor/InstructorCourseView";
import StudentsResultsPicker from "./pages/Instructor/StudentsResultsPicker";

import StudentDashboard from "./pages/Student/StudentDashBoard";
import BrowseCourses from "./pages/Student/BrowseCourses";
import MyLearning from "./pages/Student/MyLearning";
import StudentMyCourses from "./pages/Student/StudentMyCourses";
import Certifications from "./pages/Student/Certifications";
import CertificateDetail from "./pages/Student/CertificateDetail";

import QuizGenerator from "./pages/Student/QuizGenerator";

import About from "./pages/AboutPage";
import Contact from "./pages/ContactPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/instructor/courses"
            element={
              <ProtectedRoute allowedRoles={["INSTRUCTOR"]}>
                <MyCourses />
              </ProtectedRoute>
            }
          />

          <Route
            path="/instructor/dashboard"
            element={
              <ProtectedRoute allowedRoles={["INSTRUCTOR"]}>
                <InstructorDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/instructor/courses/new"
            element={
              <ProtectedRoute allowedRoles={["INSTRUCTOR"]}>
                <CreateEditCourse />
              </ProtectedRoute>
            }
          />

          <Route
            path="/instructor/courses/:id/edit"
            element={
              <ProtectedRoute allowedRoles={["INSTRUCTOR"]}>
                <CreateEditCourse />
              </ProtectedRoute>
            }
          />

          <Route
            path="/instructor/courses/:courseId/lessons"
            element={
              <ProtectedRoute allowedRoles={["INSTRUCTOR"]}>
                <LessonManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/instructor/students/:courseId"
            element={
              <ProtectedRoute allowedRoles={["INSTRUCTOR"]}>
                <StudentsResults />
              </ProtectedRoute>
            }
          />

          <Route
            path="/instructor/courses/:courseId"
            element={<InstructorCourseView />}
          />

          <Route
            path="/instructor/students"
            element={
              <ProtectedRoute allowedRoles={["INSTRUCTOR"]}>
                <StudentsResultsPicker />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor/students/:courseId"
            element={
              <ProtectedRoute allowedRoles={["INSTRUCTOR"]}>
                <StudentsResults />
              </ProtectedRoute>
            }
          />

          {/*Student Routes*/}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute allowedRoles={["STUDENT"]}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/browse"
            element={
              <ProtectedRoute allowedRoles={["STUDENT"]}>
                <BrowseCourses />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/learning"
            element={
              <ProtectedRoute allowedRoles={["STUDENT"]}>
                <MyLearning />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/learning/:courseId"
            element={
              <ProtectedRoute allowedRoles={["STUDENT"]}>
                <MyLearning />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/courses"
            element={
              <ProtectedRoute allowedRoles={["STUDENT"]}>
                <StudentMyCourses />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/certifications"
            element={
              <ProtectedRoute allowedRoles={["STUDENT"]}>
                <Certifications />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/certifications/:id"
            element={
              <ProtectedRoute allowedRoles={["STUDENT"]}>
                <CertificateDetail />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/quiz"
            element={
              <ProtectedRoute allowedRoles={["STUDENT"]}>
                <QuizGenerator />
              </ProtectedRoute>
            }
          />

          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* catch-all for any unmatched path */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
