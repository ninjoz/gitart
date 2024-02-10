const express = require('express');
const router = express.Router();
let bodyParser = require('body-parser')
const path = require("path");
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
const database = require('../database');
const oneWeek = 1000 * 60 * 60 * 24 * 7;
const bcrypt = require('bcrypt');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
const saltRound = 10;
const session = require('express-session');


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
const fs = require('fs');





let design_id='';
var filename='';
getDesignId = (user_id,design_path) => {
    return new Promise((resolve, reject) => {
      database.query(`SELECT design_id FROM gitart.designs WHERE user_id="${user_id}" and design_path="${design_path}"`, (error, data) => {
        if (error) {
          return reject(error);
        }
        return resolve(data);
      });
    });
  };

router.get("/upload", function (req, res, next) {
    res.render('fileupload', { title: 'file upload' });
});


checkAccType = (user_id) => {
    return new Promise((resolve, reject) => {
      database.query(`SELECT account_type FROM gitart.users where user_id="${user_id}"`, (error, data) => {
        if (error) {
          return reject(error);
        }
        return resolve(data);
      });
    });
  };

uploadDesign = (filename, user_id,design_price,description,design_title,design_privacy) => {
    return new Promise((resolve, reject) => {
      database.query(`INSERT INTO gitart.designs (user_id,design_price,description,design_title,design_privacy,design_path,posting_date,design_source) VALUES ("${user_id}","${design_price}","${description}","${design_title}","${design_privacy}","${filename}","${joining_date}","local")`, (error, data) => {
        if (error) {
          return reject(error);
        }
        return resolve(data);
      });
    });
  };
  getUsername = (user_id) => {
    return new Promise((resolve, reject) => {
      database.query(`select user_name from users where user_id ="${user_id}"`, (error, data) => {
        if (error) {
          return reject(error);
        }
        return resolve(data);
      });
    });
  };
  insertTags = (design_id,tag) => {
    return new Promise((resolve, reject) => {
      database.query(`insert into gitart.categories(design_id,tags) values ("${design_id}","${tag}")`, (error, data) => {
        if (error) {
          return reject(error);
        }
        return resolve(data);
      });
    });
  };
  
  insertFP = (design_id,template_id) => {
    return new Promise((resolve, reject) => {
      database.query(`insert into gitart.finalproduct (design_id,template_id,size) values ("${design_id}","${template_id}",100)`, (error, data) => {
        if (error) {
          return reject(error);
        }
        return resolve(data);
      });
    });
  };


router.post("/fileupload", upload.single('uploadDesign'), async function (req, res, next) {
    if(req.session.user_id){
      let filename = req.file.filename;
      console.log(filename);



        let title_field=req.body.title_field;
        console.log(title_field);

        let description_field=req.body.description_field;
        console.log(description_field);

        let tags_field= req.body.tags_field;
        console.log(tags_field);

        let price_field=req.body.price_field;
        console.log(price_field);


        let tshirt=req.body.tshirt;
        console.log(tshirt);
        let totebag=req.body.totebag;
        let sticker=req.body.sticker;
        let poster=req.body.poster;
        let phoneCover=req.body.phoneCover;
        let notebook=req.body.notebook;
        let mug=req.body.mug;
        let laptopSleeve=req.body.laptopSleeve;
        let laptopSkin=req.body.laptopSkin;
        let ipadCase=req.body.ipadCase;
        let frame=req.body.frame;
        let coaster=req.body.coaster;
        let a4=req.body.a4;


        let getUsername1 = await getUsername(req.session.user_id)
        let user_name = getUsername1[0].user_name;
        let checkAccType1 = await checkAccType(req.session.user_id)
        let accType = checkAccType1[0].account_type;
        
        let segmenter = new Intl.Segmenter([], { granularity: 'word' });
let segmentedText = segmenter.segment(tags_field);
let words = [...segmentedText].filter(s => s.isWordLike).map(s => s.segment);
console.log(words);

        if(accType=="artist"){
            let uploadDesign1 = await uploadDesign(filename, req.session.user_id,price_field,description_field,title_field,"Public");
                 
      }
        else{
            let uploadDesign1 = await uploadDesign(filename, req.session.user_id,price_field,description_field,title_field,"Private");
            
        }
        let getDesignId1= await getDesignId(req.session.user_id,filename)
        let desId=getDesignId1[0].design_id;
        if (words.length > 0) {
            for (let count = 0; count < words.length; count++) {
let insertTags1 = await insertTags(desId,words[count]);

            }
    }
        if(tshirt=="on"){
          let insertFP1 = await insertFP(desId,9)
        }
         if(totebag=="on"){
          let insertFP1 = await insertFP(desId,10)

        }
         if(sticker=="on"){
          let insertFP1 = await insertFP(desId,7)

        }
         if(poster=="on"){
          let insertFP1 = await insertFP(desId,11)

        }
         if(phoneCover=="on"){
          let insertFP1 = await insertFP(desId,1)

        }
         if(notebook=="on"){
          let insertFP1 = await insertFP(desId,4)

        }
         if(mug=="on"){
          let insertFP1 = await insertFP(desId,2)

        }
         if(laptopSleeve=="on"){
          let insertFP1 = await insertFP(desId,6)

        }
         if(laptopSkin=="on"){
          let insertFP1 = await insertFP(desId,8)

        }
         if(ipadCase=="on"){
          let insertFP1 = await insertFP(desId,5)

        }
         if(frame=="on"){
          let insertFP1 = await insertFP(desId,12)

        }
         if(coaster=="on"){
          let insertFP1 = await insertFP(desId,3)

        }
         if(a4=="on"){
          let insertFP1 = await insertFP(desId,13)

        }
        res.redirect(`/${user_name}`);
    }
    else{
        res.render('404')

    }
   
});


module.exports = router;
