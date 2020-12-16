import { getManager } from "typeorm";
import { Moderator } from "../entities/Moderator";
import { Request, Response } from "express";
import clean from "../utils/clean";
import { Person } from "../entities/Person";

export default class ModeratorController {
  async create(req: Request, res: Response) {}

  async readAll(req: Request, res: Response) {
    const repo = getManager().getRepository(Moderator);

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
    const data = await repo.findOne(req.params.id);
    return res.status(200).send(data);
  }

  async update(req: Request, res: Response) {}

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
