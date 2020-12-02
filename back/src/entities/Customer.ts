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

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  custMail: string;

  @Column()
  custPass: string;

  @OneToOne(() => Person, (pers) => pers.id)
  @JoinColumn()
  person: Person;

  @ManyToMany(() => Event, (cl) => cl.id)
  classes: Event[];

  @OneToMany(() => Card, (card) => card.id)
  cards: Card[];
}
