import express from "express";
import CardController from "../controllers/CardController";

const router = express.Router();

const cardController = new CardController();
router.get("/", cardController.readAll);
router.get("/:id", cardController.readOne);
router.put("/:id", cardController.update);
router.delete("/:id", cardController.delete);
router.post("/", cardController.create);
router.post("/CreateWithSub", cardController.createWithSub);
router.get("/findByEmail/:email", cardController.findCardByEmail);
router.get("/findByCustomer/:email", cardController.findByEmail);
//POG
//router.use(authenticateToken);

export default router;
