import express from "express";
import CategoryController from "../controllers/CategoryController";

const router = express.Router();

const categoryController = new CategoryController();
router.get("/", categoryController.readAll);
router.get("/:id", categoryController.readOne);
router.put("/:id", categoryController.update);
router.delete("/:id", categoryController.delete);
router.post("/", categoryController.create);
//router.use(authenticateToken);

export default router;
