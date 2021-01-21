import express from "express";
import ModeratorController from "../controllers/ModeratorController";
const router = express.Router();

const moderatorController = new ModeratorController();
router.get("/", moderatorController.readAll);
router.get("/:id", moderatorController.readOne);
router.put("/:id", moderatorController.update);
router.delete("/:id", moderatorController.delete);
router.post("/", moderatorController.create);

export default router;
