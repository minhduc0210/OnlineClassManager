const router = require("express").Router();
const notificationController = require("../controllers/NotificationController");
const { isAuth } = require("../middlewares/auth/auth");

router.get("/", isAuth, notificationController.getNotifications)
router.put("/:notificationId", isAuth, notificationController.markNotificationAsRead)

module.exports = router 