import { Request, Response } from "express";
import { getManager } from "typeorm";
import { Card } from "../entities/Card";
import { Customer } from "../entities/Customer";
import { Payment } from "../entities/Payment";
import { Subscription } from "../entities/Subscription";
import clean from "../utils/clean";
import addMonths from "../utils/addMonths";

export default class CardController {
  async findCardByEmail(req: Request, res: Response) {
    const { email } = req.params;
    const cardRepo = getManager().getRepository(Card);
    const custRepo = getManager().getRepository(Customer);

    let cust = await custRepo.findOne({
      where: { email: email },
    });

    let card = await cardRepo.findOne({ where: { customer: cust } });

    if (card) {
      return res.status(200).send(card);
    } else {
      res.status(400).send();
    }
  }

  async create(req: Request, res: Response) {
    const { customer } = req.body;
    const cardRepo = getManager().getRepository(Card);
    const custRepo = getManager().getRepository(Customer);

    let cust = await custRepo.findOne({
      where: { id: customer },
    });

    let card = await cardRepo.findOne({ where: { customer: customer } });
    if (cust) {
      if (!card) {
        const card = new Card();
        console.log("utworzono nowy karnet ");

        card.customer = cust;
        card.isActive = false;
        //card.sub = SubscriptionType.None;
        card.due = 0;
        card.expDate = new Date();
        await cardRepo.save(card);

        res.send(card);
      } else res.status(400).send();
    } else {
      console.log("nie ma takiego klienta");
      res.status(400).send();
    }
  }

  async createWithSub(req: Request, res: Response) {
    const { custId, subId  } = req.body;
    const cardRepo = getManager().getRepository(Card);
    const custRepo = getManager().getRepository(Customer);
    const subRepo = getManager().getRepository(Subscription);
    const paymRepo = getManager().getRepository(Payment);


    let cust = await custRepo.findOne({
      where: { id: custId },
    });
    let card = await cardRepo.findOne({ where: { customer: cust } });
    if (cust) {
      const sub = await subRepo.findOne({where: {id: subId}});
      if (!card) {

        const card = new Card();
        const payment = new Payment();

        card.customer = cust;
        card.isActive = false;
        card.subscription = sub;
        card.due = sub.cost;
        card.expDate = new Date();
        
        //var newDate = addMonths(card.expDate, sub.period);

        payment.paymentDate = new Date();
        payment.dueDate = card.expDate;
        payment.due = sub.cost;
        payment.customer = cust;
        payment.period = sub.period;

        await cardRepo.save(card);
        await paymRepo.save(payment);
        res.send(card);
      } 
      else
      {
        card.subscription = sub;
        card.due = parseFloat(card.due.toString()) + parseFloat(sub.cost.toString());
        await cardRepo.save(card);
        var newDate = addMonths(card.expDate, sub.period);
        const payment = new Payment();

        payment.paymentDate = new Date();
        payment.dueDate = newDate;
        payment.due = sub.cost;
        payment.customer = cust;
        payment.period = sub.period;

        res.send(card);
        await paymRepo.save(payment);
      }
    } else {
      res.status(400).send();
    }
  }

  async readAll(req: Request, res: Response) {
    const repo = getManager().getRepository(Card);

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
      .createQueryBuilder("card")
      .leftJoinAndSelect("card.customer", "customer")
      .leftJoinAndSelect("card.subscription", "subscription")
      .orderBy(`customer.${sort[0]}`, sort[1])
      .skip(skip)
      .take(take)
      .getMany();

    // Filtrowanie encji
    const filteredData = data.filter((elem) => {
      for (let filter of Object.keys(filters)) {
        if (elem[filter] != filters[filter]) return false;
      }

      return true;
    });

    // Usuwanie pól będących nullami / undefined
    filteredData.forEach((elem) => clean(elem));
    // Wyciąganie tylko istotnych pól
    const result = [];

    for (let elem of filteredData) {
      const { customer, subscription } = elem;

      if (customer) {
        // delete customer.email;
        delete customer.password;
        delete customer.id;
      }

      if (subscription) {
        delete subscription.id;
      }

      result.push({ ...elem, ...customer, ...subscription });
    }

    res
      .set({
        "Content-Range": `cards ${range[0]}-${range[1]}/${result.length}`,
        "Access-Control-Expose-Headers": "Content-Range",
      })
      .send(result);
  }

  async findByEmail(req: Request, res: Response) {
    const repo = getManager().getRepository(Card);
    const card = await repo
      .createQueryBuilder("card")
      .leftJoinAndSelect("card.customer", "customer")
      .leftJoinAndSelect("card.subscription", "subscription")
      .where("customer.email = :email", { email: req.params.email })
      .getOne();

    if (card) {
      const { customer } = card;
      const {subscription} = card;

      delete customer.id;
      delete customer.password;
      subscription && delete subscription.id;

      return res.status(200).send({ ...card, ...customer, ...subscription});
    } else res.status(400).send();
  }

  async readOne(req: Request, res: Response) {
    const repo = getManager().getRepository(Card);
    const card = await repo
      .createQueryBuilder("card")
      .leftJoinAndSelect("card.customer", "customer")
      .where("card.id = :id", { id: req.params.id })
      .getOne();

    if (card) {
      const { customer } = card;
      return res.status(200).send({ ...card, ...customer });
    } else res.status(400).send();
  }

  async update(req: Request, res: Response) {
    const { isActive, subscription, due, expDate, customer } = req.body;
    const repo = getManager().getRepository(Card);

    const card = await repo
      .createQueryBuilder("card")
      .leftJoinAndSelect("card.customer", "customer")
      .where("card.id = :id", { id: req.params.id })
      .getOne();

    if (card) {
      card.isActive = isActive;
      card.subscription = subscription;
      card.due = due;
      card.expDate = expDate;
      card.customer = customer;
      await repo.save(card);
      res.status(200).send(card);
    } else {
      res.status(400).send();
    }
  }

  async delete(req: Request, res: Response) {
    const repo = getManager().getRepository(Card);
    const object = await repo.findOne(req.params.id);

    await repo.delete(req.params.id);

    return res
      .set({
        "Content-Type": "application/json",
      })
      .send(object);
  }
}
