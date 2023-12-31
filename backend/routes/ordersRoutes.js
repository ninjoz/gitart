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


let order_date = [];
let design_title = [];
let order_id = [];
let delivering_date = [];
let total_price = [];
let order_status = [];
let code = [];
let orders = [];
let fp_id = [];
let quantity = [];
let orderlines = [];
let dt = [];
let template_name = [];
let orderNum = 0;
let idOrder = [];
let sameOrder = [];
let unsortedSameOrder = [];
router.get('/myOrders', (req, res) => {
  if (req.session.user_id) {
    database.query(`SELECT * FROM gitart.orders where user_id="${req.session.user_id}"`, (error, data) => {
      if (error) {
        throw error;
      }
      else {
        if (data.length > 0) {
          orderNum = data.length;
          for (let count = 0; count < data.length; count++) {


            setTimeout(() => {
              idOrder[count] = data[count].order_id;

              order_date[count] = data[count].order_date;
              delivering_date[count] = data[count].delivering_date;
              total_price[count] = data[count].total_price;
              order_status[count] = data[count].order_status;
              code[count] = data[count].code;


              unsortedSameOrder[count] = {
                "order_date": order_date[count], "idOrder": idOrder[count], "delivering_date": delivering_date[count], "total_price": total_price[count], "order_status": order_status[count], "code": code[count]
              };
            }, 10)



          }
        }
        else {
          orderNum = 0;
        }
      }
    })
    setTimeout(() => {
      sameOrder = unsortedSameOrder.sort(
        (objA, objB) => Number(objB.order_date) - Number(objA.order_date),
      );

    }, 50)
    database.query(`Select orders.order_id, template_name,design_title,quantity,fp.fp_id
      from gitart.orders orders
      INNER JOIN gitart.orderline AS orderline ON orders.order_id = orderline.order_id
      INNER JOIN gitart.finalproduct AS fp ON orderline.fp_id = fp.fp_id
      INNER JOIN gitart.designs AS des ON  fp.design_id = des.design_id
      INNER JOIN gitart.templates AS temp ON temp.template_id = fp.template_id
      where orders.user_id="${req.session.user_id}"`, (error, data) => {
      if (error) {
        throw error;
      }
      else {
        for (let count = 0; count < data.length; count++) {

          //console.log(orderlines);
          setTimeout(() => {
            order_id[count] = data[count].order_id;


            template_name[count] = data[count].template_name;
            design_title[count] = data[count].design_title;
            quantity[count] = data[count].quantity;
            fp_id[count] = data[count].fp_id;


            orders[count] = {
              "order_id": order_id[count],
              "template_name": template_name[count],
              "design_title": design_title[count],
              "quantity": quantity[count],
              "fp_id": fp_id[count]
            };
          }, 10)















        }




      }
    })


    setTimeout(() => {
      console.log(orders)
      console.log(sameOrder)
      if (sameOrder.delivering_date != null) {
        console.log("not null")
      }
      else {
        console.log("null")
      }


      res.render('orders', {
        orders,
        idOrder,
        orderNum,
        sameOrder,
        joining_date
      });


    }, 50)
  }
  else {
    res.render('404');
  }

})


router.post('/deliveryCheck', (req, res) => {
  let codeId = req.body.codeId;
  let date = req.body.date;

  database.query(`update gitart.orders set delivering_date = "${date}" , order_status = "Delivered" where user_id ="${req.session.user_id}" and code="${codeId}"`, (error, data) => {
    if (error) {
      throw error;
    }

  });

  res.redirect('/myOrders');

})



module.exports = router;