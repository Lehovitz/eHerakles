import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
} from "typeorm";
import { Person } from "./Person";

@Entity()
export class Moderator {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  modMail: string;

  @Column()
  modPass: string;

  @Column()
  isAdmin: boolean;

  @OneToOne(() => Person, (pers) => pers.id, { cascade: true })
  @JoinColumn()
  person: Person;
}
