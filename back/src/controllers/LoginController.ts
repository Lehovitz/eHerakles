import { Request, Response } from "express";
import { getManager } from "typeorm";
import { Customer } from "../entities/Customer";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Trainer } from "../entities/Trainer";

export default class LoginController {
  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const customerRepository = getManager().getRepository(Customer);
    let customer = await customerRepository.findOne({
      where: { CustMail: email },
    });

    const trainerRepository = getManager().getRepository(Trainer);
    let trainer = await trainerRepository.findOne({
      where: { TrainerMail: email },
    });

    if (customer) {
      const passCorrect = await bcrypt.compare(password, customer.CustPass);
      if (passCorrect) {
        const token = jwt.sign(
          { email, role: "customer" },
          process.env.TOKEN_SECRET
        );
        res.send(token);
      } else {
        res.status(400).send("Nieprawidlowe dane logowania");
      }
    } else if (trainer) {
      const passCorrect = await bcrypt.compare(password, trainer.TrainerPass);
      if (passCorrect) {
        const token = jwt.sign(
          { email, role: "trainer" },
          process.env.TOKEN_SECRET
        );
        res.send(token);
      } else {
        res.status(400).send("Nieprawidlowe dane logowania");
      }
    } else {
      res.status(400).send("Nieprawidlowe dane logowania");
    }
  }
}
