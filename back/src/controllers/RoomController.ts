import { Request, Response } from "express";
import { getManager } from "typeorm";
import { Room } from "../entities/Room";

export default class RoomController {
  async create(req: Request, res: Response) {
    const { name, number } = req.body;

    const roomRepo = getManager().getRepository(Room);

    let room = await roomRepo.findOne({
      where: { RoomName: name, RoomNumber: number },
    });

    if (!room) {
      const room = new Room();
      room.roomNumber = number;
      room.roomName = name;
      console.log("utworzono nowy pokoj ");
      await roomRepo.save(room);
      res.send();
    }
  }

  async readAll(req: Request, res: Response) {
    const repo = getManager().getRepository(Room);
    let room = await repo.find();
    res.send(room);
  }
}
