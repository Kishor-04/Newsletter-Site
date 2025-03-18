const mongoose = require("mongoose");

const NewsletterSchema = new mongoose.Schema({
    banner: String,
    poster: String,
    name: String,
    description: String,
    eventDuration: String,
    prizeMoney: Number,
    registrationLink: String,
    capacity: Number,
    contactInfo: String,
    type: String, 
});

module.exports = mongoose.model("Newsletter", NewsletterSchema);
