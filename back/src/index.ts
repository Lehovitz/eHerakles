import { Moderator } from "./entities/Moderator";
import { Trainer } from "./entities/Trainer";
import "reflect-metadata";
import { createConnection, getManager } from "typeorm";
import { Customer } from "./entities/Customer";
import { Location } from "./entities/Location";
import { Room } from "./entities/Room";
import { Event } from "./entities/Event";
import { Card } from "./entities/Card";
import { Person } from "./entities/Person";
import express from "express";
import custRouter from "./routes/CustomerRoute";
import eventRouter from "./routes/EventRoute";
import trainerRouter from "./routes/TrainerRoute";
import roomRouter from "./routes/RoomRoute";
import loginRouter from "./routes/LoginRoute";
import moderatorRouter from "./routes/ModeratorRoute";
import locationRouter from "./routes/LocationRoute";
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
  entities: [Customer, Moderator, Card, Event, Location, Room, Trainer, Person],
  synchronize: true,
  logging: false,
})
  .then(async () => {
    dotenv.config();

    const moderatorRepository = getManager().getRepository(Moderator);
    const moderator = new Moderator();
    moderator.isAdmin = true;
    moderator.modMail = "mod@xd.pl";
    moderator.modPass = await bcrypt.hash("pass", bcrypt.genSaltSync(10));
    const location = new Location();
    location.city = "aa";
    location.country = "aa";
    location.postalCode = "aaa";

    const person = new Person();
    person.address = "aaaa";
    person.birthDate = new Date();
    person.gender = Gender.Male;
    person.docNumber = "98239483";
    person.docType = DocumentType.Passport;
    person.name = "imie";
    person.pesel = "2938329823";
    person.phoneNum = "2394823834";
    person.surname = "surname";

    location.person = person;
    person.location = location;
    person.moderator = moderator;
    moderator.person = person;

    await moderatorRepository.save(moderator);

    console.log("dodano moda");

    const app = express();
    app.use(cors());
    app.use(express.json());
    app.use("/customers", custRouter);
    app.use("/events", eventRouter);
    app.use("/rooms", roomRouter);
    app.use("/trainers", trainerRouter);
    app.use("/locations", locationRouter);
    app.use("/moderators", moderatorRouter);
    app.use("/login", loginRouter);
    app.use("/bmiCalc", bmiRouter);

    app.listen(5000);
    console.log("Listening on port 5000...");
  })
  .catch((error) => console.log(error));
