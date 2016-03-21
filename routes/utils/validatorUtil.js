// var Regexp = require('regex')
var Numeric = new RegExp("[^0-9]", "g")
var FormattedNumeric = new RegExp("[^0-9$\\-\/\(\)]","g")
var Alphanumeric = new RegExp("[^a-zA-Z0-9]", "g")
var FormattedAlphanumeric = new RegExp("[^a-zA-Z0-9 _\\-\(\)\/$]", "g")
var SafeChars = new RegExp("[^a-zA-Z0-9 _\\-\(\)\/!\\*\\+,;:\\?@\\[\\]~\\$]", "g")

var makeSafe = function(str, regex){
	var result = JSON.stringify(str).replace(regex, "")
	return result;
}

var checkSafe = function(str, regex){
	//there's gotta be a cleaner way
	if(str === makeSafe(str, regex)){
		return true;
	} 
	return false;
}

module.exports.makeNumeric = function(str){return makeSafe(str, Numeric)}
module.exports.makeFormattedNumeric = function(str){return makeSafe(str, FormattedNumeric)}
module.exports.makeAlphanumeric = function(str){return makeSafe(str, Alphanumeric)}
module.exports.makeFormattedAlphanumeric = function(str){return makeSafe(str, FormattedAlphanumeric)}
module.exports.makeSafeChars = function(str){return makeSafe(str, SafeChars)}

module.exports.checkNumeric = function(str){return checkSafe(str, Numeric)}
module.exports.checkFormattedNumeric = function(str){return checkSafe(str, FormattedNumeric)}
module.exports.checkAlphanumeric = function(str){return checkSafe(str, Alphanumeric)}
module.exports.checkFormattedAlphanumeric = function(str){return checkSafe(str, FormattedAlphanumeric)}
module.exports.checkSafeChars = function(str){return checkSafe(str, SafeChars)}