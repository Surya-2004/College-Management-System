const express = require('express');
const router = express.Router();
const multer = require('multer')
const { Class1, Class2, Class3, Class4 } = require("../models/announcement")

const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }
});

router.post('/', upload.array("files"), async (req, res) => {
    try {

        const classes = req.body.classes;

        const { title, description, date } = req.body;
        const files = req.files;

        let filesdata = [];
        if (files) {
            filesdata = files.map((file) => ({
                filename: file.originalname,
                filedata: file.buffer,
            }));
        }

        const classModels = {
            Class1,
            Class2,
            Class3,
            Class4,
        };

        await Promise.all(classes.map(async (className) => {
            const ClassModel = classModels[className];

            const data = new ClassModel({
                title,
                description,
                date,
                files: filesdata,
            });

            await data.save();
        }));


        res.status(201).json({ message: "Files uploaded and data saved successfully" });
    } catch (error) {
        console.error("Error saving data:", error);
        res.status(500).json({ error: "An error occurred while uploading and saving data" });
    }
});

module.exports = router;