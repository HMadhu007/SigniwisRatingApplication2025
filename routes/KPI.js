var express = require('express');
const { LocalStorage } = require('node-localstorage');
const localStorage = new LocalStorage('../localStorage');
var router = express.Router();
var name = null;
var RequestedDate = null;
var revrid = null
var radnm = Math.random()*100000
var ID = Math.ceil(radnm)
var UniqueId =ID
let employee_Mock_Given = 0
let employee_Mock_Taken = 0
const nodemailer = require("nodemailer");


 
const app = express()
var session = require('express-session')
var bodyParser = require('body-parser')
var flash = require('express-flash')
app.set('view engine')
 
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(session({
    secret : 'secret key',
    resave : false,
    saveUninitialized : true,
    cookie : {
        maxAge : 60000
    }
}))
app.use(flash())
 
 
 
 
debugger
var mysql = require('mysql');
var connection  = mysql.createConnection({
 
    connectionLimit : 1000,
    host     : 'localhost',
    user     : 'root',
    password : 'Signiwis@123',
    database : 'signiwis_schema',
    port : 3306
 
});
 


this.oUser_ID
var vid = null
router.get ( '/:id', function(req, res, next) {
debugger
 
localStorage.setItem("Mocktype", "KPI")
  this.oUser_ID = req.params.id.split("-")[0]
  var message = req.flash('success')
  // req.session.reviewedId = req.params.id;
  this.reviewerUserId = req.session.EmpId
 
  var query = `SELECT * FROM employee_table where Employee_Id = '${this.oUser_ID}'`
  var querr1 = `SELECT Request_Id From admin_notification where User_Id = '${this.oUser_ID}'`
  var kpiPointQuterly = `SELECT * From kpi1 where Emp_Id = '${this.oUser_ID}' and ReviewerId = '${this.reviewerUserId}'`
 
  connection.query(query, function(error, data, rows){
  connection.query(querr1, function(err, data1){
    if(error){
      req.flash('success', "some Error");
    }else{
      var Request_Id = data1[0].Request_Id;
  var sql = `select * from employee_review where Request_Id = '${Request_Id}'`;

    connection.query(sql, function(error, kpiData){
      debugger
      if(error){
        req.flash('success', "some Error");
      }

          connection.query(kpiPointQuterly,function(error, kpiPointData) {
            if(error){
             
              req.flash('success', "some Error");
            }
            
            res.render('KPI', {message ,singleUserData:data, KPIData1:kpiData, kpi1TableData:kpiPointData });

          })
        
      
    })
  }
  })
  
  })
    
 
   })

router.post('/UpdateKPI',function(req,res){
 debugger
 
})




//---------------------------------------------------------------------------------------------------


  router.post('/ratings/:id/:mocktrype',function(req, res ){
    debugger;
    
    connection.query(`SELECT Request_Id From admin_notification where User_Id = '${req.params.id}' && selectedId= '${req.session.EmpId}' && Mock_Type = '${req.params.mocktrype}' && Status = 'Accepted'`, function(err, data1){
      if(err){
        console.error(err)
        req.flash('sucess', 'Something went wrong');
        res.redirect(`/user`)
      }else{
        
        connection.query(`SELECT * FROM employee_review where Request_Id = '${data1[0].Request_Id}'`, function(err, data2){
          debugger
          if(err){
            console.error(err)
            req.flash('sucess', 'Something went wrong');
            res.redirect(`/user`)
          } else {
            
            var value = []
            const prefix = "KPI";
    
          data2.forEach((element, index) => {
            
               for(const property in req.body){
                if(element.employee_review_val == property){
                    element.review_value = req.body[property];
                }
               }
               const timestamp = Date.now(); // Current timestamp in milliseconds
              const randomNum = Math.floor(Math.random() * 10000); // Random number between 0 and 9999
              var kpiDocLink=req.body.KPI_Doc_Link
              const UnqKPI =   `${prefix}${timestamp}${randomNum}`
               value.push([req.session.EmpId,UnqKPI, element.employee_review_val, element.review_points, element.Request_Id, element.Requested_Date,element.review_value,element.employee_id,kpiDocLink])
               

            });
            
            var sql = `INSERT into kpi (reviewer_id, unique_id, employee_review_val, review_points,Request_Id,Requested_Date,review_value, employee_id,document_link) values ?`;
            connection.query(sql, [value], function(err, data){
              
              if(err){
                console.error(err)
                req.flash('sucess', 'Something went wrong');
                res.redirect(`/user`)
              } else{
                debugger
                connection.query(`UPDATE admin_notification SET Status ="Done" where User_Id = '${req.params.id}' && selectedId = '${req.session.EmpId}' && Mock_Type = '${req.params.mocktrype}' && Status = 'Accepted'`, (err, data)=>{
                  if(err){
                    console.error(err)
                    req.flash('success', 'Something went wrong');
                    res.redirect(`/user`)
                  }
                  else{

                    
                    req.flash('success', 'Data submitted successfully');
                    res.redirect(`/user`)
                  }
                })

                
              }
            })
          }
        })
      }
    })

  });




 
// });



router.post('/kpiUpload',function(req,res){
  debugger
let query_String=`UPDATE kpi1 SET CF_Appreciate_Mail_Client='${req.body.CF_Appreciate_Mail_Client}', 
CF_Project_Release_Feedb='${req.body.CF_Project_Release_Feedb}',
CTC_Company_Growth='${req.body.CTC_Company_Growth}',
CTC_Num_Leave_Taken='${req.body.CTC_Num_Leave_Taken}',
Emp_Id='${req.body.Emp}',
HRF_Emp_Need_Inform_HR='${req.body.HRF_Emp_Need_Inform_HR}',
HRF_Reg_Avail_Attendance='${req.body.HRF_Reg_Avail_Attendance}',
ReviewerId='${req.body.ReviewerId}',
Reviewer_Name='${req.body.Reviewer_Name}',
TL_Adv_Concept_Fiori='${req.body.TL_Adv_Concept_Fiori}',
TL_Complete_Training='${req.body.TL_Complete_Training}',
TL_Documents_New_Topics='${req.body.TL_Documents_New_Topics}',
TL_Performance_Mock='${req.body.TL_Performance_Mock}',
TL_Publish_Blogs='${req.body.TL_Publish_Blogs}',
TL_Two_Topics_Year='${req.body.TL_Two_Topics_Year}',
TMS_Session_On_Sat='${req.body.TMS_Session_On_Sat}',
TMS_Taken_Session_Year='${req.body.TMS_Taken_Session_Year}',
TMS_Train_Two_Candidates='${req.body.TMS_Train_Two_Candidates}' WHERE KPI_UId= '${req.body.KPI_UId}'`

console.log(query_String)
  connection.query(query_String, function(err, data){
    if (err) {
      console.log(err)
    }else {
      console.log('Updated Succressfully',data)
    }
  })
})







 
module.exports = router;
 