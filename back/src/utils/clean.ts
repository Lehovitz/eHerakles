export default function clean(obj: Object) {
  for (let prop in obj) {
    if (obj[prop] === null || obj[prop] === undefined) {
      delete obj[prop];
    }
  }
}
