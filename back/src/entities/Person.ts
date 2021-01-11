import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
} from "typeorm";
import { Location } from "./Location";
import { Customer } from "./Customer";
import { Trainer } from "./Trainer";
import { Moderator } from "./Moderator";

export enum Gender {
  Male = "M",
  Female = "F",
  Other = "O",
}

export enum DocumentType {
  Passport = "Passport",
  IdCard = "IdCard",
}

@Entity()
export class Person {
  @PrimaryGeneratedColumn()
  id: number;

  @Column(  )
  surname: string;

  @Column()
  name: string;

  @Column("enum", { enum: Gender, default: Gender.Other})
  gender: Gender;

  @Column()
  birthDate: Date;

  @Column()
  phoneNum: string;

  @Column()
  pesel: string;

  @Column()
  address: string;

  @ManyToOne(() => Location, (location) => location.id, {
    cascade: true,
  })
  location: Location;

  @OneToOne(() => Customer, (cust) => cust.id)
  customer: Customer;

  @OneToOne(() => Trainer, (train) => train.id)
  trainer: Trainer;

  @OneToOne(() => Moderator, (mod) => mod.id, { cascade: true })
  moderator: Moderator;
}
