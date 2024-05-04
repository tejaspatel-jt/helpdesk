import { User } from "../models/user.model.js";
import { Ticket } from "../models/ticket.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse, ticketResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  deleteOldFileInCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";

//Create new ticket
const createTicket = asyncHandler(async (req, res) => {
  const { description, title, department } = req.body;
  if (!(description || title || department)) {
    throw new ApiError(400, "Please provide title & description both.");
  }

  if (title.length < 5 || title.length > 100) {
    throw new ApiError(400, "Title must be between 5 and 100 characters long");
  }

  if (description.length < 10 || description.length > 500) {
    throw new ApiError(
      400,
      "Description must be between 10 and 500 characters long"
    );
  }

  const attachmentPath = req.files?.attachment;
  let attachmentUrl = [];
  if (attachmentPath && attachmentPath.length > 0) {
    try {
      for (const file of attachmentPath) {
        const attachment = await uploadOnCloudinary(file.path);
        attachmentUrl.push(attachment?.secure_url);
      }
    } catch (error) {
      for (const url of attachmentUrl) {
        await deleteOldFileInCloudinary(url);
      }
      throw new ApiError(500, "Failed to upload one or more files.");
    }
  }
  const existingTicketCount = await Ticket.countDocuments();
  const user = await User.findById(req.user._id);
  const ticket = await Ticket.create({
    number: existingTicketCount + 1,
    title,
    description,
    attachFile: attachmentUrl,
    department,
    user: user._id,
  });
  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        ticket,
        "You have successfully created a new ticket."
      )
    );
});

//Get user ticket
const getTicket = async (req, res) => {
  const { status, page, perPage } = req.body;

  let filter = {};
  filter.user = req.user._id;

  if (status) {
    filter.status = status;
  }

  const currentPage = parseInt(page) || 1;
  const ticket = await Ticket.find(filter).populate({path:"user",select:"username avatar"})
    .sort({ createdAt: -1 })
    .skip((currentPage - 1) * perPage)
    .limit(perPage);

  if (ticket.length === 0) {
    return res
      .status(200)
      .json(
        new ApiResponse(200, null, "No tickets found matching the criteria.")
      );
  }
  if (currentPage == 1) {
    const totalTickets = await Ticket.countDocuments(filter);
    return res
      .status(200)
      .json(
        new ticketResponse(
          200,
          ticket,
          "Successfully fetched ticket",
          totalTickets
        )
      );
  }
  return res
    .status(200)
    .json(new ApiResponse(200, ticket, "All tickets fetched successfully"));
};

//Get all ticket data
const getAllTickets = asyncHandler(async (req, res) => {
  const { status, username, department, page, perPage } = req.body;

  let filter = {};
  if (req.user.role != "master") {
    filter.department = req.user.role;
    filter.status = {
      $in: ["accepted_master", "rejected_department", "accepted_department"],
    };
  }
  
  if (department) {
    filter.department = department;
  }

  if (status) {
    filter.status = status;
  }

  if (username) {
    let user = await User.findOne({username})
    filter.user = user._id;
  }

  const currentPage = parseInt(page) || 1;
  const ticket = await Ticket.find(filter).populate({path:"user",select:"username avatar"})
    .sort({ createdAt: -1 })
    .skip((currentPage - 1) * perPage)
    .limit(perPage);

  if (ticket.length === 0) {
    return res
      .status(200)
      .json(
        new ApiResponse(200, null, "No tickets found matching the criteria")
      );
  }

  if (currentPage == 1) {
    const totalTickets = await Ticket.countDocuments(filter);
    return res
      .status(200)
      .json(
        new ticketResponse(
          200,
          ticket,
          "Successfully fetched ticket",
          totalTickets
        )
      );
  }
  return res
    .status(200)
    .json(new ApiResponse(200, ticket, "All tickets fetched successfully"));
});

//Update ticket status
const updateTicketStatus = asyncHandler(async (req, res) => {
  const { ticketId, ticketStatus, comment } = req.body;
  if (
    ![
      "rejected_master",
      "accepted_master",
      "pending",
      "rejected_department",
      "accepted_department",
    ].includes(ticketStatus.toLowerCase())
  ) {
    throw new ApiError(400, "Ticket status is not valid.");
  }
  if (!(ticketId || ticketStatus)) {
    throw new ApiError(400, "Please provide ticket status and id.");
  }

  const ticket = await Ticket.findById(ticketId);
  if (!ticket) {
    throw new ApiError(404, "Ticket not found.");
  }

  ticket.status = ticketStatus;

  if (comment) {
    ticket.comments.push({
      text: comment,
      postedBy: req.user.username,
    });
  }
  await ticket.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, ticket, "Ticket status is updated successfully")
    );
});

export { createTicket, getTicket, getAllTickets, updateTicketStatus };