import { getManager } from "typeorm";
import { Moderator } from "../entities/Moderator";
import { Request, Response } from "express";
import clean from "../utils/clean";
import { Person } from "../entities/Person";
import { Location } from "../entities/Location";
import bcrypt from "bcryptjs";

export default class ModeratorController {
  async create(req: Request, res: Response) {
    const {
      modMail,
      modPass,
      country,
      city,
      postalCode,
      name,
      surname,
      gender,
      docType,
      birthDate,
      phoneNum,
      pesel,
      docNumber,
      address,
    } = req.body;

    const repo = getManager().getRepository(Moderator);
    const locRepo = getManager().getRepository(Location);
    const personRepo = getManager().getRepository(Person);

    let location = await locRepo.findOne({
      where: { country: country, city: city },
    });

    let person = await personRepo.findOne({
      where: { pesel: pesel, phoneNum: phoneNum },
    });

    let moderator = person && person.moderator;

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
      person.birthDate = birthDate;
      person.phoneNum = phoneNum;
      person.pesel = pesel;
      person.address = address;
      person.location = location;
      console.log("utworzono nowa osobe");

      await personRepo.save(person);
    } else {
      console.log("Taka osoba juz istnieje :3");
    }

    if (!moderator) {
      moderator = new Moderator();
      moderator.modMail = modMail;
      const salt = bcrypt.genSaltSync(10);
      const hash = await bcrypt.hash(modPass, salt);
      moderator.modPass = hash;
      console.log("utworzono nowego customera");
      moderator.person = person;
      await repo.save(moderator);
    } else {
      console.log("Taki Moderator juz istnieje :3");
    }

    res.send({ id: moderator.id, modMail: moderator.modMail });
  }

  async readAll(req: Request, res: Response) {
    const repo = getManager().getRepository(Moderator);

    let { sort, filters, range } = req.query;

    sort = sort ? JSON.parse(sort.toString()) : ["id", "ASC"];
    filters = filters ? JSON.parse(filters.toString()) : {};
    range = range ? JSON.parse(range.toString()) : [0, 1000000];

    // Parametry metody find używanej poniżej
    const order = {};
    order[sort[0]] = sort[1];

    const skip = +range[0];
    const take = +range[1] - +range[0];

    // Wybieranie zakresu i sortowanie na podstawie wyżej podanych parametrów
    let data = await repo
      .createQueryBuilder("moderator")
      .leftJoinAndSelect("moderator.person", "person")
      .leftJoinAndSelect("person.location", "location")
      .orderBy(`moderator.${sort[0]}`, sort[1])
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
      const { person } = elem;
      const { location } = person;

      delete elem.modPass;
      delete elem.person;
      delete person.id;
      delete person.location;
      delete location.id;

      result.push({ ...elem, ...person, ...location });
    }

    // Wysyłanie odpowiedzi z dwoma obowiązkowymi nagłówkami
    res
      .set({
        "Content-Range": `moderators ${range[0]}-${range[1]}/${result.length}`,
        "Access-Control-Expose-Headers": "Content-Range",
      })
      .send(result);
  }

  async readOne(req: Request, res: Response) {
    const repo = getManager().getRepository(Moderator);
    const moderator = await repo
      .createQueryBuilder("moderator")
      .leftJoinAndSelect("moderator.person", "person")
      .leftJoinAndSelect("person.location", "location")
      .where("moderator.id = :id", { id: req.params.id })
      .getOne();

    if (moderator) {
      const { person } = moderator;
      const { location } = person;

      delete moderator.modPass;
      delete moderator.person;
      delete person.id;
      delete person.location;
      delete location.id;

      res.status(200).send({ ...moderator, ...person, ...location });
    } else res.status(400).send();
  }

  async update(req: Request, res: Response) {
    const {
      modMail,
      name,
      surname,
      gender,
      docType,
      birthDate,
      phoneNum,
      pesel,
      docNumber,
      address,
      country,
      city,
      postalCode,
    } = req.body;

    const repo = getManager().getRepository(Moderator);
    const personRepo = getManager().getRepository(Person);
    const locationRepo = getManager().getRepository(Location);

    const moderator = await repo
      .createQueryBuilder("moderator")
      .leftJoinAndSelect("moderator.person", "person")
      .leftJoinAndSelect("person.location", "location")
      .where("moderator.id = :id", { id: req.params.id })
      .getOne();

    if (moderator) {
      const { person } = moderator;
      const { location } = person;

      moderator.modMail = modMail;

      person.name = name;
      person.surname = surname;
      person.birthDate = birthDate;
      person.docType = docType;
      person.docNumber = docNumber;
      person.gender = gender;
      person.pesel = pesel;
      person.phoneNum = phoneNum;
      person.address = address;

      location.country = country;
      location.city = city;
      location.postalCode = postalCode;

      await repo.save(moderator);
      await personRepo.save(person);
      await locationRepo.save(location);

      delete moderator.modPass;
      delete moderator.person;
      delete person.id;
      delete person.location;
      delete location.id;

      res.status(200).send({ ...moderator, ...person, ...location });
    } else res.status(400).send("Nie istnieje taki moderator");
  }

  async delete(req: Request, res: Response) {
    const repo = getManager().getRepository(Moderator);
    const object = await repo.findOne(req.params.id);

    await repo.delete(req.params.id);

    return res
      .set({
        "Content-Type": "application/json",
      })
      .send(object);
  }
}
