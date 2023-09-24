const mongodb = require('mongodb');
// getting access to the database
const getDb = require('../util/database').getDb;

class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }
  save() {
    // getting access to the database
    const db = getDb();
    db.collection('users')
      .insertOne(this)
      // telling mongoDB in which collection you want to insert something
      // if the collection does not exist, it will be created
      .then(result=>{
        console.log(result);
      })
      .catch (err => {
      console.log(err);
    });
  }
  static findUserById(userId) {
    const db = getDb();
    // find will return a cursor as mongoDB won't know that I will only get one
    // next will give access to the next, i.e. the last document that was returned here
    return db
      .collection('users')
      // mongodb stores the ids in the format of objectId so rather than just comparing the string we will compare the ObjectId
      .find({ _id: new mongodb.ObjectId(userId) })
      .next()
      .then(user => {
        console.log(user);
        return user;
      })
      .catch(err => {
        console.log(err);
      })
  }
}

// const Sequelize = require('sequelize');

// const sequelize = require('../util/database');

// const User = sequelize.define('user', {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true
//   },
//   name: Sequelize.STRING,
//   email: Sequelize.STRING
// });

module.exports = User;
