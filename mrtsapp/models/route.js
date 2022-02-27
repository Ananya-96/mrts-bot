var mongoose = require ('mongoose');

// Create a Product schema first. Map it to the collection

var routeSchema = new mongoose.Schema ({

   name: String,
   type: String,
   start:String,
   final:String,
   route:[{stationid: Number,
          seqno: Number,
           stationName: String,
           location:{ latitude: Number,
                      longitude: Number

           }
         }]
 },
 { collection: "routes"});

 //Defining the model here

module.exports = mongoose.model ('route', routeSchema);
