var express = require('express');
let ejs = require('ejs');
var router = express.Router();
const puppeteer = require('puppeteer');
const path = require('path');



var mysql = require('mysql');
const session = require('express-session');

var connection  = mysql.createConnection({
    connectionLimit : 1000,
    host     : 'localhost',
    user     : 'root',
    password : 'Signiwis@123',
    database : 'signiwis_schema',
    port : 3306
});

this.User_Id = null

router.get(['/','/:id'], (req, res)=>{
  debugger
    var message = req.flash('sucess')

    UID = req.params.id
    this.User_Id = req.params.id
    UserID = UID
    var query = `select * from employee_rating 
    right join employee_table on employee_rating.Employee_Id = employee_table.Employee_Id`
    UID = req.params.id
    this.User_Id = req.params.id
    UserID = UID
    var query = `select * from employee_rating 
    right join employee_table on employee_rating.Employee_Id = employee_table.Employee_Id`
    req.session.UID = UID
    console.log( this.User_Id)
    connection.query(query, function(error, data, rows){
      debugger
      console.log(data)
        singleUserData = data
        console.log(data)
        res.render('adminMDPopuppdf', {title:UID,message,session:req.session, sampleData:data, currId:UID})
  
     })
})

var date = new Date()
debugger
var sStrRevrs = date.toISOString().split(":")[0].split("T")[0]
var cDate = sStrRevrs.split("-")
var vFormattedDate = cDate[2]+"/"+cDate[1]+"/"+cDate[0]
debugger
// console.log("Current Date", cDate[2]+"/"+cDate[1]+"/"+cDate[0])

// router.post('/rating',(req,res,next)=>{

//   var UserID = "MD102";
// var singleUserData=null
// var ReviewDate = "nulldate"
// var ReviewName = "nullName"
// var Status = "nullStatus"
// var ReviewRate = 5

//     // var UID = req.params.id
//     var sql = `INSERT INTO employee_notifaction (Employee_Id, Requested_Date, Review_Date, Review_Rating, Reviewer_Name, Status) VALUES ("${UserID}", "${date}", "${ReviewDate}", "${ReviewRate}", "${ReviewName}", "${Status}")`;
   
//                 connection.query(sql, (error, results)=>{

//                 if(error) 
//                 {
                    
//                     res.send("Error occured") 
                         
//                 } 
//                 else 
//                 {
//                     // console.log('data created successfully');
//                     res.redirect("admin")
                    
//                 }
//                 // res.redirect('admin')
        
//             })
  
// })

router.post(['/rating','/:id'],(req,res,next)=>{
debugger

  var Status = "Pending"
  
      // var UID = req.params.id
      var sql = `INSERT INTO admin_notification (User_Id, Requested_Date, Status) VALUES (?, ?, ?)`;
     
                  connection.query(sql, [this.User_Id, vFormattedDate, Status], (error, results)=>{
  
                  if(error) 
                  {
                    debugger
                    req.flash('sucess', "Request already sent")
                    res.redirect(`${this.User_Id}`);
                  } 
                  else 
                  {
                    debugger
                      console.log('data created successfully');
                      // res.send("data created successfully")
                    req.flash('sucess', "Request sent succesfully")

                      // res.render('adminMDPopup')
                      
                    res.redirect(`${this.User_Id}`)
                  }
          
              })
    
  })

  router.get('/delete/:id/:id2', function(req,res,next){
    debugger
    var id = req.params.id;
    var id2 = req.params.id2;
    connection.query(`DELETE FROM employee_rating WHERE UniqueId = ${id}`, function(error,data){
        debugger
        if(error)
        {
            throw error
        }
        else
        {
            debugger
            res.redirect(`/adminMDPopup/${id2}`)
        }
    })
 })

 router.get('/empDelete/:id',function(req,res,next){
  debugger
    var id = req.session.UID;
    var sql=`Select Employee_Name from employee_table WHERE Employee_Id = ${id}`
    var sqlData=`Select * from employee_table WHERE Employee_Id = ${id}`
    var empName;

    var employeeName;
    var employeeDesignation;
    var employeeEmail;
    var employeeDept;
    var employeePassword;
    var employeeIcon;
    var employeeeStatus;

    var insertData = `INSERT INTO resign_employeetab (Employee_Id, Employee_Name, Employee_Designation, Employee_Email,
      Employee_Department, Employee_Password,
      Employee_Icon,Employee_Status,Employee_Mock_Taken,Employee_Mock_Given,IMG_file)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`;

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
        employeeeStatus= "Resigned"
        employeeMockTaken= data[0].Employee_Mock_Taken
        employeeMockGiven= data[0].Employee_Mock_Given
        employeeImg = data[0].IMG_file
        connection.query(insertData,[id,employeeName,employeeDesignation,employeeEmail,employeeDept,employeePassword,employeeIcon,employeeeStatus,employeeMockTaken,employeeMockGiven,employeeImg],function(error, data, rows){
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
    })


    



    connection.query(sql,function(error,data){
      if(error)
      {
          throw error
      }
      else
      {
        // debugger
        empName= data[0].Employee_Name
      }
    })
    
    connection.query(`DELETE FROM employee_table WHERE Employee_Id = ${id}`,function(error,data){
      debugger
      if(error)
      {
          throw error
      }
      else
      {
        req.flash('success',`${id} Employee ${empName} Deleted Successfully`);
        res.redirect("/admin");
      }
    })
 })


  router.get('/empEdit/:id',function(req,res,next){
    debugger
      var empId=req.session.UID;
      var empName=req.query.empEditName;
      var empEmail=req.query.empEditEmail;
      var empDesignation=req.query.empEditDesignation;
      var empDept=req.query.empEditDept;
      var empStatus = req.query.Status;

      var sql=`UPDATE  employee_table SET 
      Employee_Name = "${empName}",
      Employee_Designation = "${empDesignation}",
      Employee_Email = "${empEmail}",
      Employee_Department = "${empDept}",
      Employee_Status = "${empStatus}"
       WHERE Employee_Id = "${empId}"
      `;

      connection.query(sql,function(error,data){
        if(error){
          throw error;
        }else{
          // req.flash('success',`${empId} Employee Updated!!`);
         req.flash('sucess',`${empId} Employee Updated!!`);
          res.redirect(`/adminMDPopup/${empId}`)
        }
      })
  })

module.exports = router;



