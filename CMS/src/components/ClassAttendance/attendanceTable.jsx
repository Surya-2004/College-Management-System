import { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../../UserContext";

export default function AttendanceTable({ classId }) {
  const { role, username } = useUser();
  const [attendanceData, setAttendanceData] = useState([]);

  useEffect(() => {
    const fetchAttendance = async () => {
      if (!classId && role !== "Student") return;

      try {
        const endpoint =
          role === "Student"
            ? `http://localhost:5000/api/attendance/student/${username}`
            : `http://localhost:5000/api/attendance/class/${classId}`;

        const response = await axios.get(endpoint);
        console.log(response);
        const { data } = response.data;
        console.log(data);

        const formattedAttendance = data
          .filter((entry) => entry.date && entry.date !== "N/A") // Exclude "N/A" dates
          .map((entry) => ({
            date: entry.date,
            attendance: entry.attendance.map((student) => ({
              studentId: student.studentId,
              status: student.status,
            })),
          }));

        setAttendanceData(formattedAttendance);
      } catch (error) {
        console.error(
          "Error fetching attendance:",
          error.response?.data?.message || error.message
        );
      }
    };

    fetchAttendance();
  }, [classId, role, username]);

  const uniqueDates = Array.from(
    new Set(
      attendanceData.map((entry) => entry.date) // Extract unique dates
    )
  ).sort();

  const students =
    role !== "Student"
      ? Array.from(
          new Set(
            attendanceData.flatMap((entry) =>
              entry.attendance.map((student) => student.studentId)
            )
          )
        )
      : ["Your Attendance"];

  return (
    <div className="overflow-x-auto">
      <table className="table-auto border-collapse border border-gray-700 w-full text-left text-sm">
        <thead className="bg-gray-800 text-white">
          <tr>
            {role !== "Student" && (
              <th className="border border-gray-700 px-4 py-2">Student ID</th>
            )}
            {uniqueDates.map((date) => (
              <th key={date} className="border border-gray-700 px-4 py-2">
                {date}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {students.map((studentId) => (
            <tr key={studentId} className="hover:bg-gray-700">
              {role !== "Student" && (
                <td className="border border-gray-700 px-4 py-2">{studentId}</td>
              )}
              {uniqueDates.map((date) => {
                const attendanceEntry = attendanceData.find(
                  (entry) =>
                    entry.date === date &&
                    entry.attendance.some(
                      (a) =>
                        role === "Student" || a.studentId === studentId
                    )
                );

                const status =
                  attendanceEntry?.attendance.find(
                    (a) =>
                      role === "Student" || a.studentId === studentId
                  )?.status;

                return (
                  <td
                    key={date}
                    className={`border border-gray-700 px-4 py-2 text-center ${
                      status === "Present"
                        ? "bg-green-500 text-gray-900"
                        : status === "Absent"
                        ? "bg-red-500 text-white"
                        : "bg-gray-300"
                    }`}
                  >
                    {status || "-"}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
