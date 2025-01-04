var express = require('express');
// const flash = require('express-flash');
var router = express.Router();

// var database = require('../database')
var mysql = require('mysql');


var connection  = mysql.createConnection({
    connectionLimit : 1000,
    host     : 'localhost',
    user     : 'root',
    password : 'Giri#1290',
    database : 'signiwis_schema',
    port : 3306

});
/* GET users listing. */
router.get('/', function(req, res, next) {
    var message = req.flash('success')
    connection.query('SELECT * FROM employee_table', function(error, data){
      
       res.render('home', {title:"Welcome to Signiwis",message, session:req.session})
        
    })
});

router.post('/user', function(req, res, next){
debugger
    var EmpId =  req.body.User_Id
    var EmpPass = req.body.User_Password

    var dataTosend = {mes:req.body.User_Id}
    var queryData = encodeURIComponent(JSON.stringify(dataTosend))
    // var obj={}
    // obj.EmpId = EmpId
    // obj.pass = EmpPass
    
    
  if(EmpId && EmpPass){
debugger
        var query = `SELECT * FROM employee_table`;
        
        connection.query(query, function(error, data){
            debugger
            
             if(EmpId == "" && EmpPass != ""){
                req.flash('success',"Id field cannot be empty")
                        res.redirect('home')
            }
            else if(EmpId != "" && EmpPass == ""){
                req.flash('success',"Password field cannot be empty")
                        res.redirect('home')
            }
            else if(EmpId == "Admin" && EmpPass == "12345"){
                debugger
                req.flash('success',"Welcome Admin")
                res.redirect('/admin')
            } 
            
            else if(EmpId == 'Admin' && EmpPass != "12345"){
                req.flash('success',"Incorrect Admin password")
                        res.redirect('home');
            }
            // else if(data.some((val) =>{ return  val.Employee_Id != EmpId})){
            //     req.flash('success',`Invalid ID check the ID and try again.` );
            //             res.redirect('/');
            // }
            // else if(data.some((val) =>{ return val.Employee_Password != EmpPass })){
            //     req.flash('success',`Invalid Password check the password and try again.` );
            //             res.redirect('/');
            // }
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
        debugger
        // res.send("Incorrect Employee Id")
        req.flash('success',"ID and Password field cannot be empty.")
        res.redirect('home')
        // res.redirect('/home')

    }
})

//     else if (EmpId == "Admin" && EmpPass == ""){
//         debugger
//         req.flash('success',"Paswword field canot be empty")
//         res.redirect('home')

//     }
//     else{
//         debugger
//         // res.send("Please Enter Employee Id and Password")
//         req.flash('success',"Please Enter Employee Id and Password")
//         res.redirect('home')
//         // res.redirect('/home')
//     //    res.render('home', {title:"Welcome to Signiwis", session:req.session})
// debugger

//         res.end()
//     }


// router.get('/', function(req, res, next){
//     req.session.destroy()
//     res.redirect('/home')
// })
debugger
module.exports = router;


