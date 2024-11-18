import DownloadButton from "./DownloadButton";

export default function AttendanceTable({ attendanceData }) {
  const generateCSV = () => {
    const csvHeader = "Name,Attendance\n";
    const csvRows = (attendanceData || [])
      .map((student) => `${student.name},${student.attendance}`)
      .join("\n");
    return csvHeader + csvRows;
  };

  // Ensure attendanceData is an array before rendering the table
  if (!Array.isArray(attendanceData)) {
    return <p className="text-gray-300">No attendance data available.</p>;
  }

  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Attendance Table</h3>
        <DownloadButton
          data={generateCSV()}
          fileName="attendance_table.csv"
          fileType="text/csv"
        />
      </div>
      <table className="w-full bg-gray-700 rounded-lg overflow-hidden text-left">
        <thead>
          <tr className="bg-[#80d83d] text-gray-900">
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Attendance</th>
          </tr>
        </thead>
        <tbody>
          {attendanceData.length === 0 ? (
            <tr>
              <td colSpan="2" className="px-4 py-2 text-center">
                No data available
              </td>
            </tr>
          ) : (
            attendanceData.map((student, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"
                }`}
              >
                <td className="px-4 py-2">{student.name}</td>
                <td className="px-4 py-2">{student.attendance}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
