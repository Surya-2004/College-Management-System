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
      // Sending the attendance records to the backend API
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
  
      // If the submission is successful
      console.log("Attendance Submitted:", attendanceRecords);
      alert("Attendance submitted successfully!"); // Optionally show a success message
  
      // Hide the form after submission
      setShowForm(false);
  
      // Trigger the parent callback to update the state
      onAddAttendance(false);
    } catch (error) {
      console.error("Error submitting attendance:", error);
      alert("Error submitting attendance. Please try again later.");
    }
  };
  

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Attendance for {classId}</h3>

      {showForm ? (
        <div>
          <h4 className="text-lg font-bold">Mark Attendance</h4>
          {students.map((student) => (
            <div key={student.username} className="flex items-center mb-4">
              <span className="mr-4">{student.name}</span>
              <input
                type="radio"
                name={`attendance-${student.username}`}
                value="present"
                onChange={() => handleAttendanceChange(student.username, "present")}
              />{" "}
              Present
              <input
                type="radio"
                name={`attendance-${student.username}`}
                value="absent"
                onChange={() => handleAttendanceChange(student.username, "absent")}
              />{" "}
              Absent
            </div>
          ))}
          <button
            onClick={handleSubmitAttendance}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg"
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
            className="bg-green-500 text-white py-2 px-4 rounded-lg"
          >
            Add Attendance
          </button>
          <div className="flex gap-4 mt-4 mb-4">
            <button
              onClick={() => handleViewToggle("table")}
              className={`py-2 px-4 rounded-full ${viewFormat === "table" ? "bg-[#80d83d] text-gray-900 font-bold" : "bg-gray-800 text-gray-300"}`}
            >
              Table View
            </button>
            <button
              onClick={() => handleViewToggle("graph")}
              className={`py-2 px-4 rounded-full ${viewFormat === "graph" ? "bg-[#80d83d] text-gray-900 font-bold" : "bg-gray-800 text-gray-300"}`}
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
