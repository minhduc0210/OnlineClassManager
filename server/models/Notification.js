const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = new Schema(
  {
    recipient: {
      type: mongoose.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    classroom: {
      type: mongoose.Types.ObjectId,
      ref: "Classroom", 
      required: true,
    },
    slot: {
      type: mongoose.Types.ObjectId,
      ref: "Slot", 
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false, 
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = {Notification};
