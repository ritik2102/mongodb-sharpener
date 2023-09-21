// importing MongoClient
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;


// mongoConnect method if for connecting and storing the connection to the database
const mongoConnect = (callback) => {
  MongoClient.connect(
    // shop is the database we will be connecting to as specified in the connection string below
    // in mongoDB, the database shop will be created automatically if it does not exist yet
    'mongodb+srv://admin-ritik:admin-ritik@mongo.d5cqhbt.mongodb.net/shop?retryWrites=true&w=majority'
  )
  // client object which will give us access to the database
    .then(client => {
      console.log("Connected!");
      _db=client.db();
      callback();
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
};

// in this method we return access to that database
const getDb=()=>{
  if(_db){
    return _db;
  }
  throw "No database found!";
}

// exporting both the models
exports.mongoConnect=mongoConnect;
exports.getDb=getDb;

