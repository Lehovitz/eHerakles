import express from "express";
import CustomerController from "../controllers/CustomerController";
import RoomController from "../controllers/RoomController";
import authenticateToken from "../middlewares/authentication";

const router = express.Router();

const roomController = new RoomController();
router.get("/", roomController.readAll);
router.post("/", roomController.create);

//router.use(authenticateToken);

export default router;
