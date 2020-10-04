import { Room } from "./Room";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { Trainer } from "./Trainer";
import { Customer } from "./Customer";

@Entity()
export class Class {
  @PrimaryGeneratedColumn()
  ClassId: number;

  @Column()
  Capacity: number;

  @Column()
  PlacesTaken: number;

  @Column()
  Name: string;

  @Column()
  Description: string;

  @Column()
  DateStart: Date;

  @Column()
  DateEnd: Date;

  @ManyToOne(
    (type) => Trainer,
    (trainer) => trainer.TrainerId
  )
  Trainer: number;

  @ManyToOne(
    (type) => Room,
    (room) => room.RoomId
  )
  Room: Room;

  @ManyToMany(
    (type) => Customer,
    (customer) => customer.CustId
  )
  @JoinTable()
  Customers: Customer[];
}
