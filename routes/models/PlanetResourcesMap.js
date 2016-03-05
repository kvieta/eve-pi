var mongoose = require('mongoose');

var PlanetResourcesMapSchema = new mongoose.Schema({
	planetid: Number,
	planetname: String,
	resources: [Number]
});

module.exports = mongoose.model('PlanetResources', PlanetResourcesMapSchema);
//{ "_id" : ObjectId("56c5f588a55f00e63f593dc1"), 
//"planetid" : 11, "planetname" : "Temperate", "resources" : [ 2268, 2287, 2073, 2305, 2288 ] }
