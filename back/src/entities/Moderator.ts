import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from "typeorm";
import { Location } from "./Location";
import { Person } from "./Person";

@Entity()
export class Moderator {
  @PrimaryGeneratedColumn()
  ModId: number;

  @Column()
  ModMail: string;

  @Column()
  ModPass: string;

  @Column()
  IsAdmin: boolean;

  @OneToOne((type) => Person, (pers) => pers.PersonId, { cascade: true })
  @JoinColumn()
  Person: Person;
}
