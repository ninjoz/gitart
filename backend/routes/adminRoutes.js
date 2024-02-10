const express = require('express');
const router = express.Router();

const database = require('../database');
let bodyParser = require('body-parser')

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
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
let orderNum = '';
let artists = '';
let customers='';
let earnings = '';
let mug = '';
let phone_cover = '';
let coaster = '';
let ipad_case = '';
let laptop_sleeve = '';
let tote_bag = '';
let t_shirt = '';
let notebook = '';
let laptop_skin = '';
let poster = '';
let frame = '';
let A4 = '';
let sticker = '';
let missedQuantities =[];
let processingOrders=[];
let processingCode=[];
let shippedOrders=[];
let shippedDate=[];
let shippedCode=[];

getOrders = (staus) =>{
  return new Promise((resolve, reject)=>{
      database.query(`SELECT * FROM gitart.orders where order_status="${staus}";`, (error, data)=>{
          if(error){
              return reject(error);
          }
          return resolve(data);
      });
  });
};
ordersNumber = () =>{
  return new Promise((resolve, reject)=>{
      database.query(`SELECT COUNT(*) as orderNum FROM gitart.orders;`, (error, data)=>{
          if(error){
              return reject(error);
          }
          return resolve(data);
      });
  });
};
artistsNumber = () =>{
  return new Promise((resolve, reject)=>{
      database.query(`SELECT COUNT(*) as artists FROM gitart.users where account_type="artist"`, (error, data)=>{
          if(error){
              return reject(error);
          }
          return resolve(data);
      });
  });
};
customersNumber = () =>{
  return new Promise((resolve, reject)=>{
      database.query(`SELECT COUNT(*) as customers FROM gitart.users where account_type="customer"`, (error, data)=>{
          if(error){
              return reject(error);
          }
          return resolve(data);
      });
  });
};
totalEarnings = () =>{
  return new Promise((resolve, reject)=>{
      database.query(`select sum(total_price) as total_price from gitart.orders where order_status="Delivered"`, (error, data)=>{
          if(error){
              return reject(error);
          }
          return resolve(data);
      });
  });
};
getTemplates = (id) =>{
  return new Promise((resolve, reject)=>{
      database.query(`select in_stock from gitart.templates where template_id="${id}"`, (error, data)=>{
          if(error){
              return reject(error);
          }
          return resolve(data);
      });
  });
};




router.get('/admin', async (req, res) => {
  orderNum = '';
 artists = '';
 customers='';
 earnings = '';
 mug = '';
 phone_cover = '';
 coaster = '';
 ipad_case = '';
 laptop_sleeve = '';
 tote_bag = '';
 t_shirt = '';
 notebook = '';
 laptop_skin = '';
 poster = '';
 frame = '';
 A4 = '';
 sticker = '';
  let deliveredOrders=[];
  let deliveredDate=[];
  let deliveredCode=[];
  let pendingOrders=[];
  let pendingCode=[];
  let processingOrders=[];
  let processingCode=[];
  let shippedOrders=[];
  let shippedDate=[];
  let shippedCode=[];
  let missedQuantities =[];





let ordersNumber1 = await ordersNumber();
if (ordersNumber1.length > 0) {
  orderNum = ordersNumber1[0].orderNum;
}
let artistsNumber1 = await artistsNumber();
if (artistsNumber1.length > 0) {
  artists = artistsNumber1[0].artists;
}
let customersNumber1 = await customersNumber();
if (customersNumber1.length > 0) {
  customers = customersNumber1[0].customers;
}
let totalEarnings1 = await totalEarnings();
if (totalEarnings1.length > 0) {
  earnings =parseFloat( totalEarnings1[0].total_price);
}
  
  let getTemplates1 = await getTemplates(1);
  if (getTemplates1.length > 0) {
    phone_cover = getTemplates1[0].in_stock;
  }
  let getTemplates2 = await getTemplates(2);
  if (getTemplates2.length > 0) {
    mug = getTemplates2[0].in_stock;
  }
  let getTemplates3 = await getTemplates(3);
  if (getTemplates3.length > 0) {
    coaster = getTemplates3[0].in_stock;
  }
  let getTemplates4 = await getTemplates(4);
  if (getTemplates4.length > 0) {
    notebook = getTemplates4[0].in_stock;
  }
  let getTemplates5 = await getTemplates(5);
  if (getTemplates5.length > 0) {
    ipad_case = getTemplates5[0].in_stock;
  }
  let getTemplates6 = await getTemplates(6);
  if (getTemplates6.length > 0) {
    laptop_sleeve = getTemplates6[0].in_stock;
  }
  let getTemplates7 = await getTemplates(7);
  if (getTemplates7.length > 0) {
    sticker = getTemplates7[0].in_stock;
  }
  let getTemplates8 = await getTemplates(8);
  if (getTemplates8.length > 0) {
    laptop_skin = getTemplates8[0].in_stock;
  }
  let getTemplates9 = await getTemplates(9);
  if (getTemplates9.length > 0) {
    t_shirt = getTemplates9[0].in_stock;
  }
  let getTemplates10 = await getTemplates(10);
  if (getTemplates10.length > 0) {
    tote_bag = getTemplates10[0].in_stock;
  }
  let getTemplates11 = await getTemplates(11);
  if (getTemplates11.length > 0) {
    poster = getTemplates11[0].in_stock;
  }
  let getTemplates12 = await getTemplates(12);
  if (getTemplates12.length > 0) {
    frame = getTemplates12[0].in_stock;
  }
  let getTemplates13 = await getTemplates(13);
  if (getTemplates13.length > 0) {
    A4 = getTemplates13[0].in_stock;
  }

  let getOrdersTable1 = await getOrders("Delivered");
  if (getOrdersTable1.length > 0) {
for(let i=0;i<getOrdersTable1.length;i++){
  deliveredDate[i] = getOrdersTable1[i].delivering_date;
  deliveredCode[i] = getOrdersTable1[i].code;
  
  deliveredOrders[i] = { "delivering_date": deliveredDate[i], "code": deliveredCode[i]
};


}


  }


  let getOrdersTable2 = await getOrders("Pending");
  if (getOrdersTable2.length > 0) {
for(let i=0;i<getOrdersTable2.length;i++){
  let missedQuantities=[];
  //pendingWhy[i] = getOrdersTable2[i].delivering_date;
  pendingCode[i] = getOrdersTable2[i].code;
  let orderDetails1 = await orderDetails(pendingCode[i]);
  if(orderDetails1.length>0){
    for(let j=0;j<orderDetails1.length;j++){
      if(orderDetails1[j].missed_quantity>0){
        missedQuantities[j]= orderDetails1[j].template_name;
  
      }
      
    }
  }
  

  
  pendingOrders[i] = {  "code": pendingCode[i],
  "missedQuantities":missedQuantities
};


}


  }
  let getOrdersTable3 = await getOrders("Processing");
  if (getOrdersTable3.length > 0) {
for(let i=0;i<getOrdersTable3.length;i++){
  processingCode[i] = getOrdersTable3[i].code;
  
  processingOrders[i] = { "code": processingCode[i]
};


}


  }
  let getOrdersTable4 = await getOrders("Shipped");
  if (getOrdersTable4.length > 0) {
for(let i=0;i<getOrdersTable4.length;i++){
  shippedDate[i] = getOrdersTable4[i].shipment_date;
  shippedCode[i] = getOrdersTable4[i].code;
  
  shippedOrders[i] = { "shipment_date": shippedDate[i], "code": shippedCode[i]
};


}


  }




 
  res.render('admin', {
    deliveredOrders,
    shippedOrders,
    processingOrders,
    pendingOrders,
    
    orderNum,
    artists,
    customers,
    earnings,
    
    
 mug ,
 phone_cover,
 coaster ,
 ipad_case, 
 laptop_sleeve,
 tote_bag ,
 t_shirt ,
 notebook ,
 laptop_skin ,
 poster,
 frame ,
 A4 ,
 sticker ,
 joining_date
  });


  


})
insertIntoOrders = (date,code) =>{
  return new Promise((resolve, reject)=>{
      database.query(`update gitart.orders set order_status ="Shipped", shipment_date ="${date}" where code =${code}`, (error, data)=>{
          if(error){
              return reject(error);
          }
          return resolve(data);
      });
  });
};

router.post('/processingFinished', async(req,res)=>{
let codeId = req.body.codeId;
let date = req.body.date;
let insertIntoOrders1 = await insertIntoOrders(date,codeId);

  res.redirect('/admin');


})
getOrderDetailsByCode = (code) =>{
  return new Promise((resolve, reject)=>{
      database.query(`SELECT * FROM gitart.orders where code ="${code}";`, (error, data)=>{
          if(error){
              return reject(error);
          }
          return resolve(data);
      });
  });
};

orderDetails = (code) =>{
  return new Promise((resolve, reject)=>{
      database.query(`Select *
      from gitart.orders orders
      INNER JOIN gitart.orderline AS orderline ON orders.order_id = orderline.order_id
      INNER JOIN gitart.users AS users ON orders.user_id = users.user_id
      INNER JOIN gitart.finalproduct AS fp ON orderline.fp_id = fp.fp_id
      INNER JOIN gitart.designs AS des ON  fp.design_id = des.design_id
      INNER JOIN gitart.templates AS temp ON temp.template_id = fp.template_id
      where orders.code=${code}`, (error, data)=>{
          if(error){
              return reject(error);
          }
          return resolve(data);
      });
  });
};


router.get('/order:id',async (req,res)=>{
  let delDate='';
let shipDate='';
let totPrice='';
let orderDet=[];
let template_name=[];
let design_title=[];
let quantity=[];
let fp_id=[];
let sub_totPrice=[];
let dat='';
let order_username='';

let orderCode = req.params.id;
let getOrderDetailsByCode1 = await getOrderDetailsByCode(orderCode);
if(getOrderDetailsByCode1.length>0){
let orderDetails1 = await orderDetails(orderCode);
if(orderDetails1.length>0){
  let state = orderDetails1[0].order_status;

  
  totPrice = orderDetails1[0].total_price;
  order_username=orderDetails1[0].user_name;
  dat= orderDetails1[0].order_date;
if(state=="Delivered"){
  delDate= orderDetails1[0].order_date;
}
else if(state=="Shipped"){
  shipDate= orderDetails1[0].shipment_date;
}


  for (let count = 0; count < orderDetails1.length; count++) {
            
    
    
      
      

      template_name[count]=orderDetails1[count].template_name;
      design_title[count]=orderDetails1[count].design_title;
      quantity[count]=orderDetails1[count].quantity;
      fp_id[count]=orderDetails1[count].fp_id;
      sub_totPrice[count]=orderDetails1[count].sub_total;
      

      orderDet[count] = { 
      "template_name":template_name[count],
      "design_title":design_title[count],
      "quantity":quantity[count],
      "fp_id":fp_id[count],
      "sub_totPrice":sub_totPrice[count]

  }}
  res.render('orderDetails',{
    state,
    delDate,
    shipDate,

    dat,
    orderCode,
    totPrice,
    orderDet,
    order_username


  })


}
else{

  res.render('404');
}






}
else{

  res.render('404');
}



})

router.post('/searchOrder',async (req,res)=>{
  let searchedCode = req.body.searchCode;
  res.redirect(`/order${searchedCode}`)


})





updateTemplates = (oldVal,newVAl,template_id) =>{
  return new Promise((resolve, reject)=>{
      database.query(`update gitart.templates set in_stock = ${oldVal}+${newVAl} where template_id ="${template_id}"`, (error, data)=>{
          if(error){
              return reject(error);
          }
          return resolve(data);
      });
  });
};

router.post('/admin', async (req, res) => {

  let mugNum = req.body.EnteredMugNum;
  let coasterNum = req.body.EnteredCoasterNum;
  let PhonecoverNum=req.body.EnteredPhoneNum;
  let ipadcaseNum = req.body.EnteredIpadNum;
  let laptopsleeveNum = req.body.EnteredLaptopsleeveNum;
  let totebagNum=req.body.EnteredTotebagNum;
  let tshirtNum = req.body.EnteredTshirtNum;
  let notebookNum = req.body.EnteredNotebookNum;
  let laptopskinNum=req.body.EnteredLaptopskinNum;
  let posterNum = req.body.EnteredPosterNum;
  let frameNum = req.body.EnteredFrameNum;
  let a4Num=req.body.EnteredA4Num;
  let stickerNum=req.body.EnteredStickerNum;


  if(mugNum){
    let updateTemplates2 = await updateTemplates(mug,mugNum,2);
    
  }
  if(coasterNum){
    let updateTemplates3 = await updateTemplates(coaster,coasterNum,3);
    
  }
  if(PhonecoverNum){
    let updateTemplates1 = await updateTemplates(phone_cover,PhonecoverNum,1);

    
  }
  if(ipadcaseNum){
    let updateTemplates5 = await updateTemplates(ipad_case,ipadcaseNum,5);
  }
  if(laptopsleeveNum){
    let updateTemplates6 = await updateTemplates(laptop_sleeve,laptopsleeveNum,6);
  }
  if(totebagNum){
    let updateTemplates10 = await updateTemplates(tote_bag,totebagNum,10);
    
  }
  if(tshirtNum){
    let updateTemplates9 = await updateTemplates(t_shirt,tshirtNum,9);
    
  }
  if(notebookNum){
    let updateTemplates4 = await updateTemplates(notebook,notebookNum,4);

  }
  if(laptopskinNum){
    let updateTemplates8 = await updateTemplates(laptop_skin,laptopskinNum,8);
    
  }
  if(posterNum){
    let updateTemplates11 = await updateTemplates(poster,posterNum,11);
    
  }
  if(frameNum){
    let updateTemplates12 = await updateTemplates(frame,frameNum,12);

  }
  if(a4Num){
    let updateTemplates13 = await updateTemplates(A4,a4Num,13);
    
  }
  if(stickerNum){
    let updateTemplates7 = await updateTemplates(sticker,stickerNum,7);
    
  }

  


    res.redirect('/admin')
    


})




module.exports = router;