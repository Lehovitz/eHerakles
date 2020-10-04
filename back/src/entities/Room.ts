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
import { Class } from "./Class";

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  RoomId: number;

  @Column()
  RoomName: string;

  @Column()
  RoomNumber: number;

  @ManyToOne(
    (type) => Gym,
    (gym) => gym.GymId
  )
  Gym: Gym;

  @OneToMany(
    (type) => Class,
    (cl) => cl.ClassId
  )
  classes: Class[];
}
