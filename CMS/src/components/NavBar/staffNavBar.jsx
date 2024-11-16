import { Link } from "react-router-dom";

export default function StaffNavBar() {
  return (
    <nav className="bg-green-500 text-white p-4 sticky">
      <ul className="flex space-x-4">
        <li>
          <Link to="/dashboard/timetable" className="hover:text-yellow-400">
            Timetable
          </Link>
        </li>
        <li>
          <Link to="/dashboard/class-announcements" className="hover:text-yellow-400">
            Class Announcements
          </Link>
        </li>
        <li>
          <Link to="/dashboard/class-skills" className="hover:text-yellow-400">
            Class Skills
          </Link>
        </li>
        <li>
          <Link to="/dashboard/class-attendance" className="hover:text-yellow-400">
            Class Attendance
          </Link>
        </li>
        <li>
          <Link to="/dashboard/add-announcement" className="hover:text-yellow-400">
            Add Announcement
          </Link>
        </li>
      </ul>
    </nav>
  );
}
