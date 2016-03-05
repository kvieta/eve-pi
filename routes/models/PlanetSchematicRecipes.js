var mongoose 	= require('mongoose');

var InputSchema = new mongoose.Schema({
	typeid: Number,
	quantity: Number
})

var PlanetSchematicRecipesSchema = new mongoose.Schema({
	typeid: Number,
	quantity: Number,
	inputs:[InputSchema]
});

module.exports = mongoose.model('PlanetSchematicRecipe', PlanetSchematicRecipesSchema);
//mongoose adds an 's' to the end, so this is used as 'PlanetSchematicRecipes'

//{ "_id" : ObjectId("56c5f588a55f00e63f593d90"), 
//"typeid" : 3695, "quantity" : 5, "inputs" : 
//[ { "typeid" : 2396, "quantity" : 40 }, { "typeid" : 2397, "quantity" : 40 } ] }
