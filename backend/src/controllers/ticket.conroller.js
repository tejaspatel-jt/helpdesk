import fs from "fs";
import { TicketStatus, TicketStatuses, UserRole } from "../constants.js";
import { File } from "../models/files.model.js";
import { Ticket } from "../models/ticket.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse, ticketResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { fileToBase64, saveBase64Data } from "../utils/fileHandler.js";

//Create new ticket
const createTicket = asyncHandler(async (req, res) => {
  const { description, title, department, attachment, category } = req.body;
  if (!(description || title || department || category)) {
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

  const attachmentLocalPath = req.files?.attachment?.[0]?.path;
  let file_id;
  if (attachmentLocalPath) {
    const attachFile = await fileToBase64(attachmentLocalPath);
    file_id = await saveBase64Data(attachFile);
    fs.unlinkSync(attachmentLocalPath);
  }
  if (attachment) {
    file_id = await saveBase64Data(attachment);
  }

  const existingTicketCount = await Ticket.countDocuments();
  const user = await User.findById(req.user._id);
  let ticket = await Ticket.create({
    number: existingTicketCount + 1,
    title,
    description,
    attachFile: file_id,
    department,
    category,
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
    .populate("statusFlow.fromUser.updatedBy", "username fullname email role")
    .populate(
      "statusFlow.fromMaster.updatedBy",
      "username fullname email role avatar"
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
    .populate(
      "statusFlow.fromUser.updatedBy",
      "username fullname email role avatar"
    )
    .populate(
      "statusFlow.fromMaster.updatedBy",
      "username fullname email role avatar"
    )
    .populate(
      "statusFlow.fromDepartment.updatedBy",
      "username fullname email role avatar"
    );

  return res
    .status(200)
    .json(
      new ApiResponse(200, ticket, "Ticket status is updated successfully")
    );
});

//Get user ticket
const getTicket = async (req, res) => {
  const { status, page, perPage, ticketId } = req.query;

  let filter = {};
  if (ticketId) {
    const ticket = await Ticket.findById(ticketId)
      .populate(
        "statusFlow.fromUser.updatedBy",
        "username fullname email role avatar"
      )
      .populate(
        "statusFlow.fromMaster.updatedBy",
        "username fullname email role avatar"
      )
      .populate(
        "statusFlow.fromDepartment.updatedBy",
        "username fullname email role avatar"
      );

    return res
      .status(200)
      .json(new ticketResponse(200, ticket, "Ticket fetched successfully"));
  } else {
    filter.user = req.user._id;
  }

  if (status) {
    filter.status = status;
  }

  const currentPage = parseInt(page) || 1;
  const ticket = await Ticket.find(filter)
    .populate("statusFlow.fromUser.updatedBy", "username fullname email role  ")
    .populate(
      "statusFlow.fromMaster.updatedBy",
      "username fullname email role avatar"
    )
    .populate(
      "statusFlow.fromDepartment.updatedBy",
      "username fullname email role avatar"
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
    filter.department = req.user.role;
    filter["statusFlow.fromMaster.status"] = TicketStatus.APPROVED;
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
    .populate(
      "statusFlow.fromMaster.updatedBy",
      "username fullname email role avatar"
    )
    .populate(
      "statusFlow.fromDepartment.updatedBy",
      "username fullname email role avatar"
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

const getTicketDetails = asyncHandler(async (req, res) => {
  const inReview = await Ticket.countDocuments({
    status: TicketStatus.IN_REVIEW,
  });
  const approved = await Ticket.countDocuments({
    status: TicketStatus.APPROVED,
  });
  const onHold = await Ticket.countDocuments({ status: TicketStatus.ON_HOLD });
  const open = await Ticket.countDocuments({ status: TicketStatus.OPEN });
  const rejected = await Ticket.countDocuments({
    status: TicketStatus.REJECTED,
  });
  const returned = await Ticket.countDocuments({
    status: TicketStatus.RETURNED,
  });

  //// master
  const MasterInReview = await Ticket.countDocuments({
    status: TicketStatus.IN_REVIEW,
  });
  const MasterApproved = await Ticket.countDocuments({
    status: TicketStatus.APPROVED,
  });

  const MasterRejected = await Ticket.countDocuments({
    ["statusFlow.fromMaster.status"]: TicketStatus.REJECTED,
  });
  const MasterReturned = await Ticket.countDocuments({
    ["statusFlow.fromMaster.status"]: TicketStatus.RETURNED,
  });
  const MasterOnHold = await Ticket.countDocuments({
    ["statusFlow.fromMaster.status"]: TicketStatus.ON_HOLD,
  });
  const master = {
    inReview: MasterInReview,
    approved: MasterApproved,
    rejected: MasterRejected,
    returned: MasterReturned,
    onHold: MasterOnHold,
  };

  ///// Admin
  const AdminApproved = await Ticket.countDocuments({
    status: TicketStatus.APPROVED,
    department: UserRole.ADMIN,
  });
  const AdminOpen = await Ticket.countDocuments({
    status: TicketStatus.OPEN,
    department: UserRole.ADMIN,
  });
  const AdminResolved = await Ticket.countDocuments({
    status: TicketStatus.RESOLVED,
    department: UserRole.ADMIN,
  });
  const AdminReturned = await Ticket.countDocuments({
    status: TicketStatus.RETURNED,
    department: UserRole.ADMIN,
  });

  const AdminOnHold = await Ticket.countDocuments({
    status: TicketStatus.ON_HOLD,
    department: UserRole.ADMIN,
  });
  const admin = {
    approved: AdminApproved,
    onHold: AdminOnHold,
    resolved: AdminResolved,
    returned: AdminReturned,
    open: AdminOpen,
  };

  const HRApproved = await Ticket.countDocuments({
    status: TicketStatus.APPROVED,
    department: UserRole.HR,
  });
  const HROpen = await Ticket.countDocuments({
    status: TicketStatus.OPEN,
    department: UserRole.HR,
  });
  const HRResolved = await Ticket.countDocuments({
    status: TicketStatus.RESOLVED,
    department: UserRole.HR,
  });
  const HRReturned = await Ticket.countDocuments({
    status: TicketStatus.RETURNED,
    department: UserRole.HR,
  });

  const HROnHold = await Ticket.countDocuments({
    status: TicketStatus.ON_HOLD,
    department: UserRole.HR,
  });
  const hr = {
    approved: HRApproved,
    onHold: HROnHold,
    resolved: HRResolved,
    returned: HRReturned,
    open: HROpen,
  };

  const ISApproved = await Ticket.countDocuments({
    status: TicketStatus.APPROVED,
    department: UserRole.IS,
  });
  const ISOpen = await Ticket.countDocuments({
    status: TicketStatus.OPEN,
    department: UserRole.IS,
  });
  const ISResolved = await Ticket.countDocuments({
    status: TicketStatus.RESOLVED,
    department: UserRole.IS,
  });
  const ISReturned = await Ticket.countDocuments({
    status: TicketStatus.RETURNED,
    department: UserRole.IS,
  });

  const ISOnHold = await Ticket.countDocuments({
    status: TicketStatus.ON_HOLD,
    department: UserRole.IS,
  });
  const is = {
    approved: ISApproved,
    onHold: ISOnHold,
    resolved: ISResolved,
    returned: ISReturned,
    open: ISOpen,
  };

  const FinanceApproved = await Ticket.countDocuments({
    status: TicketStatus.APPROVED,
    department: UserRole.FINANCE,
  });
  const FinanceOpen = await Ticket.countDocuments({
    status: TicketStatus.OPEN,
    department: UserRole.FINANCE,
  });
  const FinanceResolved = await Ticket.countDocuments({
    status: TicketStatus.RESOLVED,
    department: UserRole.FINANCE,
  });
  const FinanceReturned = await Ticket.countDocuments({
    status: TicketStatus.RETURNED,
    department: UserRole.FINANCE,
  });

  const FinanceOnHold = await Ticket.countDocuments({
    status: TicketStatus.ON_HOLD,
    department: UserRole.FINANCE,
  });
  const finance = {
    approved: FinanceApproved,
    onHold: FinanceOnHold,
    resolved: FinanceResolved,
    returned: FinanceReturned,
    open: FinanceOpen,
  };

  const ticketStat = {
    overAll: {
      inReview,
      approved,
      rejected,
      returned,
      onHold,
      open,
    },
    master,
    department: {
      admin,
      hr,
      is,
      finance,
    },
  };

  return res
    .status(200)
    .json(
      new ticketResponse(200, ticketStat, "Ticket data fetched successfully.")
    );
});

const getTicketFile = asyncHandler(async (req, res) => {
  const { fileId } = req.query;

  if (!fileId) {
    throw new ApiError(400, "Please provide id of file.");
  }

  const file = await File.findById(fileId);

  if (!file) {
    throw new ApiError(404, "File not found.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, file, "File fetched successfully."));
});

export {
  createTicket,
  getAllTickets,
  getTicket,
  getTicketDetails,
  getTicketFile,
  updateTicketStatus,
};
