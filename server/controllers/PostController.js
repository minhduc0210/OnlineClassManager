const asyncHandler = require("express-async-handler");
const CustomError = require("../helpers/errors/CustomError");
const Classroom = require("../models/Classroom");
const Post = require("../models/Post");
const path = require("path");
const fs = require("fs");

const createPost = asyncHandler(async (req, res, next) => {
  try {
    const { classroomID } = req.params;
    const { title, content } = req.body;
    const classroom = req.classroom;
    const newPost = await Post({ title, content });
    newPost.author = req.user.id;
    req.file ? (newPost.file = req.file.filename) : null;
    await newPost.save();
    await classroom.posts.push(newPost._id);
    await classroom.save();
    return res.status(200).json({ success: true, data: newPost });
  } catch (error) {
    return res.status(500).json({ message: error })
  }
});

const deletePost = asyncHandler(async (req, res, next) => {
  try {
    const classroom = req.classroom;
    const post = req.post;
    if (req.user.id !== post.author.toString()) {
      return res.status(401).json({ message: "You are not authorized!" });
    }
    if (!classroom || !post) {
      return res.status(404).json({ message: "Classroom or post not found" });
    }
    const postIndex = classroom.posts.findIndex(postId => postId.toString() === post._id.toString());
    if (postIndex === -1) {
      return res.status(404).json({ message: "Post not found in classroom posts" });
    }
    classroom.posts.splice(postIndex, 1);
    await classroom.save();
    await Post.findByIdAndDelete(post._id);

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});


const updatePost = asyncHandler(async (req, res, next) => {
  try {
    const { title, content } = req.body;
  const post = req.post;
  title ? (post.title = title) : null;
  content ? (post.content = content) : null;
  req.file ? (post.file = req.file.filename) : null;
  if (!post) {
    return next(new CustomError("Post not found", 400));
  }
  if (req.user.id !== post.author.toString()) {
    return next(new CustomError("You are not authorized", 400));
  }
  post.save();
  return res.status(200).json({ success: true, data: post });
  } catch (error) {
    return res.status(500).json({ message: error })
  }
  
});

const getPostsByClassroom = asyncHandler(async (req, res, next) => {
  try {
    const posts = await Classroom.findById(req.classroom._id)
    .select("posts")
    .populate({
      path: "posts",
      select: "-__v",
      populate: { path: "author", select: "name lastname" },
    });
  return res.status(200).json({ posts });
  } catch (error) {
    return res.status(500).json({ message: error })
  }
});

const sendPostFile = asyncHandler(async (req, res, next) => {
  try {
    const appPath = path.resolve();
  const { filename } = req.params;
  const classroomID = filename.split("-")[0];
  const filePath = path.join(appPath, "../public/uploads", classroomID, filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "File not found" });
  }
  return res.status(200).sendFile(filePath);
  } catch (error) {
    return res.status(500).json({ message: error })
  }
});



module.exports = {
  createPost,
  deletePost,
  updatePost,
  getPostsByClassroom,
  sendPostFile,
};