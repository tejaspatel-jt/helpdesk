import { Router } from "express";

import {
  createTicket,
  getAllTickets,
  getTicket,
  getTicketFile,
  updateTicketStatus,
} from "../controllers/ticket.conroller.js";
import { authorizedAccess, verifyJWT } from "../middlewares/auth.middleware.js";

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

router.route("/get/file").get(verifyJWT, getTicketFile);

export default router;
