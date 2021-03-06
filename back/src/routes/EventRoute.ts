import express from "express";
import EventController from "../controllers/EventController";
const router = express.Router();

const eventController = new EventController();
router.get("/", eventController.readAll);
router.get("/getNextId", eventController.getNextIndex);
router.get("/:eventId", eventController.readOne);
router.put("/:eventId", eventController.update);
router.put("/sign/:identifier/:email", eventController.assignCustomer);
router.delete("/:eventId", eventController.delete);
router.delete("/byIdentifier/:identifier", eventController.deleteByIdentifier);
router.post("/", eventController.create);
export default router;
