const router = require("express").Router();
const userRouter = require("./UserRouter");
const classroomRouter = require("./ClassroomRouter");
const postRouter = require("./PostRouter");
// Use router
router.use("/users", userRouter);
router.use("/classrooms", classroomRouter);
router.use("/posts", postRouter);
module.exports = router;