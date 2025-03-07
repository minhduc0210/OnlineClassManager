const router = require("express").Router();
const { isAuth } = require("../middlewares/auth/auth");
const postController = require("../controllers/PostController");
const uploadFile = require("../middlewares/assets/UploadFile");
const { classroomCheck, postCheck } = require("../middlewares/checkExist/CheckExist");

router.get(
    "/:classroomID",
    isAuth,
    classroomCheck,
    postController.getPostsByClassroom
);

router.post(
    "/:classroomID",
    isAuth,
    uploadFile.single("post_file"),
    classroomCheck,
    postController.createPost
);

router.delete(
    "/:classroomID/:postID",
    isAuth,
    classroomCheck,
    postCheck,
    postController.deletePost
);

router.patch(
    "/:postID",
    isAuth,
    uploadFile.single("post_file"),
    postCheck,
    postController.updatePost
);

router.get("/download/:filename",
    postController.sendPostFile
);

module.exports = router;