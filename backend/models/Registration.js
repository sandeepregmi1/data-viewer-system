// home/sandeep/Projects/data-viewer-system/backend/models/Registration.js
const mongoose = require("mongoose");

const teamMemberSchema = new mongoose.Schema({
    name: String,
    github: String
});

const registrationSchema = new mongoose.Schema(
    {
        full_name: String,
        email: String,
        phone_number: String,
        age: Number,
        institution: String,
        role: String,
        experience: String,
        track: String,
        team_name: String,
        team_size: Number,
        coc_accepted: Boolean,
        github_portfolio: String,
        linkedin: String,
        team_members: [teamMemberSchema]
    },
    { timestamps: true }
);

module.exports = mongoose.model("Registration", registrationSchema);