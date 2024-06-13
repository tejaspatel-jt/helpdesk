import { Router } from "express";
import { authorizedAccess, verifyJWT } from "../middlewares/auth.middleware.js";
import { getTicketDetails, getTicketFile } from "../controllers/ticket.conroller.js";

const router = Router()
router.route("/dashboard").get(verifyJWT,authorizedAccess,getTicketDetails);
router.route("/media").get(verifyJWT,getTicketFile);

export default router;