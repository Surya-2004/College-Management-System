const express = require("express");
const router = express.Router();
const { Class1, Class2, Class3, Class4 } = require("../models/announcement");

router.get("/", async (req, res) => {
    try {
        console.log("in here");
        const class1Data = await Class1.find();
        const class2Data = await Class2.find();
        const class3Data = await Class3.find();
        const class4Data = await Class4.find();

        const data = [
            ...class1Data,
            ...class2Data,
            ...class3Data,
            ...class4Data,
        ];

        res.send(data);
        console.log("data sent");
    } catch (err) {
        console.error("Error fetching announcements:", err);
        res.status(500).json({ error: "An error occurred while fetching announcements." });
    }
});

module.exports = router;
