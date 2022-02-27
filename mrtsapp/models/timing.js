var mongoose = require ('mongoose');

// Create a Product schema first. Map it to the collection

var timingSchema = new mongoose.Schema ({

   trainid: Number,
   routeid:String,
   type: String,
   startTime:Number,
   endTime:Number,
   stations:[
     {
       stationName:String,
       stationid:Number,
       seqno: Number,
       arrivalTime:Number,
       departureTime:Number
     }
   ],
   day:String
 },
 { collection: "timings"});

 //Defining the model here

module.exports = mongoose.model ('timings', timingSchema);
