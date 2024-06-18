export const TicketStatus = {
  IN_REVIEW: "in_review",
  APPROVED_MASTER: "approved",
  PENDING_MASTER: "pending_master",
  REJECTED_MASTER: "rejected",
  APPROVED: "approved",
  OPEN: "open",
  ON_HOLD: "on_hold",
  RESOLVED: "resolved",
  RETURNED: "returned",
  PENDING_WITH: "pending_with",
  BUTTON_APPROVE: "Approve",
  BUTTON_APPROVED: "Approved",
  BUTTON_ACCEPT: "Accept",
  BUTTON_ACCEPTED: "Accepted",
  BUTTON_REJECT: "Reject",
  BUTTON_REJECTED: "Rejected",
  BUTTON_RETURN: "Return",
  BUTTON_RETURNED: "Returned",
  BUTTON_RESOLVE: "Resolve",
  BUTTON_RESOLVED: "Resolved",
  BUTTON_ON_HOLD: "On Hold",
};

export const UserRole = {
  EMPLOYEE: "employee",
  MASTER: "master",
  HR: "hr",
  ADMIN: "admin",
  IS: "is",
  FINANCE: "finance",
};

export const MyRoutes = {
  DEFAULT: "/",
  MY_TICKETS: "/mytickets",
  FORGOT_PASSWORD: "/forgotpassword",
  PROFILE: "/profile",
  RAISED_TICKETS: "/raisedtickets",
  TICKET_DETAILS: "/ticketDetailsPage",
  HELP_PAGE: "/help",
  ADMIN_DASHBOARD: "/admindashboard",
};

export const hrCategory = {
  ATTENDENCE_LOGS: "attendance logs",
  LEAVE_REQUESTS: "leave request",
  DOCUMENTS: "documents",
  JIGNECT_POLICY: "jignect policy",
  OTHER: "other",
};

export const isCategory = {
  SOFTWARE_INSTALLATION_REQUEST: "software installation request",
  PC_MOUSE_KEYBOARD_RELATED_QUERIES: "pc/keyboard/mouse related query",
  INTERNET_ACCESS_REQUEST_FOR_SPECIFIC_WEB:
    "internet access request for specific web",
  DESK_CHANGE: "desk change",
  OTHER: "other",
};

export const adminCategory = {
  STATIONARY: "stationary",
  DESK_CLEANUP: "desk clean up",
  DESK_CHAIR_RELATED: "desk / chair",
  OTHER: "other",
};

export const financeCategory = {
  PAYROLL: "payroll",
  PF: "pf",
  OTHER: "other",
};
