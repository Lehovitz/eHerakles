import { Room } from "./Room";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
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

  @ManyToOne(() => Trainer, (trainer) => trainer.id)
  trainer: Trainer;

  @ManyToOne(() => Room, (room) => room.id)
  room: Room;

  @ManyToMany(() => Customer, (customer) => customer.id)
  @JoinTable()
  customers: Customer[];
}
