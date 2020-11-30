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

  @Column()
  PostalCode: string;

  @OneToMany((type) => Gym, (gym) => gym.GymId)
  gyms: Gym[];

  @OneToOne((type) => Person, (pers) => pers.PersonId, { cascade: true })
  Person: Person;
}
