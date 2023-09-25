const mongodb = require('mongodb');
// getting access to the database
const getDb = require('../util/database').getDb;

class Product {
  constructor(title, price, description, imageUrl, id,userId) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = id ? new mongodb.ObjectId(id) : null;
    this.userId=userId;
  }

  save() {
    // getting access to the database
    const db = getDb();
    let dbOp;
    if (this._id) {
      // if this._id exists then we will update the product
      dbOp=db.collection('products').updateOne(
        {_id: this._id},
        {$set:this});
    }
    // otherwise we will insert it
    else {
      dbOp = db.collection('products').insertOne(this);
      // telling mongoDB in which collection you want to insert something
      // if the collection does not exist, it will be created
    }
    return dbOp.then(result => {
      // We are printing the result of the insert operation
      console.log(result);
    })
      .catch(err => {
        console.log(err);
      });

  }

  static fetchAll() {
    const db = getDb();
    // Find returns a cursor
    // a cursor is an object provided by mongoDB which allows us to go  through our elements/documents step by step
    return db
      .collection('products')
      .find()
      // toArray is used to tell mongoDB to get all elements and turn them into JavaScript array
      .toArray()
      .then(products => {
        console.log(products);
        return products;
      })
      .catch(err => {
        console.log(err);
      });
  }
  static findById(prodId) {
    const db = getDb();
    // find will return a cursor as mongoDB won't know that I will only get one
    // next will give access to the next, i.e. the last document that was returned here
    return db
      .collection('products')
      // mongodb stores the ids in the format of objectId so rather than just comparing the string we will compare the ObjectId
      .find({ _id: new mongodb.ObjectId(prodId) })
      .next()
      .then(product => {
        console.log(product);
        return product;
      })
      .catch(err => {
        console.log(err);
      })
  }

  static deleteById(prodId){
    const db=getDb();
    return db
    .collection('products')
    .deleteOne({_id: new mongodb.ObjectId(prodId)})
    .then(result=>{
      console.log("Deleted");
    })
    .catch(err=>{
      console.log(err);
    })
  }
}


module.exports = Product;
