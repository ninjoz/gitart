
const express = require('express');
const router = express.Router();
let bodyParser = require('body-parser')
const path = require("path");

const database = require('../database');
const oneWeek = 1000 * 60 * 60 * 24 * 7;
let date = new Date();
let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();
let fullDate = year + "-" + month + "-" + day;
let today = new Date();
let h = today.getHours();
let m = today.getMinutes();
let s = today.getSeconds();
let time = h + ":" + m + ":" + s;
let joining_date = fullDate + " " + time; const bcrypt = require('bcrypt');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
const saltRound = 10;
const session = require('express-session');
router.use(session({
  secret: 'Hmmm..',
  saveUninitialized: true,
  cookie: { maxAge: oneWeek },
  resave: true
}))
let rememberMe = '';
let message = '';

router.get('/register', (req, res) => {
  if (req.session.user_id) {
    let getUsername1 = getUsername(req.session.user_id)
    user_name = getUsername1[0].user_name;
    res.redirect('/home');
  }
  else {
    user_id = '';
    res.render('register', {
      message: ''
    })
  }

});
getIdByEmail = (new_user_email_address) => {
  return new Promise((resolve, reject) => {
    database.query(`SELECT user_id FROM gitart.users WHERE email="${new_user_email_address}"`, (error, data) => {
      if (error) {
        return reject(error);
      }
      return resolve(data);
    });
  });
};
getIdByUsername = (new_user_name) => {
  return new Promise((resolve, reject) => {
    database.query(`SELECT user_id FROM gitart.users WHERE user_name="${new_user_name}"`, (error, data) => {
      if (error) {
        return reject(error);
      }
      return resolve(data);
    });
  });
};
insertAccDetails = (new_user_name,new_user_email_address,accType,gender,hash) => {
  return new Promise((resolve, reject) => {
    database.query(`INSERT INTO users (user_name,email,account_type,gender,password,joining_date) VALUES ("${new_user_name}","${new_user_email_address}","${accType}","${gender}","${hash}","${joining_date}")`, (error, data) => {
      if (error) {
        return reject(error);
      }
      return resolve(data);
    });
  });
};
router.post('/register', async (req, res) => {
  let new_user_name = req.body.new_user_name;
  let accType=req.body.accType;
  let gender = req.body.gender;
  let new_user_email_address = req.body.new_user_email_address;
  let new_user_password = req.body.new_user_password;
  let re_new_user_password = req.body.re_new_user_password;
  if (new_user_name && new_user_email_address && new_user_password && re_new_user_password) {


   
      let getIdByEmail1 = await getIdByEmail(new_user_email_address)
      if (getIdByEmail1.length > 0) {
        res.render('register', { message: 'Please Enter A Valid Email Address' });
      }


   
    let getIdByUsername1 = await getIdByUsername(new_user_name);
    
      if (getIdByUsername1.length > 0) {
        res.render('register', { message: 'This Username Is Already Taken. Please Choose Anothor One' });
      }
      else {
        if (new_user_password == re_new_user_password) {
          if (new_user_name.length > 20) {
            res.render('register', { message: 'Username Must Not Exceed 20 Characters. Please Try Again.' });
          }
          else {
             bcrypt.hash(new_user_password, saltRound, async (err, hash) => {
              let insertAccDetails1 =  await insertAccDetails(new_user_name,new_user_email_address,accType,gender,hash)

            
               
                  user_name=new_user_name;
                  let getIdByUsername2 = await getIdByUsername(user_name);
                  

                    req.session.user_id=getIdByUsername2[0].user_id;
                    user_id=req.session.user_id;
                  
                  res.redirect('/home');
                
            });
          }
        }
        else if (new_user_password != re_new_user_password) {
          res.render('register', { message: 'Passwords Do Not Match' });
        }
      }
    
  }
  else {
    res.render('register', { message: 'Please enter all Fields' });
  }
});

module.exports = router;