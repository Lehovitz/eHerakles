import express from "express";
import emailController from "../controllers/EmailController";

const router = express.Router();

const emails = new emailController();

router.get("/{id}", emails.sendPayment);
//router.use(authenticateToken);

export default router;
