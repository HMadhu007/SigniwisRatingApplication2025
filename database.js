
var mysql = require('mysql')
var connection  = mysql.createConnection({
    connectionLimit : 1000,
    host     : 'localhost',
    user     : 'root',
    password : 'Signiwis@123',
    database : 'signiwis_schema',
    port : 3306

});

connection.connect(function(err){

    if(err)
    {
        throw err
    }
    console.log("Database is Connected");

});

module.exports = connection
  connection.query( 'SELECT * FROM employee_table', function(err, results, rows) {
    if(err)
    throw err;
    results.forEach((emp,index)=>{
        console.log(emp.Employee_Id,emp.Employee_Name,emp.Employee_Email,emp.Employee_Department)
    
      })

   });
   


   
  