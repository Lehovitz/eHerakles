import { getManager } from "typeorm";
import { Customer } from "../entities/Customer";
import { Person } from "../entities/Person";
import nodemailer from "nodemailer";
import { Request, Response} from "express"
import htmlToText from "nodemailer-html-to-text"
import { Card } from "../entities/Card";
import faker from "faker"
import { Payment } from "../entities/Payment";

    export default class emailController{

        async sendPayment(req: Request, res: Response){
            const {paymId} = req.params;
            console.log("Send payment");
            const cardRepo = getManager().getRepository(Card);
            const paymRepo = getManager().getRepository(Payment);
            const payment = await paymRepo.findOne({where: {id: paymId}})

            const paym = await paymRepo
            .createQueryBuilder("payment")
            .leftJoinAndSelect("payment.customer", "customer")
            .leftJoinAndSelect("customer.person", "person")
            .where("payment.id = :id", { id: paymId })
            .getOne();
            
            const cust = paym.customer;
            const person = cust.person;          
            const vatNum = "FV " + faker.random.number({'min': 10000, 'max': 99999});
            const fakeAccNum = faker.finance.iban().slice(2);
            const dueDate = payment.dueDate.toString().split("T")[0];
            const card = await cardRepo.findOne({where: {customer : cust}}); 

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
    