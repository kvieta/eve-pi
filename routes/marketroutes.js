var express = require('express');
var router = express.Router();
var http = require('http');
var validator = require('./utils/validatorUtil')

var connections = 0;

var bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}));

const GOOD = 200;
const MISSING_DATA = 400;
const BAD_REQUEST = 422;
const BAD_DEVELOPER = 500;
const BAD_GATEWAY = 502;

// router.get('/test', function(req, res){
// 	console.log(req.body)
// 	res.send("market working", req.body)
// })

// router.post('/test', function(req, res){
// 	console.log("working")
// 	res.send(req.body)
// })

/**
 * getMarketInfo endpoint. Returns parsed marketdata for one system or region
 * @param  {[body]} {"system":SYS_OR_REGION_ID, "idList": [TYPEIDS]}
 * @return {[type]}                          [description]
 */
router.post('/getMarketInfo', function(req, res){
	connections += 1;
	console.log("getMarketInfo #", connections);
	//http://api.eve-central.com/api/marketstat/json?
	if(!req.body.system || !req.body.idList){
		console.log("bad request:", req.body);
		res.status(MISSING_DATA).send("Correct usage is {system: Number, idList: [Number]");
	}
	var location = ''
	if(isNaN(req.body.system)){
		res.status(BAD_REQUEST).send("Correct usage is {system: Number, idList: [Number]");
	};
	if(req.body.system > 30000000){ location = "usesystem=" + req.body.system }
		else location = "regionlimit="+req.body.system;
	var types = ''
	for (var i = req.body.idList.length - 1; i >= 0; i--) {
		if(isNaN(req.body.idList[i])){
			res.status(BAD_REQUEST).send("Correct usage is {system: Number, idList: [Number]");
		}
		types = types + '&typeid=' + req.body.idList[i]
	};

	var options = {
		host: "api.eve-central.com",
		path: "/api/marketstat/json?" + location + types
	};
	// console.log("options are:", options);
	var request = http.request(options, function(result){
		var output = '';
		result.on('data', function(chunk) {
			console.log(chunk);
			output += chunk;
		});

		result.on('end', function() {
			var obj = JSON.parse(output);
			var stats = {};
			var marketLocation = '';
			for (var i = obj.length - 1; i >= 0; i--) {
				// console.log(obj[i]);
				var buy = obj[i]["buy"]
				var sell = obj[i]["sell"]
				var all = obj[i]["all"]
				if(!buy || !sell || !all){
					console.error("successful reply, bad format:", options);
					res.status(BAD_DEVELOPER).send("Successful but invalid response from eve-central");
					continue;
				}
				var type = buy.forQuery.types[0];

				//redundancy ho! 
				if(buy.forQuery.regions[0]) {marketLocation = buy.forQuery.regions[0]}
					else if (buy.forQuery.regions[0]) {marketLocation = buy.forQuery.systems[0]}
						else {console.log("SOMETHING IS FUCKED")}
				var stat = {
					buy: buildMarketstats(buy),
					sell: buildMarketstats(sell),
					all: buildMarketstats(all)
				};
				stats[type] = stat;
			};
			//onResult(result.statusCode, obj);
			res.status(GOOD).send({
				market: marketLocation,
				statMap: stats
			});
		});
	}).on('error', function(err){
		console.error("api call failed with error: ", err);
		res.status(BAD_GATEWAY).send("received bad response from eve-central");
	}).end();
})
///////////////////////

var buildMarketstats = function(stats){
	if(!stats.forQuery){
		console.log("forQuery doesn't exist, that's bad");
	}
	var type = stats.forQuery.types[0]
	return {
		volume: stats.volume,
		generated: stats.generated,
		avg: stats.avg,
		wavg: stats.wavg,
		// variance : stats.variance,
		// stdDev : stats.stdDev,
		median : stats.median,
		fivePercent : stats.fivePercent,
		max : stats.max,
		min : stats.min,
		highToLow : stats.highToLow
	}
}

module.exports = router;