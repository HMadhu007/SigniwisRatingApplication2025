debugger
var express = require('express');
var router = express.Router();
var router2 = express.Router();

// var popup = require('popups');

// var database = require('../database')


debugger
const { request } = require('../app');
const session = require('express-session');
debugger
var mysql = require('mysql');
// const app = require('../app');
var connection  = mysql.createConnection({
    connectionLimit : 1000,
    host     : 'localhost',
    user     : 'root',
    password : 'Giri#1290',
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
      debugger
      var id = req.params.id;
      connection.query(`DELETE FROM resign_employeetab WHERE Employee_Id = ${id}`, function(error, data){
        if(error){
          debugger
          req.flash('success', error)
          res.redirect('/')
        } else{
          debugger
          req.flash('success', id+" Deleted successfully")
          res.redirect('/resignEmpPopup');
        }
      })
    })
    router.get('/delete/:id/view', function(req, res, next){
      debugger
      // var id = req.params.id;
      // connection.query(`DELETE FROM resign_employeetab WHERE Employee_Id = ${id}`, function(error, data){
      //   if(error){
      //     debugger
      //     req.flash('success', error)
      //     res.redirect('/')
      //   } else{
      //     debugger
      //     req.flash('success', id+" Deleted successfully")
          
      //   }
      // })

      // res.redirect('/adminMDPopup');
      // res.redirect('/admin');

      debugger
    // var message = req.flash('sucess')

    // UID = req.params.id
    // this.User_Id = req.params.id
    // UserID = UID
    // var query = `select * from employee_rating 
    // right join resign_employeetab on employee_rating.Employee_Id = resign_employeetab.Employee_Id`
    // req.session.UID = UID
    // console.log( this.User_Id)
    // connection.query(query, function(error, data, rows){
    //   debugger
    //   console.log(data)
    //     singleUserData = data
    //     // res.render('adminMDPopup', {title:UID,message,session:req.session, sampleData:data})
    //     return res.redirect(`/adminMDPopup/${UID}`,{title:UID,message,session:req.session, sampleData:data})
  
    //  })

    debugger

    var id = req.params.id;
    var sql=`Select Employee_Name from resign_employeetab WHERE Employee_Id = ${id}`
    var sqlData=`Select * from resign_employeetab WHERE Employee_Id = ${id}`
    var empName;

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
    Employee_Icon,Employee_Status,Employee_Mock_Taken,Employee_Mock_Given,IMG_file,dateOfBirth,mobil,employeeNo) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?,?,?)`;

    connection.query(sqlData,function(error,data){
      if(error)
      {
          throw error
      }
      else
      {
        debugger
        employeeName= data[0].Employee_Name
        employeeDesignation= data[0].Employee_Designation
        employeeEmail= data[0].Employee_Email
        employeeDept= data[0].Employee_Department
        employeePassword= data[0].Employee_Password
        employeeIcon= data[0].Employee_Icon
        employeeeStatus= "Released";
        employeeMockTaken= data[0].Employee_Mock_Taken;
        employeeMockGiven= data[0].Employee_Mock_Given;
        var img = req.file.buffer.toString('base64');
        var dateOfBirth = data[0].dateOfBirth;
        var mobile = data[0].mobile;
        var employeeNo = data[0].employeeNo;
        connection.query(insertData,[id,employeeName,employeeDesignation,employeeEmail,employeeDept,employeePassword,employeeIcon,employeeeStatus,employeeMockTaken,employeeMockGiven,img, dateOfBirth, mobile, employeeNo],function(error, data, rows){
          if(error) 
          {
            debugger
            
            console.log(error);
                                      
          } 
            else 
            {
              debugger
                
                
            }

            
        })
      }

      // connection.query(sql,function(error,data){
      //   if(error)
      //   {
      //       throw error
      //   }
      //   else
      //   {
      //     // debugger
      //     empName= data[0].Employee_Name
      //   }
      // })

      connection.query(`DELETE FROM resign_employeetab WHERE Employee_Id = ${id}`,function(error,data){
        debugger
        if(error)
        {
            throw error
        }
        else
        {
          // req.flash('success',`${id} Employee ${empName} Deleted Successfully`);
          // res.redirect("/admin")
        }
      })

    
    res.redirect('/admin');
    

    })

   
});






 

module.exports = router;
