// var Regexp = require('regex')
var Numeric = new RegExp("[^0-9]", "g")
var FormattedNumeric = new RegExp("[^0-9$\\-\/\(\)]","g")
var Alphanumeric = new RegExp("[^a-zA-Z0-9]", "g")
var FormattedAlphanumeric = new RegExp("[^a-zA-Z0-9 _\\-\(\)\/$]", "g")
var SafeChars = new RegExp("[^a-zA-Z0-9 _\\-\(\)\/!\\*\\+,;:\\?@\\[\\]~\\$]", "g")

var makeSafe = function(str, regex){
	// console.log(regex)
	var result = JSON.stringify(str).replace(regex, "")
	// console.log(result);
	return result;
	// return JSON.stringify(str).replace(regex, "")
	//JSON.stringify(str).match(/[a-zA-Z0-9 -]/g).join('')
}

module.exports.makeNumeric = function(str){return makeSafe(str, Numeric)}
module.exports.makeFormattedNumeric = function(str){return makeSafe(str, FormattedNumeric)}
module.exports.makeAlphanumeric = function(str){return makeSafe(str, Alphanumeric)}
module.exports.makeFormattedAlphanumeric = function(str){return makeSafe(str, FormattedAlphanumeric)}
module.exports.makeSafeChars = function(str){return makeSafe(str, SafeChars)}