// 1.0 Require modules

var fs = require('fs')
var mongoose = require('mongoose')
mongoose.Promise = global.Promise
var powerbankModel = require('./schema.js')

// 2.0 Create dummy data for powerbanks

var arr = [];

for(i=10; i < 100; i++){
	arr.push({
		'name': 'powerbank' + i,
		'capacity': 100 * i
	})
}

// 3.0 Save dummy data offline and log it out to the console


setTimeout(function(){
console.log(arr)
fs.writeFile('output.JSON', arr, (err) => {
	if(err) throw err;
	console.log("saved JSON offline as output.JSON");
})
}, 1000);



// 4. Set up connection to mLab's MongoDB

var url = 'mongodb://maciej:maciejmaciej@ds137141.mlab.com:37141/powerbanks'

mongoose.connect(url, function(error){
	if(error){
		throw error
	}
})

mongoose.connection.once('open', function() {console.log("Connected to MongoDB for the first time !")})
mongoose.connection.on('connect', function() {console.log("Connected to MongoDB again !")})
mongoose.connection.on('disconnected', function() {console.log("Disconnected to MongoDB")})


// 5. Save dummy data ONLINE 

powerbankModel.create(arr, function(err, res){
	if(err) throw err;
	console.log("Saved online to mLab!")
})