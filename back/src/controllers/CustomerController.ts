import { Request, Response } from "express";
import { getManager } from "typeorm";
import { Customer } from "../entities/Customer";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export default class CustomerController {
  async create(req: Request, res: Response) {
    const { email, password } = req.body;

    const repo = getManager().getRepository(Customer);
    let cust = await repo.findOne({ where: { CustMail: email } });

    if (!cust) {
      cust = new Customer();
      cust.CustMail = email;
      const salt = bcrypt.genSaltSync(10);
      const hash = await bcrypt.hash(password, salt);
      cust.CustPass = hash;
      console.log("utworzono nowego customera");
      await repo.save(cust);
      res.send();
    } else {
      res.status(400).send("Taki Customer juz istnieje :3");
    }
    // TODO:: poprawic tresci komunikatow, sprawdzic odpowiedni kod bledu,
    // pozniej wymienic wszystkie hardcode string na labelki
  }
  async readOne(req: Request, res: Response) {
    const { id } = req.params;
    const repo = getManager().getRepository(Customer);
    let cust = await repo.findOneOrFail(id);
    res.send(cust);
  }
  async readAll(req: Request, res: Response) {
    const repo = getManager().getRepository(Customer);
    let cust = await repo.find();
    res.send(cust);
  }
  async update(req: Request, res: Response) {}
  async delete(req: Request, res: Response) {}

  async logIn(req: Request, res: Response) {
    const { email, password } = req.body;
    const repo = getManager().getRepository(Customer);
    let cust = await repo.findOne({ where: { CustMail: email } });
    console.log(cust);
    if (cust) {
      const passCorrect = await bcrypt.compare(password, cust.CustPass);
      if (passCorrect) {
        const token = jwt.sign(
          { email, role: "customer" },
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
