import { TicketStatus } from "../../common/common.config";

export function getSteps(apiRes) {
  console.log(`rj_ getSteps > apiRes -- ${JSON.stringify(apiRes)}`);

  const step = [];

  if(apiRes.status == "in_review") {
    return [
      {
        username: "user",
        status: "Created",
        // updatedAt: fromUser.updatedBy.updatedAt.substring(0, 10),
        updatedAt: getSubstringedDate(apiRes.updatedAt),
        // avatar: fromUser.updatedBy.avatar,
      },
      {
        username: "Master",
        status: "in review",
        // updatedAt: fromMaster.updatedBy.updatedAt.substring(0, 10),
        updatedAt: "-",
        // avatar: fromMaster.updatedBy.avatar,
      },
    ];
  }

  var fromMaster = apiRes.statusFlow.fromMaster;
  var fromUser = apiRes.statusFlow.fromUser;
  var fromDepartment = apiRes.statusFlow.fromDepartment;

  if (
    // fromMaster.status == TicketStatus.PENDING_MASTER ||
    fromMaster.status == "pending_With" ||
    fromMaster.status == TicketStatus.REJECTED_MASTER ||
    fromMaster.status == TicketStatus.RETURNED ||
    fromMaster.status == TicketStatus.ON_HOLD
  ) {
    return [
      {
        username: fromUser.updatedBy.username?.toUpperCase(),
        status: getStatus(fromUser.status),
        // updatedAt: fromUser.updatedBy.updatedAt.substring(0, 10),
        updatedAt: getSubstringedDate(fromUser.updatedAt),
        // avatar: fromUser.updatedBy.avatar,
      },
      {
        username: fromMaster.updatedBy.username?.toUpperCase(),
        status: getStatus(fromMaster.status),
        // updatedAt: fromMaster.updatedBy.updatedAt.substring(0, 10),
        updatedAt: fromMaster.updatedAt,
        // avatar: fromMaster.updatedBy.avatar,
      },
    ];
  }

  return [
    {
      username: fromUser.updatedBy.username?.toUpperCase(),
      status: getStatus(fromUser.status),
      updatedAt: getSubstringedDate(fromUser.updatedAt),
      // avatar: fromUser.updatedBy.avatar,
    },
    {
      username: fromMaster.updatedBy.username?.toUpperCase(),
      status: getStatus(fromMaster.status),
      updatedAt: getSubstringedDate(fromMaster.updatedAt),
      // avatar: fromMaster.updatedBy.avatar,
    },
    {
      username: fromDepartment.updatedBy.username?.toUpperCase(),
      status: getStatus(fromDepartment.status),
      updatedAt: fromDepartment.updatedAt,
      // avatar: fromDepartment.updatedBy.avatar,
    },
  ];
}

export function getTicketDetails(ticketData) {
  return {
    ticketNo: ticketData.number,
    title: ticketData.title,
    username: ticketData.statusFlow?.fromUser?.updatedBy.username,
  };
}

export function getStatus(status) {
  return status
    .replace("With", "")
    .split("_")
    .map((word) => word?.charAt(0)?.toUpperCase() + word.slice(1))
    .join(" ");
}

export function getSubstringedDate(date) {
  return date.substring(0, 10);
}
