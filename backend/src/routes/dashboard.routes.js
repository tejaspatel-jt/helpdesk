import { Router } from "express";
import { authorizedAccess, verifyJWT } from "../middlewares/auth.middleware.js";
import { getTicketDetails } from "../controllers/ticket.conroller.js";

const router = Router()
router.route("/dashboard").get(verifyJWT,authorizedAccess,getTicketDetails);
export default router;