const express = require("express");
const upload = require("../middleware/upload");
const {
    createNewsletter,
    getAllNewsletters,
    getAllNewslettersById,
    editNewsletter,
    deleteNewsletter
} = require("../controllers/newsletterController");

const router = express.Router();

// Create Newsletter
router.post("/create",upload.fields([{ name: "banner" }, { name: "poster" }]),createNewsletter);

// Fetch All Newsletters
router.get("/newsletters", getAllNewsletters);
router.get("/newsletters/:id", getAllNewslettersById);

// Update Newsletter
router.put("/edit/:id", upload.fields([{ name: "banner" }, { name: "poster" }]), editNewsletter);

// Delete Newsletter
router.delete("/delete/:id", deleteNewsletter);

module.exports = router;
