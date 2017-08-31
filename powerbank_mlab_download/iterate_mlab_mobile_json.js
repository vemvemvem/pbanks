var path = require('path')
var fs = require('fs')

// 0. Reading file & converting to JS object

var jsonLoad = fs.readFileSync(path.join(__dirname,'mlab_.json'))
var jsonRead = JSON.parse(jsonLoad)

console.log(jsonRead)