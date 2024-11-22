import { useState, useRef } from "react";
import { Pie, Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, ArcElement, Title, Tooltip, Legend } from "chart.js";
import { toPng } from "html-to-image";
import DownloadButton from "./DownloadButton";
import { useUser } from "../../UserContext"; // Importing useUser context

// Register the necessary components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement, // Register LineElement for Line chart
  ArcElement, // Register ArcElement for Pie chart
  Title,
  Tooltip,
  Legend
);

export default function AttendanceGraph({ attendanceData }) {
  const { role } = useUser(); // Get the role from the user context
  const [graphType, setGraphType] = useState("Bar");
  const graphRef = useRef(null);

  // Ensure attendanceData is an array before proceeding
  const safeAttendanceData = Array.isArray(attendanceData) ? attendanceData : [];

  // Format data for the graph if role is "Student"
  const totalPresent = safeAttendanceData.filter(
    (student) => student.attendance === "Present"
  ).length;
  const totalAbsent = safeAttendanceData.filter(
    (student) => student.attendance === "Absent"
  ).length;

  const pieChartData = {
    labels: ["Present", "Absent"],
    datasets: [
      {
        data: [totalPresent, totalAbsent],
        backgroundColor: ["#80d83d", "#f44336"], // Green for Present, Red for Absent
        borderColor: ["#66b133", "#d32f2f"],
        borderWidth: 1,
      },
    ],
  };

  // Format data for Bar Chart (for Staff/Admin)
  const labels = safeAttendanceData.map((student) => student.name);
  const attendanceCounts = safeAttendanceData.map((student) =>
    student.attendance === "Present" ? 1 : 0
  );

  const chartData = {
    labels,
    datasets: [
      {
        label: "Attendance",
        data: attendanceCounts,
        backgroundColor: "#80d83d",
        borderColor: "#66b133",
        borderWidth: 1,
      },
    ],
  };

  // Format data for Line Chart (for Staff/Admin)
  // Collect dates and count students present on each date
  const datewiseAttendance = safeAttendanceData.reduce((acc, { date, attendance }) => {
    if (attendance === "Present") {
      acc[date] = (acc[date] || 0) + 1; // Increment count for the date
    }
    return acc;
  }, {});

  const lineChartData = {
    labels: Object.keys(datewiseAttendance), // Dates on the x-axis
    datasets: [
      {
        label: "Students Present",
        data: Object.values(datewiseAttendance), // No. of students present on each date
        fill: false,
        borderColor: "#80d83d", // Green color for line
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true, position: "top" },
    },
  };

  // Export graph as image
  const downloadGraphAsImage = async () => {
    if (graphRef.current) {
      const dataUrl = await toPng(graphRef.current);
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "attendance_graph.png";
      link.click();
    }
  };

  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Attendance Overview</h3>
        <div className="flex gap-2">
          <DownloadButton
            data={JSON.stringify(safeAttendanceData, null, 2)}
            fileName="attendance_data.json"
            fileType="application/json"
          />
          <button
            onClick={downloadGraphAsImage}
            className="bg-[#80d83d] hover:bg-green-700 text-gray-900 px-4 py-2 rounded-full font-semibold"
          >
            Download Graph as Image
          </button>
        </div>
      </div>

      <div className="mb-4 flex justify-center">
        <button
          onClick={() => setGraphType("Bar")}
          className={`px-4 py-2 mx-2 font-bold rounded-md ${
            graphType === "Bar"
              ? "bg-[#80d83d] text-gray-900"
              : "bg-gray-700 text-white hover:bg-[#80d83d] hover:text-gray-900"
          }`}
        >
          Bar Graph
        </button>
        <button
          onClick={() => setGraphType("Pie")}
          className={`px-4 py-2 mx-2 font-bold rounded-md ${
            graphType === "Pie"
              ? "bg-[#80d83d] text-gray-900"
              : "bg-gray-700 text-white hover:bg-[#80d83d] hover:text-gray-900"
          }`}
        >
          Pie Chart
        </button>
        {role === "Staff" || role === "Admin" && (
          <button
            onClick={() => setGraphType("Line")}
            className={`px-4 py-2 mx-2 font-bold rounded-md ${
              graphType === "Line"
                ? "bg-[#80d83d] text-gray-900"
                : "bg-gray-700 text-white hover:bg-[#80d83d] hover:text-gray-900"
            }`}
          >
            Line Chart
          </button>
        )}
      </div>

      <div ref={graphRef} className="w-full flex justify-center">
        {role === "Student" && graphType === "Pie" && (
          <Pie data={pieChartData} options={options} width={400} height={300} />
        )}
        {(role !== "Student" || graphType === "Bar") && (
          <Bar data={chartData} options={options} width={400} height={300} />
        )}
        {(role === "Staff" || role === "Admin") && graphType === "Line" && (
          <Line data={lineChartData} options={options} width={400} height={300} />
        )}
      </div>

      <div className="mt-6">
        <h4 className="text-lg font-semibold mb-2">Attendance Table</h4>
        <table className="w-full text-left bg-gray-700 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-[#80d83d] text-gray-900">
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Attendance</th>
            </tr>
          </thead>
          <tbody>
            {safeAttendanceData.length === 0 ? (
              <tr>
                <td colSpan="2" className="px-4 py-2 text-center">
                  No data available
                </td>
              </tr>
            ) : (
              safeAttendanceData.map((student, index) => (
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
    </div>
  );
}
