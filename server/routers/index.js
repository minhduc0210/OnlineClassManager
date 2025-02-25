const router = require("express").Router();
const userRouter = require("./UserRouter");

// Use router
router.use("/users", userRouter);

module.exports = router;