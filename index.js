var express = require('express'),
		  app = express(),
		  bodyParser = require("body-parser").urlencoded({
		  extended: false
			}),
			userController = require('./Controller/userController'),
			mongoose = require('mongoose'),
			cookieParser = require('cookie-parser'),
			session = require('express-session'),
			passport = require('passport'),
			flash = require('connect-flash'),
			validator = require('express-validator'),
			mongoMemory = require('connect-mongo')(session),
			Admin = require('./Routes/Admin');
			csrf = require('csurf'),
		  server = require("http").Server(app);


app.use(bodyParser);
app.use(validator());
app.use(cookieParser());
app.use(session({
	secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
	expires : new Date(Date.now() + 10800000),
	cookie: { maxAge:  new Date(Date.now() + 10800000) }, //# 3 tiếng
	store: new mongoMemory({ mongooseConnection: mongoose.connection })
}));
// app.use(csrf());
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use("*", function(req, res, next) {
	res.locals.user = req.user || null;
	res.locals.session = req.session;
	res.locals.success_messages = req.flash('success_messages');
  res.locals.error_messages = req.flash('error_messages');
	return next();
});

app.use(express.static("./public"));
app.set("view engine", "ejs");
app.set("views", "./views/");
userController(app);

mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://localhost/chotot')
mongoose.connect('mongodb://superMarketVLU:asdasd@ds157833.mlab.com:57833/testchotot')
.then(() => console.log("Start Database Success"))
.catch((err, done) => done("Lỗi kết nối DB: " + err + ''));
require('./config/passport');

var port = process.env.port || 8080;
server.listen(port, () => console.log('Server start: ' + port));

module.exports = app;
