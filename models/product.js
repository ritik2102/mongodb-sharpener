// getting access to the database
const getDb = require('../util/database').getDb;

class Product {
  constructor(title, price, description, imageUrl) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
  }

  save() {
    // getting access to the database
    const db = getDb();
    // telling mongoDB in which collection you want to insert something
    // if the collection does not exist, it will be created
    return db.collection('products')
      .insertOne(this)
      .then(result => {
        // We are printing the result of the insert operation
        console.log(result);
      })
      .catch(err => {
        console.log(err);
      });
  }
}


module.exports = Product;
