import express from "express";
import PaymentController from "../controllers/PaymentController";
const router = express.Router();

const paymentController = new PaymentController();
router.get("/", paymentController.readAll);
router.get("/getPending", paymentController.readAllPending);
router.get("/:id", paymentController.readOne);
router.get("/findByEmail/:email", paymentController.findByEmail);
router.put("/reject/:id", paymentController.rejectPayment);
router.put("/accept/:id", paymentController.acceptPayment);
router.put("/pend/:id", paymentController.makePaymentPending);

router.put("/:id", paymentController.update);
router.delete("/:id", paymentController.delete);
router.post("/", paymentController.create);
router.post("/createWithCustId", paymentController.createWithCustId);

export default router;
