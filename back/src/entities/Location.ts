import { Column, PrimaryGeneratedColumn, Entity, OneToOne } from "typeorm";
import { Person } from "./Person";

@Entity()
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  country: string;

  @Column()
  city: string;

  @Column()
  postalCode: string;

  @OneToOne(() => Person, (pers) => pers.id, { cascade: true })
  person: Person;
}
