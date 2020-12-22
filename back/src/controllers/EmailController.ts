import { getManager } from "typeorm";
import { Customer } from "../entities/Customer";
import { Person } from "../entities/Person";
import nodemailer from "nodemailer";
import { Request, Response} from "express"

    export default class emailController{

        async sendPayment(req: Request, res: Response){
            const id = req.params.id;
            const custRepo = getManager().getRepository(Customer);
            const personRepo = getManager().getRepository(Person);
            
            const cust = await custRepo.findOne({where: { id: id}});
            const custPerson = cust.person;
            const person = await personRepo.findOne({where: {person: custPerson}});

            var mailOptions = {
              from: "eHerakles",
              to: "michallechowicz14@gmail.com",
              subject: "Payment",
              text: "Hello" + person.name + " " + person.surname,
            };
            var transporter = nodemailer.createTransport({
              service: "gmail",
              auth: {
                user: "eHeraklesTeam@gmail.com",
                pass: "pass@word1",
              },
            });
            transporter.sendMail(mailOptions, function(error, info) {
              if (error) {
                console.log(error);
                res.status(400).send();
              } else {
                console.log("Email sent: " + info.response);
                res.status(200).send();
              }
            });
        }
    
            
    
           
    
          
     
    
    }
    