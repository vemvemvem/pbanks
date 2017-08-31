// 1. Require modules

var mongoose = require('mongoose')

// 2. Schema creation


var schema = mongoose.Schema
var dataSchema = new schema({
	'name': String,
	'capacity': Number
})


module.exports = mongoose.model('powerbank', dataSchema, 'powerbanks')