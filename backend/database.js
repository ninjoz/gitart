const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config({path: './.env'})

const connection = mysql.createConnection({

  host: process.env.DATABASE_HOST ,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
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
  