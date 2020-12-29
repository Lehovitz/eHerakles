import { Request, Response } from "express";
import { getManager } from "typeorm";
import { Category } from "../entities/Category";
import clean from "../utils/clean";

export default class CategoryController {
  
  async create(req: Request, res: Response) {
    const { name, goal } = req.body;
    const categoryRepo = getManager().getRepository(Category);

    let cat = await categoryRepo.findOne({
      where: { name: name, goal: goal},
    });

      if (!cat) {
        cat = new Category();
        console.log("utworzono nową kategorię");

        cat.name = name;
        cat.goal = goal;
      
        await categoryRepo.save(cat);
        res.send(cat);
      } else res.status(400).send();
  }

  async readAll(req: Request, res: Response) {
    const repo = getManager().getRepository(Category);

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
    let data = await repo.find();

    // Filtrowanie encji
    const filteredData = data.filter((elem) => {
      for (let filter of Object.keys(filters)) {
        if (elem[filter] != filters[filter]) return false;
      }

      return true;
    });

    // Usuwanie pól będących nullami / undefined
    filteredData.forEach((elem) => clean(elem));
    // console.log(filteredData);
    // Wyciąganie tylko istotnych pól
    const result = [];

    //  console.log("wyciaganie ok");

    // Wysyłanie odpowiedzi z dwoma obowiązkowymi nagłówkami
    res
      .set({
        "Content-Range": `categories ${range[0]}-${range[1]}/${data.length}`,
        "Access-Control-Expose-Headers": "Content-Range",
      })
      .send(data);
  }

  async readOne(req: Request, res: Response) {
    const repo = getManager().getRepository(Category);
    const cat = await repo.findOne({where: { id: req.params.id }});

    if (cat) {
      return res.status(200).send(cat);
    } else res.status(400).send();
  }

  async update(req: Request, res: Response) {
    const { name, goal} = req.body;
    const repo = getManager().getRepository(Category);
    console.log("update body");
    console.log(req.body);
    
    const cat = await repo.findOne({where: {id: req.params.id}});

    console.log("find")
    console.log(cat)
    if (cat) {
      cat.name = name;
      cat.goal = goal;
      await repo.save(cat);
      res.status(200).send(cat);
    } else {
      res.status(400).send();
    }
  }

  async delete(req: Request, res: Response) {
    const repo = getManager().getRepository(Category);
    const object = await repo.findOne(req.params.id);

    await repo.delete(req.params.id);

    return res
      .set({
        "Content-Type": "application/json",
      })
      .send(object);
  }
}
