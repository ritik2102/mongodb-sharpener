const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// we define schema here as mongoose has to know what our data looks like
// This schema is non-rigid, we have the flexibility to  deviate from this schema

const productSchema= new Schema({
  title:{
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl:{ 
    type: String,
    required: true
  }
});

// Product is our model with the schema productSchema
module.exports = mongoose.model('Product', productSchema);
