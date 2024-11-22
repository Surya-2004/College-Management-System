import { useState, useEffect, useRef } from "react";
import { Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement, // Import PointElement
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { toPng } from "html-to-image";
import DownloadButton from "./DownloadButton";
import { useUser } from "../../UserContext";
import axios from "axios"; // For API calls

// Register all required elements, scales, and plugins
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement, // Register PointElement
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function AttendanceGraph({ classId }) {
  const { role, username } = useUser(); // Get the role and username from the user context
  const [data, setData] = useState(null); // State to store attendance data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [graphType, setGraphType] = useState("Pie"); // Set default graph type to Pie
  const graphRef = useRef(null);

  // Fetch attendance data from the API
  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        setLoading(true);

        let endpoint = "";
        if (role === "Student") {
          endpoint = `http://localhost:5000/api/attendance/student/${username}`;
        } else if (role === "Staff" || role === "Admin") {
          endpoint = `http://localhost:5000/api/attendance/class/${classId}`;
        } else {
          throw new Error("Invalid role detected.");
        }

        const response = await axios.get(endpoint); // Use GET as specified in the provided URLs
        setData(response.data);
      } catch (err) {
        setError("Failed to fetch attendance data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, [classId, username, role]);

  // Ensure data is in the correct structure
  const safeAttendanceData = data?.data || [];

  // Format data for the pie chart
  let totalPresent = 0;
  let totalAbsent = 0;

  safeAttendanceData.forEach(({ attendance }) => {
    attendance.forEach(({ status }) => {
      if (status === "Present") totalPresent++;
      if (status === "Absent") totalAbsent++;
    });
  });

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

  // Format data for the line chart (for Staff/Admin roles)
  const datewiseAttendance = safeAttendanceData.reduce((acc, { date, attendance }) => {
    if (date !== "N/A") {
      const presentCount = attendance.filter(({ status }) => status === "Present").length;
      acc[date] = (acc[date] || 0) + presentCount; // Count present students for each date
    }
    return acc;
  }, {});

  const lineChartData = {
    labels: Object.keys(datewiseAttendance), // Dates on the x-axis
    datasets: [
      {
        label: "Students Present",
        data: Object.values(datewiseAttendance), // Number of students present on each date
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

  if (loading) {
    return <p className="text-center text-white">Loading attendance data...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

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
        {(role === "Student") && (
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
        )}
        {(role === "Staff" || role === "Admin") && (
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
        {graphType === "Pie" && (
          <Pie data={pieChartData} options={options} width={400} height={300} />
        )}
        {(role === "Staff" || role === "Admin") && graphType === "Line" && (
          <Line data={lineChartData} options={options} width={400} height={300} />
        )}
      </div>
    </div>
  );
}
