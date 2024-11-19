const express = require("express");
const router = express.Router();
const User = require("../models/users");
const Student = require("../models/Student");
const Attendance = require("../models/Attendance");

router.use(express.json({ limit: '10mb' }));

router.post("/", async (req, res) => {
  try {
    const { 
      role, 
      userName, 
      password, 
      name, 
      email, 
      phone, 
      image, 
      year, 
      batch, 
      class: selectedClass 
    } = req.body;

    // Validate required fields
    if (!role || !userName || !password || !name || !email || !phone) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    if (role === "Student" && (!year || !batch || !selectedClass)) {
      return res.status(400).json({ error: "Year, batch, and class are required for Student profiles." });
    }

    // Save user details in the `users` collection
    const user = new User({
      role,
      username: userName,
      password,
    });
    await user.save();

    if (role === "Student") {
      // Save student details in the `students` collection
      const studentData = new Student({
        studentId: userName,
        name,
        email,
        classId: selectedClass,
        batch, // Storing batch info
        year, // Storing year info
        image: image || null, // Save image URL or path if available, else null
      });
      await studentData.save();

      // Add or update the attendance record for the class
      let attendanceRecord = await Attendance.findOne({ classId: selectedClass });

      if (!attendanceRecord) {
        // If attendance record for the class doesn't exist, create a new one
        attendanceRecord = new Attendance({
          classId: selectedClass,
          attendance: [],
        });
      }

      // Add the student to the attendance record with an empty attendance history
      attendanceRecord.attendance.push({
        studentId: userName,
        date: "", // No attendance date at registration
        status: "Absent", // Default to "Absent" until marked
      });

      await attendanceRecord.save();
    }

    res.status(201).json({ message: "The profile has been added successfully." });
  } catch (error) {
    console.error("Profile data saving error:", error);
    res.status(500).json({ error: "Data could not be saved." });
  }
});

module.exports = router;
