import express from "express";
import LocationController from "../controllers/LocationController";
const router = express.Router();

const locationController = new LocationController();
router.get("/", locationController.readAll);
router.get("/:id", locationController.readOne);
router.put("/:id", locationController.update);
router.delete("/:id", locationController.delete);
router.post("/", locationController.create);

export default router;
