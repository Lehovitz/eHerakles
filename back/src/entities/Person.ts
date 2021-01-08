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

  @Column( { nullable: true} )
  surname: string;

  @Column( { nullable: true} )
  name: string;

  @Column("enum", { enum: Gender, nullable: true})
  gender: Gender;

  @Column( { nullable: true} )
  birthDate: Date;

  @Column( { nullable: true} )
  phoneNum: string;

  @Column( { nullable: true} )
  pesel: string;

  @Column( { nullable: true} )
  address: string;

  @ManyToOne(() => Location, (location) => location.id, {
    cascade: true,
    nullable: true,
  })
  location: Location;

  @OneToOne(() => Customer, (cust) => cust.id)
  customer: Customer;

  @OneToOne(() => Trainer, (train) => train.id)
  trainer: Trainer;

  @OneToOne(() => Moderator, (mod) => mod.id, { cascade: true })
  moderator: Moderator;
}
