// backend/controllers/submitController.js

const Report = require("../models/Report");

exports.handleSubmit = (req, res) => {
    res.status(200).json({ message: "Submit endpoint is working." });
};

exports.handleReportSubmission = async (req, res) => {
    try {
        const { plotData, description, userId, userName, userEmail } = req.body;
        const parsedPlotData = JSON.parse(plotData);

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "Error: No photos were uploaded." });
        }

        const photoPaths = req.files.map((file) => file.path);

        const newReport = new Report({
            address: parsedPlotData.address,
            description: description,
            plot: parsedPlotData.plot,
            building: parsedPlotData.building,
            road: parsedPlotData.road,
            photos: photoPaths,
            location: {
                type: 'Point',
                coordinates: [parsedPlotData.location.lng, parsedPlotData.location.lat],
            },
            user: {
                id: userId,
                name: userName,
                email: userEmail,
            },
        });

        await newReport.save();
        res.status(201).json({ message: "Report submitted and saved successfully!" });
    } catch (error) {
        console.error("Error saving report:", error);
        res.status(500).json({ message: "Server error while saving the report." });
    }
};

exports.getAllReports = async (req, res) => {
    try {
        const reports = await Report.find({});
        res.status(200).json(reports);
    } catch (error) {
        console.error("Error fetching reports:", error);
        res.status(500).json({ message: "Server error while fetching reports." });
    }
};
