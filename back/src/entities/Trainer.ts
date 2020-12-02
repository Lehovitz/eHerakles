import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToMany,
  OneToOne,
} from "typeorm";
import { Card } from "./Card";
import { Person } from "./Person";

@Entity()
export class Trainer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  trainerMail: string;

  @Column()
  trainerPass: string;

  @OneToOne(() => Person, (pers) => pers.id)
  @JoinColumn()
  person: Person;

  @OneToMany(() => Card, (card) => card.id)
  cards: Card[];
}
