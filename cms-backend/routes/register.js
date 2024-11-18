const express = require("express");
const router = express.Router();
const profile = require("../models/profile");
const newuser = require("../models/users")

router.use(express.json({ limit: '10mb' })); 

router.post("/", async (req, res) => {
    try {
        const { role, userName, password, name, email, phone, image, year, batch } = req.body;
        
        if (role === "Student" && (!year || !batch)) {
            return res.status(400).json({ error: "Join year and batch are required for Student profiles." });
        }
        const user = new newuser({
            role,
            username:userName,
            password,
        })


        const data = new profile({
            role,
            userName,
            name,
            email,
            phone,
            image, 
            year: role === "Student" ? year : undefined, 
            batch: role === "Student" ? batch : undefined,
        });

        await user.save();
        await data.save();

        res.status(201).json({ message: "The profile has been added successfully." });
    } catch (error) {
        console.log("Profile data saving error:", error);
        res.status(500).json({ error: "Data could not be saved." });
    }
});

module.exports = router;
