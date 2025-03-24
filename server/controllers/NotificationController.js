const { Notification } = require("../models/Notification");

const getNotifications = async (req, res) => {
    try {
        const userID = req.user.id;
        const notifications = await Notification.find({ recipient: userID }).sort({ createdAt: -1 });

        res.status(200).json({ notifications });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = {getNotifications}