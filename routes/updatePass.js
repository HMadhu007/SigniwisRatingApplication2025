var express = require('express');
// const flash = require('express-flash');
var router = express.Router();

// var database = require('../database')
var mysql = require('mysql');


var connection  = mysql.createConnection({
    connectionLimit : 1000,
    host     : 'localhost',
    user     : 'root',
    password : 'Signiwis@123',
    database : 'signiwis_schema',
    port : 3306

});


/* GET users listing. */
router.get('/', function(req, res, next) {
    debugger
    // res.render('updatePass')
    var message = req.flash('success')
    connection.query('SELECT * FROM employee_table', function(error, data){
      
       res.render('updatePass', {title:"Welcome to Signiwis",message, session:req.session,oReviewEmpData:data})
        
    })
});

router.get('/Pass_Updated',function(req,res,next){
    debugger    
    var EmployeeId=req.query.Employee_Id;
    var EmployeeName=req.query.Employee_Name;
    var password=req.query.Password;
    var confirm_Password= req.query.ConfirmPass;

    var sql =`UPDATE employee_table SET
    Employee_Password = "${password}"
    WHERE Employee_Id = "${EmployeeId}"`;
    connection.query(sql,function(error,data){
        if(error){
            throw error;
          }else{
            // req.flash('success',`${empId} Employee Updated!!`);
           req.flash('sucess',`Password Updated successfully!!`);
  
            res.redirect(`/home`)
          }
    });


});

module.exports = router;
