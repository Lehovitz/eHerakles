import { Request, Response } from "express";
import { getManager } from "typeorm";
import { Person } from "../entities/Person";
export default class PersonController {
  async create(req: Request, res: Response) {
    const {
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
    console.log(req.body);

    const repo = getManager().getRepository(Person);
    let person = await repo.findOne({ where: { PESEL: PESEL } });

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

      console.log("utworzono nowa osobe");
      await repo.save(person);
      res.send();
    } else {
      res.status(400).send("Taka Persona juz istnieje :3");
    }
    // TODO:: poprawic tresci komunikatow, sprawdzic odpowiedni kod bledu,
    // pozniej wymienic wszystkie hardcode string na labelki
  }
  async readOne(req: Request, res: Response) {
    const { id } = req.params;
    const repo = getManager().getRepository(Person);
    let person = await repo.findOneOrFail(id);
    res.send(person);
  }
  async readAll(req: Request, res: Response) {
    const repo = getManager().getRepository(Person);
    let person = await repo.find();
    res.send(person);
  }
  async update(req: Request, res: Response) {}
  async delete(req: Request, res: Response) {}
}
