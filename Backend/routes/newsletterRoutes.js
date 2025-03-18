const express = require("express");
const upload = require("../middleware/upload");
const { createNewsletter, getAllNewsletters ,getAllNewslettersById } = require("../controllers/newsletterController");

const router = express.Router();

// Create Newsletter
router.post(
    "/create",
    upload.fields([{ name: "banner" }, { name: "poster" }]),
    createNewsletter
);

// Fetch All Newsletters
router.get("/newsletters", getAllNewsletters);
router.get("/newsletters/:id", getAllNewslettersById);

module.exports = router;
