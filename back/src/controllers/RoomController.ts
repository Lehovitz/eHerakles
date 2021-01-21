import { Request, Response } from "express";
import { getManager } from "typeorm";
import { Room } from "../entities/Room";
import clean from "../utils/clean";

export default class RoomController {
  async create(req: Request, res: Response) {
    const { roomName, roomNumber } = req.body;

    const roomRepo = getManager().getRepository(Room);

    let room = await roomRepo.findOne({
      where: { roomName: roomName, roomNumber: roomNumber },
    });

    if (!room) {
      const room = new Room();
      console.log("utworzono nowy pokoj ");

      room.roomNumber = roomNumber;
      room.roomName = roomName;

      await roomRepo.save(room);
      res.send(room);
    } else res.status(400).send();
  }

  async readAll(req: Request, res: Response) {
    const repo = getManager().getRepository(Room);

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
        "Content-Range": `rooms ${range[0]}-${range[1]}/${filteredData.length}`,
        "Access-Control-Expose-Headers": "Content-Range",
      })
      .send(filteredData);
  }

  async readOne(req: Request, res: Response) {
    const repo = getManager().getRepository(Room);
    const data = await repo.findOne(req.params.id);
    return res.status(200).send(data);
  }

  async update(req: Request, res: Response) {
    const { name, number } = req.body;
    const repo = getManager().getRepository(Room);

    let room = await repo.findOne(req.params.id);

    if (room) {
      room.roomName = name;
      room.roomNumber = number;
      await repo.save(room);
      res.status(200).send(room);
    } else {
      res.status(400).send();
    }
  }

  async delete(req: Request, res: Response) {
    const repo = getManager().getRepository(Room);
    const object = await repo.findOne(req.params.id);

    await repo.delete(req.params.id);

    return res
      .set({
        "Content-Type": "application/json",
      })
      .send(object);
  }
}
