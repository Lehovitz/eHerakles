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
  id: number;

  @Column({ nullable: true })
  capacity?: number;

  @Column({ nullable: true })
  exDate?: string;

  @Column({ nullable: true })
  rule?: string;

  @Column()
  identifier: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  dateStart: Date;

  @Column()
  dateEnd: Date;

  @Column({ nullable: true })
  isAllDay?: Boolean;

  @ManyToOne((type) => Trainer, (trainer) => trainer.TrainerId)
  trainer: Trainer;

  @ManyToOne((type) => Room, (room) => room.RoomId)
  room: Room;

  @ManyToMany((type) => Customer, (customer) => customer.CustId)
  @JoinTable()
  customers: Customer[];
}
