import express from "express";
import PaymentController from "../controllers/PaymentController";
const router = express.Router();

const paymentController = new PaymentController();
router.get("/", paymentController.readAll);
router.get("/getPending", paymentController.readAllPending);
router.get("/:id", paymentController.readOne);
router.put("/reject/:id", paymentController.rejectPayment);
router.put("/accept/:id", paymentController.acceptPayment);
router.put("/:id", paymentController.update);
router.delete("/:id", paymentController.delete);
router.post("/", paymentController.create);

export default router;
