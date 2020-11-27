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
}
