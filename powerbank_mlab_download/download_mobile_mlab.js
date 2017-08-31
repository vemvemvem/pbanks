// 1.0 Require modules

var mongoose = require('mongoose')
var fs = require('fs')
mongoose.Promise = global.Promise
const chalk = require('chalk');

// 1.5 Set up db

var url = 'mongodb://maciej:maciejmaciej@ds137141.mlab.com:37141/powerbanks'

// 2.0 Connect to MongoDB

setTimeout(function() {mongoose.connect(url, function(error){
	if(error){
		throw error
	}
})}, 5)

mongoose.connection.once('open', function() {console.log(chalk.bgMagenta("Connected to MongoDB for the first time !"))})
mongoose.connection.on('connect', function() {console.log(chalk.bgMagenta("Connected to MongoDB again !"))})
mongoose.connection.on('disconnected', function() {console.log(chalk.bgRed("Disconnected to MongoDB"))})


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

powerbank_model = mongoose.model('mobile_and_tablet', dataSchema, 'mobiles_and_tablets')

var a = powerbank_model.find().exec(function(err, results) {
			var a = results
			var b = JSON.stringify(a)
			console.log(a)
			fs.writeFile('mlab_mobile.json', b, (err) => {
  		if (err) throw err;
		  console.log('It\'s saved!');
		});
	})

