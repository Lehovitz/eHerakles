import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToOne, RelationId } from "typeorm";
import { Customer } from "./Customer";
import { Subscription } from "./Subscription";
import { Trainer } from "./Trainer";

export enum SubscriptionType {
  Monthly = "M",
  Quaterly = "Q",
  Semestral = "S",
  Yearly = "Y",
  None = "N",
}
@Entity()
export class Card {
  @PrimaryGeneratedColumn()
  id: number;

  // @Column()
  // role: number;

  @Column()
  isActive: boolean;


  @Column({type: 'decimal', precision:6, scale: 2})
  due: Number;

  @Column()
  expDate: Date;

  
  @ManyToOne(() => Subscription, (sub) => sub.id)
  @JoinColumn({ name: "subscriptionId" })
  subscription: Subscription;

  @OneToOne(() => Customer, (cust) => cust.id)
  @JoinColumn()
  customer: Customer;


  // @ManyToOne(() => Trainer, (train) => train.id)
  // trainer: Trainer;
}
