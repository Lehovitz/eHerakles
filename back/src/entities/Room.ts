import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from "typeorm";
import { Gym } from "./Gym";
import { type } from "os";
import { Event } from "./Event";

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  RoomId: number;

  @Column()
  RoomName: string;

  @Column()
  RoomNumber: number;

  // @ManyToOne(
  //   (type) => Gym,
  //   (gym) => gym.GymId
  // )
  // Gym: Gym;

  @OneToMany(
    (type) => Event,
    (ev) => ev.id
  )
  events: Event[];
}
