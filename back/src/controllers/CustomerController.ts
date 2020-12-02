import { Request, Response } from "express";
import { getManager } from "typeorm";
import { Customer } from "../entities/Customer";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Person } from "../entities/Person";
import { Location } from "../entities/Location";

export default class CustomerController {
  async create(req: Request, res: Response) {
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
      where: { country: country, city: city },
    });

    let person = await personRepo.findOne({
      where: { pesel: PESEL, phoneNum: phoneNum },
    });

    let customer = person && person.customer;

    if (!location) {
      location = new Location();
      location.country = country;
      location.city = city;
      location.postalCode = postalCode;

      console.log("utworzono nowa lokalizacje");
      await locRepo.save(location);
    } else {
      console.log("Taka Lokacja juz istnieje :3");
    }

    if (!person) {
      person = new Person();
      person.name = name;
      person.surname = surname;
      person.docType = docType;
      person.docNumber = docNumber;
      person.gender = gender;
      person.birthDate = dateOfBirth;
      person.phoneNum = phoneNum;
      person.pesel = PESEL;
      person.address = address;
      person.location = location;
      console.log("utworzono nowa osobe");

      await personRepo.save(person);
    } else {
      console.log("Taka osoba juz istnieje :3");
    }

    if (!customer) {
      customer = new Customer();
      customer.custMail = email;
      const salt = bcrypt.genSaltSync(10);
      const hash = await bcrypt.hash(password, salt);
      customer.custPass = hash;
      console.log("utworzono nowego customera");
      customer.person = person;
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
}
