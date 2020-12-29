import { Room } from "./Room";
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    ManyToMany,
    JoinTable,
    Unique,
    JoinColumn,
    RelationId,
} from "typeorm";
import { Trainer } from "./Trainer";
import { Customer } from "./Customer";

@Unique(["identifier"])
@Entity()
export class Event {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true, default: 20 })
    capacity?: number;

    @Column({ nullable: true })
    exDate?: string;

    @Column({ nullable: true })
    rule?: string;

    @Column()
    identifier: number;

    @Column()
    title: string;

    @Column({ nullable: true })
    description?: string;

    @Column()
    dateStart: Date;

    @Column()
    dateEnd: Date;

    @Column({ nullable: true })
    isAllDay?: Boolean;

    @ManyToOne(() => Trainer, (trainer) => trainer.id)
    @JoinColumn({ name: "trainerId" })
    trainer: Trainer;

    @RelationId((event: Event) => event.trainer)
    trainerId: number;

    @ManyToOne(() => Room, (room) => room.id)
    @JoinColumn({ name: "roomId" })
    room: Room;

    @RelationId((event: Event) => event.room)
    roomId: number;

    @ManyToMany(() => Customer, (customer) => customer.id)
    @JoinTable()
    customers: Customer[];
}
