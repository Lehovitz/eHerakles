import { Request, Response } from "express";
import { getManager } from "typeorm";
import { Location } from "../entities/Location";
import clean from "../utils/clean";

export default class LocationController {
  async create(req: Request, res: Response) {
    const { country, city, postalCode } = req.body;

    const repo = getManager().getRepository(Location);
    let location = await repo.findOne({
      where: { country: country, city: city, postalCode: postalCode },
    });

    if (!location) {
      location = new Location();
      location.country = country;
      location.city = city;
      location.postalCode = postalCode;

      console.log("utworzono nowa lokalizacje");
      await repo.save(location);
      res.send(location);
    } else {
      res.status(400).send("Taka Lokacja juz istnieje :3");
    }
    // TODO:: poprawic tresci komunikatow, sprawdzic odpowiedni kod bledu,
    // pozniej wymienic wszystkie hardcode string na labelki
  }

  async readOne(req: Request, res: Response) {
    const { id } = req.params;
    const repo = getManager().getRepository(Location);
    let location = await repo.findOneOrFail(id);
    res.send(location);
  }

  async readAll(req: Request, res: Response) {
    const repo = getManager().getRepository(Location);
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
        if (elem[filter] != filters[filter]) return false;
      }

      return true;
    });

    // Usuwanie pól będących nullami / undefined
    filteredData.forEach((elem) => clean(elem));

    // Wysyłanie odpowiedzi z dwoma obowiązkowymi nagłówkami, w pierwszym trzeba zmienić nazwę encji
    res
      .set({
        "Content-Range": `locations ${range[0]}-${range[1]}/${filteredData.length}`,
        "Access-Control-Expose-Headers": "Content-Range",
      })
      .send(filteredData);
  }

  async update(req: Request, res: Response) {
    const { country, city, postalCode } = req.body;

    const repo = getManager().getRepository(Location);

    let location = await repo.findOne(req.params.id);

    if (location) {
      location.country = country;
      location.city = city;
      location.postalCode = postalCode;

      console.log("zaktualizowano lokacje");
      await repo.save(location);
      res.send();
    } else {
      res.status(400).send("Taka Lokacja nie istnieje :(");
    }
  }

  async delete(req: Request, res: Response) {
    const repo = getManager().getRepository(Location);
    const object = await repo.findOne(req.params.id);

    await repo.delete(req.params.id);

    return res
      .set({
        "Content-Type": "application/json",
      })
      .send(object);
  }
}
