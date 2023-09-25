const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId;
// getting access to the database
const getDb = require('../util/database').getDb;

class User {
  constructor(name, email, cart, id) {
    this.name = name;
    this.email = email;
    this.cart = cart;    // {items: []}
    this._id = id;
  }
  save() {
    // getting access to the database
    const db = getDb();
    db.collection('users').insertOne(this);
    // telling mongoDB in which collection you want to insert something
    // if the collection does not exist, it will be created
  }

  addToCart(product) {
    // finding the item if it exists in the cart already
    const cartProductIndex = this.cart.items.findIndex(cp => {
      return cp.productId.toString() === product._id.toString();
    });
    // newQuantity is 1 if the product is not present in cart
    let newQuantity = 1;
    // getting access to the cart 
    const updatedCartItems = [...this.cart.items];
    // cartProductIndex will be >=0 only if the product exists in cart
    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      // updating the quantity for our product
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        productId: new ObjectId(product._id),
        quantity: newQuantity
      });
    }

    // we are storing an array named items in the cart 
    const updatedCart = {
      items: updatedCartItems
    };
    const db = getDb();
    return db
      .collection('users')
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      );
  }


  static findById(userId) {
    const db = getDb();
    // find will return a cursor as mongoDB won't know that I will only get one
    // next will give access to the next, i.e. the last document that was returned here
    return db
      .collection('users')
      .findOne({ _id: new mongodb.ObjectId(userId) })
      .then(user => {
        console.log(user);
        return user;
      })
      .catch(err => {
        console.log(err);
      });
    // mongodb stores the ids in the format of objectId so rather than just comparing the string we will compare the ObjectId

  }
}

module.exports = User;
