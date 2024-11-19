const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// Add a student
router.post('/add', async (req, res) => {
  const { studentId, name, email, classId } = req.body;
  try {
    const newStudent = new Student({ studentId, name, email, classId });
    await newStudent.save();
    res.status(200).json({ message: 'Student added successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding student', error: error.message });
  }
});

// Fetch students for a class
router.get('/class/:classId', async (req, res) => {
  const { classId } = req.params;
  try {
    const students = await Student.find({ classId });
    res.status(200).json({ students });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching students', error: error.message });
  }
});

module.exports = router;
