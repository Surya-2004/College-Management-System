import { useState, useEffect, useRef } from "react";
import { Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { toPng } from "html-to-image";
import DownloadButton from "./DownloadButton";
import { useUser } from "../../UserContext";
import axios from "axios";

// Register required Chart.js elements
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function AttendanceGraph({ classId }) {
  const { role, username } = useUser();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [graphType, setGraphType] = useState(role === "Student" ? "Pie" : "Line"); // Default to "Line" for Admin and Staff
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

        const response = await axios.get(endpoint);
        setData(response.data);
      } catch (err) {
        setError("Failed to fetch attendance data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, [classId, username, role]);

  const safeAttendanceData = data?.data || [];

  // Pie chart data
  let totalPresent = 0;
  let totalAbsent = 0;

  safeAttendanceData.forEach(({ attendance, date }) => {
    if (date && date !== "N/A") {
      attendance.forEach(({ status }) => {
        if (status === "Present") totalPresent++;
        if (status === "Absent") totalAbsent++;
      });
    }
  });

  const pieChartData = {
    labels: ["Present", "Absent"],
    datasets: [
      {
        data: [totalPresent, totalAbsent],
        backgroundColor: ["#80d83d", "#f44336"],
        borderColor: ["#66b133", "#d32f2f"],
        borderWidth: 1,
      },
    ],
  };

  // Line chart data
  const datewiseAttendance = safeAttendanceData.reduce((acc, { date, attendance }) => {
    if (date && date !== "N/A") {
      const presentCount = attendance.filter(({ status }) => status === "Present").length;
      acc[date] = (acc[date] || 0) + presentCount;
    }
    return acc;
  }, {});

  const lineChartData = {
    labels: Object.keys(datewiseAttendance),
    datasets: [
      {
        label: "Students Present",
        data: Object.values(datewiseAttendance),
        fill: false,
        borderColor: "#80d83d",
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true, position: "top" },
    },
    maintainAspectRatio: false,
  };

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

  if (Object.keys(datewiseAttendance).length === 0) {
    return <p className="text-center text-yellow-500">No valid attendance data to display.</p>;
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
        {role === "Student" && (
          <button
            onClick={() => setGraphType((prev) => (prev === "Pie" ? "Line" : "Pie"))}
            className="px-4 py-2 font-bold rounded-md bg-[#80d83d] text-gray-900 hover:bg-green-700"
          >
            {graphType === "Pie" ? "Switch to Line Chart" : "Switch to Pie Chart"}
          </button>
        )}
      </div>

      <div
        ref={graphRef}
        className="flex justify-center items-center mx-auto"
        style={{
          width: "500px",
          height: "500px",
          overflow: "hidden",
        }}
      >
        {graphType === "Pie" && <Pie data={pieChartData} options={options} />}
        {graphType === "Line" && <Line data={lineChartData} options={options} />}
      </div>
    </div>
  );
}
