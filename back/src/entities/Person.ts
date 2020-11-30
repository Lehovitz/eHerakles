import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  OneToMany,
  JoinTable,
  ManyToMany,
  OneToOne,
} from "typeorm";
import { Location } from "./Location";
import { Card } from "./Card";
import { type } from "os";
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
  PersonId: number;

  @Column()
  Surname: string;

  @Column()
  Name: string;

  @Column("enum", { enum: Gender })
  Gender: Gender;

  @Column()
  BirthDate: Date;

  @Column("enum", { enum: DocumentType })
  DocType: DocumentType;

  @Column()
  DocNumber: string;

  @Column()
  PhoneNum: string;

  @Column()
  PESEL: string;

  @Column()
  Address: string;

  @ManyToOne((type) => Location, (location) => location.LocationId, {
    cascade: true,
  })
  Location: Location;

  @OneToOne((type) => Customer, (cust) => cust.CustId)
  Customer: Customer;

  @OneToOne((type) => Trainer, (train) => train.TrainerId)
  Trainer: Trainer;

  @OneToOne((type) => Moderator, (mod) => mod.ModId, { cascade: true })
  Moderator: Moderator;
}
