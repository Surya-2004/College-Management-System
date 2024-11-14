import { useUser } from "../../UserContext";

export default function NavBar() {
  const { role: role } = useUser();

  {
    role === "Student" && <StudentNavBar />;
  }
  {
    role === "Staff" && <StaffNavBar />;
  }
}
