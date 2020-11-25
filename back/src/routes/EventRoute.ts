import express from "express";
import EventController from "../controllers/EventController";
import authenticateToken from "../middlewares/authentication";
const router = express.Router();

const eventController = new EventController();
router.get("/", authenticateToken, eventController.readAll);
router.put("/:eventId", eventController.update);
router.delete("/:eventId", eventController.delete);
router.post("/", eventController.create);
export default router;