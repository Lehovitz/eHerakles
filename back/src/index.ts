import { Moderator } from "./entities/Moderator";
import { Trainer } from "./entities/Trainer";
import "reflect-metadata";
import { createConnection } from "typeorm";
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
  .then(async (connection) => {
    dotenv.config();
    console.log("Inserting a new user into the database...");
    const customer = new Customer();

    const users = await connection.manager.find(Customer);

    const app = express();
    app.use(cors());
    app.use(express.json());
    app.use("/customers", custRouter);
    app.use("/events", eventRouter);
    app.use("/rooms", roomRouter);
    app.use("/trainers", trainerRouter);
  
    app.listen(5000);
  })
  .catch((error) => console.log(error));