import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToOne, RelationId, OneToMany } from "typeorm";
import { Customer } from "./Customer";

export enum Status {
  Started = "S",
  Pending = "P",
  Finalized = "F",
  Rejected = "R",
}

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  paymentDate: Date;

  @Column()
  dueDate: Date;

  
  @Column(
    {
    type: "enum",
    enum: Status,
    default: Status.Started
    }
  )
  status: Status;

  @Column({type: 'decimal', precision:6, scale: 2})
  due: Number;

  @ManyToOne(() => Customer, (cust) => cust.id)
  @JoinColumn({ name: "customer" })
  customer: Customer;
  
}
