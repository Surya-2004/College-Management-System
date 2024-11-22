import { Link } from "react-router-dom";

export default function StudentNavBar() {
  return (
    <nav className="bg-blue-500 text-white p-4 sticky">
      <div className="flex justify-between items-center">
        {/* Left Navigation Links */}
        <ul className="flex space-x-4">
          <li>
            <Link to="/dashboard/class-attendance" className="hover:text-yellow-400">
              Attendance
            </Link>
          </li>
        </ul>

        {/* Profile and Logout Links on the Top Right */}
        <div className="ml-auto">
          <Link to="/logout" className="hover:text-yellow-400">
            Logout
          </Link>
        </div>
      </div>
    </nav>
  );
}
