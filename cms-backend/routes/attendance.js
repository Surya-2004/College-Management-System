const express = require("express");
const router = express.Router();
const Attendance = require("../models/Attendance");

// Add attendance
router.post("/add", async (req, res) => {
  try {
    const { classId, date, attendanceData: attendance } = req.body;

    // Find the class attendance record
    let classAttendance = await Attendance.findOne({ classId });

    // If the class attendance record does not exist, create one
    if (!classAttendance) {
      classAttendance = new Attendance({ classId, data: [] });
    }

    // Check if attendance for the given date already exists
    let dateEntry = classAttendance.data.find((entry) => entry.date === date);

    if (!dateEntry) {
      // If no attendance for the date, add a new entry
      dateEntry = { date, attendance: [] };
      classAttendance.data.push(dateEntry);
    }

    // Add or update attendance for each student
    dateEntry.attendance.push(...attendance);

    await classAttendance.save();
    res.status(200).json({ message: "Attendance added successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding attendance", error: error.message });
  }
});

// Fetch attendance for a student
router.get("/student/:studentId", async (req, res) => {
  console.log(req.params.studentId);
  const { studentId } = req.params;
  try {
    // Find all attendance records for the student across dates
    const attendanceRecords = await Attendance.find(
      { "data.attendance.studentId": studentId },
      { "data.$": 1 } // Only return matching data entries
    );

    // Format the response to return attendance details per date
    const formattedRecords = attendanceRecords.map((record) => {
      const relevantData = record.data.filter((entry) =>
        entry.attendance.some((att) => att.studentId === studentId)
      );
      return {
        classId: record.classId,
        attendance: relevantData.map((entry) => ({
          date: entry.date,
          status: entry.attendance.find((att) => att.studentId === studentId).status,
        })),
      };
    });

    res.status(200).json({ attendance: formattedRecords });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching student attendance", error: error.message });
  }
});

// Fetch attendance for a class
router.get("/class/:classId", async (req, res) => {
  const { classId } = req.params;
  try {
    const classAttendance = await Attendance.findOne({ classId });

    if (!classAttendance) {
      return res.status(404).json({ message: "No attendance record found for this class." });
    }

    res.status(200).json({ classId, data: classAttendance.data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching class attendance", error: error.message });
  }
});

module.exports = router;
