const { otpGen } = require('otp-gen-agent');
const express = require('express');
const nodemailer = require('nodemailer');


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
const { error } = require('console');
const { register } = require('module');
router.use(session({
  secret: 'Hmmm..',
  saveUninitialized: true,
  cookie: { maxAge: oneWeek },
  resave: true
}))
let rememberMe = '';

let new_user_name;
  let accType;
  let gender;
  let new_user_email_address;
  let new_user_password;
  let re_new_user_password;
  let username;
  let otp;

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
  
  
router.post('/success',  async(req, res) => {
  const salt = await bcrypt.genSalt(10);
  let hash = await bcrypt.hash(new_user_password, salt);
  let insertAccDetails1 =  await insertAccDetails(new_user_name,new_user_email_address,accType,gender,hash)

  let getIdByUsername2 = await getIdByUsername(new_user_name);
            
    
  req.session.user_id=getIdByUsername2[0].user_id;
  user_id=req.session.user_id;
  
  console.log(req.session.user_id)
  
  res.send({done:'success'});
  return




});

router.get('/registered', async (req, res) => {
  console.log("qqq" +req.session.user_id)
  res.render('regSuccess');
  
});


router.get('/register', async(req, res) => {
  if (req.session.user_id) {
    let getUsername1 = await getUsername(req.session.user_id)
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

  router.post('/register', async (req, res) => {
     new_user_name = req.body.new_user_name;
     accType=req.body.accType;
     gender = req.body.gender;
     new_user_email_address = req.body.new_user_email_address;
     new_user_password = req.body.new_user_password;
     re_new_user_password = req.body.re_new_user_password;
    

    if (new_user_name && new_user_email_address && new_user_password && re_new_user_password) {
  
  
     
        let getIdByEmail1 = await getIdByEmail(new_user_email_address)
        if (getIdByEmail1.length > 0) {
          res.send( { message: 'Please Enter A Valid Email Address' });
        return
        }
  
  
     
      let getIdByUsername1 = await getIdByUsername(new_user_name);
      
        if (getIdByUsername1.length > 0) {
          res.send(  { message: 'This Username Has Already Been Taken. Please Choose Anothor One.' });
          return
        }
        else {
          if (new_user_password == re_new_user_password) {
            if (new_user_name.length > 20) {
              res.send(  { message: 'Username Must Not Exceed 20 Characters. Please Try Again.' });
              return
            }
            else if (new_user_password.length < 8) {
              res.send(  { message: 'Password Must Be At Least 8 Characters. Please Try Again.' });
              return
            }
            else {

  
              let transporter = await nodemailer.createTransport({
                service: "Gmail",
                
                auth: {
                  user: process.env.VERIFICATION_EMAIL,
                  pass: process.env.VERIFICATION_EMAIL_PASSWORD,
                },
              });
              
              
               otp = await otpGen();
              
              
              let mailOptions = {
                from: process.env.VERIFICATION_EMAIL,
                to: `${new_user_email_address}`,
                subject: "GitArt Register",
                text: `Here is your verification code ${otp}. Please don't share it with any one.`,
              };
              
              transporter.sendMail(mailOptions).then(()=>{
               res.render("verification",{otp});
              }).catch(error=>{
                res.render('404');
              })
  
  
  res.send({message:''})
         
              return
  
            }
          }
          else if (new_user_password != re_new_user_password) {
            res.send( { message: 'Passwords Do Not Match' });
            return
          }
        }
      
    }
    else {
      res.send({ message: 'Please enter all Fields' });return
    }
  });

router.get('/verification', async (req, res) => {
  res.render("verification",{otp});  
});


module.exports = router;