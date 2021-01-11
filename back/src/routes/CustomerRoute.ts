import express from "express";
import CustomerController from "../controllers/CustomerController";
const router = express.Router();

const customerController = new CustomerController();
router.get("/", customerController.readAll);
router.get("/:id", customerController.readOne);
router.get("/goal/:email", customerController.getCustomerGoalByEmail);
router.put("/profileInfo/:id", customerController.addProfileInfo);
router.put("/:id", customerController.update);
router.delete("/:id", customerController.delete);
router.post("/", customerController.create);
router.post("/register", customerController.register);
router.get("/check/:id", customerController.checkIfHasProfile);
router.get("/checkIfHasCard/:email", customerController.checkIfHasCard);

// router.get("/findByEmail/:email", customerController.findIdByMail);

export default router;
