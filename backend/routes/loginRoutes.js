const express = require('express');
const router = express.Router();
let bodyParser = require('body-parser')

const database = require('../database');
const oneWeek = 1000 * 60 * 60 * 24 * 7;
const bcrypt = require('bcrypt');
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
let user_id = '';
let user_name = '';

let message = ''

router.get('/login', (req, res) => {
  if (req.session.user_id) {
    res.redirect('/home');
  }
  else {
    user_id = '';
    res.render('login', {
      message: ''
    })
  }

});



router.post('/login', (req, res) => {
  let user_email_address = req.body.user_email_address;
  let user_password = req.body.user_password;
  rememberMe = '';
  rememberMe = req.body.rememberMe;
  if (user_email_address && user_password) {
    let query = `SELECT * FROM users WHERE email = "${user_email_address}"`;
    database.query(query, function (error, data) {
      if (data.length > 0) {
        for (let count = 0; count < data.length; count++) {
          bcrypt.compare(user_password, data[count].password, (err, result) => {
            if (result) {
              user_name = '';
              user_name = data[count].user_name;
              //req.locals.user_name = user_name;

              req.session.user_id = data[count].user_id;
              user_id = data[count].user_id;


              res.redirect('/home');
            }
            else {
              res.render('login', { message: 'Incorrect email address or password. Please try again' });
            }
          });
        }
      }
      else {
        res.render('login', { message: 'Incorrect email address or password. Please try again' });
      }
    });
  }
  else {
    res.render('login', { message: 'Please enter email address and password details' });
  }
});
module.exports = router;
