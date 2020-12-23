import cron from 'node-cron';
import { getManager } from 'typeorm';
import { Card, SubscriptionType } from '../entities/Card';

export default () => {
  cron.schedule('0 3 * * *', async () => {
    console.log("Cron dziala");

    const cardRepo = getManager().getRepository(Card);
    const cards = await cardRepo.find();
    const today = new Date();
    for (let card of cards) {
      const dateDiff = Math.ceil(today.getDate() - card.expDate.getDate())/(1000*60*60*24);

      if(dateDiff===0)
      {
        card.isActive = false;
        //twoj karnet wygasl
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

