var express 		= require('express');
var mongoose 		= require('mongoose');
var port 			= 3000;
var logger 			= require('morgan');
var bodyParser		= require('body-parser');
// var methodOverride 	= require('method-override');
var server 			= express();

server.use(express.static(__dirname + '/public'));

server.use(logger('dev'));
server.use(bodyParser.json()); //application/json
server.use(bodyParser.urlencoded({extended:true})); //application/x-www-form-urlencoded
server.use(bodyParser.text()); //raw text
server.use(bodyParser.json({type: 'application/vnd.api+json'})); //...
mongoose.connect('mongodb://localhost/sde');

var planetRoutes = require('./routes/index');
server.use('/planetary', planetRoutes);

var marketRoutes = require('./routes/marketroutes');
server.use('/webapi', marketRoutes);

var planetPersistRoutes = require('./routes/planetaryPersist')
server.use('/planetary/persist', planetPersistRoutes);

/**
 * Startup testing stuff begins
 */
// var validator = require('./routes/utils/validatorUtil')
// var testString = "stuff and escape things: {hey} (noo) <div>HelloWorld</div> | don't even think $100, @ do you? "
// console.log("Raw:", testString)
// console.log("Numeric:", validator.makeNumeric(testString))
// console.log("FormattedNumeric:", validator.makeFormattedNumeric(testString))
// console.log("Alphanumeric:", validator.makeAlphanumeric(testString))
// console.log("FormattedAlphanumeric:", validator.makeFormattedAlphanumeric(testString))
// var safeResult = validator.makeSafeChars(testString)
// console.log("SafeChars:", safeResult)

/**
 * Startup testing stuff end
 */



server.listen(port, function() {
	console.log('server listening on port ' + port);
});





//stuff
var connectionNumber = 0;

server.get('/restCall', function(req, res) {
	connectionNumber = connectionNumber + 1; 
	setTimeout(
		(function(){
			res.send('hello from the restCall endpoint! You are connection number ' + connectionNumber);
		}),	3000)
	
})