var express = require('express');
var router = express.Router();
var name = null;
var RequestedDate = null;
var revrid = null
var radnm = Math.random() * 100000
var ID = Math.ceil(radnm)
var UniqueId = ID
let employee_Mock_Given = 0
let employee_Mock_Taken = 0
const nodemailer = require('nodemailer');

const app = express()
var session = require('express-session')
var bodyParser = require('body-parser')
var flash = require('express-flash')
app.set('view engine')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(session({
  secret: 'secret key',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 60000
  }
}))
app.use(flash())




debugger
var mysql = require('mysql');
var connection = mysql.createConnection({

  connectionLimit: 1000,
  host: 'localhost',
  user: 'root',
  password: 'Giri#1290',
  database: 'signiwis_schema',
  port: 3306

});

debugger
/* GET home page. */
this.oUser_ID
var vid = null
router.get(['/Employee_review', '/:id'], function (req, res, next) {
  debugger

  this.oUser_ID = req.params.id
  var message = req.flash('success')

  var query = `SELECT * FROM employee_table`
  var query2 = `SELECT Requested_Date FROM admin_notification WHERE User_Id = ${req.params.id}`
  var query3 = `select Employee_Mock_Taken,Employee_Mock_Given from employee_table where Employee_Id = '${req.params.id}'`
  var query4 = `select Employee_Mock_Taken,Employee_Mock_Given from employee_table where Employee_Id = '${req.session.EmpId}'`

  connection.query(query, function (error, data, rows) {
    connection.query(query2, function (error2, data2, rows2) {
      debugger
      for (let i = 0; i <= data.length; i++) {
        if (data[i].Employee_Id == req.params.id) {
          debugger
          res.render('EmployeeRating', { title: oUser_ID, message, singleUserData: data })
          if (data2.length == 0) {
            // RequestedDate = data2[0].Requested_Date;
            revrid = data[i].Employee_Id
            return name = data[i].Employee_Name, RequestedDate, revrid, vid;
          } else {
            RequestedDate = data2[0].Requested_Date;
            revrid = data[i].Employee_Id
            return name = data[i].Employee_Name, RequestedDate, revrid, vid;
          }

        }
        else {

        }
        connection.query(query3, function (error3, data3, row3) {
          if (error3) {
            throw error3
          }
          else {
            debugger
            employee_Mock_Given = data3[0].Employee_Mock_Given

            if (employee_Mock_Given == null) {
              employee_Mock_Given = 0

            }
          }
        })
        connection.query(query4, function (error4, data4, row4) {
          debugger
          if (error4) {
            debugger
            throw error4
          } else {
            debugger
            employee_Mock_Taken = data4[0].Employee_Mock_Taken
            if (employee_Mock_Taken == null) {
              employee_Mock_Taken = 0
            }
          }
        })
      }
    })

  })


  // res.render('EmployeeRating', { title: oUser_ID });

});


debugger
var date = new Date()

var sStrRevrs = date.toISOString().split(":")[0].split("T")[0]
var cDate = sStrRevrs.split("-")
var vFormattedDate = cDate[2] + "/" + cDate[1] + "/" + cDate[0]

debugger

router.post(['/review', '/:id'], function (req, res, next) {
  debugger
  var Job_Knowladge = req.body.Job_Knowladge_comm

  // var Job_Knowladge = req.body.Job_Knowladge+"-"+req.body.Job_Knowladge_comm



  var Work_Quality = req.body.Work_Quality + "-" + req.body.Work_Quality_comm

  var Attendance_Punctuality = req.body.Attendance_Punctuality + "-" + req.body.Attendance_Punctuality_comm

  var Productivity = req.body.Productivity + "-" + req.body.Productivity_comm

  var Communication_listening_Skill = req.body.Communication_listening_Skill + "-" + req.body.Communication_listening_Skill_comm

  var Behaviour = req.body.Behaviour + "-" + req.body.Behaviour_comm

  var Employee_Id = this.oUser_ID

  var Review_Date = vFormattedDate

  var Overall_Feedback = req.body.Overall_Feedback

  var Overall_Ratings = req.body.Overall_Ratings

  var Reviewer_Id = req.session.EmpId

  var Reviewer_Mail = req.session.Email

  // --------------rew-ststus----------

  var Req_Date = RequestedDate
  var Rew_Date = vFormattedDate
  var Emp_name = name
  var Rew_name = req.session.Name
  var Status = "Done"
  var Result = req.body.Overall_Ratings




  debugger

  connection.query(`SELECT * FROM employee_table`, function (error, hariData) {
    debugger
    if (error) {
      debugger
      console.log(error)
    } else {
      debugger



      console.log(hariData);


      let currentEmployee = hariData.find(employee => employee.Employee_Id == Employee_Id);
      let visitedMentors = [];
      let emailsArray = [];

      if (currentEmployee) {

        while (currentEmployee && currentEmployee.mentorId != null) {

          if (visitedMentors.includes(currentEmployee.Employee_Id)) {
            console.log("Circular reference detected, stopping further checks.");
            break;
          }


          visitedMentors.push(currentEmployee.Employee_Id);


          emailsArray.push(currentEmployee.Employee_Email);
          console.log(`Employee Email: ${currentEmployee.Employee_Email}, Mentor ID: ${currentEmployee.mentorId}`);


          currentEmployee = hariData.find(mentor => mentor.Employee_Id == currentEmployee.mentorId);


          if (currentEmployee) {
            emailsArray.push(currentEmployee.Employee_Email);
            console.log(`Mentor Email: ${currentEmployee.Employee_Email}, Mentor ID: ${currentEmployee.mentorId}`);
          }
        }


        console.log("Emails array:", emailsArray);
        var uniqueMailsIds = [... new Set(emailsArray)]
        console.log(uniqueMailsIds)


        const transporter = nodemailer.createTransport({
          service: "gmail",
          port: 465,
          secureConnection: false,
          auth: {
            user: 'ganeshjkoppad@gmail.com',
            pass: 'wpwyawesxyolwdpc'
          }

        });

        uniqueMailsIds.forEach(email => {
          let mailOptions = {
            from: `${Reviewer_Mail}`,
            to: email,
            subject: 'Mock Ratings',
            text: `
Hi All,

I hope everyone is doing well.

We have completed the recent mock assessment and are pleased to share your ratings and feedback below.

Mock Rating: ${Overall_Ratings}

Feedback:
- Work Quality:                 ${Work_Quality}
- Attendance/Punctuality:       ${Attendance_Punctuality}
- Productivity:                 ${Productivity}
- Communication/Listening Skills: ${Communication_listening_Skill}
- Behavior:                     ${Behaviour}

Please feel free to reach out if you have any questions.




Thanks & Regards,
${Rew_name}  
Signiwis Technologies `,



          }




          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              req.flash('success', error);
            }
            else {
              req.flash('success', `Mail sent succesfully`);
              // res.redirect(`${Employee_Id}`)
            }
          })

        })








      } else {
        console.log(`No employee found with Employee_Id: ${Employee_Id}`);

      }
















      // console.log(hariData);
      // // res.redirect(`${Employee_Id}`)


      // let currentEmployee = hariData.find(employee => employee.Employee_Id == Employee_Id);
      // let visitedMentors = [];  // To track visited mentors to avoid infinite loops
      // let emailsArray = []; 
      // if (currentEmployee) {
      //   // Loop until the mentId becomes null
      //   while (currentEmployee && currentEmployee.mentorId != null) {
      //     console.log(`Employee Email: ${currentEmployee.Employee_Email}, Mentor ID: ${currentEmployee.mentorId}`);

      //     // Find the mentor whose Employee_Id matches the current employee's mentId
      //     currentEmployee = hariData.find(mentor => mentor.Employee_Id == currentEmployee.mentorId);

      //     // If mentor is found, print the details
      //     if (currentEmployee) {
      //       console.log(`Mentor Email: ${currentEmployee.Employee_Email}, Mentor ID: ${currentEmployee.mentorId}`);
      //     }
      //   }

      // } else {
      //   console.log(`No employee found with Employee_Id: ${Employee_Id}`);
      // }









    }
  })





  debugger

  var sql = `INSERT INTO employee_rating (UniqueId, Employee_Id, Rew_name, Review_Date, Employee_Job_knowledge, Employee_Work_Quality, Employee_Attendence_punctuality, Employee_Productivity, Employee_Communication, Employee_Behaviour, Employee_Total_Rating, Employee_Overall_Feedback, Reviewer_Id, Table_Id) 
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`;




  connection.query(sql, [UniqueId, Employee_Id, Rew_name, Review_Date, Job_Knowladge, Work_Quality, Attendance_Punctuality, Productivity, Communication_listening_Skill, Behaviour, Overall_Ratings, Overall_Feedback, Reviewer_Id, Reviewer_Id + Employee_Id], function (error, data, rows) {
    debugger
    if (error) {
      debugger
      // req.flash('error'," req sent already")
      // res.redirect(`Employee_review/${vid}`)
      // res.send("Request Already Sent")
      console.log(error);

    }
    else {
      debugger
      console.log('data created successfully');
      req.flash('success', "Data submitted successfully");

      // res.redirect(`/Employee_review/${vid}`)

      // res.redirect("/user")

      // res.send("success")

    }




  })
  debugger
  var sql2 = `INSERT INTO review_status (Unique_Id, Employee_Id,Req_Date,Rew_Date,Emp_name,Rew_name,Status,Result) 
   VALUES (?,?,?,?,?,?,?,?)`;
  connection.query(sql2, [UniqueId, Employee_Id, Req_Date, Rew_Date, Emp_name, Rew_name, Status, Result], function (error, data, rows) {
    debugger
    if (error) {
      debugger
      //  req.flash('error'," req sent already")
      //  res.redirect(`/Employee_review/${vid}`)
      req.flash('success', "Req already sent");
      res.redirect(`${Employee_Id}`)

    }
    else {
      debugger
      // console.log('data created successfully');
      // req.flash('error'," Saved successfully")
      // res.redirect(`/Employee_review/${vid}/review`)
      UniqueId = UniqueId - 1
      // res.send("success")
      // res.render('EmployeeRating', {title:oUser_ID, singleUserData:data })

    }

  })

  var sql3 = `UPDATE admin_notification SET Status = "${Status}" WHERE User_Id = "${Employee_Id}"`;

  //    connection.query(sql3,(error, data,)=>{
  //     debugger
  //       if(error){
  // debugger
  //         console.log(error);
  //       } else{
  //         debugger
  //         // console.log("working fine");

  //         // res.render('user')

  //       }
  //   })

  // connection.query(`DELETE FROM admin_notification WHERE User_Id = ${Employee_Id}`,(error,data)=>{
  //  debugger
  // // 
  // req.flash('success',"Working fine")
  // res.redirect(`${Employee_Id}`)
  // })
  // res.render('EmployeeRating', { title: oUser_ID });

  var sql4 = `UPDATE employee_table SET Employee_Mock_Given = "${parseInt(employee_Mock_Given) + 1}" WHERE Employee_Id = "${Employee_Id}"`
  debugger
  connection.query(sql4, (error, data) => {
    debugger
    if (error) {
      debugger
      throw error
    }
    else {
      debugger
      console.log("working fine Seema");
    }
  })

  var sql5 = `UPDATE employee_table SET Employee_Mock_Taken = "${parseInt(employee_Mock_Taken) + 1}" WHERE Employee_Id = "${Reviewer_Id}"`
  debugger
  connection.query(sql5, (error, data) => {
    debugger
    res.redirect(`${Employee_Id}`)
  })




});

module.exports = router;
