import { Request, Response } from "express";
import { getManager } from "typeorm";
import { Person } from "../entities/Person";
import { Trainer } from "../entities/Trainer";
import { Location } from "../entities/Location";
import bcrypt from "bcryptjs";
import clean from "../utils/clean";

export default class TrainerController {
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

    const trainerRepo = getManager().getRepository(Trainer);
    const locRepo = getManager().getRepository(Location);
    const personRepo = getManager().getRepository(Person);

    let location = await locRepo.findOne({
      where: { Country: country, City: city },
    });

    let person = await personRepo.findOne({
      where: { PESEL: PESEL, PhoneNum: phoneNum },
    });

    let trainer = person && person.trainer;

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

    if (!trainer) {
      trainer = new Trainer();
      trainer.trainerMail = email;
      const salt = bcrypt.genSaltSync(10);
      const hash = await bcrypt.hash(password, salt);
      trainer.trainerPass = hash;
      console.log("utworzono nowego customera");
      trainer.person = person;
      await trainerRepo.save(trainer);
    } else {
      console.log("Taki Trainer juz istnieje :3");
    }
    res.send();
  }

  async readAll(req: Request, res: Response) {
    const repo = getManager().getRepository(Trainer);

    const sort = JSON.parse(req.query.sort.toString());
    const filters = JSON.parse(req.query.filter.toString());
    const range = JSON.parse(req.query.range.toString());

    // Parametry metody find używanej poniżej
    const order = {};
    order[sort[0]] = sort[1];

    const skip = +range[0];
    const take = +range[1] - +range[0];

    // Wybieranie zakresu i sortowanie na podstawie wyżej podanych parametrów
    let data = await repo
      .createQueryBuilder("trainer")
      .leftJoinAndSelect("trainer.person", "person")
      .orderBy(`trainer.${sort[0]}`, sort[1])
      .skip(skip)
      .take(take)
      .getMany();

    // Filtrowanie encji
    const filteredData = data.filter((elem) => {
      for (let filter of Object.keys(filters)) {
        if (elem[filter] != filters[filter]) return false;
      }

      return true;
    });

    // Usuwanie pól będących nullami / undefined
    filteredData.forEach((elem) => clean(elem));

    // Wyciąganie tylko istotnych pól
    const result = [];

    for (let elem of filteredData) {
      const { id, trainerMail } = elem;
      const personRepo = getManager().getRepository(Person);
      const person = await personRepo.findOne(elem.person);

      const { name, surname, birthDate, docNumber, docType } = person;

      result.push({
        id,
        trainerMail,
        name,
        surname,
        birthDate,
        docType,
        docNumber,
      });
    }

    // Wysyłanie odpowiedzi z dwoma obowiązkowymi nagłówkami
    res
      .set({
        "Content-Range": `trainers ${range[0]}-${range[1]}/${result.length}`,
        "Access-Control-Expose-Headers": "Content-Range",
      })
      .send(result);
  }

  async readOne(req: Request, res: Response) {
    const repo = getManager().getRepository(Trainer);
    const data = await repo.findOne(req.params.id);
    const { id, trainerMail } = data;
    const { name, surname, birthDate, docType, docNumber } = data.person;

    res
      .status(200)
      .send({ id, trainerMail, name, surname, birthDate, docType, docNumber });
  }

  async update(req: Request, res: Response) {
    const { id, mail, name, surname, birthDate, docType, docNumber } = req.body;

    // ważne żeby update miał tylko te pola które zwraca read
  }

  async delete(req: Request, res: Response) {
    const repo = getManager().getRepository(Trainer);
    const object = await repo.findOne(req.params.id);

    await repo.delete(req.params.id);

    return res
      .set({
        "Content-Type": "application/json",
      })
      .send({ id: object.id, trainerMail: object.trainerMail });
  }
}
