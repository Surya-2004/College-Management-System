const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');

// Add attendance
router.post('/add', async (req, res) => {
  try {
    const { classId, date, attendance } = req.body;

    // Find the class attendance record
    let classAttendance = await Attendance.findOne({ classId });

    // If the class attendance record does not exist, create one
    if (!classAttendance) {
      classAttendance = new Attendance({ classId, data: [] });
    }

    // Check if attendance for the given date already exists
    let dateEntry = classAttendance.data.find(entry => entry.date === date);

    if (!dateEntry) {
      // If no attendance for the date, add a new entry
      dateEntry = { date, attendance: [] };
      classAttendance.data.push(dateEntry);
    }

    // Add or update attendance for each student
    dateEntry.attendance.push(...attendance);

    await classAttendance.save();
    res.status(200).json({ message: 'Attendance added successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding attendance', error: error.message });
  }
});

// Fetch attendance for a student
router.get('/student/:studentId', async (req, res) => {
  const { studentId } = req.params;
  try {
    const attendanceRecords = await Attendance.find({ 'attendance.studentId': studentId }, {
      'attendance.$': 1,
    });
    res.status(200).json({ attendance: attendanceRecords });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attendance', error: error.message });
  }
});

// Fetch attendance for a class
router.get('/class/:classId', async (req, res) => {
  const { classId } = req.params;
  try {
    const attendance = await Attendance.findOne({ classId });
    res.status(200).json({ attendance: attendance ? attendance.attendance : [] });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching class attendance', error: error.message });
  }
});

module.exports = router;
