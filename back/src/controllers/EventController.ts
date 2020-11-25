import { Request, Response } from "express";
import { getManager } from "typeorm";
import { Event } from "../entities/Event";
import { Location } from "../entities/Location";
import { Room } from "../entities/Room";
import { Trainer } from "../entities/Trainer";
export default class EventController {
  async create(req: Request, res: Response) {
    const { title, id, startDate, endDate, trainerId, allDay, notes, roomId, rRule, exDate, capacity } = req.body;

    console.log(req.body);

    const repo = getManager().getRepository(Event);
    const trainer = getManager().getRepository(Trainer);
    const room = getManager().getRepository(Room);
    
      const event = new Event();
      event.Identifier = id;
      event.DateStart = startDate;
      event.DateEnd = endDate;
      event.Title = title;
      event.IsAllDay = Boolean(allDay);
      event.Description = notes;
      event.Rule = rRule;
      console.log(exDate);
      event.ExDate = exDate;
      event.Trainer = await trainer.findOne(trainerId);
      event.Capacity = capacity;
      //event.Room = await room.findOne(roomId);

      console.log("utworzono nowe zajecia");
      await repo.save(event);
      res.send();
    
  }
  
  async readAll(req: Request, res: Response) {
    const repo = getManager().getRepository(Event);
    let event = await repo.find();
    res.send(event);
  }
  async update(req: Request, res: Response) {
    const { title, id, startDate, endDate, trainerId, allDay, notes, roomId, rRule, exDate, capacity } = req.body;
    const repo = getManager().getRepository(Event);
    let event = await repo.findOne({ where: {Identifier: req.params.eventId} });

    if(event)
    {
    const repo = getManager().getRepository(Event);
    const trainer = getManager().getRepository(Trainer);
    const room = getManager().getRepository(Room);
    
      event.Identifier = id;
      event.DateStart = startDate;
      event.DateEnd = endDate;
      event.Title = title;
      event.IsAllDay = Boolean(allDay);
      event.Description = notes;
      event.Rule = rRule;
      event.ExDate = exDate;
      event.Trainer = await trainer.findOne(trainerId);
      event.Capacity = capacity;
      event.Room = await room.findOne(roomId);

      console.log("utworzono nowe zajecia");
      await repo.save(event);
      res.send();
    }
    else res.send(new Error("Event nie znaleziony!!!!"))
  }
  async delete(req: Request, res: Response) {
    const repo = getManager().getRepository(Event);
    await repo.delete(req.params.eventId);
    res.send();
  }
}
