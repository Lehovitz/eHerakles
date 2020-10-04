import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  JoinColumn,
  OneToMany,
  ManyToOne,
  OneToOne,
} from "typeorm";
import { Location } from "./Location";
import { Card } from "./Card";
import { Person } from "./Person";

@Entity()
export class Gym {
  @PrimaryGeneratedColumn()
  GymId: number;

  @Column()
  GymName: string;

  @Column()
  GymAddress: string;

  @ManyToOne(
    (type) => Location,
    (location) => location.LocationId
  )
  GymLocation: Location;

  @OneToMany(
    (type) => Card,
    (card) => card.CardId
  )
  Cards: Card[];

  // @OneToMany(
  //   (type) => Gym,
  //   (gym) => gym.GymId
  // )
  // Gyms: Gym[];

  @JoinColumn()
  Person: Person;
}
