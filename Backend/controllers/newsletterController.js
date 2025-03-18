const Newsletter = require("../models/Newsletter");

// Create Newsletter
const createNewsletter = async (req, res) => {
    try {
        const { name, description, eventDuration, prizeMoney, registrationLink, capacity, contactInfo, type } =
            req.body;

        const banner = req.files["banner"] ? req.files["banner"][0].path : "";
        const poster = req.files["poster"] ? req.files["poster"][0].path : "";

        const newsletter = new Newsletter({
            banner,
            poster,
            name,
            description,
            eventDuration,
            prizeMoney: Number(prizeMoney), // Convert string to number
            capacity: Number(capacity),     // Convert string to number
            registrationLink,
            contactInfo,
            type,
        });

        await newsletter.save();
        res.status(201).json({ message: "Newsletter created successfully", newsletter });
    } catch (error) {
        console.error("Error creating newsletter:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

// Fetch Newsletters
const getAllNewsletters = async (req, res) => {
    try {
        const newsletters = await Newsletter.find();
        res.json(newsletters);
    } catch (error) {
        console.error("Error fetching newsletters:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

const getAllNewslettersById = async (req, res) => {
    const { id } = req.params;

    try {
        const newsletter = await Newsletter.findById(id);
        if (!newsletter) {
            console.log("Newsletter not found for ID:", id);
            return res.status(404).json({ message: "Newsletter not found" });
        }
        res.json(newsletter);
    } catch (error) {
        console.error("Error fetching newsletter:", error);
        res.status(500).json({ message: "Server error" });
    }
};


module.exports = { createNewsletter, getAllNewsletters ,getAllNewslettersById };
