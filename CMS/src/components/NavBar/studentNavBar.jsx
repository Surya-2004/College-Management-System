import { Link } from "react-router-dom";

export default function StudentNavBar() {
  return (
    <nav className="bg-blue-500 text-white p-4 sticky">
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
      </ul>
    </nav>
  );
}
