import { Request, Response } from "express";
import { getManager } from "typeorm";
import { Card, SubscriptionType } from "../entities/Card";
import { Customer } from "../entities/Customer";
import clean from "../utils/clean";

export default class CardController {
  async findCardByEmail(req: Request, res: Response)
  {
    const {email} = req.params;
    const cardRepo = getManager().getRepository(Card);
    const custRepo =  getManager().getRepository(Customer);

    let cust = await custRepo.findOne({
      where: {email: email},
    });

    let card = await cardRepo.findOne({where: {customer : cust}});

    if(card){
      return res.status(200).send(card);
    }
    else 
    {
      res.status(400).send();
    }
  }
  

  async create(req: Request, res: Response) {
    const { customer } = req.body;
    const cardRepo = getManager().getRepository(Card);
    const custRepo = getManager().getRepository(Customer);

    let cust = await custRepo.findOne({
      where: {id : customer},
    });
    console.log(customer);
    console.log(cust);
    let card = await cardRepo.findOne({where: {customer: customer}})
    if(cust) {
      if (!card) {
        const card = new Card();
        console.log("utworzono nowy karnet ");
  
        card.customer = cust;
        card.isActive = false;
        card.subType = SubscriptionType.None;
        card.due = 0;
        card.expDate = new Date();
        await cardRepo.save(card);
        console.log("save k ");

        res.send(card);
        console.log("res k ");


      } else res.status(400).send();
    }
    else {
      console.log("nie ma takiego klienta")
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
    //  filteredData.forEach((elem) => clean(elem));
    // console.log(filteredData);
     // Wyciąganie tylko istotnych pól
     const result = [];
 
     for (let elem of filteredData) {
 
        const { customer } = elem;
    //     delete customer.email;
    //     delete customer.password;
         delete customer.id;
       
 
      result.push({ ...elem, ...customer });
    }
    //  console.log("wyciaganie ok");

 
     // Wysyłanie odpowiedzi z dwoma obowiązkowymi nagłówkami
     res
       .set({
         "Content-Range": `cards ${range[0]}-${range[1]}/${result.length}`,
         "Access-Control-Expose-Headers": "Content-Range",
       })
       .send(result);

   }
  

  async readOne(req: Request, res: Response) {
    const repo = getManager().getRepository(Card);
    const card = await repo
    .createQueryBuilder("card")
    .leftJoinAndSelect("card.customer", "customer")
    .where("card.id = :id",  { id: req.params.id }).getOne();

    console.log(req.params);
    if(card)
    {
      const { customer } = card;
      return res.status(200).send({...card, ...customer});
    }
    else res.status(400).send();
  }

  async update(req: Request, res: Response) {
    const { isActive, subType, due, expDate, customer } = req.body;
    const repo = getManager().getRepository(Card);

    const card = await repo
    .createQueryBuilder("card")
    .leftJoinAndSelect("card.customer", "customer")
    .where("card.id = :id",  { id: req.params.id }).getOne();

    if (card) {
      card.isActive = isActive;
      card.subType = subType;
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