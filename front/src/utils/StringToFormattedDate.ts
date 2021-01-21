export default (date: Date) => {
  
  var curr = new Date();
  curr.setDate(curr.getDate() + 3);
  var retDate = curr.toISOString().substr(0,10);
  return retDate;
};
