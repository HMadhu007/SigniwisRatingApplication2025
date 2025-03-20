var express = require('express');
var router = express.Router();
const nodemailer = require("nodemailer");

// var database = require('../database')
var mysql = require('mysql');

var connection = mysql.createConnection({
  connectionLimit: 1000,
  host: 'localhost',
  user: 'root',
  password: 'Signiwis@123',
  database: 'signiwis_schema',
  port: 3306

});


/* GET users listing. */
router.get('/', function (req, res, next) {



  var loggedUser = req.session.EmpId
  var message = req.flash('success');
  if (req.session.currId) { }
  connection.query(`SELECT * FROM admin_notification where selectedId = ${req.session.EmpId}`, function (error, data) {
    
    connection.query('SELECT * FROM employee_table', function (err, data1) {
      var LeadCheck = "hidden";
      debugger
      data1.forEach((val)=>{
        if(val.Employee_Id == loggedUser && val.position == "Lead"){
          LeadCheck = "visible";
        }
      })

      connection.query('SELECT * FROM review_status', function (error, data2) {
        connection.query(`SELECT * FROM admin_notification`, function (error, allData) {

          
          console.log(data);

          if (error) { throw error } else {

            //  var selected_Id=data.filter(element=>element.selectedId===loggedUser)

            res.render('user', { title: "Welcome to Signiwis", message, session: req.session, oReviewEmpData: data, oEmp_Data: data1, oEmp_ReviewStatus: data2, loggedUser1: loggedUser, LeadCheck:LeadCheck})
            
          }


        })








      })

    })
  })
}

);


router.get('/mail/:tableUID/:id', function (req, res, next) {
  debugger
  // var message = req.flash('success');
  let table_UId = req.params.tableUID;
  let id = req.params.id;

  res.send(`
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
    <script src="https://kit.fontawesome.com/e799d6a9ed.js" crossorigin="anonymous"></script>
 
 
  <div style="height:100%; width:100%; filter: blur(5px);" id="divContainer">
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
  <div class="container-fluid">
    <a class="navbar-brand" href="/user">
    <img src='../images/logo.jpg' alt="" height="90px" width="150px" style="margin-left: 10px;">
     
    </a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <!-- <div class="row"> -->
        <div class="col-md-10" >
          <div class="row">
            <div class="col-md-2"></div>
            <div class="col-md-8">
          <h2 id="orgTitle" style="color:rgb(34, 155, 199) ;">--SIGNIWIS TECHNOLOGIES--</h2>
 
            </div>
            <div class="col-md-2"></div>
          </div>
 
        </div>
        <div class="col-md-2">
          <div style="display: flex; align-items: center; justify-content: space-evenly;">
            <div style="display: flex; justify-content: space-between; gap: 8px;">
              <button   style="" onclick="displayEmpDetails()">Update Review</button>
              <img src="../images/notification.png" onclick="UserNotification()"  id="UserNotification" alt="User" width="34px" height="30px"/>
              <a href="./home"><img src="../images/logout-8-512.png" alt="Logout" id="ologout" width="30px" height="30px"/></a>
          </div>
        </div>
        </div>
        <!-- </div> -->
      </div>
    </div>
 
</nav>
  </div>
 
 
    <div style=" width:600px;height:350px; position: absolute; top: 20%;left:28%; background-color:white;padding: 30px; border-radius: 5px;z-index: 50; box-shadow:0 4px 8px 0 rgba(3, 3, 2, 3);" id="Mode_of_review">
    <a style="position:relative; left:530px; top:-20px; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: 50%; background-color: #f0f0f0; font-size: 30px; text-decoration: none;" href="/user"><i class="fa-solid fa-xmark"></i></a>
    <form action="/user/sendmail/${id}/${table_UId}" method="post"  style="padding:10px;">
 
     
      <div class="mb-3">
      <label for="exampleInputPassword1" class="form-label">Select Mode :</label>
 
        <select  class="form-select form-select-sm" name="mode" aria-label="Small select example" required >
          <option selected>Select mode </option>
          <option value="Offline">Offline</option>
          <option value="Online">Online</option>
        </select>
      </div>
      <div class="mb-3">
        <label for="exampleInputPassword1" class="form-label">Select Date :</label>
        <input type="date" class="form-control" name = "date" id="exampleInputPassword1">
      </div>
     
      <button type="submit" class="btn btn-primary" value="Add" style="position:absolute;top:300px;left:500px;" >Submit</button>
    </form>
  </div>
   
    `)
}),

  router.get('/delete/:id', function (req, res, next) {
    debugger

    var id = req.params.id
    connection.query(`DELETE FROM accept_reject where emp_id = '${id}'`, function (err, data) {
      debugger
      connection.query(`DELETE FROM admin_notification where User_Id = '${id}'`, function (error, deleteAdminNotofication1) {
        if (err) {
          console.log(err);

        } else {
          req.flash('success', `ID  ${req.params.id} Removed successfully`);
          res.redirect('/user')
        }
      })

    })
  })

router.post(['/sendmail/:id/:tableUID'], function (req, res, next) {

  debugger
  let id = req.params.id;
  let table_UId = req.params.tableUID;
  connection.query(`SELECT * FROM employee_table WHERE Employee_Id = '${id}'`, function (err, data1) {
    debugger
    console.log(data1)
    var employee_id1 = null
    for (var i = 0; i < data1.length; i++) {

      employee_id1 = data1[i].Employee_Id
    }

    if (err) {
      throw err;
    } else {
      connection.query(`DELETE FROM accept_reject where emp_id = '${employee_id1}' `, function (err, data) {
        // connection.query(`DELETE FROM admin_notification where User_Id = '${employee_id1}'`, function (error, deleteAdminNotofication) {


          
        // })
        if (err) {
          console.log(err);
        } else {
          const transporter = nodemailer.createTransport({
            service: "gmail",
            secureConnection: false,
            auth: {
              user: 'ganeshjkoppad@gmail.com',
              pass: 'wpwyawesxyolwdpc'
            }



          });

          transporter.verify(function (error, success) {
            if (error) {
              console.log(error);
            } else {
              console.log('Server is ready to take our messages');
            }
          });

          const options = {
            from: "Derr",
            to: `${data1[0].Employee_Email}`,
            subject: "Mock Update",
            html: `<p> Hi <strong>${data1[0].Employee_Name} </strong> your mock is scheduled on <strong>${req.body.date}</strong>, It will be taken by  <strong>${req.session.Name}</strong> in ${req.body.mode} mode Please be prepared for the mock. </br> </br>
                                                                          
            <strong>
            -- </br>
            Thanks & Regards, </br>
            Signiwis Technologies.
            </strong> </br>
            <a href="https://www.signiwis.com/">www.signiwis.com</a>
            </p>
            `
          }

          transporter.sendMail(options, (error, info) => {
            if (error) {
              req.flash('success', err);
            }
            else {
                  var updateStatus = `UPDATE admin_notification SET Status = "Done" WHERE User_Id = ${employee_id1} && selectedId = ${req.session.EmpId}`;

                  connection.query(updateStatus, (error, data) => {
                    if(error)
                      throw error;
                    else{
                      req.flash('success', `Mail sent succesfully`);
                      res.redirect('/user')
                    }
                  })
                  
            }
          })
        }
      })
    }
  })


})

var date = new Date()
var sStrRevrs = date.toISOString().split(":")[0].split("T")[0]
var cDate = sStrRevrs.split("-")
var vFormattedDate = cDate[2]+"/"+cDate[1]+"/"+cDate[0]

router.post('/leadMockRequest',function (req, res){
 var User_Id = req.session.EmpId;
 var selectedId = req.body.Reviewer_name.split(',')[1] // Mentor Id
 var MenteeId = req.body.Reviewer_name2.split(',')[1]
 var MenteeName = req.body.Reviewer_name2.split(',')[0]
 var sMockType = req.body.Mock_Type;

 const reqId = Math.floor(Math.random() * 1000000);
 const requestId = 'REQID' + reqId; 
 const prefix = 'M001';
 const randomNumber = Math.floor(Math.random() * 10000);
 const meetingId = `${prefix}${randomNumber.toString().padStart(4, '0')}`;


 var sql = `INSERT INTO admin_notification (User_Id, Requested_Date, Status, Reviewer_name, Mock_Type, Request_Id, selectedId) VALUES (?, ?, ?, ?, ?, ?, ?)`;
 var reference = ` INSERT into accept_reject (Request_Id, emp_id, name, request_date, type_of_mock, table_UId) VALUES (?, ?, ?, ?, ?, ?)`

 connection.query(sql, [req.body.Reviewer_name2.split(',')[1], vFormattedDate, "Pending",meetingId, sMockType, requestId,selectedId], (error, results)=>{
  debugger
  if(error){
      if(error.code == 'ER_DUP_ENTRY'){
        req.flash('success', `Request already sent`);
        res.redirect("/user")
      }
      else{
        req.flash('error', `Something went wrong`);
        res.redirect("/user")
      }

    debugger
  }
  else{
    connection.query(reference,[requestId, MenteeId, MenteeName, vFormattedDate,sMockType,meetingId],(err, data)=>{
      debugger
      if(err){
        req.flash('success', `Something went wrong`);
        res.redirect("/user")
      }
      else{
        req.flash('success', `Request sent succesfully`);
        res.redirect("/user")
      }
    })
    
  }

 })

 
})









module.exports = router;