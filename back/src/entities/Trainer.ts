import { Location } from "./Location";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToMany,
  ManyToOne,
  OneToOne,
} from "typeorm";
import { Card } from "./Card";
import { Person } from "./Person";

@Entity()
export class Trainer {
  @PrimaryGeneratedColumn()
  TrainerId: number;

  @Column()
  TrainerMail: string;

  @Column()
  TrainerPass: string;

  @Column()
  CardId: number;

  @OneToOne(
    (type) => Person,
    (pers) => pers.PersonId
  )
  @JoinColumn()
  Person: Person;

  @OneToMany(
    (type) => Card,
    (card) => card.CardId
  )
  Cards: Card[];
}
