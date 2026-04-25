const express = require("express");
const router = express.Router();
const Registration = require("../models/Registration");

// GET ALL REGISTRATIONS
router.get("/", async (req, res) => {
    try {
        const data = await Registration.find().sort({ createdAt: -1 });
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// SEARCH FILTER (optional but useful)
router.get("/search", async (req, res) => {
    try {
        const { name } = req.query;

        const data = await Registration.find({
            full_name: { $regex: name, $options: "i" }
        });

        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;