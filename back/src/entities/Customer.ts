import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToMany,
  ManyToMany,
  OneToOne,
} from "typeorm";
import { Person } from "./Person";
import { Card } from "./Card";
import { Event } from "./Event";
import { Payment } from "./Payment";


export enum Goal {
  MuscleMass = "M",
  GetFit = "Fit",
  Reduction = "Rd",
  Relaxation = "Rel",
}

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToOne(() => Person, (pers) => pers.id)
  @JoinColumn()
  person: Person;

  @ManyToMany(() => Event, (cl) => cl.id)
  classes: Event[];

  @OneToOne(() => Card, (card) => card.id)
  card: Card;

  @OneToMany(() => Payment, (paym) => paym.id)
  payment: Payment[];
}
