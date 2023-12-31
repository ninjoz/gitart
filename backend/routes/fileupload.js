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
const connection = require('../database');
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
      connection.query(`SELECT design_id FROM gitart.designs WHERE user_id="${user_id}" and design_path="${design_path}"`, (error, data) => {
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

//var storage = multer.memoryStorage();
//var upload = multer({ storage: storage });

router.post("/upload", upload.single('sample'), async function (req, res, next) {
    if(req.session.user_id){
        let fileSaved = false;
        let productsSaved = false;
    
        if (req.file) {
             filename = req.file.originalname;
            
        } else {
            console.log("No file to upload.");
        }
    
        try {
           
            const designResult = await connection.query(
                'INSERT INTO designs (user_id,design_id, design_price, description, posting_date, design_title, design_path) VALUES (?,?, ?, ?, ?, ?, ?)',
                [req.session.user_id,req.body.design_id, req.body.price_field, req.body.description_field, new Date(), req.body.title_field, filename]
            );
             //design_id = designResult.insertId; // Get the inserted design ID
            //connection.release();
            fileSaved = true;
        } catch (error) {
            console.error(error);
            fileSaved = false;
        }
    
        // Handle enabled products
        try {
            let getDesignId1=await getDesignId(req.session.user_id, filename)
            design_id=getDesignId1[0].design_id;
            const enabledProducts = JSON.parse(req.body.enabledProducts || '[]');
            if (enabledProducts.length > 0) {
    
                for (let product of enabledProducts) {
                    let template_Id = product.id;
                  
                    
                    await connection.query(
                        'INSERT INTO FinalProduct (template_id,design_id) VALUES (?, ?)',
                        [template_Id,design_id]
                    );
                }
    
               // connection.release();
                productsSaved = true;
            } else {
                console.log("No products to enable and save.");
                productsSaved = true; // Set to true because it's not an error if there are no products to save
            }
        } catch (error) {
            console.error("Error saving enabled products:", error);
            productsSaved = false;
        }
    
        // Final response
        if (fileSaved && productsSaved) {
            res.send("File and products saved successfully.");
        } else {
            res.status(500).send("Error saving file and/or products.");
        }


    }
    else{
        res.render('404')

    }
   
});


module.exports = router;
