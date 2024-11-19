import { useState, useEffect } from "react";
import { useUser } from "../../UserContext";
import AttendanceGraph from "./attendanceGraph";
import AttendanceTable from "./attendanceTable";
import DownloadButton from "./DownloadButton";
import ClassDetail from "./classDetail";

export default function ClassAttendance() {
  const { role, class: studentClass } = useUser(); // Context values
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewFormat, setViewFormat] = useState("table");
  const [students, setStudents] = useState([
    { date: "2024-11-01", status: "Present" },
    { date: "2024-11-02", status: "Absent" },
    { date: "2024-11-03", status: "Present" },
  ]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [showAttendanceForm, setShowAttendanceForm] = useState(false);

  useEffect(() => {
    if (!role) return; // Wait until role is defined
    if (role === "Student") {
      fetchStudentAttendance();
    } else if ((role === "Staff" || role === "Admin") && selectedClassId) {
      fetchClassAttendance(selectedClassId);
      fetchClassStudents(selectedClassId);
    }
  }, [role, selectedClassId]);
 

  const fetchClassAttendance = async (classId) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/attendance/class/${classId}`
      );
      if (!response.ok) throw new Error("Failed to fetch attendance data.");
      const data = await response.json();
      setAttendanceData(data.attendance || []);
    } catch (error) {
      console.error("Error fetching class attendance:", error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(()=>{
    fetchStudentAttendance("class1")
  },[])
  const fetchStudentAttendance = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/attendance/student/${studentClass}`
      );
      if (!response.ok) throw new Error("Failed to fetch student attendance.");
      const data = await response.json();
      // setAttendanceData(data.attendance || []);
      console.log(data);
      
    } catch (error) {
      console.error("Error fetching student attendance:", error.message);
    } finally {
      setLoading(false);
    }
  };

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

  const handleViewToggle = (format) => {
    setViewFormat(format);
  };

  const handleClassSelection = (classId) => {
    setSelectedClassId(classId);
  };

  return (
    <div className="bg-gray-900 text-white p-8 rounded-lg shadow-md w-full max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">
        {role === "Student" ? "Your Attendance" : "Class Attendance"}
      </h2>

      {role === "Student" && (
        <div>
          <h3 className="text-xl font-bold mb-4">Your Attendance</h3>
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
      )}

      {(role === "Staff" || role === "Admin") && (
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
