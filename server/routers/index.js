const router = require("express").Router();
const userRouter = require("./UserRouter");
const classroomRouter = require("./ClassroomRouter");
// Use router
router.use("/users", userRouter);
router.use("/classrooms", classroomRouter);
module.exports = router;