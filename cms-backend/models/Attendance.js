const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  classId: { type: String, required: true },
  data: [
    {
      date: { type: String},
      attendance: [
        {
          studentId: { type: String, required: true },
          status: { type: String, required: true, enum: ['Present', 'Absent'] },
        },
      ],
    },
  ],
});

module.exports = mongoose.model('Attendance', attendanceSchema);
