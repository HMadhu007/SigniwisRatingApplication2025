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
 
debugger

this.oUser_ID
var vid = null
router.get ( ['/','/:id' ], function(req, res, next) {
debugger
 
  this.oUser_ID = req.params.id
  var message = req.flash('success')
  // req.session.reviewedId = req.params.id;
  this.reviewerUserId = req.session.EmpId
 
  var query = `SELECT * FROM employee_table where Employee_Id = ${req.params.id}`
  var querr1 = `SELECT Request_Id From admin_notification where User_Id = ${req.params.id}`
  var kpiPointQuterly = `SELECT * From kpi1 where Emp_Id = ${this.oUser_ID} and ReviewerId = ${this.reviewerUserId}`
  // var query2 = `SELECT Requested_Date FROM admin_notification WHERE User_Id = ${req.params.id}`
  // var query3 = `select Employee_Mock_Taken,Employee_Mock_Given from employee_table where Employee_Id = '${req.params.id}'`
  // var query4 = `select Employee_Mock_Taken,Employee_Mock_Given from employee_table where Employee_Id = '${req.session.EmpId}'`
 
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
          debugger
          console.log(kpiData);

          connection.query(kpiPointQuterly,function(error, kpiPointData) {
            if(error){
              debugger;
              req.flash('success', "some Error");
            }
            debugger
            console.log(kpiPointData)
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

debugger;
  router.post('/ratings/:id',function(req, res ){
    debugger;
    
    connection.query(`SELECT Request_Id From admin_notification where User_Id = ${req.params.id}`, function(err, data1){
      if(err){
        debugger
      }else{
        debugger
        connection.query(`SELECT * FROM employee_review where Request_Id = '${data1[0].Request_Id}'`, function(err, data2){
          if(err){
            debugger
          } else {
            debugger
            var value = []
            const prefix = "KPI";
    
          data2.forEach((element, index) => {
            debugger
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
               console.log(value);

            });
            
            var sql = `INSERT into kpi (reviewer_id, unique_id, employee_review_val, review_points,Request_Id,Requested_Date,review_value, employee_id,document_link) values ?`;
            connection.query(sql, [value], function(err, data){
              debugger
              if(err){
                throw err;
              } else{
                debugger
                // req.flash('sucess', 'Data submitted successfully');
                res.redirect(`/user`)
              }
            })
          }
        })
      }
    })

  //   let value = []
  //   for(const property in req.body){    
  // value.push([property,req.query[property]]);
  //   }

    // var sql = `INSERT INTO kpi (KPI_UId, TL_Complete_Training, TL_Adv_Concept_Fiori, TL_Performance_Mock, TL_Publish_Blogs, TL_Two_Topics_Year, TL_Reg_Avail_Attendance, TL_Documents_New_Topics, TMS_Train_Two_Candidates, TMS_Taken_Session_Year, TMS_Session_On_Sat, HRF_Reg_Avail_Attendance, HRF_Emp_Need_Inform_HR, CF_Appreciate_Mail_Client, CF_Project_Release_Feedb, CTC_Company_Growth, CTC_Num_Leave_Taken, Emp_Id, ReviewerId, Reviewer_Name) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
    // connection.query(sql,[KPI_UId, sTL_Complete_Training, sTL_Adv_Concept_Fiori, sTL_Performance_Mock, sTL_Publish_Blogs, sTL_Two_Topics_Year, sTL_Reg_Avail_Attendance, sTL_Documents_New_Topics, sTMS_Train_Two_Candidates, sTMS_Taken_Session_Year, sTMS_Session_On_Sat, sHRF_Reg_Avail_Attendance, sHRF_Emp_Need_Inform_HR, sCF_Appreciate_Mail_Client, sCF_Project_Release_Feedb, sCTC_Company_Growth, sCTC_Num_Leave_Taken, EmpId, reviewerId, reviewerName],function(error, data){
    //     if(error){
    //         console.log(error);
    //     } else{
    //         res.redirect(`/KPI/${EmpId}`);
    //     }
    // }) 
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
TMS_Train_Two_Candidates='${req.body.TMS_Train_Two_Candidates}' WHERE KPI_UId='${req.body.KPI_UId}'`

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
 