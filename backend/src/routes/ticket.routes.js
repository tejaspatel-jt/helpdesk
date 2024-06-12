import { Router } from "express";

import { authorizedAccess, verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createTicket,
  getAllTickets,
  getTicket,
  getTicketDetails,
  updateTicketStatus,
} from "../controllers/ticket.conroller.js";

import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/create").post(
  verifyJWT,
  upload.fields([
    {
      name: "attachment",
      maxCount: 1,
    },
  ]),
  createTicket
);
router.route("/get").get(verifyJWT, getTicket);
router.route("/get/all").get(verifyJWT, authorizedAccess, getAllTickets);
router
  .route("/update/status")
  .patch(verifyJWT, authorizedAccess, updateTicketStatus);

router.route("/dashboard").get(verifyJWT,authorizedAccess,getTicketDetails);  

export default router;
