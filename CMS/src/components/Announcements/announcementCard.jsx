// AnnouncementCard.js
export default function AnnouncementCard({ announcement }) {
    return (
      <div className="announcement-card">
        <h3>{announcement.title}</h3>
        <p>{announcement.message}</p>
        <p><strong>{announcement.date}</strong></p>
      </div>
    );
  }
  