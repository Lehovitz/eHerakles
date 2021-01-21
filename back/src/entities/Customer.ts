import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    JoinColumn,
    OneToMany,
    ManyToMany,
    OneToOne,
} from "typeorm";
import { Person } from "./Person";
import { Card } from "./Card";
import { Event } from "./Event";
import { Payment } from "./Payment";
import { Goal } from "./Category";

@Entity()
export class Customer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({nullable: true})
    accountNumber: string;

    @Column({
        type: "enum",
        enum: Goal,
        default: Goal.GetFit,
    })
    goal: Goal;

    @OneToOne(() => Person, (pers) => pers.id)
    @JoinColumn()
    person: Person;

    @ManyToMany(() => Event, (cl) => cl.id)
    classes: Event[];

    @OneToOne(() => Card, (card) => card.id)
    card: Card;
    

    @OneToMany(() => Payment, (paym) => paym.id)
    payment: Payment[];
}
