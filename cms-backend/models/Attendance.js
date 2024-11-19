const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  classId: { type: String, required: true },
  attendance: [
    {
      studentId: { type: String, required: true },
      date: { type: String},
      status: { type: String, required: true, enum: ['Present', 'Absent'] },
    },
  ],
});

module.exports = mongoose.model('Attendance', attendanceSchema);
