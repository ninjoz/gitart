const mysql = require('mysql');
const connection = mysql.createConnection({

  host: "localhost",
  user: "sqluser",
  password: "password",
  database: "gitart",
  port: "3306"

});


connection.connect(function(error){
  if(error){
    throw error
  }
  else{
    console.log("connected");
  }
  });

  
  module.exports=connection;
  