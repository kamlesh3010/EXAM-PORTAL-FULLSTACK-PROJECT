import { useNavigate } from "react-router-dom";
import {
  FaUserGraduate,
  FaClipboardList,
  FaTasks,
  FaSchool,
  FaCogs,
  FaUserShield,
} from "react-icons/fa";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Conduct Exam",
      icon: <FaClipboardList size={30} />,
      onClick: () => navigate("/admin/conduct-exam"),
    },
    {
      title: "Assign Exam (University-wise)",
      icon: <FaTasks size={30} />,
      onClick: () => navigate("/admin/assign-exam"),
    },
    {
      title: "Student List (by University)",
      icon: <FaUserGraduate size={30} />,
      onClick: () => navigate("/admin/studentslist"),
    },
    {
      title: "Universities",
      icon: <FaSchool size={30} />,
      onClick: () => navigate("/admin/universitylist"),
    },
    {
      title: "Admin / University / Proctor Access Management", // Updated label
      icon: <FaUserShield size={30} />,
      onClick: () => navigate("/admin/admin-management"),
    },
    {
  title: "Assign Student Exam",
    icon: <FaCogs size={30} />,
    onClick: () => navigate("/admin/student-exam-assignment"),
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white px-4 pt-28 pb-12 flex flex-col items-center">
      <h2 className="text-3xl font-semibold mb-10 text-yellow-400">Admin Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
        {cards.map((card, index) => (
          <div
            key={index}
            onClick={card.onClick}
            className="cursor-pointer flex flex-col items-center justify-center bg-[#111] border border-gray-700 rounded-xl p-8 text-center transition-transform hover:scale-105 hover:border-yellow-400 shadow-lg"
          >
            <div className="text-yellow-400 mb-4">{card.icon}</div>
            <h3 className="text-lg font-medium">{card.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
