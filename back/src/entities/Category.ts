import { Column, PrimaryGeneratedColumn, Entity, OneToMany } from "typeorm";
import { Event } from "./Event";

export enum Goal {
    MuscleMass = "M",
    GetFit = "Fit",
    Reduction = "Rd",
    Relaxation = "Rel",
}

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({
        type: "enum",
        enum: Goal,
        default: Goal.GetFit,
    })
    goal: Goal;

    @OneToMany(() => Event, (ev) => ev.id)
    events: Event[];
}
