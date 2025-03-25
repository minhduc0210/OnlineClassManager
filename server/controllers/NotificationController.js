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

const markNotificationAsRead = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const userID = req.user.id;

        const notification = await Notification.findOneAndUpdate(
            { _id: notificationId, recipient: userID },
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ message: "Notification not found!" });
        }

        res.status(200).json({ message: "Notification marked as read", notification });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = {getNotifications, markNotificationAsRead}