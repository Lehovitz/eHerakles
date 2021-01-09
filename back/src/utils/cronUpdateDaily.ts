import cron from 'node-cron';
import { getManager } from 'typeorm';
import { Card } from '../entities/Card';
import { Status } from '../entities/Payment';
import fetch from "node-fetch";

export default () => {
  cron.schedule('* * * * *', async () => {
    console.log("Cron dziala");

    const cardRepo = getManager().getRepository(Card);

    const cards = await cardRepo
      .createQueryBuilder("card")
      .leftJoinAndSelect("card.subscription", "subscription")
      .leftJoinAndSelect("card.customer", "customer")
      .getMany();

    const today = new Date();
    for (let card of cards) {
      const dateDiff = Math.ceil(today.getDate() - card.expDate.getDate())/(1000*60*60*24);

      if(dateDiff===0)
      {
        console.log(card);
        card.isActive = false;
        //twoj karnet wygasl
          await fetch(`http://localhost:5000/payments`, {
          method: "POST",
          body: JSON.stringify({
            due: card.due,
            status: Status.Started,
            customer: card.customer,
            dueDate: new Date(card.expDate.setMonth(card.expDate.getMonth() + card.subscription.period)),
            //zastanowic sie nad zyciem
            paymentDate: new Date(),
          }),
          headers: {"Content-Type" : "application/json"}
        });
      }
      else if(dateDiff === 3)
      {
        //twoj karnet wygasnie za 3 dni, pamietaj o dokonaniu platnosci
      }
      if(dateDiff<0)
      {
        card.isActive = false;
        //card.subType = SubscriptionType.None;

        //card.due zmienic i dodac cennik 
        //wyslac maila ze wygasl
      }

    }
  });


};

