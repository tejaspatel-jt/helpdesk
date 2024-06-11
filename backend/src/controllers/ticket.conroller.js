import { User } from "../models/user.model.js";
import { Ticket } from "../models/ticket.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse, ticketResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  deleteOldFileInCloudinary,
  uploadOnCloudinary,
  uploadOnCloudinaryWithBase64,
} from "../utils/cloudinary.js";
import fs from "fs";
import { TicketStatus, TicketStatuses, UserRole } from "../constants.js";

//Create new ticket
const createTicket = asyncHandler(async (req, res) => {
  const { description, title, department, attachment } = req.body;
  if (!(description || title || department)) {
    throw new ApiError(
      400,
      "Please provide title, description, department, category."
    );
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

  if (attachment && attachment.length > 0) {
    try {
      // Extracting file type from base64 data
      const matches = attachment.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        throw new Error("Invalid file format");
      }

      const fileType = matches[1].split("/")[1]; // Extracting file extension
      const base64Data = matches[2];
      const buffer = Buffer.from(base64Data, "base64");

      // Generating a unique file name
      var fileName = `attachment_${Date.now()}.${fileType}`;

      // Writing file to disk
      fs.writeFileSync(`./public/temp/${fileName}`, buffer, "base64");

      // Uploading to Cloudinary
      let fileUrl = await uploadOnCloudinaryWithBase64(fileName);
      attachmentUrl.push(fileUrl.secure_url);
    } catch (error) {
      for (const url of attachmentUrl) {
        await deleteOldFileInCloudinary(url);
      }
      throw new ApiError(500, "Failed to upload one or more files.");
    }
  }

  const existingTicketCount = await Ticket.countDocuments();
  const user = await User.findById(req.user._id);
  let ticket = await Ticket.create({
    number: existingTicketCount + 1,
    title,
    description,
    attachFile: attachmentUrl,
    department,
    user: user._id,
  });

  // Initialize statusFlow if it's undefined
  if (!ticket.statusFlow) {
    ticket.statusFlow = {};
  }

  ticket.statusFlow.fromUser = {
    updatedBy: req.user._id,
  };
  const master = await User.find({ role: UserRole.MASTER });
  ticket.statusFlow.fromMaster = {
    updatedBy: master[0]._id,
  };

  await ticket.save();

  ticket = await Ticket.findOne({ number: existingTicketCount + 1 })
    .populate("statusFlow.fromUser.updatedBy", "username fullname email role ")
    .populate(
      "statusFlow.fromMaster.updatedBy",
      "username fullname email role"
    );

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

//Update ticket status
const updateTicketStatus = asyncHandler(async (req, res) => {
  const { ticketId, ticketStatus, comment } = req.body;

  if (!(ticketId || ticketStatus)) {
    throw new ApiError(400, "Please provide ticket status and id.");
  }

  let ticket = await Ticket.findById(ticketId);
  if (!ticket) {
    throw new ApiError(404, "Ticket not found.");
  }

  if (
    !TicketStatuses.filter(
      (status) => status !== TicketStatus.IN_REVIEW
    ).includes(ticketStatus)
  ) {
    throw new ApiError(400, "Invalid ticket status.");
  }

  if (req.user.role === UserRole.MASTER) {
    if (TicketStatus.APPROVED === ticketStatus) {
      ticket.status = ticketStatus;
      ticket.statusFlow.fromMaster = {
        updatedBy: req.user._id,
        updatedAt: new Date(),
        status: ticketStatus,
      };
      const department = await User.find({ role: ticket.department });
      ticket.statusFlow.fromDepartment = {
        status: TicketStatus.PENDING_WITH,
        updatedBy: department[0]._id,
      };
    } else {
      ticket.status = ticketStatus;
      ticket.statusFlow.fromMaster = {
        updatedBy: req.user._id,
        updatedAt: new Date(),
        status: ticketStatus,
      };
    }
  }

  if (
    !(
      req.user.role === UserRole.MASTER ||
      ticket.statusFlow.fromMaster.status === TicketStatus.APPROVED
    )
  ) {
    throw new ApiError(400, "You are not authorized to change ticket status.");
  }

  if (req.user.role !== UserRole.MASTER) {
    if (TicketStatus.APPROVED === ticketStatus) {
      ticket.status = TicketStatus.OPEN;
      ticket.statusFlow.fromDepartment = {
        updatedBy: req.user._id,
        status: TicketStatus.OPEN,
        updatedAt: new Date(),
      };
    } else {
      ticket.status = ticketStatus;
      ticket.statusFlow.fromDepartment = {
        updatedBy: req.user._id,

        status: ticketStatus,
        updatedAt: new Date(),
      };
    }
  }

  if (comment) {
    ticket.comments.push({
      text: comment,
      postedBy: req.user.username,
    });
  }

  await ticket.save();
  ticket = await Ticket.findById(ticketId)
    .populate("statusFlow.fromUser.updatedBy", "username fullname email role ")
    .populate("statusFlow.fromMaster.updatedBy", "username fullname email role")
    .populate(
      "statusFlow.fromDepartment.updatedBy",
      "username fullname email role"
    );

  return res
    .status(200)
    .json(
      new ApiResponse(200, ticket, "Ticket status is updated successfully")
    );
});

//Get user ticket
const getTicket = async (req, res) => {
  const { status, page, perPage } = req.query;

  let filter = {};
  filter.user = req.user._id;

  if (status) {
    filter.status = status;
  }

  const currentPage = parseInt(page) || 1;
  const ticket = await Ticket.find(filter)
    .populate("statusFlow.fromUser.updatedBy", "username fullname email role ")
    .populate("statusFlow.fromMaster.updatedBy", "username fullname email role")
    .populate(
      "statusFlow.fromDepartment.updatedBy",
      "username fullname email role"
    )
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
    .json(new ticketResponse(200, ticket, "All tickets fetched successfully"));
};

//Get all ticket data
const getAllTickets = asyncHandler(async (req, res) => {
  const { status, username, department, page, perPage } = req.query;
  let filter = {};
  if (req.user.role !== UserRole.MASTER) {
    const userRole = req.user.role;
    filter.department = userRole;
    filter.status = {
      $in: [TicketStatus.APPROVED, TicketStatus.OPEN],
    };
  }

  if (department) {
    filter.department = department;
  }

  if (status) {
    filter.status =
      req.user.role !== UserRole.MASTER && status === TicketStatus.IN_REVIEW
        ? TicketStatus.APPROVED
        : status;
  }

  if (username) {
    let user = await User.findOne({ username });
    filter.user = user._id;
  }

  const currentPage = parseInt(page) || 1;
  const ticket = await Ticket.find(filter)
    .populate("statusFlow.fromUser.updatedBy", "username fullname email role ")
    .populate("statusFlow.fromMaster.updatedBy", "username fullname email role")
    .populate(
      "statusFlow.fromDepartment.updatedBy",
      "username fullname email role"
    )
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
    .json(new ticketResponse(200, ticket, "All tickets fetched successfully"));
});

export { createTicket, getTicket, getAllTickets, updateTicketStatus };
