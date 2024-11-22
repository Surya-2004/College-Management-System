import { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../../UserContext";
import AttendanceGraph from "./attendanceGraph";
import AttendanceTable from "./attendanceTable";
import DownloadButton from "./DownloadButton";
import ClassDetail from "./classDetail";

export default function ClassAttendance() {
  const { role, username } = useUser(); // Fetch role and username from context
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewFormat, setViewFormat] = useState("table");
  const [students, setStudents] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [showAttendanceForm, setShowAttendanceForm] = useState(false);
  const [updatedData, setUpdatedData] = useState([]);

  var formattedAttendance = [];

  // Fetch attendance data
  const fetchAttendance = async () => {
    try {
      setLoading(true);

      const endpoint =
        role === "Student"
          ? `http://localhost:5000/api/attendance/student/${username}`
          : `http://localhost:5000/api/attendance/class/${selectedClassId}`;

      const response = await axios.get(endpoint);

      const { data } = response.data;

      formattedAttendance = data
        .filter((entry) => entry.date)
        .map((entry) => ({
          date: entry.date,
          attendance: entry.attendance.map((student) => ({
            studentId: student.studentId,
            status: student.status,
          })),
        }));

      setUpdatedData((prev) => {
        const val = [...prev, ...formattedAttendance];
        setAttendanceData(val);
        return val;
      });
    } catch (error) {
      console.error(
        "Error fetching attendance:",
        error.response?.data?.message || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch students for a selected class
  const fetchClassStudents = async (classId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/students/class/${classId}`
      );
      if (!response.ok) throw new Error("Failed to fetch students.");
      const data = await response.json();
      setStudents(data.students || []);
    } catch (error) {
      console.error("Error fetching students:", error.message);
    }
  };

  // Handle class selection and fetch attendance + students
  const handleClassSelection = async (classId) => {
    setSelectedClassId(classId);
    await fetchAttendance();
    await fetchClassStudents(classId);
  };

  // Toggle between table and graph views
  const handleViewToggle = (format) => {
    setViewFormat(format);
  };

  // Fetch attendance automatically for students on component mount
  useEffect(() => {
    if (role === "Student") {
      fetchAttendance();
    }
  }, [role]);

  return (
    <div className="bg-gray-900 text-white p-8 rounded-lg shadow-md w-full max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">
        {role === "Student" ? "Your Attendance" : "Class Attendance"}
      </h2>

      {role === "Student" ? (
        <div>
          {loading ? (
            <p className="text-gray-300">Loading...</p>
          ) : (
            <>
              <div className="flex gap-4 mb-4">
                <button
                  onClick={() => handleViewToggle("table")}
                  className={`py-2 px-4 rounded-full ${
                    viewFormat === "table"
                      ? "bg-[#80d83d] text-gray-900 font-bold"
                      : "bg-gray-800 text-gray-300"
                  }`}
                >
                  Table View
                </button>
                <button
                  onClick={() => handleViewToggle("graph")}
                  className={`py-2 px-4 rounded-full ${
                    viewFormat === "graph"
                      ? "bg-[#80d83d] text-gray-900 font-bold"
                      : "bg-gray-800 text-gray-300"
                  }`}
                >
                  Graph View
                </button>
              </div>
              {viewFormat === "table" && !showAttendanceForm && (
                <AttendanceTable classId={selectedClassId} />
              )}
              {viewFormat === "graph" && !showAttendanceForm && (
                <AttendanceGraph classId={selectedClassId} />
              )}
              <div className="mt-4">
                <DownloadButton
                  data={formattedAttendance}
                  fileName="student_attendance.csv"
                  fileType="text/csv"
                />
              </div>
            </>
          )}
        </div>
      ) : (
        <div>
          <h3 className="text-xl font-bold mb-4">Select a Class</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {["Class1", "Class2", "Class3", "Class4"].map((className) => (
              <button
                key={className}
                onClick={() => handleClassSelection(className)}
                className="block p-6 rounded-lg shadow-lg text-center text-white bg-green-500 hover:bg-green-600 transition-colors"
              >
                <h3 className="text-xl font-bold">{className}</h3>
                <p className="mt-2">Click to view attendance</p>
              </button>
            ))}
          </div>
          {selectedClassId && (
            <ClassDetail
              classId={selectedClassId}
              students={students}
              onAddAttendance={setShowAttendanceForm}
            />
          )}
        </div>
      )}
    </div>
  );
}
