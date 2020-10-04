import { Trainer } from "./Trainer";
import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  OneToMany,
  OneToOne,
} from "typeorm";
import { Gym } from "./Gym";
import { Person } from "./Person";

@Entity()
export class Location {
  @PrimaryGeneratedColumn()
  LocationId: number;

  @Column()
  Country: string;

  @Column()
  City: string;

  @OneToMany(
    (type) => Gym,
    (gym) => gym.GymId
  )
  gyms: Gym[];

  @OneToOne(
    (type) => Person,
    (pers) => pers.PersonId
  )
  Person: Person;
}
