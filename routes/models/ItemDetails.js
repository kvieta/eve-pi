var mongoose = require('mongoose');

var ItemdetailsSchema = new mongoose.Schema({
	typeid: Number,
	typename: String,
	marketgroupid: Number,
	groupid: Number,
	categoryid: Number
});

module.exports = mongoose.model('ItemDetails', ItemdetailsSchema);