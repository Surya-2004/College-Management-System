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

router.post("/submit/:classId", async (req, res) => {
  const { classId } = req.params;
  const { attendanceRecords: attendance } = req.body;

  try {
    // Validate the input
    if (!attendance || !Array.isArray(attendance) || attendance.length === 0) {
      return res.status(400).json({ message: "Attendance data is required and must be an array." });
    }

    // Generate today's date in "YYYY-MM-DD" format
    const date = new Date().toISOString().split("T")[0];

    // Find or create attendance record for the class
    let classAttendance = await Attendance.findOne({ classId });

    if (!classAttendance) {
      // If the class attendance record does not exist, create a new one
      classAttendance = new Attendance({ classId, data: [] });
    }

    // Check if an entry already exists for the date
    let dateEntry = classAttendance.data.find((entry) => entry.date === date);

    if (!dateEntry) {
      // If no entry exists for the date, create one
      dateEntry = { date, attendance: [] };
      classAttendance.data.push(dateEntry);
    }

    // Add or update attendance for each student
    attendance.forEach((student) => {
      const { studentId, status } = student;

      // Ensure studentId and status are provided
      if (!studentId || !status) {
        throw new Error(`Invalid student attendance data: ${JSON.stringify(student)}`);
      }

      // Check if the student is already in the attendance for the date
      const existingStudent = dateEntry.attendance.find((att) => att.studentId === studentId);

      if (existingStudent) {
        // Update the status if the student already exists
        existingStudent.status = status;
      } else {
        // Add the student to the attendance
        dateEntry.attendance.push({ studentId, status });
      }
    });

    // Save the updated attendance record
    await classAttendance.save();

    res.status(200).json({ message: "Attendance submitted successfully." });
  } catch (error) {
    console.error("Error submitting attendance:", error);
    res.status(500).json({ message: "Error submitting attendance.", error: error.message });
  }
});



module.exports = router;
