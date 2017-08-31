// 1. Require modules

var express = require('express')
var path = require('path')
var mongoose = require('mongoose')
mongoose.Promise = global.Promise

// 2. Require local files

var mobile_and_tablet_model = require('../schemas/mobile_and_tablet_model.js')
var powerbank_model = require('../schemas/powerbank_model.js')

// 3. Invoke express router
var router = express.Router()

// 4. Set up routes

var phone = 'test'

router.get('/', function(req, res){
	console.log('/ was requested')
	console.log("Cookies info")
	console.log(req.cookies)
	console.log("Session info")
	console.log(req.session)
	console.log(phone)
	res.render("index.hbs",{
		title: 'powerbank main page!'
	})
})

router.get('/page_1', function(req, res){
	console.log('/ was requested')
	// console.log("Cookies info")
	// console.log(req.cookies)
	// console.log("Session info")
	// console.log(req.session)
	res.render("page_1.hbs",{
		title: 'Phone selection!'
	})
})

	var battery_capacity;

	router.post('/page_2', function(req, res){
	phone = req.body.phone
	mobile_and_tablet_model.find({name:phone}).catch(function(error) {
			if (error) 
				throw error;
		}).then(function(MongoDBdata){
			battery_capacity = MongoDBdata[0].battery_capacity_mAh
			res.render('page_2.hbs', {
				title: 'Battery selection!', 
				phone: phone,
				battery_capacity: MongoDBdata[0].battery_capacity_mAh,
				platform: MongoDBdata[0].platform
			})
		})
	powerbank_model.find({}).catch(function(err){
		if (err) 
			throw err;
	}).then(function(powerbankMongoDBdata){
		for(i=0; i < 0; i++){
			console.log(powerbankMongoDBdata[i].capacity)
			console.log(powerbankMongoDBdata[i].capacity / battery_capacity)
		}
	})
})

var charges = 0;
var charges_in_a_phone = 0;

router.post('/page_3', function(req, res){
	var range_lower_than = ""
	var range_min = ""
	var range_max = ""
	var range_higher_than = ""
	// console.log(battery_capacity)

	charges = req.body.charges
	if(charges == 1){
		range_lower_than = battery_capacity
	} else if(charges == 2) {
		range_min = battery_capacity
		range_max = battery_capacity * 2
	} else {
		range_higher_than = battery_capacity * 2
	}

	console.log("range_lower_than: " + range_lower_than)
	console.log("range_min: " + range_min)
	console.log("range_max: " + range_max)
	console.log("range_higher_than: " + range_higher_than)
	// console.log("Cookies info")
	// console.log(req.cookies)
	// console.log("Session info")
	// console.log(req.session)
	res.render("page_3.hbs",{
		title: 'Results page!',
		phone: phone,
		charges: req.body.charges
	})
})


router.post('/phone_details', function(req,res){
	console.log(phone)
	mobile_and_tablet_model.find({name: phone}).exec(function(err,result){
		if(err){
			res.send('error')
			throw err;
		} else {
			res.send(result)
		}
	})
})

router.post('/back', function(req,res){
	res.redirect('back')
})

module.exports = router;


