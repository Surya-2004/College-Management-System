const mongoose = require("mongoose");
const validator = require('validator');


const profileSchema = new mongoose.Schema({
    role: { type: String, required: true },
    userName: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: {
        type: String,
        validate: {
            validator: function (v) {
                return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v); // Basic email regex
            },
            message: props => `${props.value} is not a valid email address!`,
        },
    },    

    phone: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^\d{10}$/.test(v); // Regular expression for exactly 10 digits
            },
            message: props => `${props.value} is not a valid 10-digit phone number!`,
        },
    },
    year: {
        type: Number,
        validate: {
            validator: function (v) {
                return /^\d{4}$/.test(v);
            },
            message: props => "The join year is not correct"
        },
    },
    batch: {
        type: Number,
        validate: {
            validator: function (v) {
                return /^\d{4}$/.test(v);
            },
            message: props => `${props.value} is not a valid batch year!`,
        },
    },
    image: {
        type: String,
    }
})

module.exports = mongoose.model("profile", profileSchema);