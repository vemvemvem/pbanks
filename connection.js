// 1.0 Require modules

var mongoose = require('mongoose')
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