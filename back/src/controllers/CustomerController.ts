import { Request, Response } from "express";
import { getManager } from "typeorm";
import { Customer } from "../entities/Customer";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Person } from "../entities/Person";
import { Location } from "../entities/Location";

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

  async union(req: Request, res: Response) {
    const {
      email,
      password,
      country,
      city,
      postalCode,
      name,
      surname,
      gender,
      docType,
      dateOfBirth,
      phoneNum,
      PESEL,
      docNumber,
      address,
    } = req.body;

    const custRepo = getManager().getRepository(Customer);
    const locRepo = getManager().getRepository(Location);
    const personRepo = getManager().getRepository(Person);

    let location = await locRepo.findOne({
      where: { Country: country, City: city },
    });

    let person = await personRepo.findOne({
      where: { PESEL: PESEL, PhoneNum: phoneNum },
    });

    let customer = person && person.Customer;

    if (!location) {
      location = new Location();
      location.Country = country;
      location.City = city;
      location.PostalCode = postalCode;

      console.log("utworzono nowa lokalizacje");
      await locRepo.save(location);
    } else {
      console.log("Taka Lokacja juz istnieje :3");
    }

    if (!person) {
      person = new Person();
      person.Name = name;
      person.Surname = surname;
      person.DocType = docType;
      person.DocNumber = docNumber;
      person.Gender = gender;
      person.BirthDate = dateOfBirth;
      person.PhoneNum = phoneNum;
      person.PESEL = PESEL;
      person.Address = address;
      person.Location = location;
      console.log("utworzono nowa osobe");

      await personRepo.save(person);
    } else {
      console.log("Taka osoba juz istnieje :3");
    }

    if (!customer) {
      customer = new Customer();
      customer.CustMail = email;
      const salt = bcrypt.genSaltSync(10);
      const hash = await bcrypt.hash(password, salt);
      customer.CustPass = hash;
      console.log("utworzono nowego customera");
      customer.Person = person;
      await custRepo.save(customer);
    } else {
      console.log("Taki Customer juz istnieje :3");
    }
    res.send();
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
