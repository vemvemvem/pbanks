// 1. Require dependencies

var path = require('path')
var fs = require('fs')
var request = require('request')
var cheerio = require('cheerio')
var connection = require('./connection.js')
var dataModel = require('./schema.js')

// 2. Reading file & converting to JS object

var start = 6301
var end = 6301


;(function(){

	var arr = []
	for(i= start; i <= end; i++){
	// ^ i should be equal to jsonRead.length to iterate through everything, but then the server will stop responding
	var url = 'http://pdadb.net/index.php?m=device&id=' + i

	request(url, (function(i) {
		return function(error,response,body){
	if(error){
		throw error;
	} $ = cheerio.load(body)

	var name_full = $('title').text().match(/([A-Za-z0-9_$.].*?)(?:\s\|)/)[1]

	var name_brand = $('title').text().match(/([A-Za-z0-9_$.]{0,15})(?:\s)/)[1]

	var name_model = $('title').text().match(/(?:[A-Za-z0-9_$.]{0,15})(?:\s)(.*?)(?:\s\|)/)[1]

	var released = $('td[style]').text().match(/(?:Released)([0-9]{4}\s[A-Za-z]{3})/)
	if(released) {
		var released = $('td[style]').text().match(/(?:Released)([0-9]{4}\s[A-Za-z]{3})/)[1]
	}

	var dim_width = $('a[title]').text().match(/(\d{1,3}.\d{1,3}|\d{1,3})\smm/)

		if(dim_width){
		dim_width = $('a[title]').text().match(/(\d{1,3}.\d{1,3}|\d{1,3})\smm/)[1]
	}

	var dim_height = $('a[title]').text().match(/(?:\d{1,3}.\d{1,3}|\d{1,3})\smm(\d{1,3}.\d{1,3}|\d{1,3})\smm/)

		if(dim_height){
		dim_height = $('a[title]').text().match(/(?:\d{1,3}.\d{1,3}|\d{1,3})\smm(\d{1,3}.\d{1,3}|\d{1,3})\smm/)[1]
	}

	var dim_depth = $('a[title]').text().match(/(?:\d{1,3}.\d{1,3}|\d{1,3})\smm(?:\d{1,3}.\d{1,3}|\d{1,3})\smm(\d{1,3}.\d{1,3}|\d{1,3})/)

		if(dim_depth){
		dim_depth = $('a[title]').text().match(/(?:\d{1,3}.\d{1,3}|\d{1,3})\smm(?:\d{1,3}.\d{1,3}|\d{1,3})\smm(\d{1,3}.\d{1,3}|\d{1,3})/)[1]
	}

	var battery_type = $('td[style]').text().match(/(?:Battery\s)([A-Za-z]{0,10})/)[1]

	var battery_capacity = $('a[title]').text().match(/(\d{1,4})(?:\smAh)/)
	if(battery_capacity){
		battery_capacity = $('a[title]').text().match(/(\d{1,4})(?:\smAh)/)[1]
	}
	
	var weight = $('a[title]').text().match(/(\d{1,4}\.\d{1,4}\s)(ounces)/)
	if(weight){
		weight = $('a[title]').text().match(/(\d{1,4}\.\d{1,4}\s)(ounces)/)[1]
	}

	var platform = $('a[title]').text().match(/(Android|iOS|Windows|BlackBerry|Linux)/)
	if(platform) {
		platform = $('a[title]').text().match(/(Android|iOS|Windows|BlackBerry|Linux)/)[1]
	}


		arr.push({
			"index_pdadb": i,
			"url": 'http://pdadb.net/index.php?m=device&id=' + i,
			"name_full": "" + name_full + "",
			"name_brand": name_brand,
			"name_model": name_model,
			"released": released,
			"dimensions":{
					"width_mm": dim_width,
					"height_mm": dim_height,
					"depth_mm": dim_depth,	
					},
			"weight_oz": weight,
			"battery_type": battery_type,
			"battery_capacity_mAh": battery_capacity,
			"platform": platform
		})
}})(i))

}

setTimeout(function(){
		console.log(arr)
		dataModel.create(arr, function(err, res){
		if(err) throw err;
			console.log('It\'s saved online!');
		})
}, 100000);
// ^ This is probably not the best solution, but it worked. Issue I was having was that previously, I was saving 'arr' on every single iteration.
// This way, I save 'arr' once it has iterated to the end. Timeout of '3000' might be too little for more iterations, but it worked in case of i=5
// Optimally, I'd prefer to return 

})();