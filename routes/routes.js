function add1() {
    for(i=0; i < 5; i++){
    	console.log("add 1 " + i)
    }
} 

// 1. Require modules

var express = require('express')
var path = require('path')
var mongoose = require('mongoose')
const chalk = require('chalk');
mongoose.Promise = global.Promise

// 2. Require local files

var mobile_and_tablet_model = require('../schemas/mobile_and_tablet_model.js')
var powerbank_model = require('../schemas/powerbank_model.js')

// 3. Invoke express router
var router = express.Router()

// 4. Set up routes

var phone = 'test'
var width_mm = ""
var height_mm = ""

router.get('/', function(req, res){
	if (!req.session.visitCount) {
		req.session.visitCount = 1;
	} else {
		req.session.visitCount++;
	}
	console.log(chalk.black.bgWhite('/ was requested'))
	console.log(chalk.green("====== Cookies info ======"))
	console.log(req.cookies)
	console.log(chalk.green("====== Session info ======"))
	console.log(req.session)

	console.log(phone)
	res.render("index.hbs",{
		title: 'powerbank main page!'
	})
})

router.get('/page_1', function(req, res){
	if (!req.session.visitCount) {
		req.session.visitCount = 1;
	} else {
		req.session.visitCount++;
	}

	console.log(chalk.black.bgWhite('/page_1 requested'))
	console.log(chalk.green("====== Cookies info ======"))
	console.log(req.cookies)
	console.log(chalk.green("====== Session info ======"))
	console.log(req.session)
	
	res.render("page_1.hbs",{
		title: 'Phone selection!'
	})
})

var battery_capacity;

router.post('/page_2', function(req, res){
	phone = req.body.phone

	// Session storage

	if(!req.session.phone_1){
		req.session.phone_1 = phone
	} else if(!req.session.phone_2) {
		req.session.phone_2 = phone
	} else {
		req.session.phone1 = phone
	}

	if (!req.session.visitCount) {
		req.session.visitCount = 1;
	} else {
		req.session.visitCount++;
	}

	console.log(chalk.black.bgWhite('/page_2 requested'))
	console.log(chalk.green("====== Cookies info ======"))
	console.log(req.cookies)
	console.log(chalk.green("====== Session info ======"))
	console.log(req.session)
	

	
	// MongoDB query

	mobile_and_tablet_model.find({name_full:phone}).catch(function(error) {
			console.log("error:", err)
		}).then(function(MongoDBdata){


			battery_capacity = MongoDBdata[0].battery_capacity_mAh
			width_mm = MongoDBdata[0].dimensions.width_mm
			height_mm = MongoDBdata[0].dimensions.height_mm

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
var range_lower_than = ""
var range_min = ""
var range_max = ""
var range_higher_than = ""
var page_3_query = [];

router.post('/page_3', function(req, res){

	// Session storage

	charges = req.body.charges

	req.session.charges = charges

	if (!req.session.visitCount) {
		req.session.visitCount = 1;
	} else {
		req.session.visitCount++;
	}
	
	console.log(chalk.black.bgWhite('/page_3 requested'))
	console.log(chalk.green("====== Cookies info ======"))
	console.log(req.cookies)
	console.log(chalk.green("====== Session info ======"))
	console.log(req.session)

	// MongoDB query
	
	console.log(battery_capacity)

	if(charges == 1){
		range_lower_than = battery_capacity
			powerbank_model.find({"capacity":{$lte:battery_capacity}}).catch(function(error) {
			if (error) 
				throw error;
		}).then(function(MongoDBdata){
			console.log(MongoDBdata)
		})

	} else if(charges == 2) {
		range_min = battery_capacity
		range_max = battery_capacity * 2
		powerbank_model.find({"capacity":{$lte:range_max, $gte:range_min}}).catch(function(error) {
			if (error) 
				throw error;
		}).then(function(MongoDBdata){
			console.log(MongoDBdata)
		})

	} else {
			range_higher_than = battery_capacity * 2
			powerbank_model.find({"capacity":{$gte:range_higher_than}}).catch(function(error) {
			console.log("error: " + error)
		}).then(function(MongoDBdata){
			page_3_query = MongoDBdata
			console.log(MongoDBdata[1].capacity)
			console.log(MongoDBdata[2].capacity)
			for(i=0; i < MongoDBdata.length; i++){
				page_3_query[i].charges_in_phone = MongoDBdata[i].capacity * 0.8 * 0.8 / battery_capacity // JSON array of objects is modfied correctly, but console.log does logs it out correctly
				console.log(page_3_query[i].charges_in_phone)
			}
		})
	}
	console.log("width is: " + width_mm)
	console.log("height is: " + height_mm)
	console.log("range_lower_than: " + range_lower_than)
	console.log("range_min: " + range_min)
	console.log("range_max: " + range_max)
	console.log("range_higher_than: " + range_higher_than)
	res.render("page_3.hbs",{
		title: 'Results page!',
		phone: phone,
		charges: req.body.charges,
		width_mm: width_mm,
		height_mm: height_mm
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

router.get("*", function(req, res){

	// res.send("SORRY ! This page does not exist")
	res.render("404.hbs")

	// console.log(chalk.black.bgRed('unrouted page was requested'))
	// console.log(chalk.green("====== Cookies info ======"))
	// console.log(req.cookies)
	// console.log(chalk.green("====== Session info ======"))
	// console.log(req.session)

})

module.exports = router;


