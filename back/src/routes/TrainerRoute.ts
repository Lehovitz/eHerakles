import { Trainer } from './../entities/Trainer';
import express from "express";
import TrainerController from '../controllers/TrainerController';

const router = express.Router();

const trainerController = new TrainerController();
router.get("/", trainerController.readAll);
router.post("/", trainerController.create);

//router.use(authenticateToken);

export default router;
