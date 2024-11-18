import NavBar from "../NavBar";
import {
  Routes,
  Route,
} from "react-router-dom";
import Announcements from "../Announcements";
import Timetable from "../TimeTable";
import ClassAnnouncements from "../ClassAnnouncements";
import AddAnnouncement from "../AddAnnouncement";
import Register from "../Register";
import ClassAttendance from "../ClassAttendance";

export default function DashBoard() {

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Announcements />} />
        <Route path="/timetable" element={<Timetable />} />
        <Route path="/class-announcements" element={<ClassAnnouncements />} />
        {/* <Route path="/class-skills" element={<ClassSkills />} /> */}
        <Route path="/class-attendance/*" element={<ClassAttendance />} />
        <Route path="/register-users" element={<Register />} />
        <Route path="/add-announcement" element={<AddAnnouncement />} />
      </Routes>
    </>
  );
}
