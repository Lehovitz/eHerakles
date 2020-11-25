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
export class Event {
  @PrimaryGeneratedColumn()
  EventId: number;

  @Column({nullable: true})
  Capacity?: number;

  @Column({nullable: true})
  ExDate?: string;

  @Column({nullable: true})
  Rule?: string;

  @Column()
  Identifier: number;

  @Column()
  Title: string;

  @Column({nullable: true})
  Description?: string;

  @Column()
  DateStart: Date;

  @Column()
  DateEnd: Date;

  @Column({nullable: true})
  IsAllDay?: Boolean;

  @ManyToOne(
    (type) => Trainer,
    (trainer) => trainer.TrainerId
  )
  Trainer: Trainer;

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
