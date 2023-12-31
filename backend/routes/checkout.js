const express = require('express');
const router = express.Router();
const database = require('../database');

router.get('/checkout', async (req, res) => {
  if (req.session.user_id) {
    try {
      const userId = req.session.user_id;

      // Check if the cart is empty
      const checkCartQuery = 'SELECT COUNT(*) AS cartCount FROM CartItem WHERE user_id = ?';
      const cartCountResult = await new Promise((resolve, reject) => {
        database.query(checkCartQuery, [userId], (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        });
      });

      const cartCount = cartCountResult[0].cartCount;


      if (cartCount === 0) {
        return res.send("<script>alert('Your cart is empty.'); window.location='/cart';</script>");
      }


      const query = `
        SELECT 
          CartItem.*, 
          FinalProduct.*, 
          Designs.*, 
          Templates.*, 
          FinalProduct.fp_price
        FROM CartItem
        JOIN FinalProduct ON CartItem.fp_id = FinalProduct.fp_id
        JOIN Designs ON FinalProduct.design_id = Designs.design_id
        JOIN Templates ON FinalProduct.template_id = Templates.template_id
        WHERE CartItem.user_id = ?;`;

      const products = await new Promise((resolve, reject) => {
        database.query(query, [userId], (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      });

      products.forEach(product => {
        product.sub_total = product.quantity * product.fp_price;
      });
      const orderTotal = products.reduce((total, product) => total + product.sub_total, 0);

      req.session.orderTotal = orderTotal;

      res.render('checkout', { products, orderTotal });
    } catch (error) {
      console.error('Error fetching or processing product data:', error);
      res.status(500).send('Internal Server Error');
    }

  }
  else {
    res.render('404');
  }

});


router.post('/confirm-order', async (req, res) => {
  if (req.session.user_id) {
    try {
      const userId = req.session.user_id;

      let codeExists;
      let code;
      do {
        code = Math.floor(10000000 + Math.random() * 90000000);
        codeExists = await checkIfCodeExists(code);
      } while (codeExists);

      // console.log('Received orderTotal:', req.session.orderTotal);

      const orderInsertResult = await new Promise((resolve, reject) => {
        const orderQuery = `
          INSERT INTO Orders (user_id, order_date, code)
          VALUES (?, NOW(), ?);
        `;

        database.query(orderQuery, [userId, code], (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        });
      });

      const orderId = orderInsertResult.insertId;

      const cartItems = await new Promise((resolve, reject) => {
        const cartItemQuery = 'SELECT * FROM CartItem WHERE user_id = ?';
        database.query(cartItemQuery, [userId], (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      });

      for (const cartItem of cartItems) {
        const orderLineQuery = `
          INSERT INTO OrderLine (order_id, fp_id, quantity, sub_total)
          VALUES (?, ?, ?, ?);
        `;
        await new Promise((resolve, reject) => {
          database.query(orderLineQuery, [orderId, cartItem.fp_id, cartItem.quantity, cartItem.sub_total], (error) => {
            if (error) {
              reject(error);
            } else {
              resolve();
            }
          });
        });
      }

      const postalCodeQuery = `
        INSERT INTO PostalCodes (order_id, postal_code)
        VALUES (?, ?);
      `;
      await new Promise((resolve, reject) => {
        database.query(postalCodeQuery, [orderId, req.body.postalCode], (error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      });

      res.redirect('/');
    } catch (error) {
      console.error('Error confirming order:', error);
      res.status(500).send('Internal Server Error');
    }


  }
  else {
    res.render('404');
  }
});

async function checkIfCodeExists(code) {
  return new Promise((resolve, reject) => {
    const checkCodeQuery = 'SELECT COUNT(*) as count FROM Orders WHERE code = ?';
    database.query(checkCodeQuery, [code], (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result[0].count > 0);
      }
    });
  });
}

module.exports = router;
