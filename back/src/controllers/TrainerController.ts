import { Request, Response } from "express";
import { getManager } from "typeorm";
import { Person } from "../entities/Person";
import { Trainer } from "../entities/Trainer";
import { Location } from "../entities/Location";
import bcrypt from "bcryptjs";

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
      console.log("Taki Customer juz istnieje :3");
    }
    res.send();
  }

  async readAll(_req: Request, res: Response) {
    const repo = getManager().getRepository(Trainer);
    const personRepo = getManager().getRepository(Person);
    let trainers = await repo.find();
    const result = [];
    for (let t of trainers)
    {
      let person = await personRepo.findOne(t.person);
      result.push({
        TrainerId: t.id,
        TrainerName: person.name,
        TrainerSurname: person.surname
      })
    }
    res.send(result);
  }
}
