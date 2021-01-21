import { Request, Response } from "express";
import { getManager } from "typeorm";
import { Category } from "../entities/Category";
import { Customer } from "../entities/Customer";
import { Event } from "../entities/Event";
import { Room } from "../entities/Room";
import { Trainer } from "../entities/Trainer";
import clean from "../utils/clean";

export default class EventController {
    async create(req: Request, res: Response) {
        const {
            title,
            identifier,
            startDate,
            endDate,
            trainerId,
            allDay,
            notes,
            roomId,
            rRule,
            exDate,
            capacity,
            categoryId,
            isAccepted
        } = req.body;

        const repo = getManager().getRepository(Event);
        const trainer = getManager().getRepository(Trainer);
        const room = getManager().getRepository(Room);
        const cat = getManager().getRepository(Category);

        const event = new Event();
        event.identifier = identifier;
        event.dateStart = startDate;
        event.dateEnd = endDate;
        event.title = title;
        event.isAllDay = Boolean(allDay);
        event.description = notes;
        event.rule = rRule;
        event.exDate = exDate;
        event.isAccepted = true;
        event.trainer = await trainer.findOne(trainerId);
        event.capacity = capacity;
        event.room = await room.findOne(roomId);
        event.category = await cat.findOne(categoryId);

        console.log("utworzono nowe zajecia");
        await repo.save(event);
        return res.send(event);
    }

    async readAll(req: Request, res: Response) {
        const repo = getManager().getRepository(Event);

        let { sort, filters, range } = req.query;

        sort = sort ? JSON.parse(sort.toString()) : ["id", "ASC"];
        filters = filters ? JSON.parse(filters.toString()) : {};
        range = range ? JSON.parse(range.toString()) : [0, 1000000];

        // Parametry metody find używanej poniżej
        const order = {};
        order[sort[0]] = sort[1];

        const skip = +range[0];
        const take = +range[1] - +range[0];

        // Wybieranie zakresu i sortowanie na podstawie wyżej podanych parametrów
        let data = await repo
            .createQueryBuilder("event")
            .leftJoinAndSelect("event.customers", "customers")
            .leftJoinAndSelect("event.category", "category")
            .orderBy(`event.${sort[0]}`, sort[1])
            .skip(skip)
            .take(take)
            .getMany();

        // Filtrowanie encji
        const filteredData = data.filter((event) => {
            for (let filter of Object.keys(filters)) {
                if (event[filter] != filters[filter]) return false;
            }

            return true;
        });

        const result = [];

        for (let event of filteredData) {
            const customers = event.customers.map((cust) => cust.email);
            delete event.customers;

            const goal = event.category ? event.category.goal : undefined;

            result.push({ ...event, customers, goal });
        }

        // Usuwanie pól będących nullami / undefined
        result.forEach((elem) => clean(elem));

        // Wysyłanie odpowiedzi z dwoma obowiązkowymi nagłówkami
        res.set({
            "Content-Range": `events ${range[0]}-${range[1]}/${result.length}`,
            "Access-Control-Expose-Headers": "Content-Range",
        }).send(result);
    }

    async readOne(req: Request, res: Response) {
        const repo = getManager().getRepository(Event);
        const data = await repo.findOne(req.params.eventId);
        return res.status(200).send(data);
    }

    async getNextIndex(_req: Request, res: Response) {
        const repo = getManager().getRepository(Event);
        let lastRec = await repo.find({
            order: {
                identifier: "DESC",
            },
            take: 1,
        });
        let lastIndex = lastRec.length === 0 ? 0 : lastRec[0].identifier + 1;
        return res.send({ lastIndex });
    }

    async update(req: Request, res: Response) {
        const {
            title,
            identifier,
            startDate,
            endDate,
            trainerId,
            allDay,
            notes,
            roomId,
            rRule,
            exDate,
            capacity,
            categoryId,
            isAccepted
        } = req.body;
        const repo = getManager().getRepository(Event);

        const idType = req.header("X-Identifier-Type");

        let event = await repo.findOne({
            where:
                idType === "Identifier"
                    ? { identifier: req.params.eventId }
                    : { id: req.params.eventId },
        });

        if (event) {
            const repo = getManager().getRepository(Event);
            const trainer = getManager().getRepository(Trainer);
            const room = getManager().getRepository(Room);
            const cat = getManager().getRepository(Category);

            event.identifier = identifier;
            event.dateStart = startDate;
            event.dateEnd = endDate;
            event.title = title;
            event.isAllDay = Boolean(allDay);
            event.isAccepted = isAccepted;
            event.description = notes;
            event.rule = rRule;
            event.exDate = exDate;
            event.trainer = await trainer.findOne(trainerId);
            event.capacity = capacity;
            event.room = await room.findOne(roomId);
            event.category = await cat.findOne(categoryId);

            await repo.save(event);
            return res.send(event);
        } else res.status(400).send("Event nie znaleziony!!!!");
    }

    async deleteByIdentifier(req: Request, res: Response) {
        const repo = getManager().getRepository(Event);
        const event = await repo.findOne({
            where: { identifier: req.params.identifier },
        });

        await repo.delete(event.id);

        return res.send(event);
    }

    async delete(req: Request, res: Response) {
        const repo = getManager().getRepository(Event);
        const object = await repo.findOne(req.params.eventId);

        await repo.delete(req.params.eventId);

        return res
            .set({
                "Content-Type": "application/json",
            })
            .send(object);
    }

    async assignCustomer(req: Request, res: Response) {
        const { identifier, email } = req.params;

        const repo = getManager().getRepository(Event);
        const custRepo = getManager().getRepository(Customer);

        const event = await repo
            .createQueryBuilder("event")
            .leftJoinAndSelect("event.customers", "customers")
            .where("event.identifier = :identifier", { identifier })
            .getOne();
        const customer = await custRepo.findOne({ where: { email } });

        if (event && customer) {
            event.customers.push(customer);
            await repo.save(event);
            res.status(200).send();
        } else res.status(400).send();
    }
}
