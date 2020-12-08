import { Request, Response } from "express";
import { getManager } from "typeorm";
import { Event } from "../entities/Event";
import { Location } from "../entities/Location";
import { Room } from "../entities/Room";
import { Trainer } from "../entities/Trainer";
import clean from "../utils/clean";

export default class EventController {
  async create(req: Request, res: Response) {
    const {
      title,
      identifier,
      startDate,
      endDate,
      trainerId,
      allDay,
      notes,
      roomId,
      rRule,
      exDate,
      capacity,
    } = req.body;

    const repo = getManager().getRepository(Event);
    const trainer = getManager().getRepository(Trainer);
    const room = getManager().getRepository(Room);

    const event = new Event();
    event.identifier = identifier;
    event.dateStart = startDate;
    event.dateEnd = endDate;
    event.title = title;
    event.isAllDay = Boolean(allDay);
    event.description = notes;
    event.rule = rRule;
    console.log(exDate);
    event.exDate = exDate;
    event.trainer = await trainer.findOne(trainerId);
    event.capacity = capacity;
    event.room = await room.findOne(roomId);

    console.log("utworzono nowe zajecia");
    await repo.save(event);
    return res.send(event);
  }

  async readAll(req: Request, res: Response) {
    const repo = getManager().getRepository(Event);
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
    const filteredData = data.filter((event) => {
      for (let filter of Object.keys(filters)) {
        console.log(filter);
        if (event[filter] != filters[filter]) return false;
      }

      return true;
    });

    // Usuwanie pól będących nullami / undefined
    filteredData.forEach((elem) => clean(elem));

    // Wysyłanie odpowiedzi z dwoma obowiązkowymi nagłówkami
    res
      .set({
        "Content-Range": `events ${range[0]}-${range[1]}/${filteredData.length}`,
        "Access-Control-Expose-Headers": "Content-Range",
      })
      .send(filteredData);
  }

  async readOne(req: Request, res: Response) {
    const repo = getManager().getRepository(Event);
    const data = await repo.findOne(req.params.eventId);
    return res.status(200).send(data);
  }

  async getNextIndex(_req: Request, res: Response) {
    const repo = getManager().getRepository(Event);
    let lastRec = await repo.find({
      order: {
        identifier: "DESC",
      },
      take: 1,
    });
    let lastIndex = lastRec.length === 0 ? 0 : lastRec[0].identifier + 1;
    return res.send({ lastIndex });
  }

  async update(req: Request, res: Response) {
    const {
      title,
      identifier,
      startDate,
      endDate,
      trainerId,
      allDay,
      notes,
      roomId,
      rRule,
      exDate,
      capacity,
    } = req.body;
    const repo = getManager().getRepository(Event);

    const idType = req.header("X-Identifier-Type");

    let event = await repo.findOne({
      where:
        idType === "Identifier"
          ? { identifier: req.params.eventId }
          : { id: req.params.eventId },
    });

    console.log(event);

    if (event) {
      const repo = getManager().getRepository(Event);
      const trainer = getManager().getRepository(Trainer);
      const room = getManager().getRepository(Room);

      event.identifier = identifier;
      event.dateStart = startDate;
      event.dateEnd = endDate;
      event.title = title;
      event.isAllDay = Boolean(allDay);
      event.description = notes;
      event.rule = rRule;
      event.exDate = exDate;
      event.trainer = await trainer.findOne(trainerId);
      event.capacity = capacity;
      event.room = await room.findOne(roomId);

      console.log("updated LMAO   " + req.params.eventId);
      await repo.save(event);
      return res.send(event);
    } else res.status(400).send("Event nie znaleziony!!!!");
  }

  async deleteByIdentifier(req: Request, res: Response) {
    const repo = getManager().getRepository(Event);
    const event = await repo.findOne({
      where: { identifier: req.params.identifier },
    });

    await repo.delete(event.id);

    return res.send(event);
  }

  async delete(req: Request, res: Response) {
    const repo = getManager().getRepository(Event);
    const object = await repo.findOne(req.params.eventId);

    await repo.delete(req.params.eventId);

    return res
      .set({
        "Content-Type": "application/json",
      })
      .send(object);
  }
}
