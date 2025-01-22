// *** For MySql Database connection, do follow the below details ***

var connection  = mysql.createConnection({
    connectionLimit : 1000,
    host     : 'localhost',
    user     : 'root',
    password : 'Signiwis@123',
    database : 'signiwis_schema',
    port : 3306
});

// *** To Run application after clone.
    1. npm install 
    2. npm install node-localstorage
    3. npm install --save node-notifier
