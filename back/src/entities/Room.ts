import { Column, PrimaryGeneratedColumn, Entity, OneToMany } from "typeorm";
import { Event } from "./Event";

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  roomName: string;

  @Column()
  roomNumber: number;

  @OneToMany(() => Event, (ev) => ev.id)
  events: Event[];
}
