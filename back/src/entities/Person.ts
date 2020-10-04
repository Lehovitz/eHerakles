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
import { Class } from "./Class";
import { type } from "os";
import { Customer } from "./Customer";
import { Trainer } from "./Trainer";
import { Moderator } from "./Moderator";

@Entity()
export class Person {
  @PrimaryGeneratedColumn()
  PersonId: number;

  @Column()
  Surname: string;

  @Column()
  Name: string;

  @Column()
  BirthDate: Date;

  @Column()
  DocNumber: string;

  @Column()
  ContactPref: number;

  @Column()
  PhoneNum: string;

  @Column()
  Address: string;

  @ManyToOne(
    (type) => Location,
    (location) => location.LocationId
  )
  Location: Location;

  @OneToOne(
    (type) => Customer,
    (cust) => cust.CustId
  )
  Customer: Customer;

  @OneToOne(
    (type) => Trainer,
    (train) => train.TrainerId
  )
  Trainer: Trainer;

  @OneToOne(
    (type) => Moderator,
    (mod) => mod.ModId
  )
  Moderator: Moderator;
}
