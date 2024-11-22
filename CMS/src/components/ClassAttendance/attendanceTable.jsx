import React from "react";
import { useUser } from "../../UserContext"; // Import the useUser context

export default function AttendanceTable({ attendanceData }) {
  const { role } = useUser(); // Get the role from the user context

  // Extract unique dates from the data
  const uniqueDates = Array.from(
    new Set(attendanceData.flatMap((entry) => entry.data.map((d) => d.date)))
  ).sort(); // Sort dates for better readability

  // Extract student IDs if the role is not "Student"
  const students =
    role !== "Student"
      ? Array.from(
          new Set(
            attendanceData.flatMap((entry) =>
              entry.data.flatMap((d) => d.attendance.map((a) => a.studentId))
            )
          )
        )
      : ["Your Attendance"]; // Placeholder for a single row in student role

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
                const attendanceEntry = attendanceData
                  .flatMap((entry) => entry.data)
                  .find(
                    (d) =>
                      d.date === date &&
                      d.attendance.some(
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
