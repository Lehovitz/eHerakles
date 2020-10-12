import express from "express";
import CustomerController from "../controllers/CustomerController";
import authenticateToken from "../middlewares/authentication";
const router = express.Router();

const customerController = new CustomerController();
router.get("/", authenticateToken, customerController.readAll);
//router.use(authenticateToken);
router.get("/:id", customerController.readOne);
router.put("/:id", customerController.update);
router.delete("/:id", customerController.delete);
router.post("/login", customerController.logIn);
router.post("/register", customerController.union);
export default router;
