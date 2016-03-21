var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var PIStorage = require('./models/PlanetStorage')

var validator = require('./utils/validatorUtil')
// var safeResult = validator.makeSafeChars(testString)

const GOOD = 200;
const MISSING_DATA = 400;
const BAD_REQUEST = 422;
const BAD_DEVELOPER = 500;
const OTHER = 500;


router.post('/load', function(req, res){
	//{"id"}
	if(!req.body['id']){
		res.status(MISSING_DATA).send("did not request a record");
	} else {
		var query = PIStorage.find({"_id": req.body['id']})
		query.exec(function(err, result){
			if(err){
				//todo: error case
				res.status(OTHER).send("did not find id");
			} else {
				if(result[0])
					res.status(GOOD).send(result[0]);
				else
					res.status(MISSING_DATA).send("Key invalid or expired");
			}
		})

		// res.status(501).send("temporary response from not working /load");
	}
})

/* GET users listing. */
router.post('/save', function(req, res) {
	var planetquery = populatePlanetSchema(req.body.market, req.body.planets);
	if(!planetquery){
		//TODO: fail scenario
		res.status(MISSING_DATA).send("Invalid save planet request");
	} else {
		planetquery.save(function(err, data){
			if(err){
				console.error("Failed to save planetquery with cause", err);
				res.status(BAD_DEVELOPER).send("Internal server error while accessing database");
			} else {
				console.log("saved: ", data);
				res.status(GOOD).send({
					key: data._id
				});
			}
		})
	}
});

function populatePlanetSchema(market, list){
	if(!market || !list || !list.length){
		console.error("populatePlanetSchema failed due to invalid arguments")
		return null;
	}
	var planetSchemaList = [list.length]
	for (var i = list.length - 1; i >= 0; i--) {
		var basicFactories = populateFactorySchemas(list[i].factoriesBasic);
		var advancedFactories = populateFactorySchemas(list[i].factoriesAdvanced);
		var hightechFactories = populateFactorySchemas(list[i].factoriesHightech);
		var extractors = populateExtractorSchema(list[i].extractors);
		// var safeName = validator.makeSafeChars(list[i].name);

		var planet = {
			name: validator.makeSafeChars(list[i].name),
			factoriesBasic: basicFactories,
			factoriesAdvanced: advancedFactories,
			factoriesHightech: hightechFactories,
			extractors: extractors,
			numStorage: list[i].numStorage,
			numLaunchpads: list[i].numLaunchpads,
			useCCStorage: list[i].useCCStorage,
			restrictPads: list[i].restrictPads,
			taxRate: list[i].taxRate,
			level: list[i].level,
			avgLinkLength: list[i].avgLinkLength,
			cyclesPerActiveCycle: list[i].cyclesPerActiveCycle,
			isFactoryPlanet: list[i].isFactoryPlanet
		};
		console.log(planet);
		planetSchemaList[i] = planet;
	};
	var query = new PIStorage({
		market: market,
		planets: planetSchemaList
	});
	return query;
}

function populateFactorySchemas(factoryList){
	if(!factoryList){
		return [];
	}
	var response = [factoryList.length];
	for (var i = factoryList.length - 1; i >= 0; i--) {
		var factory = {
			schematic: factoryList[i].schematic,
			number: factoryList[i].number,
			avgActiveCycles: factoryList[i].avgActiveCycles};
		response[i] = factory;
	};
	return response;
};

function populateExtractorSchema(extractorList){
	if(!extractorList){
		return [];
	}
	var response = [extractorList.length];
	for (var i = extractorList.length - 1; i >= 0; i--) {
		var extractor = {
			resourceId: extractorList[i].resourceId,
			headcount: extractorList[i].headcount};
		response[i] = extractor;
	};
	return response;
};

module.exports = router;
