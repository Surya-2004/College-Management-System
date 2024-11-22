const express = require("express");
const router = express.Router();
const User = require("../models/users");
const Student = require("../models/Student");
const Attendance = require("../models/Attendance");
const Profile = require("../models/profile");


router.use(express.json({ limit: "10mb" }));

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
            class: selectedClass,
        } = req.body;

        // Validate required fields
        if (!role || !userName || !password || !name || !email || !phone) {
            return res.status(400).json({ error: "All fields are required!" });
        }

        if (role === "Student" && (!year || !batch || !selectedClass)) {
            return res
                .status(400)
                .json({
                    error: "Year, batch, and class are required for Student profiles.",
                });
        }

        // Save user details in the `users` collection
        const user = new User({
            role,
            username: userName,
            password,
        });

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

            // Add or update the attendance record for the class
            let attendanceRecord = await Attendance.findOne({ classId: selectedClass });

            if (!attendanceRecord) {
                // If no record exists, create a new one with an empty data array
                attendanceRecord = new Attendance({
                    classId: selectedClass,
                    data: [],
                });
            }

            // Check if there is an empty date entry (null or "N/A")
            let emptyDateEntry = attendanceRecord.data.find(
                (entry) => entry.date === null || entry.date === "N/A"
            );

            if (!emptyDateEntry) {
                // If no empty date entry exists, create one
                emptyDateEntry = {
                    date: "N/A", // Placeholder for the empty date
                    attendance: [],
                };
                attendanceRecord.data.push(emptyDateEntry);
            }

            // Add the new student to the empty date entry with status "Absent"
            emptyDateEntry.attendance.push({
                studentId: userName,
                status: "Absent",
            });

            // Save the updated attendance record
            await user.save();
            await studentData.save();
            await attendanceRecord.save();
        }

        // Save profile details in the `profile` collection
        const profileData = new Profile({
            role,
            userName,
            name,
            email,
            phone,
            year: role === "Student" ? year : null,
            batch: role === "Student" ? batch : null,
            image: image || null,
        });

        await profileData.save();

        res.status(201).json({ message: "The profile has been added successfully." });
    } catch (error) {
        console.error("Profile data saving error:", error);
        res.status(500).json({ error: "Data could not be saved." });
    }
});


module.exports = router;
