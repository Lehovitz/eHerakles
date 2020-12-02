import { Request, Response } from "express";
import { getManager } from "typeorm";
import { Customer } from "../entities/Customer";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Trainer } from "../entities/Trainer";
import { Moderator } from "../entities/Moderator";

export default class LoginController {
  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const customerRepository = getManager().getRepository(Customer);
    let customer = await customerRepository.findOne({
      where: { custMail: email },
    });

    const trainerRepository = getManager().getRepository(Trainer);
    let trainer = await trainerRepository.findOne({
      where: { trainerMail: email },
    });

    const moderatorRepository = getManager().getRepository(Moderator);
    let moderator = await moderatorRepository.findOne({
      where: { modMail: email },
    });

    if (customer) {
      const passCorrect = await bcrypt.compare(password, customer.custPass);
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
      const passCorrect = await bcrypt.compare(password, trainer.trainerPass);
      if (passCorrect) {
        const token = jwt.sign(
          { email, role: "trainer" },
          process.env.TOKEN_SECRET
        );
        res.send(token);
      } else {
        res.status(400).send("Nieprawidlowe dane logowania");
      }
    } else if (moderator) {
      const passCorrect = await bcrypt.compare(password, moderator.modPass);
      if (passCorrect) {
        const token = jwt.sign(
          { email, role: moderator.isAdmin ? "admin" : "moderator" },
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
