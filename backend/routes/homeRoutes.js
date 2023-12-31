const express = require('express');
const router = express.Router();
let bodyParser = require('body-parser')
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
getdesigns = () => {
  return new Promise((resolve, reject) => {
    database.query('SELECT * FROM designs where design_privacy="Public"', (error, data) => {
      if (error) {
        return reject(error);
      }
      return resolve(data);
    });
  });
};
getfinalproduct = (design_id) => {
  return new Promise((resolve, reject) => {
    database.query(`SELECT * FROM gitart.finalproduct WHERE design_id = ${design_id}`, (error, data) => {
      if (error) {
        return reject(error);
      }
      return resolve(data);
    });
  });
};
gettemplates = (template_id) => {
  return new Promise((resolve, reject) => {
    database.query(`SELECT template_before, template_after FROM gitart.templates WHERE template_id = ${template_id}`, (error, data) => {
      if (error) {
        return reject(error);
      }
      return resolve(data);
    });
  });
};
router.get("/home", async (request, response) => {
  if (request.session.user_id) {
    let getUsername1 = await getUsername(request.session.user_id)
    user_name = getUsername1[0].user_name;
    let getdesignsTable = await getdesigns();
    if (getdesignsTable.length > 0) {
      const blogs = [];
      const array = [];
      const array2 = [];
      for (let i = 0; i < getdesignsTable.length; i++) {
        let getfinalproductTable = await getfinalproduct(getdesignsTable[i].design_id);
        if (getfinalproductTable.length > 0) {
          const fp_id = getfinalproductTable[0].fp_id;
          let fp_price = getfinalproductTable[0].fp_price;
          const template_id = getfinalproductTable[0].template_id;
          let gettemplatesTable = await gettemplates(template_id);
          if (gettemplatesTable.length > 0) {
            const template_before = gettemplatesTable[0].template_before;
            const template_after = gettemplatesTable[0].template_after;

            array[i] = fp_id;
            array2[i] = fp_price;
            console.log(array[i]);

            blogs[i] = {
              "design_id": getdesignsTable[i].design_id,
              "design_path": getdesignsTable[i].design_path,
              "design_price": getdesignsTable[i].design_price,
              "design_title": getdesignsTable[i].design_title,
              "fp_id": array[i],
              "fp_price": array2[i],
              "template_before": template_before,
              "template_after": template_after
            };
          }

        }
      }

      response.render('home', { user_name, blogs, cart: request.session.cart });

    }
    else {

      response.render('home', { user_name, blogs: [], cart: request.session.cart });

    }



    /* res.render('home', {
       user_name
     });*/
  }
  else {
    response.render('welcome');
  }

});


router.get("/designs/Favourites", async (request, response) => {
  if (request.session.user_id) {
    let getUsername1 = await getUsername(request.session.user_id)
    user_name = getUsername1[0].user_name;



    database.query(`select * from gitart.favorites f join gitart.designs d on f.user_id = d.user_id join gitart.finalproduct fp on d.design_id = fp.design_id join gitart.templates temp on fp.template_id =temp.template_id where f.user_id  ="${request.session.user_id}";`, (error, data) => {
      console.log(data);
      if (error) {
        console.error('Error fetching data:', error);
        response.status(500).send('Internal Server Error');
        return;
      }

      if (data.length > 0) {
        //
        let blogs = data.map((row) => {
          return {
            "design_title": row.design_title,
            "design_path": row.design_path,
            "fp_id": row.fp_id,
            "design_likes": row.design_likes,
            "description": row.description,
            "design_price": row.design_price,
            "design_id": row.design_id,
            "template_id": row.template_id,
            "fp_price": row.fp_price,
            "size": row.size,
            "template_before": row.template_before,
            "template_after": row.template_after
          };
        });
        setTimeout(() => {
          response.render('home', { user_name, blogs, cart: request.session.cart });

        }, 100)

      } else {
        console.log("iiiiiiiiiiii")
        // Handle case when no favorites are found
        response.render('home', { user_name, blogs: [], cart: request.session.cart });
      }
    });
  }
  else {
    res.render('welcome');


  }
});

router.get("/designs/Following", async (request, response) => {
  if (request.session.user_id) {
    let getUsername1 = await getUsername(request.session.user_id)
    user_name = getUsername1[0].user_name;
    let blogs = [];
    const query = `select * from gitart.followings f join gitart.designs d on f.following = d.user_id join gitart.finalproduct fp on d.design_id = fp.design_id join gitart.templates temp on fp.template_id =temp.template_id   where f.follower  = ${request.session.user_id};`;

    database.query(query, (error, result) => {
      if (error) {
        console.error('Error fetching data:', error);
        response.status(500).send('Internal Server Error');
        return;
      }

      if (result.length > 0) {
        blogs = result.map((row) => {
          return {
            "design_title": row.design_title,
            "fp_id": row.fp_id,
            "design_path": row.design_path,
            "design_likes": row.design_likes,
            "description": row.description,
            "design_price": row.design_price,
            "design_id": row.design_id,
            "template_id": row.template_id,
            "fp_price": row.fp_price,
            "size": row.size,
            "template_before": row.template_before,
            "template_after": row.template_after
          };
        });
      }
      setTimeout(() => {
        response.render('home', { user_name, blogs, cart: request.session.cart });
      }, 100)

    });

  }
  else {
    res.render('welcome');


  }
});
let fp_id = ';'
router.get('/product/:id', (req, res, next) => {
  if (req.session.user_id) {
    fp_id = '';
    const productId = req.params.id;
    fp_id = productId;
    let reviews = '';
    database.query('SELECT r.*, u.user_name FROM Reviews r JOIN Users u ON r.user_id = u.user_id WHERE r.fp_id = ?', [productId], (error, results) => {
      if (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).send('Internal Server Error');
        return;
      }
      else {
        if (results.length > 0) {
          reviews = results;

        }

      }
    })


    // Query to fetch product details, template_id, template_before, and template_after
    const query = `
        SELECT
            fp.fp_id,
            fp.size,
            fp.fp_price,
            fp.design_id,
            t.template_id,
            t.template_before,
            t.template_after,
            d.description,
            d.design_title,
            d.design_path,
            u.user_name
        FROM
            FinalProduct fp
            JOIN Templates t ON fp.template_id = t.template_id
            JOIN Designs d ON fp.design_id = d.design_id
            JOIN Users u ON d.user_id = u.user_id
        WHERE
            fp.fp_id = ?
    `;

    // Execute Query
    database.query(query, [productId], (error, results) => {
      if (error) {
        console.error('Error fetching product details:', error);
        res.status(500).send('Internal Server Error');
        return;
      }

      if (results.length === 0) {
        next();
        return;
      }

      const product = {
        "design_title": results[0].design_title,
        "artist": results[0].user_name,
        "size": results[0].size,
        "price": results[0].fp_price,
        "description": results[0].description,
        "design_path": results[0].design_path,
        "template_before": results[0].template_before,
        "template_after": results[0].template_after
      };

      console.log(product);
      console.log(product.design_path);

      // Render the product details page with the retrieved data
      setTimeout(() => {
        res.render('product', {
          product, cart: req.session.cart, productId,
          reviews
        });
      }, 1000)
    });

  }
  else {
    res.render('404');
  }

});
router.post('/reviews', (req, res) => {
  if (req.session.user_id) {
    //constant values
    const user_id = req.session.user_id;
    const { review_text } = req.body;

    const insertQuery = 'INSERT INTO Reviews (user_id, fp_id, review_date,  review_text) VALUES (?, ?, ?, ?)';
    database.query(insertQuery, [user_id, fp_id, joining_date, review_text], (error, results) => {
      if (error) {
        console.error('Error inserting review:', error);
        res.status(500).send('Internal Server Error');
        return;
      }

      res.redirect(`/product/${fp_id}`);
    });



  }
  else {
    res.render('404');
  }

});
getcategory =  (category) => {
  return new Promise((resolve, reject) => {
    database.query(`SELECT *, t.template_before, t.template_after
    FROM gitart.FinalProduct fp
    JOIN gitart.Templates t ON fp.template_id = t.template_id
    JOIN gitart.designs des ON fp.template_id = des.design_id
    WHERE t.template_name ="${category}"
`, (error, data) => {
      if (error) {
        return reject(error);
      }
      return resolve(data);
    });
  });
};



router.get("/designs/:category", async (request, response, next) => {
  if (request.session.user_id) {
    let getUsername1 = await getUsername(request.session.user_id)
    user_name = getUsername1[0].user_name;
    let blogs = [];
    const category = request.params.category;
    const query = `
    SELECT *, t.template_before, t.template_after
    FROM gitart.FinalProduct fp
    JOIN gitart.Templates t ON fp.template_id = t.template_id
    JOIN gitart.designs des ON fp.template_id = des.design_id
    WHERE t.template_name = ?;
    `;

    let getcategory1 = await getcategory(category);
    if (getcategory1.length > 0) {
      blogs = getcategory1.map((row) => {
        return {

          "design_title": row.design_title,
          "design_path": row.design_path,
          "fp_id": row.fp_id,
          "design_likes": row.design_likes,
          "description": row.description,
          "design_price": row.design_price,
          "design_id": row.design_id,
          "template_id": row.template_id,
          "fp_price": row.fp_price,
          "size": row.size,
          "template_before": row.template_before,
          "template_after": row.template_after



         
        };
      });
      response.render('home', { user_name, blogs, cart: request.session.cart });

    }
    else {
      next();
    }



  }
  else {
    request.render('404');
  }

});
router.post('/cart', (req, res, next) => {
  if (req.session.user_id) {
    const productId = req.body.proId;
    const userId = req.session.user_id;
    const quantity = req.body.quantity;
    const AddorRemove = req.body.AddorRemove;
    console.log(userId)
    console.log(productId)
    console.log(quantity)
    console.log(AddorRemove)

    if (AddorRemove == "Remove") {
      console.log("remove")
      const insertQuery = 'INSERT INTO cartitem (user_id, fp_id, fp_adding_date,quantity) VALUES (?, ?, ?,?)';

      database.query(insertQuery, [userId, productId, joining_date, quantity], (error, result) => {
        if (error) {
          console.error('Error inserting into cart:', error);
          res.status(500).send('Internal Server Error');
          return;
        }

        res.redirect(`/product${productId}`);
      });

      //delete
    }
    else if (AddorRemove == "Add") {
      console.log("add")

      const insertQuery = 'INSERT INTO cartitem (user_id, fp_id, fp_adding_date,quantity) VALUES (?, ?, ?,?)';

      database.query(`DELETE FROM gitart.cartitem
      WHERE user_id="${userId}" and fp_id="${productId}" and quantity="${quantity}"`, (error, result) => {
        if (error) {
          console.error('Error inserting into cart:', error);
          res.status(500).send('Internal Server Error');
          return;
        }

        res.redirect(`/product${productId}`);
      });


    }
    else {
      next();
    }


  }
  else {
    req.render('404');
  }


});

module.exports = router;