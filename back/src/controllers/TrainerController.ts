import { Request, Response } from "express";
import { getManager } from "typeorm";
import { Trainer } from "../entities/Trainer";

export default class TrainerController {

 
  async create(req: Request, res: Response) {
  }

  async readAll(req: Request, res: Response) {
    const repo = getManager().getRepository(Trainer);
    let trainer = await repo.find();
    res.send(trainer);
  }
}
