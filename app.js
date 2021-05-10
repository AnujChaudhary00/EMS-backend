var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan'); 
var cors=require('cors');
var mongoose=require('mongoose');

var jwt= require('jsonwebtoken');

mongoose.connect('mongodb://127.0.0.1:27017/wissenIndia',{useNewUrlParser:true,useUnifiedTopology:true,useFindAndModify:false})
.then(()=>console.log("database is connected"))
.catch((error)=>console.log(error));


// mongoose.connect('mongodb+srv://ajchaudhary:Chaudhary%231@cluster0.tb78w.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',{useNewUrlParser:true,useUnifiedTopology:true,useFindAndModify:false})
// .then(()=>console.log("database is connected"))
//  .catch((error)=>console.log(error));
 

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var pgRouter=require('./routes/event');
var audience=require('./routes/audience'); 
var ticketRouter=require('./routes/ticket');   
var organisation=require('./routes/organisation');
var unirest = require("unirest");
 

var app = express();
app.use(cors());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/events',pgRouter);
app.use('/audience',audience);
app.use('/ticket',ticketRouter);
app.use('/organisation',organisation);
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
