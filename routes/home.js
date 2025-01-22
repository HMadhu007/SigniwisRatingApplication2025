var express = require('express');
// const flash = require('express-flash');
var router = express.Router();
var path = require('path');
// var database = require('../database')
var mysql = require('mysql');
const nodemailer = require("nodemailer");
const notifier = require('node-notifier');

//css properties for ForgotPassPopup
var ForgotPassPopup = {
    "forgetPopUP":"none",
    "blur":"",
    "EmpForgotIdField":"",
    "OTPSuccMSG":"none",
    "OTPErrMSG":"none",
    "EmpForgotIdFieldVal":"",
    "CloseOTPPopup":"#",
    "EmpOTPVrfyFieldVal":"",
    "EmpIdOTPVrfy":"",
    "EmpForgotVrfyOTPField":"",
    "EmpOTPVrfyAnim":"none",
    "EmpOTPNotVrfyAnim":"none",
    "EmpOTPVrfyContent":"none",
    "afterOTPVrfyContent":"none",
    "ForgotPassPopupCloseBTN":"block",
    "ForgotPassPopupConfirmBTN":"none",
    "PassMissMatch":"none",
    "VerifyOTPBtn":"",
    "SendOTPBtn":"",
    "EmpIdEmptyVal":"none",
    "BusyIndicator":"hidden"

}
//for verifyOTP, storing EmpId as global
this.EmpIdOTP = null;

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
    var message = req.flash('success')
        connection.query('SELECT * FROM employee_table', function(error, data){

            res.render('home', {title:"Welcome to Signiwis",message, session:req.session,ForgotPassPopup:ForgotPassPopup})
             
         })
});

router.post('/user', function(req, res, next){

    var EmpId =  req.body.User_Id
    var EmpPass = req.body.User_Password

    var dataTosend = {mes:req.body.User_Id}
    var queryData = encodeURIComponent(JSON.stringify(dataTosend))
    // var obj={}
    // obj.EmpId = EmpId
    // obj.pass = EmpPass
    
    
  if(EmpId && EmpPass){

        var query = `SELECT * FROM employee_table`;
        
        connection.query(query, function(error, data){
            
            
             if(EmpId == "" && EmpPass != ""){
                req.flash('success',"Id field cannot be empty")
                        res.redirect('home')
            }
            else if(EmpId != "" && EmpPass == ""){
                req.flash('success',"Password field cannot be empty")
                        res.redirect('home')
            }
            else if(EmpId == "Admin" && EmpPass == "12345"){
                
                req.flash('success',"Welcome Admin")
                res.redirect('/admin')
            } 
            
            else if(EmpId == 'Admin' && EmpPass != "12345"){
                req.flash('success',"Incorrect Admin password")
                        res.redirect('home');
            }
            else if(data.some((val) =>{ return  val.Employee_Id == EmpId })){
                for(var count=0; count<data.length;count++){
                    if( data[count].Employee_Password == 'Default@123' && data[count].Employee_Id == EmpId ){
                        if(EmpPass != 'Default@123'){
                            req.flash('success',`Invalid Password ` );
                            res.redirect('/');    
                            break;
                        }else{
                        req.session.EmpId = data[count].Employee_Id
                        
                        req.session.EmpId = EmpId
                        req.session.Name = data[count].Employee_Name
                        req.session.Dept = data[count].Employee_Department
                        req.session.Email = data[count].Employee_Email
                        req.flash('success',`Please Update the Password`);
                // res.redirect('/admin')
                        res.redirect('/updatePass');
                        break;
                        }
                    }
                    else if(data[count].Employee_Id == EmpId && data[count].Employee_Password == EmpPass){
                        req.session.EmpId = data[count].Employee_Id
                        req.session.EmpId = EmpId
                        req.session.Name = data[count].Employee_Name
                        req.session.Dept = data[count].Employee_Department
                        req.session.Email = data[count].Employee_Email
                        req.flash('success',`Welcome ${data[count].Employee_Name}`);
                        res.redirect('/user');
                        break;
                    }
                    else if(data[count].Employee_Id == EmpId && data[count].Employee_Password != EmpPass){
                        req.flash('success',`Invalid Password ` );
                    res.redirect('/');    
                    break;
                    }
                    }
                  
                } else{
                    req.flash('success',`Invalid ID ` );
                    res.redirect('/');

                }
        })
    } else
    {
        
        // res.send("Incorrect Employee Id")
        req.flash('success',"ID and Password field cannot be empty.")
        res.redirect('home')
        // res.redirect('/home')

    }
})


// Forgot Password


router.post('/sendOTPEmpId', function(req, res, next) {
   
    var EmpIdOTP = req.body.SendOTPEmpId;
    this.EmpIdOTP = EmpIdOTP;
    var getEmpData = `SELECT * FROM employee_table WHERE employeeNo = '${EmpIdOTP}'`
    connection.query(getEmpData, function(error, data){
    var message = req.flash('success');

        if(!!EmpIdOTP){
            if(data.length===0 || data[0].employeeNo == undefined || data[0].employeeNo == ""){

                ForgotPassPopup.OTPErrMSG = "block";
                ForgotPassPopup.blur = "6px";
                ForgotPassPopup.forgetPopUP="block"
                ForgotPassPopup.EmpForgotIdFieldVal = EmpIdOTP;
                ForgotPassPopup.CloseOTPPopup = "/CloseOTPPopup"
                ForgotPassPopup.EmpOTPVrfyContent = "none";


                res.render('home', {title:"Welcome to Signiwis",message, session:req.session,ForgotPassPopup:ForgotPassPopup})


                // res.status(420).send(`<br><br><strong style="font-family:'Monotype Corsiva';font-size:20px">Employee Id not found in our database, contact your HR's... </strong><strong> saima@signiwis.com</strong> || <strong>athulya@signiwis.com</strong> <a href="/">Click here to Continue</a><script>localStorage.setItem("IdStatus",false)</script>`);
            
            }
            else if(!!data[0].employeeNo && data[0].employeeNo == EmpIdOTP){
        
                ForgotPassPopup.EmpIdOTPVrfy = EmpIdOTP
                //insert OTP to employee table
                var num = Math.random() * 1000000;
                var checkCount = Math.ceil(num);
                checkCount = (checkCount.toString().length == 6) ? checkCount : checkCount.toString()+1;
                var OTP = Math.ceil(checkCount);

                var OTPUpdate = `UPDATE employee_table SET OTP = "${OTP}" WHERE employeeNo = "${EmpIdOTP}"`

                connection.query(OTPUpdate, function (err, data1) {
                    if (err) {
                        throw err;
                    }
                    else {
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
                            to: `${data[0].Employee_Email}`,
                            subject: "OTP-RatingApp",
                            html: `<p> Hi <strong>${data[0].Employee_Name} </strong> <br>
                            <br>
                            Please find the following OTP <strong> ${OTP} </strong>, to update password for Rating Application.it is auto generated by system and Please do not share with anyone. 
                                                                                          
                            
                             <br>
                             <br>
                             <br>
                            Thanks & Regards, </br>
                            <strong>Signiwis Technologies.
                            </strong> </br>
                            <a href="https://www.signiwis.com/">www.signiwis.com</a>
                            </p>
                            `
                          }
              
                          transporter.sendMail(options, (error, info) => {
                            if (error) {
                               throw error;
                            }
                            else {   
                                ForgotPassPopup.OTPErrMSG = "none";
                                ForgotPassPopup.OTPSuccMSG = "block"
                                ForgotPassPopup.EmpForgotIdField = "readonly"
                                ForgotPassPopup.blur = "6px";
                                ForgotPassPopup.forgetPopUP="block"
                                ForgotPassPopup.EmpForgotIdFieldVal = data[0].employeeNo;
                                ForgotPassPopup.CloseOTPPopup = "/CloseOTPPopup";
                                ForgotPassPopup.EmpOTPVrfyContent = "block";
                                ForgotPassPopup.EmpForgotVrfyOTPField = "";
                                ForgotPassPopup.SendOTPBtn = "disabled";
                                ForgotPassPopup.EmpIdEmptyVal = "none";  
                                ForgotPassPopup.BusyIndicator = "hidden"  
                                res.render('home', {title:"Welcome to Signiwis",message, session:req.session,ForgotPassPopup:ForgotPassPopup})                        
                            //   return res.status(200).send(`<strong style="font-family:'Monotype Corsiva'">OTP Send successfull</strong> <a href="#" id="go-back">Click here to Continue</a><script>document.getElementById("go-back").addEventListener("click", () => {history.back();});localStorage.setItem("IdStatus",true);document.getElementById("OTPSuccMSG").style.display = "block"</script>`);
                            // res.send("/home")
                            }
                          })
                    }
                })
                
            }
            else{                
                res.status(404).send(`<br><br><strong style="font-family:'Monotype Corsiva';font-size:20px">Employee Id not found in our database, contact your HR's... </strong><strong> saima@signiwis.com</strong> || <strong>athulya@signiwis.com</strong> <a href="/">Click here to Continue</a><script>localStorage.setItem("IdStatus",false)</script>`);
            }
        }
        else{
            ForgotPassPopup.EmpIdEmptyVal = "block"
            ForgotPassPopup.blur = "6px";
            ForgotPassPopup.forgetPopUP="block"
            ForgotPassPopup.CloseOTPPopup = "/CloseOTPPopup"
            ForgotPassPopup.EmpOTPVrfyContent = "none";


            res.render('home', {title:"Welcome to Signiwis",message, session:req.session,ForgotPassPopup:ForgotPassPopup})    
        }
        
    })
    
});



//validating fileds

function UpdateValidateFields(req,res,message,EmpIdOTPVrfy1){
    ForgotPassPopup.PassMissMatch = "block";
    ForgotPassPopup.blur = "6px";
    ForgotPassPopup.forgetPopUP="block";
    ForgotPassPopup.EmpForgotIdFieldVal = EmpIdOTPVrfy1;
    ForgotPassPopup.EmpForgotVrfyOTPField = "readonly";
    ForgotPassPopup.CloseOTPPopup = "/CloseOTPPopup";
    ForgotPassPopup.EmpOTPVrfyAnim = "block";
    ForgotPassPopup.EmpOTPNotVrfyAnim = "none";
    ForgotPassPopup.afterOTPVrfyContent = "block";
    ForgotPassPopup.ForgotPassPopupCloseBTN = "none";
    ForgotPassPopup.ForgotPassPopupConfirmBTN = "block"
    ForgotPassPopup.BusyIndicator = "hidden"  

    res.render('home', {title:"Welcome to Signiwis",message, session:req.session,ForgotPassPopup:ForgotPassPopup})  
}

//OTP Field Validation
function OTPValidation(req,res,message,EmpIdOTPVrfy1){

    ForgotPassPopup.EmpOTPNotVrfyAnim = "block";
    ForgotPassPopup.EmpForgotIdField = "";
    ForgotPassPopup.blur = "6px";
    ForgotPassPopup.forgetPopUP="block";
    ForgotPassPopup.EmpForgotIdFieldVal = EmpIdOTPVrfy1;
    // ForgotPassPopup.EmpOTPVrfyFieldVal = VerifyOTP;
    ForgotPassPopup.EmpForgotVrfyOTPField = "";
    ForgotPassPopup.CloseOTPPopup = "/CloseOTPPopup";
    ForgotPassPopup.EmpOTPVrfyAnim = "none";   
    ForgotPassPopup.afterOTPVrfyContent = "none" ;
    ForgotPassPopup.ForgotPassPopupCloseBTN = "block";
    ForgotPassPopup.ForgotPassPopupConfirmBTN = "none"

    res.render('home', {title:"Welcome to Signiwis",message, session:req.session,ForgotPassPopup:ForgotPassPopup})
}
// Verify OTP
router.post('/verifyOTPEmpId',function(req, res, next){

    var message = req.flash('success');    
    var VerifyOTP = req.body.VerifyOTPEmpId;
    var EmpIdOTPVrfy1 = req.body.EmpIdOTPVrfy;
    var getEmpData = `SELECT * FROM employee_table WHERE employeeNo = '${EmpIdOTPVrfy1}' && OTP = '${VerifyOTP}'`

    connection.query(getEmpData, function(error, data){
        
        if(error){
            console.error(error);
            throw error;
        }
        else if(EmpIdOTPVrfy1== ""){
            OTPValidation(req,res,message,EmpIdOTPVrfy1);    
        }
        else if(EmpIdOTPVrfy1== undefined){
            OTPValidation(req,res,message,EmpIdOTPVrfy1);    
        }
        else if(VerifyOTP == ""){
            OTPValidation(req,res,message,EmpIdOTPVrfy1);    
        }
        else if(VerifyOTP == undefined){
            OTPValidation(req,res,message,EmpIdOTPVrfy1);    
        }
        else if(data == undefined){
            OTPValidation(req,res,message,EmpIdOTPVrfy1); 
        }
        else if(data.length == 0){
            OTPValidation(req,res,message,EmpIdOTPVrfy1);    
        }
        else{
            ForgotPassPopup.OTPErrMSG = "none";
            ForgotPassPopup.OTPSuccMSG = "block";
            ForgotPassPopup.EmpForgotIdField = "readonly";
            ForgotPassPopup.blur = "6px";
            ForgotPassPopup.forgetPopUP="block";
            ForgotPassPopup.EmpForgotIdFieldVal = data[0].employeeNo;
            ForgotPassPopup.EmpOTPVrfyFieldVal = VerifyOTP;
            ForgotPassPopup.EmpForgotVrfyOTPField = "readonly";
            ForgotPassPopup.CloseOTPPopup = "/CloseOTPPopup";
            ForgotPassPopup.EmpOTPVrfyAnim = "block";
            ForgotPassPopup.EmpOTPNotVrfyAnim = "none";
            ForgotPassPopup.afterOTPVrfyContent = "block";
            ForgotPassPopup.ForgotPassPopupCloseBTN = "none";
            ForgotPassPopup.ForgotPassPopupConfirmBTN = "block";
            ForgotPassPopup.PassMissMatch = "none";
            ForgotPassPopup.VerifyOTPBtn = "disabled"


            res.render('home', {title:"Welcome to Signiwis",message, session:req.session,ForgotPassPopup:ForgotPassPopup})                        

        }
    })
})


router.post('/UpdatePass',function(req, res, next){

    var message = req.flash('success');    
    var NewPass = req.body.NewPassword;
    var ConfirmPass = req.body.ConfirmPassword;
    var EmpIdOTPVrfy1 = req.body.EmpIdOTPVrfy;
    var getEmpData = `UPDATE employee_table SET Employee_Password = ${NewPass} WHERE employeeNo = '${EmpIdOTPVrfy1}'`

    if((NewPass!= ConfirmPass)){
        
        UpdateValidateFields(req,res,message,EmpIdOTPVrfy1);
    }
    else if(NewPass == ""){
        UpdateValidateFields(req,res,message,EmpIdOTPVrfy1);

    }
    else if(ConfirmPass==""){
        UpdateValidateFields(req,res,message,EmpIdOTPVrfy1);
    }
    else{
         
        connection.query(getEmpData, function(error, data){
            
            // Pass update success case.
            var message = req.flash('success');
            ForgotPassPopup.EmpForgotIdField = "";
            ForgotPassPopup.EmpForgotIdFieldVal = "";
            ForgotPassPopup.OTPErrMSG = "none";
            ForgotPassPopup.OTPSuccMSG = "none";
            ForgotPassPopup.blur= "";
            ForgotPassPopup.forgetPopUP = "none";
            ForgotPassPopup.CloseOTPPopup = "/CloseOTPPopup";
            ForgotPassPopup.EmpOTPVrfyAnim = "none";    
            ForgotPassPopup.EmpForgotVrfyOTPField = "";
            ForgotPassPopup.EmpOTPVrfyFieldVal = "";
            ForgotPassPopup.EmpOTPNotVrfyAnim = "none";
            ForgotPassPopup.EmpOTPVrfyContent = "none";
            ForgotPassPopup.afterOTPVrfyContent = "none";
            ForgotPassPopup.ForgotPassPopupCloseBTN = "block";
            ForgotPassPopup.ForgotPassPopupConfirmBTN = "none";
            ForgotPassPopup.SendOTPBtn = "";
            ForgotPassPopup.VerifyOTPBtn = "";
            ForgotPassPopup.BusyIndicator = "hidden";

            notifier.notify({
                title: 'Success!',
                message: 'Your password has been updated',
                icon: path.join(__dirname, 'logo.jpg'),
                sound: true
            });
            res.render('home', {title:"Welcome to Signiwis",message, session:req.session,ForgotPassPopup:ForgotPassPopup})
    
        })
    }
    
})

// if OTP send, clear the screen
router.get('/CloseOTPPopup', function(req, res){
    var message = req.flash('success');
    ForgotPassPopup.EmpForgotIdField = "";
    ForgotPassPopup.EmpForgotIdFieldVal = "";
    ForgotPassPopup.OTPErrMSG = "none";
    ForgotPassPopup.OTPSuccMSG = "none";
    ForgotPassPopup.blur= "";
    ForgotPassPopup.forgetPopUP = "none";
    ForgotPassPopup.CloseOTPPopup = "#";
    ForgotPassPopup.EmpOTPVrfyAnim = "none";    
    ForgotPassPopup.EmpForgotVrfyOTPField = "";
    ForgotPassPopup.EmpOTPVrfyFieldVal = "";
    ForgotPassPopup.EmpOTPNotVrfyAnim = "none";
    ForgotPassPopup.EmpOTPVrfyContent = "none";
    ForgotPassPopup.afterOTPVrfyContent = "none";
    ForgotPassPopup.ForgotPassPopupCloseBTN = "block";
    ForgotPassPopup.ForgotPassPopupConfirmBTN = "none";
    ForgotPassPopup.VerifyOTPBtn = ""
    ForgotPassPopup.SendOTPBtn = ""
    ForgotPassPopup.EmpIdEmptyVal = "none"

    res.render('home', {title:"Welcome to Signiwis",message, session:req.session,ForgotPassPopup:ForgotPassPopup})

})

module.exports = router;


