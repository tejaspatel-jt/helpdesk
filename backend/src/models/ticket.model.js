import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },
    postedBy: {
      type:String,
      required: true,
    },
  },
  { timestamps: true }
);

const ticketSchema = new Schema(
  {
    number:{
      type:Number,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["rejected_master", "accepted_master", "pending","rejected_department", "accepted_department"],
      default: "pending",
      trim: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    attachFile:{
      type:Array
    },
    department: {
      type: String,
      enum: ["hr", "is","admin"],
      required: true,
      trim: true,
    },
    comments: [commentSchema],
  },
  {
    timestamps: true,
  }
);

export const Ticket = mongoose.model("Ticket", ticketSchema);
