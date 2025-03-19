const Newsletter = require("../models/Newsletter");
const path = require("path");
const fs = require("fs");

// Helper function to delete a file
const deleteFile = (filePath) => {
    if (filePath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
};

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

// Update Newsletter
const editNewsletter = async (req, res) => {
    const { id } = req.params;
    try {
        const { name, description, eventDuration, prizeMoney, registrationLink, capacity, contactInfo, type } = req.body;

        const newsletter = await Newsletter.findById(id);
        if (!newsletter) {
            return res.status(404).json({ message: "Newsletter not found" });
        }

        const updatedFields = {
            name,
            description,
            eventDuration,
            prizeMoney: Number(prizeMoney),
            capacity: Number(capacity),
            registrationLink,
            contactInfo,
            type,
        };

        // Handle image replacement
        if (req.files["banner"]) {
            deleteFile(newsletter.banner); // Delete old banner
            updatedFields.banner = req.files["banner"][0].path;
        }
        if (req.files["poster"]) {
            deleteFile(newsletter.poster); // Delete old poster
            updatedFields.poster = req.files["poster"][0].path;
        }

        const updatedNewsletter = await Newsletter.findByIdAndUpdate(id, updatedFields, { new: true });

        res.json({ message: "Newsletter updated successfully", updatedNewsletter });
    } catch (error) {
        console.error("Error updating newsletter:", error);
        res.status(500).json({ message: "Server error", error });
    }
};


// Delete Newsletter
const deleteNewsletter = async (req, res) => {
    const { id } = req.params;

    try {
        const newsletter = await Newsletter.findById(id);

        if (!newsletter) {
            return res.status(404).json({ message: "Newsletter not found" });
        }

        // Delete images from the uploads folder
        deleteFile(newsletter.banner);
        deleteFile(newsletter.poster);

        await Newsletter.findByIdAndDelete(id);

        res.json({ message: "Newsletter deleted successfully" });
    } catch (error) {
        console.error("Error deleting newsletter:", error);
        res.status(500).json({ message: "Server error", error });
    }
};


module.exports = {
    createNewsletter,
    getAllNewsletters,
    getAllNewslettersById,
    editNewsletter,
    deleteNewsletter,
};
