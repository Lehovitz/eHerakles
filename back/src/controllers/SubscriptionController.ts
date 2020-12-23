import { Request, Response } from "express";
import { getManager } from "typeorm";
import { Subscription } from "../entities/Subscription";
import clean from "../utils/clean";

export default class SubscriptionController {
  async create(req: Request, res: Response) {
    const { name, cost, period } = req.body;

    const subRepo = getManager().getRepository(Subscription);

    let sub = await subRepo.findOne({
      where: { name: name },
    });

    if (!sub) {
      const subscription = new Subscription();
      console.log("utworzono nowa subskrybcje ");

      subscription.name = name;
      subscription.cost = cost;
      subscription.period = period;

      await subRepo.save(subscription);
      res.send(subscription);
    } else res.status(400).send("nie udalo sie stworzyc subskrybcji");
  }

  async readAll(req: Request, res: Response) {
    console.log("read all subscription")

    const repo = getManager().getRepository(Subscription);
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
    let data = await repo.find({ order, skip, take });

    // Filtrowanie encji
    const filteredData = data.filter((elem) => {
      for (let filter of Object.keys(filters)) {
        if (elem[filter] != filters[filter]) return false;
      }

      return true;
    });

    // Usuwanie pól będących nullami / undefined
    filteredData.forEach((elem) => clean(elem));

    // Wysyłanie odpowiedzi z dwoma obowiązkowymi nagłówkami, w pierwszym trzeba zmienić nazwę encji
    res
      .set({
        "Content-Range": `rooms ${range[0]}-${range[1]}/${filteredData.length}`,
        "Access-Control-Expose-Headers": "Content-Range",
      })
      .send(filteredData);
  }

  async readOne(req: Request, res: Response) {
    const repo = getManager().getRepository(Subscription);
    const data = await repo.findOne(req.params.id);
    return res.status(200).send(data);
  }

  async update(req: Request, res: Response) {
    const { name, cost, period } = req.body;
    const repo = getManager().getRepository(Subscription);

    let sub = await repo.findOne(req.params.id);

    if (sub) {
      sub.name = name;
      sub.period = period;
      sub.cost = cost;
      await repo.save(sub);
      res.status(200).send(sub);
    } else {
      res.status(400).send();
    }
  }

  async delete(req: Request, res: Response) {
    const repo = getManager().getRepository(Subscription);
    const object = await repo.findOne(req.params.id);

    await repo.delete(req.params.id);

    return res
      .set({
        "Content-Type": "application/json",
      })
      .send(object);
  }
}
