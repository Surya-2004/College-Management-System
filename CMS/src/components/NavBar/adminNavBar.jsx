import { Link } from "react-router-dom";

export default function AdminNavBar() {
  return (
    <nav className="bg-red-500 text-white p-4 sticky">
      <div className="flex justify-between items-center">
        {/* Left Navigation Links */}
        <ul className="flex space-x-4">
          <li>
            <Link to="/dashboard/class-attendance" className="hover:text-yellow-400">
              Class Attendance
            </Link>
          </li>
          <li>
            <Link to="/dashboard/register-users" className="hover:text-yellow-400">
              Register Users
            </Link>
          </li>
          <li>
            <Link to="/dashboard/add-announcement" className="hover:text-yellow-400">
              Add Announcement
            </Link>
          </li>
        </ul>

        {/* Profile Link on the Top Right */}
        <div className="ml-auto flex space-x-4">
          <Link to="/dashboard/profile" className="hover:text-yellow-400">
            Profile
          </Link>
          <Link to="/logout" className="hover:text-yellow-400">
            Logout
          </Link>
        </div>
      </div>
    </nav>
  );
}
