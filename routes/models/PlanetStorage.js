var mongoose = require('mongoose');
var validator = require('../utils/validatorUtil')

var FactorySchema = new mongoose.Schema({
	schematic: String, //Number,
	number: Number,
	avgActiveCycles: Number
});

/*
FactorySchema.post('find', function(result){
	console.log("executing post-find middleware");
	this.schematic = this.schematic.toString();
	//this probably won't work. Even a .post middleware can't set a Number to a String
})
*/

FactorySchema.pre('save', function(next){
	console.log("Middleware: confirming FactorySchema.schematic is a number");
	if(isNaN(this.schematic)){
		console.error("schematic was not a number, setting to '0'")
		this.schematic = "0";
	}
	next();
})

var ExtractorSchema = new mongoose.Schema({
	resourceId: Number,
	headcount: Number
});

var PlanetSchema = new mongoose.Schema({
	name: String,
	factoriesBasic: [FactorySchema],
	factoriesAdvanced: [FactorySchema],
	factoriesHightech: [FactorySchema],
	extractors: [ExtractorSchema],
	numStorage: Number,
	numLaunchpads: Number,
	useCCStorage: Boolean,
	restrictPads: Boolean,
	taxRate: Number,
	level: Number,
	avgLinkLength: Number,
	cyclesPerActiveCycle: Number,
	isFactoryPlanet: Boolean
});

PlanetSchema.pre('save', function(next){
	console.log("Middleware: doing makeSafeChars on name field")
	this.name = validator.makeSafeChars(this.name);
	next();
})

var PISetupSchema = new mongoose.Schema({
	market: Number,
	planets: [PlanetSchema]
}) 

module.exports = mongoose.model('planetsetups', PISetupSchema);