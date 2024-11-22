import { useState } from "react";
import AttendanceGraph from "./attendanceGraph";
import AttendanceTable from "./attendanceTable";

const ClassDetail = ({ classId, students, onAddAttendance }) => {
  const [viewFormat, setViewFormat] = useState("table");
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const handleViewToggle = (format) => {
    setViewFormat(format);
  };

  const handleAttendanceChange = (studentId, status) => {
    const updated = [...attendanceRecords];
    const index = updated.findIndex((record) => record.studentId === studentId);
    if (index !== -1) {
      updated[index].status = status;
    } else {
      updated.push({ studentId, status });
    }
    setAttendanceRecords(updated);
  };

  // Handle submitting attendance
  const handleSubmitAttendance = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/attendance/submit/${classId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ attendanceRecords }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit attendance.");
      }

      console.log("Attendance Submitted:", attendanceRecords);
      alert("Attendance submitted successfully!");

      setShowForm(false);
      onAddAttendance(false);
    } catch (error) {
      console.error("Error submitting attendance:", error);
      alert("Error submitting attendance. Please try again later.");
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold text-white mb-6">Attendance for {classId}</h3>

      {showForm ? (
        <div>
          <h4 className="text-lg font-semibold text-gray-200 mb-4">Mark Attendance</h4>
          <div className="space-y-4">
            {students.map((student) => (
              <div key={student.username} className="flex items-center space-x-4">
                <span className="text-white w-1/3">{student.name}</span>
                <label className="inline-flex items-center text-white">
                  <input
                    type="radio"
                    name={`attendance-${student.username}`}
                    value="present"
                    onChange={() => handleAttendanceChange(student.username, "present")}
                    className="form-radio text-green-500"
                  />
                  <span className="ml-2">Present</span>
                </label>
                <label className="inline-flex items-center text-white">
                  <input
                    type="radio"
                    name={`attendance-${student.username}`}
                    value="absent"
                    onChange={() => handleAttendanceChange(student.username, "absent")}
                    className="form-radio text-red-500"
                  />
                  <span className="ml-2">Absent</span>
                </label>
              </div>
            ))}
          </div>
          <button
            onClick={handleSubmitAttendance}
            className="bg-blue-600 text-white py-2 px-6 rounded-lg mt-4 hover:bg-blue-700 transition duration-300"
          >
            Submit Attendance
          </button>
        </div>
      ) : (
        <div>
          <button
            onClick={() => {
              setShowForm(true);
              onAddAttendance(true);
            }}
            className="bg-green-500 text-white py-2 px-6 rounded-lg mt-4 hover:bg-green-600 transition duration-300"
          >
            Add Attendance
          </button>
          <div className="flex gap-4 mt-6 mb-6">
            <button
              onClick={() => handleViewToggle("table")}
              className={`py-2 px-6 rounded-full ${viewFormat === "table" ? "bg-[#80d83d] text-gray-900 font-semibold" : "bg-gray-700 text-white hover:bg-[#80d83d]"} transition duration-300`}
            >
              Table View
            </button>
            <button
              onClick={() => handleViewToggle("graph")}
              className={`py-2 px-6 rounded-full ${viewFormat === "graph" ? "bg-[#80d83d] text-gray-900 font-semibold" : "bg-gray-700 text-white hover:bg-[#80d83d]"} transition duration-300`}
            >
              Graph View
            </button>
          </div>
          {viewFormat === "table" && <AttendanceTable data={attendanceRecords} />}
          {viewFormat === "graph" && <AttendanceGraph data={attendanceRecords} />}
        </div>
      )}
    </div>
  );
};

export default ClassDetail;
