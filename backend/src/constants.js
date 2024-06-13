export const DB_NAME = "helpDesk_v2";

export const TicketStatus = {
  IN_REVIEW: "in_review",
  REJECTED: "rejected",
  APPROVED: "approved",
  OPEN: "open",
  RESOLVED: "resolved",
  RETURNED: "returned",
  ON_HOLD: "on_hold",
  PENDING_WITH: "pending_With",
};

export const TicketStatuses = [
  TicketStatus.IN_REVIEW,
  TicketStatus.REJECTED,
  TicketStatus.APPROVED,
  TicketStatus.OPEN,
  TicketStatus.RESOLVED,
  TicketStatus.RETURNED,
  TicketStatus.ON_HOLD,
  TicketStatus.PENDING_WITH,
];

export const UserRole = {
  EMPLOYEE: "employee",
  MASTER: "master",
  HR: "hr",
  ADMIN: "admin",
  IS: "is",
  FINANCE: "finance",
};

export const UserRoleList = [
  UserRole.EMPLOYEE,
  UserRole.MASTER,
  UserRole.HR,
  UserRole.ADMIN,
  UserRole.IS,
  UserRole.FINANCE,
];
