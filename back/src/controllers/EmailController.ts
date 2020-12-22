import { getManager } from "typeorm";
import { Customer } from "../entities/Customer";
import { Person } from "../entities/Person";
import nodemailer from "nodemailer";
import { Request, Response} from "express"
import htmlToText from "nodemailer-html-to-text"
import { Card } from "../entities/Card";
import faker from "faker"

    export default class emailController{

        async sendPayment(req: Request, res: Response){
            console.log("Send payment");
            const custRepo = getManager().getRepository(Customer);
            const cust = await custRepo
            .createQueryBuilder("customer")
            .leftJoinAndSelect("customer.person", "person")
            .where("customer.id = :id", { id: req.params.id })
            .getOne();
            const cardRepo = getManager().getRepository(Card);
            const card = await cardRepo.findOne({where: {customer : cust}})
            const person =   cust.person;          
            const vatNum = "FV " + faker.random.number({'min': 10000, 'max': 99999});
            const fakeAccNum = faker.finance.iban().slice(2);
            const dueDate = card.due.toString().split("T")[0];
            var mailOptions = {
              from: "eHerakles",
              to: "michallechowicz14@gmail.com",
              subject: "Payment",
              html: `<h1>Hello ${person.name} ${person.surname} </h1>
                    <p>Your payment with assigned number: <b>${vatNum}</b> is ready!</p>
                    <p>The amount due is: <b>${dueDate}</b> </p>
                    <p>The payment should be sent by bank transfer to the number: <b>${fakeAccNum}</b></p>
                    <p>To complete your payment send your due before: <b>${card.expDate}</b></p>
                    <p>Thank you for being part of our community!</p>
                    <h3><b>Best regards! eHeraklesTeam</b></h3>`

                    
              //text: "Hello " + person.name + " " + person.surname,
            };
            var transporter = nodemailer.createTransport({
              service: "gmail",
              auth: {
                user: "eHeraklesTeam@gmail.com",
                pass: "pass@word1",
              },
            });
            transporter.use('compile', htmlToText.htmlToText());
            transporter.sendMail(mailOptions, function(error, info) {
              if (error) {
                console.log(error);
                res.status(400).send(error);
              } else {
                console.log("Email sent: " + info.response);
                res.status(200).send("Payment sent");
              }
            });
        }
    }
    