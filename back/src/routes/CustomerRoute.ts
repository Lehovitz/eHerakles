import express from "express";
import CustomerController from "../controllers/CustomerController";
const router = express.Router();

const customerController = new CustomerController();
router.get("/", customerController.readAll);
router.get("/:id", customerController.readOne);
router.put("/:id", customerController.update);
router.delete("/:id", customerController.delete);
router.post("/", customerController.create);
// router.get("/findByEmail/:email", customerController.findIdByMail);

export default router;
