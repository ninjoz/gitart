const express = require('express');
const app = express();
const adimnApp = express();
const path = require("path");
const database = require('./database');
app.set('view engine', 'ejs');
adimnApp.set('view engine', 'ejs');
const session = require('express-session');
const bcrypt = require('bcrypt');
const saltRound = 10;
const multer = require('multer');
const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, 'public')
  },
  filename: (req, file, cb) => {
    console.log(file)

    return cb(null, Date.now() + path.extname(file.originalname))



  }
})
const upload = multer({ storage: storage });

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
let joining_date = fullDate + " " + time;
let user_name = '';
let rememberMe = '';
let user_id = '';
let bodyParser = require('body-parser')
app.use(session({
  secret: 'Hmmm..',
  saveUninitialized: true,
  cookie: { maxAge: oneWeek },
  resave: true
}))

app.listen(3000);
app.use(express.static(path.join(__dirname, '/public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



adimnApp.use(session({
  secret: 'Hmmm..',
  saveUninitialized: true,
  cookie: { maxAge: oneWeek },
  resave: true
}))

adimnApp.listen(2000);
adimnApp.use(express.static(path.join(__dirname, '/public')));

adimnApp.use(bodyParser.json());
adimnApp.use(bodyParser.urlencoded({ extended: true }));




//app.use(express.urlencoded({ extended: true }));
const loginRoutes = require('./routes/loginRoutes');
app.use('/', loginRoutes);

const uploadRoutes = require('./routes/fileupload');
app.use('/', uploadRoutes);


const searchRoutes = require('./routes/search');
app.use('/search', searchRoutes);

const ordersRoutes = require('./routes/ordersRoutes');
app.use('/', ordersRoutes);

const homeRoutes = require('./routes/homeRoutes');
app.use('/', homeRoutes);

const registerRoutes = require('./routes/registerRoutes');
app.use('/', registerRoutes);

const adminRoutes = require('./routes/adminRoutes');
adimnApp.use('/', adminRoutes);

const profileRoutes = require('./routes/profileRoutes');
app.use('/', profileRoutes);

const cartRoutes = require('./routes/cart');
app.use('/', cartRoutes);

const checkout = require('./routes/checkout');
app.use(checkout);



app.get('/', (req, res) => {
  if (req.session.user_id) {
    res.redirect('/home')
  }
  else {
    user_id = '';
    res.render('welcome');
  }
});

app.get('/logout', (req, res) => {
  user_id = '';
  req.session.destroy();
  res.render('welcome');
});

app.use((req, res) => {
  res.render('404');
})