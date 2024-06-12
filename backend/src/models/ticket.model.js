import mongoose, { Schema } from "mongoose";
import { TicketStatus } from "../constants.js";

const commentSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },
    postedBy: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const statusFlowSchema = new Schema({
  fromUser: {
    updatedAt: {
      type: Date,
      default: new Date(),
    },
    status: {
      type: String,
      default: TicketStatus.IN_REVIEW,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  fromMaster: {
    updatedAt: {
      type: Date,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      default: TicketStatus.PENDING_WITH,
    },
  },
  fromDepartment: {
    updatedAt: {
      type: Date,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
    },
  },
});

const ticketSchema = new Schema(
  {
    number: {
      type: Number,
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
      default: TicketStatus.IN_REVIEW,
      trim: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    attachFile: {
      type: Schema.Types.ObjectId,
      ref: "File",
    },
    department: {
      type: String,
      enum: ["hr", "is", "admin","finance"],
      required: true,
      trim: true,
    },
    category:{
      type: String,
      required:true,
    },
    comments: [commentSchema],
    statusFlow: statusFlowSchema,
  },
  {
    timestamps: true,
  }
);

export const Ticket = mongoose.model("Ticket", ticketSchema);
