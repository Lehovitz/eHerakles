import express from "express";
import CustomerController from "../controllers/CustomerController";
import SubscriptionController from "../controllers/SubscriptionController";

import authenticateToken from "../middlewares/authentication";

const router = express.Router();

const subscriptionController = new SubscriptionController();
router.get("/", subscriptionController.readAll);
router.get("/:id", subscriptionController.readOne);
router.put("/:id", subscriptionController.update);
router.delete("/:id", subscriptionController.delete);
router.post("/", subscriptionController.create);

//router.use(authenticateToken);

export default router;
