const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    // in our cart will be an embedded document
    cart: {
        // items array
        // We have an array of embedded documents
        items: [
            {
                productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
                quantity: { type: Number, required: true }
            }
        ]
    }
});

// methods is used to add a method to our schema
userSchema.methods.addToCart = function (product) {
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
            productId: product._id,
            quantity: newQuantity
        });
    }
    const updatedCart = {
        items: updatedCartItems
    };
    this.cart = updatedCart;
    return this.save();
}

userSchema.methods.removeFromCart = function (productId) {
    const updatedCartItems = this.cart.items.filter(item => {
        // remove the item for which the productId matches
        return item.productId.toString() !== productId.toString();
    });
    this.cart.items = updatedCartItems;
    return this.save();
}

userSchema.methods.clearCart = function() {
    this.cart = {items: []};
    return this.save();
}


// exporting our model
module.exports = mongoose.model('User', userSchema);





















// const mongodb = require('mongodb');
// const ObjectId = mongodb.ObjectId;
// // getting access to the database
// const getDb = require('../util/database').getDb;

// class User {
//   constructor(name, email, cart, id) {
//     this.name = name;
//     this.email = email;
//     this.cart = cart;    // {items: []}
//     this._id = id;
//   }
//   save() {
//     // getting access to the database
//     const db = getDb();
//     db.collection('users').insertOne(this);
//     // telling mongoDB in which collection you want to insert something
//     // if the collection does not exist, it will be created
//   }

//   addToCart(product) {
//     // finding the item if it exists in the cart already
//     const cartProductIndex = this.cart.items.findIndex(cp => {
//       return cp.productId.toString() === product._id.toString();
//     });
//     // newQuantity is 1 if the product is not present in cart
//     let newQuantity = 1;
//     // getting access to the cart 
//     const updatedCartItems = [...this.cart.items];
//     // cartProductIndex will be >=0 only if the product exists in cart
//     if (cartProductIndex >= 0) {
//       newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//       // updating the quantity for our product
//       updatedCartItems[cartProductIndex].quantity = newQuantity;
//     } else {
//       updatedCartItems.push({
//         productId: new ObjectId(product._id),
//         quantity: newQuantity
//       });
//     }

//     // we are storing an array named items in the cart 
//     const updatedCart = {
//       items: updatedCartItems
//     };
//     const db = getDb();
//     return db
//       .collection('users')
//       .updateOne(
//         { _id: new ObjectId(this._id) },
//         { $set: { cart: updatedCart } }
//       );
//   }

//   getCart() {
//     const db = getDb();
//     // We are getting access to all the productIds from the cart
//     const productIds = this.cart.items.map(i => {
//       return i.productId;
//     });
//     // We are finding all the products for whom the _id is among the ids in the productIds array
//     return db
//       .collection('products')
//       .find({ _id: { $in: productIds } })
//       .toArray()
//       // First we have extracted the product info into productss
//       .then(products => {
//         return products.map(p => {
//           return {
//             ...p,
//             // finding the cart-item from cart and extracting its quantity
//             quantity: this.cart.items.find(i => {
//               return i.productId.toString() === p._id.toString();
//             }).quantity
//             // finding the product from cart and returning its quantity
//           }
//         });
//       });
//   }

//   deleteItemFromCart(productId) {
//     const updatedCartItems = this.cart.items.filter(item => {
//       // remove the item for which the productId matches
//       return item.productId.toString() !== productId.toString();
//     });
//     const db = getDb();
//     return db
//       .collection('users')
//       .updateOne(
//         { _id: new ObjectId(this._id) },
//         { $set: { cart: { items: updatedCartItems } } }
//       );
//   }

//   // We will get the cart items, user info 
//   // add this info into an object and save it into a collection called orders
//   addOrder() {
//     const db = getDb();
//     return this.getCart()
//       .then(products => {
//         // creating order object with the products recieved from the cart
//         const order = {
//           items: products,
//           user: {
//             _id: new ObjectId(this._id),
//             name: this.name
//           }
//         };
//         return db
//           .collection('orders')
//           .insertOne(order)
//       })
//       .then(result => {
//         // When the order succeeds, we set our cart again as an object with an empty array
//         // updating the cart in user object
//         this.cart = { items: [] };
//         return db
//           .collection('users')
//           .updateOne(
//             // updating the cart in database
//             { _id: new ObjectId(this._id) },
//             { $set: { cart: { items: [] } } }
//           );
//       });
//   }

//   // getting the orders
//   getOrders() {
//     const db = getDb();
//     return db
//       .collection('orders')
//       .find({ 'user._id': new ObjectId(this._id) })
//       .toArray();
//   }

//   static findById(userId) {
//     const db = getDb();
//     // find will return a cursor as mongoDB won't know that I will only get one
//     // next will give access to the next, i.e. the last document that was returned here
//     return db
//       .collection('users')
//       .findOne({ _id: new mongodb.ObjectId(userId) })
//       .then(user => {
//         console.log(user);
//         return user;
//       })
//       .catch(err => {
//         console.log(err);
//       });
//     // mongodb stores the ids in the format of objectId so rather than just comparing the string we will compare the ObjectId

//   }
// }

// module.exports = User;
