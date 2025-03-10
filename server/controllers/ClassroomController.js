const asyncHandler = require("express-async-handler");
const CustomError = require("../helpers/errors/CustomError");
const Classroom = require("../models/Classroom");
const User = require("../models/User");
const Post = require("../models/Post");
const Homework = require("../models/Homework");

const createClassroom = asyncHandler(async (req, res, next) => {
    try {
        const classroom = new Classroom({ ...req.body, teacher: req.user.id });
        const savedClassroom = await classroom.save();
        return res.status(200).json({
            success: true,
            classroom: savedClassroom,
        });
    } catch (error) {
        return res.status(500).json({
            errors: error
        });
    }
});


const joinClassroom = asyncHandler(async (req, res, next) => {
    try {
        const accessCode = req.params.code;
        const classroom = await Classroom.findOne({ accessCode });

        if (!classroom) {
            return res.status(400).json({
                errors: [{ path: "classroomCode", msg: "Classroom not found. Please check the access code." }]
            });
        }
        if (classroom.students.includes(req.user.id)) {
            return res.status(400).json({
                errors: [{ path: "classroomCode", msg: "You have already joined this classroom." }]
            });
        }
        classroom.students.push(req.user.id);
        await classroom.save();

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error("Error joining classroom:", error);
        return res.status(500).json({
            errors: [{ path: "classroomCode", msg: "Something went wrong. Please try again later." }]
        });
    }
});


const getClassroomInfo = asyncHandler(async (req, res) => {
    try {
        const { classroomID } = req.params;

        const classroom = await Classroom.findById(classroomID)
            .populate({
                path: "teacher",
                select: "name lastname",
            })
            .populate({
                path: "students",
                select: "name lastname",
            })
            .populate("homeworks")
            .populate({
                path: "slots",
                populate: {
                    path: "posts",
                    populate: {
                        path: "author",
                        select: "name lastname",
                    },
                },
            });

        if (!classroom) {
            return res.status(404).json({ message: "Classroom not found" });
        }
        console.log(classroom)
        return res.status(200).json({ data: classroom });
        
    } catch (error) {
        console.error("Error fetching classroom info:", error);
        return res.status(500).json({ message: "Something went wrong while fetching classroom info" });
    }
});



const removeStudent = asyncHandler(async (req, res, next) => {
    const { classroomID, studentID } = req.params;
    const classroom = await Classroom.findById(classroomID);
    if (!classroom) return next(new CustomError("Classroom not found", 400));
    if (classroom.teacher.toString() !== req.user.id) {
        return next(new CustomError("You are not authorized", 400));
    }

    classroom.students.splice(classroom.students.indexOf(studentID), 1);
    classroom.save();
    return res.status(200).json({ success: true });
});

const changeInformation = asyncHandler(async (req, res, next) => {
    const { classroomID } = req.params;
    const { title, subtitle } = req.body;
    const classroom = await Classroom.findByIdAndUpdate(
        classroomID,
        {
            title,
            subtitle,
        },
        { new: true }
    );
    if (!classroom) return next(new CustomError("Classroom not found", 400));
    if (classroom.teacher.toString() !== req.user.id) {
        return next(new CustomError("You are not authorized", 400));
    }
    return res.status(200).json({ classroom });
});

const deleteClassroom = asyncHandler(async (req, res, next) => {
    const { classroomID } = req.params;
    const classroom = await Classroom.findById(classroomID);
    if (!classroom) return next(new CustomError("Classroom not found", 400));
    if (classroom.teacher.toString() !== req.user.id.toString()) {
        return next(new CustomError("You are not authorized", 400));
    }

    for (let i = 0; i < classroom.posts.length; i++) {
        await Post.findByIdAndDelete(classroom.posts[i]);
    }

    classroom.remove();
    return res.status(200).json({ success: true });
});

module.exports = {
    createClassroom,
    joinClassroom,
    getClassroomInfo,
    removeStudent,
    changeInformation,
    deleteClassroom,
};