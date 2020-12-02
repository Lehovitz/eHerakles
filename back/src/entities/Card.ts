import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Customer } from "./Customer";
import { Trainer } from "./Trainer";

@Entity()
export class Card {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  role: number;

  @Column()
  isActive: boolean;

  @ManyToOne(() => Customer, (cust) => cust.id)
  customer: Customer;

  @ManyToOne(() => Trainer, (train) => train.id)
  trainer: Trainer;
}
