import { TicketStatus } from "../../common/common.config";

export function getSteps(apiRes) {
  const step = [];
  console.log("This is api reponse for a ticket", apiRes.statusFlow.fromMaster);

  var fromMaster = apiRes.statusFlow.fromMaster;
  var fromUser = apiRes.statusFlow.fromUser;
  var fromDepartment = apiRes.statusFlow.fromDepartment;

  if (
    fromMaster.status == TicketStatus.PENDING_MASTER ||
    fromMaster.status == TicketStatus.REJECTED_MASTER
  ) {
    return [
      {
        username: fromUser.updatedBy.username.toUpperCase(),
        status: getStatus(fromUser.status),
        updatedAt: fromUser.updatedBy.updatedAt.substring(0, 10),
        avatar: fromUser.updatedBy.avatar,
      },
      {
        username: fromMaster.updatedBy.username.toUpperCase(),
        status: getStatus(fromMaster.status),
        updatedAt: fromMaster.updatedBy.updatedAt.substring(0, 10),
        avatar: fromMaster.updatedBy.avatar,
      },
    ];
  }

  return [
    {
      username: fromUser.updatedBy.username.toUpperCase(),
      status: getStatus(fromUser.status),
      updatedAt: fromUser.updatedAt.substring(0, 10),
      avatar: fromUser.updatedBy.avatar,
    },
    {
      username: fromMaster.updatedBy.username.toUpperCase(),
      status: getStatus(fromMaster.status),
      updatedAt: fromMaster.updatedAt.substring(0, 10),
      avatar: fromMaster.updatedBy.avatar,
    },
    {
      username: fromDepartment.updatedBy.username.toUpperCase(),
      status: getStatus(fromDepartment.status),
      updatedAt: fromDepartment.updatedBy.updatedAt.substring(0, 10),
      avatar: fromDepartment.updatedBy.avatar,
    },
  ];
}

export function getTicketDetails(ticketData) {
  return {
    ticketNo: ticketData.number,
    title: ticketData.title,
    username: ticketData.statusFlow.fromUser.updatedBy.username,
  };
}

export function getStatus(status) {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" By ");
}
