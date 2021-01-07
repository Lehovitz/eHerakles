export default (date: Date) => {
  const strDate = date.toString().split("T")[0];
  return strDate;
};
