import { Request, Response } from "express";
import { getManager } from "typeorm";
import { Customer } from "../entities/Customer";
import { Payment, Status } from "../entities/Payment";

import clean from "../utils/clean";

export default class PaymentController {
  async create(req: Request, res: Response) {
    const { due, status, paymentDate, customer, dueDate, period } = req.body;
    const repo = getManager().getRepository(Payment);

    let payment = await repo.findOne({
      where: { customer: customer, paymentDate:paymentDate, due: due, status:status},
    });

    console.log(req.body);

    if (!payment) {
      payment = new Payment();
      payment.customer = customer;
      payment.paymentDate = paymentDate;
      payment.due = due;
      payment.dueDate = dueDate;
      payment.period = period;

      console.log("utworzono nowa platnosc");
      await repo.save(payment);
      res.send(payment);
    } else {
      res.status(400).send("Taka Platnosc juz istnieje :3");
    }
  }

  async createWithCustId(req: Request, res: Response) {
    const { due, status, paymentDate, custId, dueDate, period } = req.body;
    const repo = getManager().getRepository(Payment);
    const custRepo = getManager().getRepository(Customer);

    const cust = await custRepo.findOne({ id: custId });
    let payment = null;
    if(cust)
    {
      payment = await repo.findOne({
      where: { customer: cust, paymentDate:paymentDate, due: due, status:status, period:period},
    });
    }
    console.log(req.body);

    if (!payment) {
      payment = new Payment();
      payment.customer = cust;
      payment.paymentDate = paymentDate;
      payment.due = due;
      payment.dueDate = dueDate;
      payment.period = period;

      console.log("utworzono nowa platnosc");
      await repo.save(payment);
      res.send(payment);
    } else {
      res.status(400).send("Taka Platnosc juz istnieje :3");
    }
  }

  async readOne(req: Request, res: Response) {
    const repo = getManager().getRepository(Payment);
    const payment = await repo
    .createQueryBuilder("payment")
    .leftJoinAndSelect("payment.customer", "customer")
    .where("payment.id = :id", { id: req.params.id })
    .getOne();

  if (payment) {
    const { customer } = payment;
    return res.status(200).send({ ...payment, ...customer });
  } else res.status(400).send();
}

  async readAll(req: Request, res: Response) {
    console.log("readAll payment");
    const repo = getManager().getRepository(Payment);

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
    
    // let data = await repo.find({ order, skip, take });

    let data = await repo
    .createQueryBuilder("payment")
    .leftJoinAndSelect("payment.customer", "customer")
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

    const result =[];

    // Usuwanie pól będących nullami / undefined
    filteredData.forEach((elem) => clean(elem));

    for (let elem of filteredData) {
      const { customer} = elem;

      if (customer) {
        delete customer.password;
        delete customer.id;
      }
      result.push({ ...elem, ...customer });

    }

    // Wysyłanie odpowiedzi z dwoma obowiązkowymi nagłówkami, w pierwszym trzeba zmienić nazwę encji
    res
      .set({
        "Content-Range": `payments ${range[0]}-${range[1]}/${result.length}`,
        "Access-Control-Expose-Headers": "Content-Range",
      })
      .send(result);
  }

  async update(req: Request, res: Response) {
    const { due, status, paymentDate, dueDate, period } = req.body;

    const repo = getManager().getRepository(Payment);

    let payment = await repo.findOne(req.params.id);

    if (payment) {
      payment.due = due;
      payment.status = status;
      payment.paymentDate = paymentDate;
      payment.dueDate = dueDate;

      console.log("zaktualizowano platnosc");
      await repo.save(payment);
      res.send();
    } else {
      res.status(400).send("Taka Platnosc nie istnieje :(");
    }
  }

  async delete(req: Request, res: Response) {
    const repo = getManager().getRepository(Payment);
    const object = await repo.findOne(req.params.id);

    await repo.delete(req.params.id);

    return res
      .set({
        "Content-Type": "application/json",
      })
      .send(object);
  }

  async readAllPending(req: Request, res: Response) {
    const repo = getManager().getRepository(Payment);

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
    
    // let data = await repo.find({ order, skip, take });

    let data = await repo
    .createQueryBuilder("payment")
    .leftJoinAndSelect("payment.customer", "customer").
    where("payment.status = :status", { status: Status.Pending  })
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

    const result =[];

    // Usuwanie pól będących nullami / undefined
    filteredData.forEach((elem) => clean(elem));

    for (let elem of filteredData) {
      const { customer} = elem;

      if (customer) {
        delete customer.password;
        delete customer.id;
      }
      result.push({ ...elem, ...customer });

    }

    // Wysyłanie odpowiedzi z dwoma obowiązkowymi nagłówkami, w pierwszym trzeba zmienić nazwę encji
    res
      .set({
        "Content-Range": `payments ${range[0]}-${range[1]}/${result.length}`,
        "Access-Control-Expose-Headers": "Content-Range",
      })
      .send(result);
  }

  async acceptPayment(req: Request, res: Response) {
    const repo = getManager().getRepository(Payment);
    let payment = await repo.findOne(req.params.id);

    if (payment) {
      payment.status = Status.Finalized;
      console.log("zaktualizowano platnosc");
      await repo.save(payment);
      res.send();
    } else {
      res.status(400).send("Taka Platnosc nie istnieje :(");
    }
  }

  async rejectPayment(req: Request, res: Response) {
    const repo = getManager().getRepository(Payment);
    let payment = await repo.findOne(req.params.id);

    if (payment) {
      payment.status = Status.Rejected;
      console.log("zaktualizowano platnosc");
      await repo.save(payment);
      res.send();
    } else {
      res.status(400).send("Taka Platnosc nie istnieje :(");
    }
  }

  async makePaymentPending(req: Request, res: Response) {
    const repo = getManager().getRepository(Payment);
    let payment = await repo.findOne(req.params.id);

    if (payment) {
      payment.status = Status.Pending;
      console.log("zaktualizowano platnosc");
      await repo.save(payment);
      res.send();
    } else {
      res.status(400).send("Taka Platnosc nie istnieje :(");
    }
  }

  async findByEmail(req: Request, res: Response) {
    const { email } = req.params;
    const paymRepo = getManager().getRepository(Payment);
    const custRepo = getManager().getRepository(Customer);

    let cust = await custRepo.findOne({
      where: { email: email },
    });

    let paym = await paymRepo.find({ where: { customer: cust } });

    if (paym) {
      return res.status(200).send(paym);
    } else {
      res.status(400).send();
    }
  }
}
