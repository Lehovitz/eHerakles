import { Request, Response } from "express";
import { getManager } from "typeorm";
import { Customer } from "../entities/Customer";
import bcrypt from "bcryptjs";
import { Person } from "../entities/Person";
import { Location } from "../entities/Location";
import clean from "../utils/clean";

export default class CustomerController {
  // async findIdByMail(req: Request, res: Response)
  // {
  //   const {email} = req.params;
  //   const custRepo = getManager().getRepository(Customer);
  //   const custId = await (await custRepo.findOne({where: {email : email}})).id;

  //   if(custId){
  //     res.status(200).send({custId});
  //   }
  //   else 
  //   {
  //     res.status(400).send();
  //   }
  // }
  
  async register(req: Request, res: Response)
  {
    const {
      email,
      password,
    } = req.body;

    const repo = getManager().getRepository(Customer);

    let customer = await repo.findOne({where: {email: email}});

    if (!customer) {
      customer = new Customer();
      customer.email = email;
      const salt = bcrypt.genSaltSync(10);
      const hash = await bcrypt.hash(password, salt);
      customer.password = hash;
      console.log("utworzono nowego customera");
      await repo.save(customer);
    } else {
      console.log("Taki Customer juz istnieje :3");
    }
    res.send({ id: customer.id, email: customer.email });
  }

  async addProfileInfo(req: Request, res: Response) {
    const {
      country,
      city,
      postalCode,
      name,
      surname,
      gender,
      docType,
      birthDate,
      phoneNum,
      pesel,
      docNumber,
      address,
      goal
    } = req.body;

    const repo = getManager().getRepository(Customer);
    const locRepo = getManager().getRepository(Location);
    const personRepo = getManager().getRepository(Person);

    const customer = await repo
      .createQueryBuilder("customer")
      .leftJoinAndSelect("customer.person", "person")
      .leftJoinAndSelect("person.location", "location")
      .where("customer.id = :id", { id: req.params.id })
      .getOne();

      let { person } = customer;
      

    // let location = await locRepo.findOne({
    //   where: { country: country, city: city },
    // });
    
   
    if(!person)
    {  
      console.log("adding info");
      let location = await locRepo.findOne({where: { country: country, city: city, postalCode: postalCode}})
      if (!location) {
        location = new Location();
        location.country = country;
        location.city = city;
        location.postalCode = postalCode;
        await locRepo.save(location);
      } else 

      person = new Person();
      person.name = name;
      person.surname = surname;
      person.docType = docType;
      person.docNumber = docNumber;
      person.gender = gender;
      person.birthDate = birthDate;
      person.phoneNum = phoneNum;
      person.pesel = pesel;
      person.address = address;
      person.location = location;
      console.log("utworzono nowa osobe");
      await personRepo.save(person);
      customer.person = person;
      customer.goal = goal;
      await repo.save(customer);
      //zastanowic sie nad zyciem
      res.status(200).send({ ...customer, ...person, ...location });
    }
    else
    {
      console.log("updating info");
      let { location } = person;
      if (!location) {
        location = new Location();
        location.country = country;
        location.city = city;
        location.postalCode = postalCode;
        await locRepo.save(location);
      } else {
      }

        person.name = name;
        person.surname = surname;
        person.birthDate = birthDate;
        person.docType = docType;
        person.docNumber = docNumber;
        person.gender = gender;
        person.pesel = pesel;
        person.phoneNum = phoneNum;
        person.address = address;
  
        location.country = country;
        location.city = city;
        location.postalCode = postalCode;
        customer.goal = goal;

        await repo.save(customer);
        await personRepo.save(person);
        await locRepo.save(location);
  
        delete customer.password;
        delete customer.person;
        delete person.id;
        delete person.location;
        delete location.id;

        res.status(200).send({ ...customer, ...person, ...location });
      } 
    }
  

  async create(req: Request, res: Response) {
    const {
      email,
      password,
      country,
      city,
      postalCode,
      name,
      surname,
      gender,
      docType,
      birthDate,
      phoneNum,
      pesel,
      docNumber,
      address,
    } = req.body;

    const custRepo = getManager().getRepository(Customer);
    const locRepo = getManager().getRepository(Location);
    const personRepo = getManager().getRepository(Person);

    let location = await locRepo.findOne({
      where: { country: country, city: city },
    });

    let person = await personRepo.findOne({
      where: { pesel: pesel, phoneNum: phoneNum },
    });

    let customer = person && person.customer;

    if (!location) {
      location = new Location();
      location.country = country;
      location.city = city;
      location.postalCode = postalCode;

      console.log("utworzono nowa lokalizacje");
      await locRepo.save(location);
    } else {
      console.log("Taka Lokacja juz istnieje :3");
    }

    if (!person) {
      person = new Person();
      person.name = name;
      person.surname = surname;
      person.docType = docType;
      person.docNumber = docNumber;
      person.gender = gender;
      person.birthDate = birthDate;
      person.phoneNum = phoneNum;
      person.pesel = pesel;
      person.address = address;
      person.location = location;
      console.log("utworzono nowa osobe");

      await personRepo.save(person);
    } else {
      console.log("Taka osoba juz istnieje :3");
    }

    if (!customer) {
      console.log(password);

      customer = new Customer();
      customer.email = email;
      const salt = bcrypt.genSaltSync(10);
      const hash = await bcrypt.hash(password, salt);
      customer.password = hash;
      console.log("utworzono nowego customera");
      customer.person = person;
      await custRepo.save(customer);
    } else {
      console.log("Taki Customer juz istnieje :3");
    }
    console.log({ id: customer.id, email: customer.email })
    res.send({ id: customer.id, email: customer.email });
  }

  async readOne(req: Request, res: Response) {
    const repo = getManager().getRepository(Customer);
    const customer = await repo
      .createQueryBuilder("customer")
      .leftJoinAndSelect("customer.person", "person")
      .leftJoinAndSelect("person.location", "location")
      .where("customer.id = :id", { id: req.params.id })
      .getOne();

    if (customer) {
      const { person } = customer;
      const { location } = person;

      delete customer.password;
      delete customer.person;
      //delete person.id;
      delete person.location;
      delete location.id;

      res.status(200).send({ ...customer, ...person, ...location });
    } else res.status(400).send();
  }

  async readAll(req: Request, res: Response) {
    const repo = getManager().getRepository(Customer);

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
      .createQueryBuilder("customer")
      .leftJoinAndSelect("customer.person", "person")
      .leftJoinAndSelect("person.location", "location")
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
      // const personRepo = getManager().getRepository(Person);
      // const person = await personRepo.findOne(elem.person);

      const { person } = elem;
      const { location } = person;

      delete elem.person;
      delete elem.password;
      delete person.id;
      delete person.location;
      delete location.id;

      result.push({ ...elem, ...person, ...location });
    }

    // Wysyłanie odpowiedzi z dwoma obowiązkowymi nagłówkami
    res
      .set({
        "Content-Range": `customers ${range[0]}-${range[1]}/${result.length}`,
        "Access-Control-Expose-Headers": "Content-Range",
      })
      .send(result);
  }

  async update(req: Request, res: Response) {
    const {
      email,
      name,
      surname,
      gender,
      docType,
      birthDate,
      phoneNum,
      pesel,
      docNumber,
      address,
      country,
      city,
      postalCode,
    } = req.body;

    const repo = getManager().getRepository(Customer);
    const personRepo = getManager().getRepository(Person);
    const locationRepo = getManager().getRepository(Location);

    const customer = await repo
      .createQueryBuilder("customer")
      .leftJoinAndSelect("customer.person", "person")
      .leftJoinAndSelect("person.location", "location")
      .where("customer.id = :id", { id: req.params.id })
      .getOne();

    if (customer) {
      const { person } = customer;
      const { location } = person;

      customer.email = email;

      person.name = name;
      person.surname = surname;
      person.birthDate = birthDate;
      person.docType = docType;
      person.docNumber = docNumber;
      person.gender = gender;
      person.pesel = pesel;
      person.phoneNum = phoneNum;
      person.address = address;

      location.country = country;
      location.city = city;
      location.postalCode = postalCode;

      await repo.save(customer);
      await personRepo.save(person);
      await locationRepo.save(location);

      delete customer.password;
      delete customer.person;
      delete person.id;
      delete person.location;
      delete location.id;

      res.status(200).send({ ...customer, ...person, ...location });
    } else res.status(400).send("Nie istnieje taki customer");
  }

  async delete(req: Request, res: Response) {
    const repo = getManager().getRepository(Customer);
    const object = await repo.findOne(req.params.id);

    await repo.delete(req.params.id);

    return res
      .set({
        "Content-Type": "application/json",
      })
      .send({ id: object.id, email: object.email });
  }
}
