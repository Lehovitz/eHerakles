import express from "express";
import emailController from "../controllers/EmailController";

const router = express.Router();

const emails = new emailController();

router.get("/:paymId", emails.sendPayment);
router.get("/expires/:custId", emails.sendReminder);

//router.use(authenticateToken);

export default router;
