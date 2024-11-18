import { useState } from "react";
import AttendanceGraph from "./attendanceGraph";
import DownloadButton from "./DownloadButton";

export default function StudentAttendance({ studentData }) {
  const [viewType, setViewType] = useState("graph"); // "graph" or "table"

  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">
        {studentData.name}&apos;s Attendance
      </h2>

      {/* View Toggle */}
      <div className="flex justify-center mb-6">
        <button
          onClick={() => setViewType("graph")}
          className={`px-4 py-2 mx-2 font-bold rounded-md ${
            viewType === "graph"
              ? "bg-[#80d83d] text-gray-900"
              : "bg-gray-700 text-white hover:bg-[#80d83d] hover:text-gray-900"
          }`}
        >
          Graph View
        </button>
        <button
          onClick={() => setViewType("table")}
          className={`px-4 py-2 mx-2 font-bold rounded-md ${
            viewType === "table"
              ? "bg-[#80d83d] text-gray-900"
              : "bg-gray-700 text-white hover:bg-[#80d83d] hover:text-gray-900"
          }`}
        >
          Table View
        </button>
      </div>

      {/* Attendance Data Views */}
      <div className="mb-6">
        {viewType === "graph" ? (
          <AttendanceGraph attendanceData={studentData.attendance} />
        ) : (
          <div>
            <h4 className="text-lg font-semibold mb-2">Attendance Table</h4>
            <table className="w-full text-left bg-gray-700 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-[#80d83d] text-gray-900">
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {studentData.attendance.map((entry, index) => (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"
                    }`}
                  >
                    <td className="px-4 py-2">{entry.date}</td>
                    <td className="px-4 py-2">
                      {entry.status ? "Present" : "Absent"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Download Buttons */}
      <div className="flex justify-center gap-4">
        <DownloadButton
          data={JSON.stringify(studentData.attendance, null, 2)}
          fileName={`${studentData.name}_attendance.json`}
          fileType="application/json"
        />
        <button
          onClick={() => {
            const csvHeader = "Date,Status\n";
            const csvRows = studentData.attendance
              .map(
                (entry) =>
                  `${entry.date},${entry.status ? "Present" : "Absent"}`
              )
              .join("\n");
            const csvData = new Blob([csvHeader + csvRows], {
              type: "text/csv",
            });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(csvData);
            link.download = `${studentData.name}_attendance.csv`;
            link.click();
          }}
          className="bg-[#80d83d] hover:bg-green-700 text-gray-900 px-4 py-2 rounded-full font-semibold"
        >
          Download CSV
        </button>
      </div>
    </div>
  );
}
