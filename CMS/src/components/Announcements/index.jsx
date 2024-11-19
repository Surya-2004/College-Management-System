import { useState, useEffect } from 'react';
import axios from 'axios';
import AnnouncementCard from './announcementCard';
import { useUser } from '../../UserContext'; // Import context to access username

const Announcements = () => {
  const { username } = useUser(); // Access the username from context
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch announcements when the component mounts or when username changes
    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/announcements", {
          params: { username }  // Send username as query parameter
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
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-6">Latest Announcements for {username}</h2>
      {announcements.length > 0 ? (
        announcements.map((announcement, index) => (
          <AnnouncementCard key={index} announcement={announcement} />
        ))
      ) : (
        <p>No announcements available.</p>
      )}
    </div>
  );
};

export default Announcements;
