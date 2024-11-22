import { useState } from "react";
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

  // Fetch attendance based on role
  const fetchAttendance = async () => {
  try {
    setLoading(true);

    const endpoint = role === "Student"
      ? `http://localhost:5000/api/attendance/student/${username}`
      : `http://localhost:5000/api/attendance/class/${selectedClassId}`;

    const response = await axios.get(endpoint);
    const { data } = response.data; // Backend sends data in the 'data' field

    // Parse and format attendance data for consistent frontend use
    const formattedAttendance = data
    .filter((entry) => entry.date)
    .map((entry) => ({
      date: entry.date,
      attendance: entry.attendance.map((student) => ({
        studentId: student.studentId,
        status: student.status,
      })),
    }));
  

    setAttendanceData(formattedAttendance || []);
  } catch (error) {
    console.error("Error fetching attendance:", error.response?.data?.message || error.message);
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

  return (
    <div className="bg-gray-900 text-white p-8 rounded-lg shadow-md w-full max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">
        {role === "Student" ? "Your Attendance" : "Class Attendance"}
      </h2>

      {role === "Student" ? (
        <div>
          <h3 className="text-xl font-bold mb-4">Your Attendance</h3>
          <button
            onClick={fetchAttendance}
            className="py-2 px-4 mb-4 bg-green-500 text-gray-900 font-bold rounded-full hover:bg-green-600"
          >
            Load Attendance
          </button>
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
                <AttendanceTable data={attendanceData} />
              )}
              {viewFormat === "graph" && !showAttendanceForm && (
                <AttendanceGraph data={attendanceData} />
              )}
              <div className="mt-4">
                <DownloadButton
                  data={attendanceData}
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
            {["class1", "class2", "class3", "class4"].map((className) => (
              <button
                key={className}
                onClick={() => handleClassSelection(className)}
                className="block p-6 rounded-lg shadow-lg text-center text-white bg-green-500 hover:bg-green-600 transition-colors"
              >
                <h3 className="text-xl font-bold">
                  {className.replace("class", "Class")}
                </h3>
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
