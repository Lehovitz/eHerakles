import { Moderator } from "./entities/Moderator";
import { Trainer } from "./entities/Trainer";
import "reflect-metadata";
import { createConnection, getManager } from "typeorm";
import { Customer } from "./entities/Customer";
import { Location } from "./entities/Location";
import { Room } from "./entities/Room";
import { Gym } from "./entities/Gym";
import { Event } from "./entities/Event";
import { Card } from "./entities/Card";
import { Person } from "./entities/Person";
import express from "express";
import custRouter from "./routes/CustomerRoute";
import eventRouter from "./routes/EventRoute";
import trainerRouter from "./routes/TrainerRoute";
import roomRouter from "./routes/RoomRoute";
import loginRouter from "./routes/LoginRoute";
import bcrypt from "bcryptjs";
import { DocumentType, Gender } from "./entities/Person";

import dotenv from "dotenv";
import cors from "cors";
createConnection({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "pass",
  database: "eHerakles",
  entities: [
    Customer,
    Moderator,
    Card,
    Event,
    Gym,
    Location,
    Room,
    Trainer,
    Person,
  ],
  synchronize: true,
  logging: false,
})
  .then(async () => {
    dotenv.config();

    // const moderatorRepository = getManager().getRepository(Moderator);
    // const moderator = new Moderator();
    // moderator.IsAdmin = true;
    // moderator.ModMail = "mod@xd.pl";
    // moderator.ModPass = await bcrypt.hash("pass", bcrypt.genSaltSync(10));
    // const location = new Location();
    // location.City = "aa";
    // location.Country = "aa";
    // location.PostalCode = "aaa";

    // const person = new Person();
    // person.Address = "aaaa";
    // person.BirthDate = new Date();
    // person.Gender = Gender.Male;
    // person.DocNumber = "98239483";
    // person.DocType = DocumentType.Passport;
    // person.Name = "imie";
    // person.PESEL = "2938329823";
    // person.PhoneNum = "2394823834";
    // person.Surname = "surname";

    // location.Person = person;
    // person.Location = location;
    // person.Moderator = moderator;
    // moderator.Person = person;

    // await moderatorRepository.save(moderator);

    // console.log("dodano moda");

    const app = express();
    app.use(cors());
    app.use(express.json());
    app.use("/customers", custRouter);
    app.use("/events", eventRouter);
    app.use("/rooms", roomRouter);
    app.use("/trainers", trainerRouter);
    app.use("/login", loginRouter);

    app.listen(5000);
    console.log("Listening on port 5000...");
  })
  .catch((error) => console.log(error));
