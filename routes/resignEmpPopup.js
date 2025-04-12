debugger
var express = require('express');
var router = express.Router();
var router2 = express.Router();

// var popup = require('popups');

// var database = require('../database')Q

const session = require('express-session');
debugger
var mysql = require('mysql');
// const app = require('../app');
var connection  = mysql.createConnection({
    connectionLimit : 1000,
    host     : 'localhost',
    user     : 'root',
    password : 'Signiwis@123',
    database : 'signiwis_schema',
    port : 3306

});
debugger
connection.connect((error)=>{
    debugger
    if(error){
        console.log("My sql database errror");
    } else{
        console.log("success of my sql");
    }
  })
/* GET users listing. */
router.get('/', function(req, res, next) {
    debugger
    var message = req.flash('success');

    connection.query('SELECT * FROM resign_employeetab', function(error, data){
        
      if(error){
        debugger
        console.log("error");
      }
      else{
        debugger
        res.render('resignEmpPopup', {title:"Welcome to Signiwis", message ,session:req.session,sampleData:data})
        
      }
            
       
    //    res.render('admin', {title:"Welcome to Signiwis", session:req.session, sampleData:data})
       
    });

  });


    router.get('/delete/:id', function(req, res, next){

      var id = req.params.id;

      connection.query(`DELETE FROM resign_employeetab WHERE Employee_Id = '${id}'`, function(error, data){

        if(error){
    
          throw error;

        } else{
          
          req.flash('success', id+" Deleted successfully")
          res.redirect('/resignEmpPopup');

        }
      })
    })

    // Employee Restore from resign_employeetab to admin employee_table
    router.get('/restore/:id', function(req, res, next){

    var id = req.params.id;
    var sqlData=`Select * from resign_employeetab WHERE Employee_Id = '${id}'`

    var employeeName;
    var employeeDesignation;
    var employeeEmail;
    var employeeDept;
    var employeePassword;
    var employeeIcon;
    var employeeeStatus;
    var employeeMockTaken;
    var employeeMockGiven;

    var insertData =  `INSERT INTO employee_table (Employee_Id, Employee_Name, Employee_Designation, Employee_Email,
    Employee_Department, Employee_Password,
    Employee_Icon,Employee_Mock_Taken,Employee_Mock_Given,Employee_Status,IMG_file,dateOfBirth,mobil,employeeNo,mentor,position,mentorId) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    connection.query(sqlData,function(error,data){
      if(error)
      {
          throw error
      }
      else
      {
        
        employeeName= data[0].Employee_Name
        employeeDesignation= data[0].Employee_Designation
        employeeEmail= data[0].Employee_Email
        employeeDept= data[0].Employee_Department
        employeePassword= data[0].Employee_Password
        employeeIcon= data[0].Employee_Icon
        employeeeStatus= "Working";
        employeeMockTaken= data[0].Employee_Mock_Taken;
        employeeMockGiven= data[0].Employee_Mock_Given;
        var img = data[0].IMG_file;
        var dateOfBirth = data[0].dateOfBirth;
        var mobile = data[0].mobil;
        var employeeNo = data[0].employeeNo;
        var mentor= data[0].mentor
        var position = data[0].position;
        var mentorId = data[0].mentorId;

        //Inserting Employee i.e restored from resign_employeetab to 
        connection.query(insertData,[id,employeeName,employeeDesignation,employeeEmail,employeeDept,employeePassword,employeeIcon,employeeMockTaken,employeeMockGiven,employeeeStatus,img, dateOfBirth, mobile, employeeNo,mentor,position,mentorId],function(error, data, rows){
          if(error) 
          {
            console.log(error);
                                      
          } 
            else 
            {
 
              connection.query(`DELETE FROM resign_employeetab WHERE Employee_Id = '${id}'`, function(error, data){
                if(error){
                  throw error
                } else{
                  res.redirect('/admin');
                }
              })
                
            }
            
        })
      }

    })

   
});






 

module.exports = router;
