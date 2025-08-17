import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useContext } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "boxicons/css/boxicons.min.css";

// Components
import Header from "./components/header";
import AdminHeader from "./components/AdminSiteWork/AdminHeader";
import Footer from "./components/footer";
import Hero from "./components/Hero";
import Register from "./components/register";
import Login from "./components/login";
import Profile from "./components/profile";
import UpdateProfile from "./components/updateprofile";
import ForgetPassword from "./components/forgetPassword/forgetpassword";
import ResetPassword from "./components/forgetPassword/reset";
import VerifyOtp from "./components/forgetPassword/verifyotp";
import ViewExam from "./components/universityWork/ViewExam";
import StartExam from "./components/userSide/StartExam";
import StudentExamAssignmentPage from "./components/AdminSiteWork/StudentExamAssignmentPage";
import ResultMarksheet from "./components/userSide/ResultMarksheet";
import ExamResults from "./components/universityWork/ExamResults";
import AllExam from "./components/userSide/AllExam";
import AboutUs from "./components/AboutUs";

// Admin Components
import AdminLogin from "./components/AdminSiteWork/adminlogin";
import AdminDashboard from "./components/AdminSiteWork/dashboard";
import StudentList from "./components/AdminSiteWork/studentList";
import UniversityList from "./components/AdminSiteWork/UniversityList";
import AssignExam from "./components/AdminSiteWork/AssignExam";
import SetExamToUniversity from "./components/AdminSiteWork/SetExamToUniversity";
import AdminManagement from "./components/AdminSiteWork/AdminManagement";
import CheckExam from "./components/userSide/checkExam";
import ProctorLogin from "./components/proctoring/ProctorLogin";

// Dashboard Components
import Proctoring from "./components/dashboards/Proctoring";
import UniversityDashboard from "./components/dashboards/UniversityDashboard";
import ExamStudentList from "./components/universityWork/examstudentlist";
import ProctoringSession from "./components/proctoring/ProctoringSession";

// Context
import { UserContext } from "./context/usercontext";

// Route Guard
const ProtectedRoute = ({ children, allowedRole }) => {
  const { user } = useContext(UserContext);
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRole && user.role?.toLowerCase() !== allowedRole.toLowerCase()) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default function App() {
  const { user } = useContext(UserContext);
  const location = useLocation();

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const isAdminRoute =
    location.pathname.startsWith("/admin") ||
    location.pathname === "/dashboard" ||
    location.pathname.startsWith("/university") ||
    location.pathname.startsWith("/proctor");

  const shouldShowAdminHeader =
    user?.role?.toLowerCase() === "admin" && isAdminRoute;

  const shouldShowFooter = !isAdminRoute;

  return (
    <div className="relative overflow-x-hidden">
      {/* Gradient Background */}
      <img
        className="fixed top-0 right-0 opacity-60 -z-10 w-[700px] max-w-none pointer-events-none"
        src="/gradient.png"
        alt="Gradient-img"
      />
      <div className="fixed h-[40rem] w-[40rem] top-[20%] right-0 translate-x-[15%] shadow-[0_0_900px_20px_#e99b63] -rotate-45 -z-10 pointer-events-none" />

      {/* Header */}
      {shouldShowAdminHeader ? <AdminHeader /> : <Header />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Hero />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/proctor/login" element={<ProctorLogin />} />

        
        {/* Student Routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/update-profile"
          element={
            <ProtectedRoute>
              <UpdateProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/check-exam"
          element={
            <ProtectedRoute allowedRole="student">
              <CheckExam />
            </ProtectedRoute>
          }
        />

        {/* Proctor Routes */}
        <Route
          path="/proctor/dashboard"
          element={
            <ProtectedRoute allowedRole="proctor">
              <Proctoring />
            </ProtectedRoute>
          }
        />

 

        {/* Admin Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

<Route
  path="/admin/student-exam-assignment"
  element={
    <ProtectedRoute allowedRole="admin">
      <StudentExamAssignmentPage />
    </ProtectedRoute>
  }
/>
        <Route
          path="/admin/studentslist"
          element={
            <ProtectedRoute allowedRole="admin">
              <StudentList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/universitylist"
          element={
            <ProtectedRoute allowedRole="admin">
              <UniversityList />
            </ProtectedRoute>
          }
        />

     
        <Route
          path="/admin/assign-exam"
          element={
            <ProtectedRoute allowedRole="admin">
              <AssignExam />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/set-exam/:universityId"
          element={
            <ProtectedRoute allowedRole="admin">
              <SetExamToUniversity />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/admin-management"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/exam-student-list"
          element={
            <ProtectedRoute allowedRole="admin">
              <ExamStudentList />
            </ProtectedRoute>
          }
        />


<Route
  path="/user/result-marksheet"
  element={
    <ProtectedRoute allowedRole="student">
      <ResultMarksheet />
    </ProtectedRoute>
  }
/>

<Route
  path="/user/all-exams"
  element={
    <ProtectedRoute allowedRole="student">
      <AllExam />
    </ProtectedRoute>
  }
/>

        {/* University Routes */}
        <Route
          path="/university/dashboard"
          element={
            <ProtectedRoute allowedRole="university">
              <UniversityDashboard />
            </ProtectedRoute>
          }
        />


<Route
  path="/university/exam-results"
  element={
    <ProtectedRoute allowedRole="university">
      <ExamResults />
    </ProtectedRoute>
  }
/>
<Route
  path="/university/ViewExam/:examId"
  element={
    <ProtectedRoute allowedRole="university">
      <ViewExam />
    </ProtectedRoute>
  }
/>
        <Route
          path="/university/view-exams"
          element={
            <ProtectedRoute allowedRole="university">
              <ExamStudentList />
            </ProtectedRoute>
          }
        />

<Route
  path="/start-exam/:examId"
  element={
    <ProtectedRoute allowedRole="student">
      <StartExam />
    </ProtectedRoute>
  }
/>

<Route
  path="/proctor/live-monitoring"
  element={
    <ProtectedRoute allowedRole="proctor">
      <ProctoringSession />
    </ProtectedRoute>
  }
/>



<Route path="/about" element={<AboutUs />} />


        {/* 404 Page */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex justify-center items-center text-white text-2xl">
              404 | Page Not Found
            </div>
          }
        />
      </Routes>

      {/* Footer */}
      {shouldShowFooter && <Footer />}
    </div>
  );
}
