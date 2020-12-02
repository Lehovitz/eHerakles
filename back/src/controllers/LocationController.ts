import { Request, Response } from "express";
import { getManager } from "typeorm";
import { Location } from "../entities/Location";
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
      res.send();
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
    let location = await repo.find();
    res.send(location);
  }
  async update(req: Request, res: Response) {}
  async delete(req: Request, res: Response) {}
}
