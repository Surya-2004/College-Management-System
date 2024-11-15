import { useEffect, useState } from "react";
import { useUser } from "../../UserContext";
import axios from "axios";

export default function Timetable() {
  const { username } = useUser(); // Get the username from context
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const response = await axios.get("/api/timetable", {
          params: { username }
        });

        // Log the response to inspect the structure
        console.log(response.data);

        // Ensure that the response is an array
        if (Array.isArray(response.data)) {
          setTimetable(response.data);
        } else {
          setError("Timetable data is not in the expected format.");
        }
      } catch (error) {
        setError("Failed to load timetable.");
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchTimetable();
    }
  }, [username]);

  if (loading) {
    return <div>Loading timetable...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>{username} &apos;s Timetable</h2>
      {timetable.length > 0 ? (
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="border-b p-2">Day</th>
              <th className="border-b p-2">Time</th>
              <th className="border-b p-2">Subject</th>
            </tr>
          </thead>
          <tbody>
            {timetable.map((day, index) => (
              <React.Fragment key={index}>
                <tr>
                  <td rowSpan={day.subjects.length} className="border-b p-2">
                    {day.day}
                  </td>
                  <td className="border-b p-2">{day.subjects[0].time}</td>
                  <td className="border-b p-2">{day.subjects[0].subject}</td>
                </tr>
                {day.subjects.slice(1).map((subject, subjectIndex) => (
                  <tr key={subjectIndex}>
                    <td className="border-b p-2">{subject.time}</td>
                    <td className="border-b p-2">{subject.subject}</td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No timetable available.</p>
      )}
    </div>
  );
}
