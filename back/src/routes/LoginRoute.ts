import express from "express";
import CustomerController from "../controllers/CustomerController";
import LoginController from "../controllers/LoginController";
import authenticateToken from "../middlewares/authentication";
const router = express.Router();

const loginController = new LoginController();
router.post("/", loginController.login);

export default router;
