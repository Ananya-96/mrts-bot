var mongoose = require ('mongoose');

// Create a Product schema first. Map it to the collection

var metroSchema = new mongoose.Schema ({
    day: String,
    firstTrain: String,
    fromStation: String,
    lastTrain: String,
    routeid: String,
    toStation: String,
    type: String
 },
 { collection: "metro"});

 //Defining the model here

module.exports = mongoose.model ('metro', metroSchema);
