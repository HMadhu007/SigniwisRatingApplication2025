var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan'); 
var fileUpload = require('express-fileupload');
var session = require('express-session');
var flash = require('connect-flash');
const multer = require('multer');


var adminRatingReq = require('./routes/adminRateReqs');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var sampledataRouter = require('./routes/admin')
var home = require('./routes/home');
var user = require('./routes/user');
var adminMDPopup = require('./routes/adminMDPopup');
var EmployeeRating = require('./routes/EmployeeRating');
var resignEmpPopup = require('./routes/resignEmpPopup');
var updatePass = require('./routes/updatePass');
var adminMDPopuppdf = require('./routes/adminMDPopuppdf');
var monthlyMock = require('./routes/monthlyMock');
var hierarchyMock = require('./routes/hierarchyMock');
var kpi = require('./routes/KPI')




var app = express();
app.use(session({
  secret: 'empLogin',
  resave: true,
  saveUninitialized: true
}))
 
app.use(session({
  secret : 'Signiwis',
  cookie : {maxAge : 60000},
  saveUninitialized : false,
  resave : false
}));
app.use(flash());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', home);
app.use('/adminRateReqs', adminRatingReq);  
app.use('/users', usersRouter);
app.use('/admin', sampledataRouter);
app.use('/home', home);
app.use('/user', user);
app.use('/adminMDPopup', adminMDPopup);
app.use('/Employee_review', EmployeeRating);
app.use('/resignEmpPopup',resignEmpPopup);
app.use('/updatePass', updatePass);
app.use('/adminMDPopuppdf', adminMDPopuppdf);
app.use('/monthlyMock', monthlyMock);
app.use('/hierarchyMock',hierarchyMock);
app.use('/KPI',kpi);
app.use(fileUpload());


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

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
