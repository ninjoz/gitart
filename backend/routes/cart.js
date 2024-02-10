const express = require('express');
const router = express.Router();
const database = require('../database');

getCartDetails = (userId) => {
    return new Promise((resolve, reject) => {
      database.query(`
      SELECT
          CartItem.user_id,
          CartItem.fp_id,
          CartItem.fp_adding_date,
          CartItem.quantity,
          Designs.design_path,
          Designs.design_title,
          Designs.design_source,
          Templates.template_name,
          Templates.template_before,
          Templates.template_after,
          FinalProduct.fp_price
      FROM CartItem
      LEFT JOIN FinalProduct ON CartItem.fp_id = FinalProduct.fp_id
      INNER JOIN Templates ON FinalProduct.template_id = Templates.template_id
      INNER JOIN Designs ON FinalProduct.design_id = Designs.design_id
      WHERE CartItem.user_id ="${userId}"`, (error, data) => {
        if (error) {
          return reject(error);
        }
        return resolve(data);
      });
    });
  };


  getPrice = (userId,fpId) => {
    return new Promise((resolve, reject) => {
      database.query(`SELECT FinalProduct.fp_price FROM CartItem INNER JOIN FinalProduct ON CartItem.fp_id = FinalProduct.fp_id 
    WHERE CartItem.user_id = ? AND CartItem.fp_id = ?`, [userId, fpId], (error, data) => {
        if (error) {
          return reject(error);
        }
        return resolve(data);
      });
    });
  };
  deleteQuery = (userId,fpId) => {
    return new Promise((resolve, reject) => {
      database.query(`DELETE FROM CartItem WHERE user_id = ? AND fp_id = ?`, [userId, fpId], (error, data) => {
        if (error) {
          return reject(error);
        }
        return resolve(data);
      });
    });
  };
router.get('/cart', async (req, res) => {
    if (req.session.user_id) {
        const userId = req.session.user_id;
        let getCartDetails1 = await getCartDetails(userId)

     

            // Check if results is an array and has at least one item
            if (!Array.isArray(getCartDetails1) || getCartDetails1.length === 0) {
                return res.render('cart', { cartItems: [], cartTotal: 0 });
            }

            // Organize the data into a format suitable for rendering in the template
            const cartItems = getCartDetails1.map((row) => ({
                fp_id: row.fp_id,
                design_source: row.design_source,
                fp_adding_date: row.fp_adding_date,
                design_title: row.design_title,
                design_path: row.design_path,
                template_name: row.template_name,
                template_before: row.template_before,
                template_after: row.template_after,
                fp_price: row.fp_price,
                quantity: row.quantity,
            }));

            const cartTotal = cartItems.reduce((total, item) => total + item.fp_price * item.quantity, 0);

            res.render('cart', { cartItems, cartTotal });
        

    }
    else {
        res.render('404');
    }

});

router.post('/removeItem', async (req, res) => {
    if (req.session.user_id) {
        const userId = req.session.user_id;
        const { fpId } = req.body;

        // Retrieve the price of the item being removed by joining with FinalProduct table
        let getPrice1 = await getPrice(userId,fpId)

     
           

            const removedItemPrice = getPrice1[0].fp_price;

            // Remove item from the CartItem table for the logged-in user

           
            let deleteQuery1 = await deleteQuery(userId,fpId)
         
                res.json({ success: true, removedItemPrice: removedItemPrice });
        
    }
    else {
        res.render('404');
    }

});


module.exports = router;
