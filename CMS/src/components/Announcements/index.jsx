import { useEffect, useState } from "react";
import { useUser } from "../../UserContext";
import axios from "axios";

export default function Announcements() {
  const { username } = useUser(); // Get the username from context
  const [announcements, setAnnouncements] = useState([]); // Initialize as an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get("/api/announcements", {
          params: { username }  // Send the username as a query parameter
        });

        // Ensure the response data is an array before calling map
        if (Array.isArray(response.data)) {
          setAnnouncements(response.data);
        } else {
          throw new Error("Announcements data is not an array");
        }
      } catch (error) {
        setError("Failed to load announcements.");
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchAnnouncements();
    }
  }, [username]);

  if (loading) {
    return <div>Loading announcements...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Announcements for {username}</h2>
      {announcements.length > 0 ? (
        <div>
          {announcements.map((announcement, index) => (
            <div key={index} className="announcement-card">
              <h3>{announcement.title}</h3>
              <p>{announcement.content}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No announcements available.</p>
      )}
    </div>
  );
}
