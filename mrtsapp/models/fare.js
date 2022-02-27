var mongoose = require ('mongoose');

// Create a Product schema first. Map it to the collection

var fareSchema = new mongoose.Schema ({

   station1: String,
   station2: String,
   fare:String,
  type:String
 },
 { collection: "fares"});

 //Defining the model here

module.exports = mongoose.model ('fare', fareSchema);
