import cron from 'node-cron';

export default () => {
    cron.schedule('0 0 * * *', () => {
        console.log("Cron dziala");
      })
};
