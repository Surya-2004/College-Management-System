import { useEffect, useState } from "react";
import { useUser } from "../../UserContext";
import axios from "axios";
import AnnouncementCard from "../Announcements/announcementCard";

export default function ClassAnnouncements() {
  const { username: username } = useUser(); // Get the username from context
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClassAnnouncements = async () => {
      try {
        const response = await axios.get("/api/class-announcements", {
          params: { username },  // Send the username to fetch class-specific announcements
        });
        if (Array.isArray(response.data)) {
          setAnnouncements(response.data);
        } else {
          setError("Announcements data is not in the expected format.");
        }
      } catch (error) {
        setError("Failed to load class announcements.");
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchClassAnnouncements();
    }
  }, [username]);

  if (loading) {
    return <div>Loading class announcements...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Class Announcements</h2>
      {announcements.length > 0 ? (
        <div>
          {announcements.map((announcement, index) => (
            <AnnouncementCard key={index} announcement={announcement} />
          ))}
        </div>
      ) : (
        <p>No class announcements available.</p>
      )}
    </div>
  );
}
