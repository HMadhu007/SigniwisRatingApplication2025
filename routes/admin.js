debugger
var express = require('express');
var router = express.Router();
var router2 = express.Router();
var multer = require('multer')
const axios = require('axios');
var request1 = require("request");
const upload = multer({storage:multer.memoryStorage()})
const { LocalStorage } = require('node-localstorage');
const localStorage = new LocalStorage('../localStorage');

// var popup = require('popups');

// var database = require('../database')

const { request } = require('../app');
const session = require('express-session');
var mysql = require('mysql');
const app = require('../app');
var connection = mysql.createConnection({
    connectionLimit: 1000,
    host: 'localhost',
    user: 'root',
    password: 'Signiwis@123',
    database: 'signiwis_schema',
    port: 3306

});

var BusyIndicator = {
    "BusyIndicator":"hidden"
  }

/* GET users listing. */
router.get('/',
   
    function (req, res, next) {
        debugger
        var message = req.flash('success');
        var message1 = req.flash('success');
        var largestNumber = `SELECT MAX(Employee_Id) AS greatest_value
    FROM (
        SELECT Employee_Id FROM employee_table
        UNION
        SELECT Employee_Id FROM resign_employeetab
    ) AS Largest_value;`

        connection.query('SELECT * FROM employee_table', function (error, data) {

            debugger

            let s = JSON.stringify(data)
            
            localStorage.setItem("data", s)
            connection.query('SELECT * FROM review_status', function (error, data2) {
                connection.query(largestNumber, function (error3, data3) {
                   
                   // Admin Notification

                   connection.query('SELECT * FROM admin_notification', function (error, AdminNotifyData) {

                    connection.query('SELECT * FROM designation', function (error, data4) {

                        res.render('admin', { title: "Welcome to Signiwis", message, session: req.session, sampleData: data, sampleData2: data2, newId: data3, designation: data4, AdminNotifyData:AdminNotifyData, BusyIndicator:BusyIndicator })

                    })

                })

                })

            })

            //    res.render('admin', {title:"Welcome to Signiwis", session:req.session, sampleData:data})

        });


    });

router.get('/resign', function (req, res, next) {

    // connection.query('SELECT * FROM employee_table', function(error, data){

    res.redirect('/resignEmpPopup')

    // })
});

router.get('/admin/:id', function (req, res) {
    debugger
    var id = request.params.id

    var query = `SELECT * FROM employee_table WHERE Employee_Id = '${id}'`

    connection.query(query, function (error, data, rows) {
        debugger

        res.redirect('adminMDPopup', { title: "Welcome to Signiwis", session: req.session, sampleData: data })

    })

})


router.post('/designation', function (req, res) {
    debugger;
    var sNewDesignation = req.body.designationName;
    var sql = `INSERT INTO designation (designationName) values(?)`
    connection.query(sql, [sNewDesignation], function (error, data) {
        if (error) {
            console.log(error);
        } else {
            res.redirect('/admin');
        }
    })

})


router.get('/fetchuser', (req, res) => {
    debugger

    var UId = req.body.EmpIdForFeatchData

    var query = `SELECT * FROM employee_table WHERE Employee_Id = '${UId}'`



    connection.query(query, function (error, data, rows) {
        debugger
        session.UId = UId
        res.render('admin', { title: "Welcome to Signiwis", sampleData: data })

        debugger

    })
})

// Admin Notification Delete

router.get('/delete/:id/:sId/:mocktype/:status/:reqId', function (req, res, next) {
    debugger
    var id = req.params.id;
    if(req.params.status == 'Accepted'){

        req.flash('success', `Can't delete, untill the mock get's complete`);
        res.redirect("/admin"); 

    }
    else{
        connection.query(`DELETE FROM admin_notification WHERE User_Id = '${id}' && selectedId = '${req.params.sId}' && Mock_Type = '${req.params.mocktype}' && Status = '${req.params.status}' && Request_Id = '${req.params.reqId}'`, function (error, data) {
        
            if (error) {
                req.flash('success', `Something went wrong`);
                res.redirect("/admin");
    
            }
            else {                
                    req.flash('success', `Data deleted`);
                    res.redirect("/admin");          
            }
        })
    }
})


router.post('/addEmployee', upload.single('Add_Employee_Image'), async (req, res, next) => {
    
    try {
        var empId = req.body.Add_Employee_Id
        var mentor = req.body.Add_Mentor
        var position = req.body.Add_Position
        const accessToken = await generateAccessToken();
        console.log(accessToken);
        const url = `https://api.greythr.com/employee/v2/employees?page=1&size=180`
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Access-Token': accessToken,
                'x-greythr-domain': `signiwistech1.greythr.com`
            }
        })
        const data = await response.json();
        var empDetails
        data.data.forEach((x)=>{
            if(x.employeeNo==empId){
                empDetails=x
            }})
        req.session.employeeId = empDetails.employeeId;
        req.session.dateOfBirth = empDetails.dateOfBirth;
        req.session.email = empDetails.email;
        req.session.employeeNo = empDetails.employeeNo;
        req.session.gender = empDetails.gender;
        req.session.mobile = empDetails.mobile;
        req.session.name = empDetails.name;
    
        var empName = empDetails.name;
        var empDesignation = req.body.Add_Employee_Designation;
        var empEmail = empDetails.email;
        var empDept = req.body.Add_Employee_Department;
        var empGender = empDetails.gender;
        var empPassword = 'Default@123';
        var empStatus = 'Working';
        var empMockTaken = 0;
        var empMockGiven = 0;
        var img = req.file.buffer.toString('base64');
        var dateOfBirth = empDetails.dateOfBirth;
        var mobile = empDetails.mobile;
        var employeeNo = empDetails.employeeNo;

        var file = req.file.uploaded_image;
       
        var sql = `INSERT INTO employee_table (Employee_Id, Employee_Name, Employee_Designation, Employee_Email,
    Employee_Department, Employee_Password,
    Employee_Icon,Employee_Status,Employee_Mock_Taken,Employee_Mock_Given,IMG_file,dateOfBirth,mobil,employeeNo,mentor,position) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?,?,?,?,?)`;


        connection.query(sql, [employeeNo, empName, empDesignation, empEmail, empDept, empPassword, empGender, empStatus, empMockTaken, empMockGiven, img, dateOfBirth, mobile, employeeNo, mentor, position], function (error, data, rows) {
            if (error) {
                
                console.log(error);
                req.flash('success', "Something went wrong");
                res.redirect("/admin")
                

            }
            else {
                
                console.log('data created successfully');
                req.flash('success', "Employee Added Successfully");
                res.redirect("/admin")

            }
        }
        )
    } catch (error) {
        
        req.flash('success', error)
        res.redirect('/admin')

    }

})
async function generateAccessToken() {
    const response = await axios({
        url: "https://signiwistech1.greythr.com/uas/v1/oauth2/client-token",
        method: "post",
        data: "grant_type=client_credentials",
        auth: {
            username: "Ganesh",
            password: "89dd801c-a874-4ec5-b59d-67fa34153d18"
        }
    })
    return response.data.access_token;
}


router.post('/updatementor', function (req, res) {
    ;
    try {

        const mentor = req.body.updateMentor;
    const position = req.body.position_val;
    var id = req.body.id

    if(position == "Lead"){

        var updateMentor = `UPDATE employee_table SET position = '${position}', mentor = 'Lead', mentorId ='${id}' WHERE Employee_Id = "${id}"`
        connection.query(updateMentor, function (err, data) {
            if (err) {
                req.flash('success', `Something went wrong`);
                console.log(err)
                res.redirect('/admin')
            }
            else {
                req.flash('success', `Updated succesfully`);
                res.statusCode
            }
        })

    }
    else{
        var sqlEMPTable = `SELECT  Employee_Name,Employee_Email FROM employee_table WHERE Employee_Id="${mentor}"`;

    // var mailId = `select Employee_Name,Employee_Email from employee_table where Employee_Id="${mentor}"`
     connection.query(sqlEMPTable, function (error,mailData) {
        debugger
        if (error) {
            debugger

            console.log(error);
            console.log("haere is double error")

        }
        else {
                debugger
                var mailname =mailData[0].Employee_Name
                var mailsendid
                // console.log(data)
                console.log(mailData);
                if (mentor == undefined || position == undefined || mentor == "" || position == "") {
                    req.flash('error', 'Please provide both mentor and position values.');

                    // return res.redirect("/admin");
                }
                else {
                        
                                        var updateMentor = `UPDATE employee_table SET position = '${position}', mentor = "${mailname}", mentorId ='${mentor}' WHERE Employee_Id = "${id}"`
                    
                                        connection.query(updateMentor, function (err, data) {
                                            if (err) {
                                                console.log("error hai yaha")
                                                throw err
                                            }
                                            else {
                                                console.log("Record updated successfully");
                                                res.statusCode
                                            }
                                        })
                
                            
                            return res.statusCode;
                        }
        
                        
                    
            
        }

    })
    }

    res.redirect('/admin')
    
        
    } catch (error) {
        console.log("error is there ")
        res.redirect('/admin')
    }


})

router.post('/updateMy', function(req, res){
    debugger
    console.log("In updateMy");
    
    const mentor = req.body.updateMentor;
    console.log(mentor)
})


module.exports = router;






