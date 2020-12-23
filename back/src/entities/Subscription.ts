import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToOne, RelationId, OneToMany } from "typeorm";
import { Card } from "./Card";
import { Customer } from "./Customer";
import { Trainer } from "./Trainer";

@Entity()
export class Subscription {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  period: number;

  @Column()
  name: string;

  @Column({type: 'decimal', precision:6, scale: 2})
  cost: Number;

  @OneToMany(() => Card, (card) => card.subscription)
  card: Card[];
}
