import { Request, Response } from "express";
import { getManager } from "typeorm";
import { Customer } from "../entities/Customer";
import bcrypt from "bcryptjs";
import { Person } from "../entities/Person";
import { Location } from "../entities/Location";
import clean from "../utils/clean";

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
    res.send(customer);
  }

  async readOne(req: Request, res: Response) {
    const { id } = req.params;
    const repo = getManager().getRepository(Customer);
    let cust = await repo.findOneOrFail(id);
    res.send(cust);
  }

  async readAll(req: Request, res: Response) {
    const repo = getManager().getRepository(Customer);

    const sort = JSON.parse(req.query.sort.toString());
    const filters = JSON.parse(req.query.filter.toString());
    const range = JSON.parse(req.query.range.toString());

    // Parametry metody find używanej poniżej
    const order = {};
    order[sort[0]] = sort[1];

    const skip = +range[0];
    const take = +range[1] - +range[0];

    // Wybieranie zakresu i sortowanie na podstawie wyżej podanych parametrów
    let data = await repo.find({ order, skip, take });

    // Filtrowanie encji
    const filteredData = data.filter((elem) => {
      for (let filter of Object.keys(filters)) {
        console.log(filter);
        if (elem[filter] != filters[filter]) return false;
      }

      return true;
    });

    // Usuwanie pól będących nullami / undefined
    filteredData.forEach((elem) => clean(elem));

    // Wyciąganie tylko istotnych pól
    const result = filteredData.map(async (elem) => {
      const { id, custMail } = elem;
      const personRepo = getManager().getRepository(Person);
      const person = await personRepo.findOne(elem.person);
      
      const { name, surname, birthDate, docNumber, docType } = person;

      return { id, custMail, name, surname, birthDate, docType, docNumber };
    });

    // Wysyłanie odpowiedzi z dwoma obowiązkowymi nagłówkami
    res
      .set({
        "Content-Range": `customers ${range[0]}-${range[1]}/${filteredData.length}`,
        "Access-Control-Expose-Headers": "Content-Range",
      })
      .send(result);
  }

  async update(req: Request, res: Response) {
    const { id, mail, name, surname, birthDate, docType, docNumber } = req.body;
  }

  async delete(req: Request, res: Response) {
    const repo = getManager().getRepository(Customer);
    const object = await repo.findOne(req.params.id);

    await repo.delete(req.params.id);

    return res
      .set({
        "Content-Type": "application/json",
      })
      .send({ id: object.id, custMail: object.custMail });
  }
}
