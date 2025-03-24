const router = require("express").Router();
const userRouter = require("./UserRouter");
const classroomRouter = require("./ClassroomRouter");
const postRouter = require("./PostRouter");
const slotRouter = require("./SlotRouter");
const notificationRouter = require("./NotificationRouter");
// Use router
router.use("/users", userRouter);
router.use("/classrooms", classroomRouter);
router.use("/posts", postRouter);
router.use("/slots", slotRouter);
router.use("/notifications", notificationRouter);

module.exports = router;