import { useUser } from "../../UserContext";
import StaffNavBar from "./staffNavBar";
import StudentNavBar from "./studentNavBar";
import AdminNavBar from "./adminNavBar";

export default function NavBar() {
  const { role } = useUser();

  return (
    <>
      {role === "Student" && <StudentNavBar />}
      {role === "Staff" && <StaffNavBar />}
      {role === "Admin" && <AdminNavBar />}
    </>
  );
}
