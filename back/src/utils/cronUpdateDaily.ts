import cron from 'node-cron';

export default () => {
    cron.schedule('0 3 * * *', () => {
        console.log("Cron dziala");
      })
      const sendMail() => {

      }
      
};

