var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var PlanetSchematics = require('./models/PlanetSchematicRecipes')
var PlanetResourcesMap = require('./models/PlanetResourcesMap')
var ItemDetails = require('./models/ItemDetails')

const GOOD = 200;
const MISSING_DATA = 400;
const BAD_REQUEST = 422;
const BAD_DEVELOPER = 500;
const OTHER = 500;

var connection = 0;

router.get('/planetDetails', function(req, res){
	connection += 1;
	console.log("planetDetails #", connection);
	// console.log("inside /planetary")
	var resultMap = {}
	var itemList = {}
	var schematicsQuery = PlanetSchematics.find({})
	var planetQuery = PlanetResourcesMap.find({})
	schematicsQuery.exec(function(schematicErr, schematicResult){
		if(schematicErr){
			console.error("schematicErr occurred, ", schematicErr)
			res.status(OTHER).send("Internal server error while accessing database");
		}
		var schFuncResult = schematicResultToSchematicMap(schematicResult, itemList)
		resultMap["schematicMap"] = schFuncResult[0]
		itemList = schFuncResult[1]

		/*
			Nested query: planetMap and resourceMap
		 */
		planetQuery.exec(function(planetErr, planetResult){
			if(planetErr){
				console.error("planetErr occurred, ", planetErr)
				res.status(OTHER).send("Internal server error while accessing database");
			}
			var pltFuncResult = planetResultToPlanetAndResourceMap(planetResult, itemList)
			resultMap["resourceMap"] = pltFuncResult[1];
			resultMap["planetMap"] = pltFuncResult[0];
			itemList = pltFuncResult[2]

			var itemDetailsQueryArg = []
			for (var itemid in itemList){
				if(!itemList.hasOwnProperty(itemid)){
					console.error("has own property: ", itemid)
					continue;
				}
				// console.log(itemid)
				itemDetailsQueryArg.push(itemid)
			}
			// console.log("itemDetailsQueryArg length is", itemDetailsQueryArg.length);

			ItemDetails.find({"typeid": {$in: itemDetailsQueryArg}})
					.exec(function(detailsErr, detailsRes){
				if(detailsErr){
					console.error("detailsErr occurred:", detailsErr)
					res.status(OTHER).send("Internal server error while accessing database");
				}
				// console.log("detailsRes: " + detailsRes)
				var itemDetailsMap = {}
				for (var i = detailsRes.length - 1; i >= 0; i--) {
					itemDetailsMap[detailsRes[i].typeid] = {
						"name": detailsRes[i].typename,
						"tier": detailsRes[i].marketgroupid-1333,
						"typeID": detailsRes[i].typeid,
						"groupID": detailsRes[i].groupid,
						"categoryID": detailsRes[i].categoryid
					}
				};
				resultMap["itemDetails"] = itemDetailsMap
				res.status(GOOD).json(resultMap)
			})
		})
	});
});

function schematicResultToSchematicMap(result, itemList) {
	var schematicMap = {}
	for (var i = result.length - 1; i >= 0; i--) {
		var schematic = {
			"outputID" : result[i].typeid,
			"quantity" : result[i].quantity,
			"recipe" : result[i].inputs
			}
		schematicMap[result[i].typeid] = schematic
		itemList[result[i].typeid] = true
		// console.log(result[i].typeid)
		for (var x = result[i].inputs.length - 1; x >= 0; x--) {
			itemList[result[i].inputs[x].typeid] = true
			// console.log("inputs: ", result[i].inputs[x])
		};
	};
	return [schematicMap, itemList]
}

function planetResultToPlanetAndResourceMap(result, itemList){
	var planetMap = {}
	var resourceMap = {}
	for (var i = result.length - 1; i >= 0; i--) {
		planetMap[result[i].planetid] = result[i].resources
		for (var x = result[i].resources.length - 1; x >= 0; x--) {
			// result[i].resources[x]
			if( result[i].resources[x] in resourceMap){
				resourceMap[result[i].resources[x]].push(result[i].planetid)
			} else {
				resourceMap[result[i].resources[x]] = []
				resourceMap[result[i].resources[x]].push(result[i].planetid)
			}
			itemList[result[i].resources[x]] = true
			// console.log(result[i].resources[x])
		};	
	};
	return [planetMap, resourceMap, itemList]
}

module.exports = router;