// 1. Require modules

var path = require('path')

var express = require('express')
var morgan = require('morgan')
var cookieParser = require('cookie-parser')
var session = require('express-session')
const MongoStore = require('connect-mongo')(session);
var bodyParser = require('body-parser')
var hbs = require('express-handlebars')
var mongoose = require('mongoose')
const chalk = require('chalk');


// 1.5 Require local files

var router = require('./routes/routes.js')
var connection = require('./connection.js')

// 3. Invoke express

var app = express()
app.use(express.static(path.join(__dirname, 'public')));

// 4. Set up views

app.engine('hbs', hbs({extname:'hbs', defaultLayout:'layout', layoutsDir: path.join(__dirname, '/views/layouts/')}));
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')

// 5. Invoke middleware

app.use(morgan('dev')) // responsible for logging in the requests into console
app.use(cookieParser())
app.use(session({
	secret:"lol",
	saveUninitialized: true,
	resave:true,
	store: new MongoStore({ mongooseConnection: mongoose.connection})
	}))
app.use(bodyParser.urlencoded({extended:true}))

// 6. Set up routing

app.use('/', router)

// 7. Launch app on a server

var port = process.env.PORT || 8080
app.listen(port, function(){
	console.log(chalk.bgMagenta("app is listening on port: " + port))
})