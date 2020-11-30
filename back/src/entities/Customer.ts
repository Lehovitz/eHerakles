import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  OneToMany,
  JoinTable,
  ManyToMany,
  OneToOne,
} from "typeorm";
import { Person } from "./Person";
import { Card } from "./Card";
import { Event } from "./Event";

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  CustId: number;

  @Column()
  CustMail: string;

  @Column()
  CustPass: string;

  @OneToOne((type) => Person, (pers) => pers.PersonId)
  @JoinColumn()
  Person: Person;

  @ManyToMany((type) => Event, (cl) => cl.id)
  classes: Event[];

  @OneToMany((type) => Card, (card) => card.CardId)
  Cards: Card[];
}
