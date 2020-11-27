import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from "typeorm";
import { Gym } from "./Gym";
import { Customer } from "./Customer";
import { Trainer } from "./Trainer";

@Entity()
export class Card {
  @PrimaryGeneratedColumn()
  CardId: number;

  @Column()
  Role: number;

  @Column()
  IsActive: boolean;

  @ManyToOne((type) => Gym, (gym) => gym.GymId)
  Gym: Gym;

  @ManyToOne((type) => Customer, (cust) => cust.CustId)
  Customer: Customer;

  @ManyToOne((type) => Trainer, (train) => train.TrainerId)
  Trainer: Trainer;
}
