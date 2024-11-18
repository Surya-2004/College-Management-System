const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema({
    title: String,
    description: String,
    date: String,
    files: [
        {
            filename: String,
            filedata: Buffer,
        },
    ],
});

const Class1 = mongoose.model("Class1",announcementSchema);
const Class2 = mongoose.model("Class2",announcementSchema);
const Class3 = mongoose.model("Class3",announcementSchema);
const Class4 = mongoose.model("Class4",announcementSchema);

module.exports = {Class1,Class2,Class3,Class4};
