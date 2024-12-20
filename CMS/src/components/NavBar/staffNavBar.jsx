import { Link } from "react-router-dom";

export default function StaffNavBar() {
  return (
    <nav className="bg-green-500 text-white p-4 sticky">
      <div className="flex justify-between items-center">
        {/* Left Navigation Links */}
        <ul className="flex space-x-4">
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

        {/* Profile Link on the Top Right */}
        <div className="ml-auto">
          <Link to="/logout" className="hover:text-yellow-400">
            Logout
          </Link>
        </div>
      </div>
    </nav>
  );
}
