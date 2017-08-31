// 1. Require modules

var mongoose = require('mongoose')

// 2. Schema creation


var schema = mongoose.Schema
var dataSchema = new schema({
		'index_pdadb': Number,
		'url': String,
		'name_full': String,
		'name_brand': String,
		'name_model': String,
		'released': String,
		'dimensions':{
				'width_mm': Number,
				'height_mm': Number,
				'depth_mm': Number,
			},
		'weight_oz': Number,
		'battery_type': String,
		'battery_capacity_mAh': Number,
		'platform': String,
		'date': {type: Date, default: Date.now}
})

module.exports = mongoose.model('mobile_and_tablet', dataSchema, 'mobiles_and_tablets')