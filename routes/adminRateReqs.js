
// var express = require('express');
// var router = express.Router();

// // var database = require('../database')
// var mysql = require('mysql');


// var connection  = mysql.createConnection({
//     connectionLimit : 1000,
//     host     : 'localhost',
//     user     : 'root',
//     password : 'Giri#1290',
//     database : 'signiwis_schema',
//     port : 3306

// });

// /* GET users listing. */
// router.get('/', (req, res, next)=> {

//        res.redirect('adminRatingReq')
      
// });

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('adminRateReqs', { title: 'SIGNIWIS' });
});


module.exports = router;