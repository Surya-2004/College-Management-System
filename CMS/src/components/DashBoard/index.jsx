import NavBar from "../NavBar";
import {
  Router,
  Routes,
  Route,
} from "react-router-dom";
import Announcements from "../Announcements";
import AddAnnouncement from "../AddAnnouncement";
import Register from "../Register";
import ClassAttendance from "../ClassAttendance";

export default function DashBoard() {

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Announcements />} />
        <Route path="/class-attendance" element={<ClassAttendance />} />
        <Route path="/register-users" element={<Register />} />
        <Route path="/add-announcement" element={<AddAnnouncement />} />
      </Routes>
    </>
  );
}
