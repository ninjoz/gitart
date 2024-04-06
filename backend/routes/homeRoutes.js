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
let likedDesigns = [];
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
insertIntoCart =  (userId, productId, joining_date, quantity) => {
  return new Promise((resolve, reject) => {
    database.query(`INSERT INTO cartitem (user_id, fp_id, fp_adding_date,quantity) VALUES (?, ?, ?,?)
`, [userId, productId, joining_date, quantity], (error, data) => {
      if (error) {
        return reject(error);
      }
      return resolve(data);
    });
  });
};

deleteFromCart =  (userId, productId, quantity) => {
  return new Promise((resolve, reject) => {
    database.query(`DELETE FROM gitart.cartitem
    WHERE user_id="${userId}" and fp_id="${productId}" and quantity="${quantity}"`, (error, data) => {
      if (error) {
        return reject(error);
      }
      return resolve(data);
    });
  });
};
insertReview =  (user_id, fp_id, joining_date, review_text) => {
  return new Promise((resolve, reject) => {
    database.query('INSERT INTO Reviews (user_id, fp_id, review_date,  review_text) VALUES (?, ?, ?, ?)',[user_id, fp_id, joining_date, review_text], (error, data) => {
      if (error) {
        return reject(error);
      }
      return resolve(data);
    });
  });
};


getcategory =  (category) => {
  return new Promise((resolve, reject) => {
    database.query(`SELECT * FROM gitart.FinalProduct fp
    JOIN gitart.Templates t ON fp.template_id = t.template_id
    JOIN gitart.designs des ON fp.design_id = des.design_id
    WHERE t.template_name ="${category}"
`, (error, data) => {
      if (error) {
        return reject(error);
      }
      return resolve(data);
    });
  });
};


getdesigns = (start_index,num_record) => {
  return new Promise((resolve, reject) => {
    database.query(`SELECT * FROM designs where design_privacy="Public" LIMIT ${start_index}, ${num_record}`, (error, data) => {
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

getFavoritesss = (user_id) => {
  return new Promise((resolve, reject) => {
    database.query(`select  d.user_id,f.design_id,d.design_price,d.description,d.posting_date,d.design_title,d.design_path,d.design_path,d.design_likes,d.design_source,fp.fp_id,temp.template_name,temp.template_after,temp.template_before,fp.fp_price,fp.size from gitart.favorites f join gitart.designs d on d.design_id = f.design_id join gitart.finalproduct fp on d.design_id = fp.design_id join gitart.templates temp on fp.template_id =temp.template_id where f.user_id  ="${user_id}";`, (error, data) => {
      if (error) {
        return reject(error);
      }
      return resolve(data);
    });
  });
};
getFollowingsss = (user_id) => {
  return new Promise((resolve, reject) => {
    database.query(`select * from gitart.followings f join gitart.designs d on f.following = d.user_id join gitart.finalproduct fp on d.design_id = fp.design_id join gitart.templates temp on fp.template_id =temp.template_id   where f.follower  ="${user_id}";`, (error, data) => {
      if (error) {
        return reject(error);
      }
      return resolve(data);
    });
  });
};

getReviews = (productId) => {
  return new Promise((resolve, reject) => {
    database.query(`SELECT r.*, u.user_name FROM Reviews r JOIN Users u ON r.user_id = u.user_id WHERE r.fp_id  ="${productId}";`, (error, data) => {
      if (error) {
        return reject(error);
      }
      return resolve(data);
    });
  });
};

getPD = (productId) => {
  return new Promise((resolve, reject) => {
    database.query(`SELECT
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
    d.design_source,
    u.user_name
FROM
    FinalProduct fp
    JOIN Templates t ON fp.template_id = t.template_id
    JOIN Designs d ON fp.design_id = d.design_id
    JOIN Users u ON d.user_id = u.user_id
WHERE
    fp.fp_id ="${productId}";`, (error, data) => {
      if (error) {
        return reject(error);
      }
      return resolve(data);
    });
  });
};
getFavorites = (id) => {
  return new Promise((resolve, reject) => {
    database.query('SELECT * FROM gitart.favorites where user_id= ?', [id], (error, data) => {
      if (error) {
        return reject(error);
      }
      return resolve(data);
    });
  });
};
let resType="";
let num_record=0;
let start_index=0;
router.get("/home", async (request, response) => {
  resType="Explore";
  
  likedDesigns = [];
  blogs=[];
  blogs.length = 0;
  if (request.session.user_id) {
    let favoritesTable = await getFavorites(request.session.user_id);
          if (favoritesTable.length > 0) {

            for (let count = 0; count < favoritesTable.length; count += 1) {
              likedDesigns[count] = favoritesTable[count].design_id;

            }

          }
           userId = request.session.user_id;
       start_index = request.query.start_index || request.body.start_index || 0;
       num_record = request.query.num_record || request.body.num_record || 15;
      console.log(start_index);
      console.log(num_record);
    let getUsername1 = await getUsername(request.session.user_id)
    user_name = getUsername1[0].user_name;
    let getdesignsTable = await getdesigns(parseInt(start_index),parseInt(num_record));
    if (getdesignsTable.length > 0) {
      
      const array = [];
      const array2 = [];
      for (let i = 0; i < getdesignsTable.length; i++) {
        blogs.length = getdesignsTable.length;
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
           

            blogs[i] = {
              "user_id": getdesignsTable[i].user_id,
              "design_id": getdesignsTable[i].design_id,
              "design_path": getdesignsTable[i].design_path,
              "design_price": getdesignsTable[i].design_price,
              "design_title": getdesignsTable[i].design_title,
              "likes":getdesignsTable[i].design_likes,
              "fp_id": array[i],
              "design_source":getdesignsTable[i].design_source,
              "fp_price": array2[i],
              "template_before": template_before,
              "template_after": template_after
            };
          }

        }
      }
      if (request.xhr) {
      
       
          response.render('partials/homeCard', {start_index,num_record, resType,"user_id": request.session.user_id, user_name, blogs,likedDesigns, cart: request.session.cart });
      
      
    
    }
      else{
        if (blogs.length > 0) {
          response.render('home', {start_index,num_record, resType,"user_id": request.session.user_id, user_name, blogs,likedDesigns, cart: request.session.cart });
      }
    
      }
    

     

    }
    
  


  
}
  else {
    response.redirect('/');
  }

});

iterateData =  (getFavorites1) => {
  return new Promise((resolve, reject) => {
    let blogs = [];
    for (let count = 0; count < getFavorites1.length; count += 1) {

      
      blogs[count] = {
        "design_path": getFavorites1[count].design_path, "design_id": getFavorites1[count].design_id, "design_title": getFavorites1[count].design_title, "design_price": getFavorites1[count].design_price, "likes": getFavorites1[count].design_likes
        , "design_source": getFavorites1[count].design_source,
        "fp_id": getFavorites1[count].fp_id,
        "description": getFavorites1[count].description,
        "template_id": getFavorites1[count].template_id,
        "fp_price": getFavorites1[count].fp_price,
        "size": getFavorites1[count].size,
        "template_before": getFavorites1[count].template_before,
        "template_after": getFavorites1[count].template_after

      };
    }

      return resolve(blogs);
    
  });
};
router.get("/designs/Favourites", async (request, response) => {
  resType="Favorites";
  likedDesigns = [];
  if (request.session.user_id) {
    let favoritesTable = await getFavorites(request.session.user_id);
          if (favoritesTable.length > 0) {

            for (let count = 0; count < favoritesTable.length; count += 1) {
              likedDesigns[count] = favoritesTable[count].design_id;

            }

          }
    let getUsername1 = await getUsername(request.session.user_id)
    user_name = getUsername1[0].user_name;
    let blogs = [];

    let getFavorites1 = await getFavoritesss(request.session.user_id)
    
      if (getFavorites1.length > 0) {
        blogs = await iterateData(getFavorites1);
        

          response.render('home', {start_index,num_record,likedDesigns,resType, "user_id": request.session.user_id,user_name, blogs, cart: request.session.cart });

     

      } else {
       
        // Handle case when no favorites are found
        response.render('home', {start_index,num_record,resType,"user_id": request.session.user_id, user_name,likedDesigns, blogs: [], cart: request.session.cart });
      }
    
  }
  else {
    response.redirect('/');


  }
});



router.get("/designs/Following", async (request, response) => {
  resType="Followings";
  likedDesigns = [];
  if (request.session.user_id) {
    let favoritesTable = await getFavorites(request.session.user_id);
          if (favoritesTable.length > 0) {

            for (let count = 0; count < favoritesTable.length; count += 1) {
              likedDesigns[count] = favoritesTable[count].design_id;

            }

          }
    let getUsername1 = await getUsername(request.session.user_id)
    user_name = getUsername1[0].user_name;
    let blogs = [];
    
    let getFollowings1 = await getFollowingsss(request.session.user_id)

     

      if (getFollowings1.length > 0) {
        blogs = getFollowings1.map((row) => {
          return {
            "design_title": row.design_title,
            "fp_id": row.fp_id,
            "design_path": row.design_path,
            "likes": row.design_likes,
            "description": row.description,
            "design_price": row.design_price,
            "design_source":row.design_source,
            "user_id":row.user_id,
            "design_id": row.design_id,
            "template_id": row.template_id,
            "fp_price": row.fp_price,
            "size": row.size,
            "template_before": row.template_before,
            "template_after": row.template_after
          };
        });
      }
     
        response.render('home', {start_index,num_record,resType,"user_id": request.session.user_id, user_name,likedDesigns, blogs, cart: request.session.cart });
      

  }
  else {
    response.redirect('/');


  }
});



let fp_id = ';'
router.get('/product/:id', async(req, res, next) => {
  if (req.session.user_id) {
    fp_id = '';
    const productId = req.params.id;
    fp_id = productId;
    let reviews = '';

    let getReviews1 = await getReviews(productId)

   
        if (getReviews1.length > 0) {
          reviews = getReviews1;

        }

      
  


    let getPD1 = await getPD(productId)

    

      if (getPD1.length === 0) {
        next();
        return;
      }

      const product = {
        "design_title": getPD1[0].design_title,
        "design_source":getPD1[0].design_source,
        "artist": getPD1[0].user_name,
        "size": getPD1[0].size,
        "price": getPD1[0].fp_price,
        "description": getPD1[0].description,
        "design_path": getPD1[0].design_path,
        "template_before": getPD1[0].template_before,
        "template_after": getPD1[0].template_after
      };

      

      // Render the product details page with the retrieved data
    
        res.render('product', {
          product, cart: req.session.cart, productId,
          reviews
        });
     
    

  }
  else {
    res.render('404');
  }

});
router.post('/reviews', async (req, res) => {
  
  if (req.session.user_id) {
    //constant values
    const user_id = req.session.user_id;
    const { review_text } = req.body;
    let insertReview1 = await insertReview(user_id, fp_id, joining_date, review_text)

   

      res.redirect(`/product/${fp_id}`);
  



  }
  else {
    res.render('404');
  }

});


router.get("/designs/:category", async (request, response, next) => {
  
  likedDesigns = [];
  if (request.session.user_id) {
    let favoritesTable = await getFavorites(request.session.user_id);
          if (favoritesTable.length > 0) {

            for (let count = 0; count < favoritesTable.length; count += 1) {
              likedDesigns[count] = favoritesTable[count].design_id;

            }

          }
    let getUsername1 = await getUsername(request.session.user_id)
    user_name = getUsername1[0].user_name;
    let blogs = [];
    const category = request.params.category;
    
    resType=category;
    let getcategory1 = await getcategory(category);
    if (getcategory1.length > 0) {
      blogs = getcategory1.map((row) => {
        return {

          "design_title": row.design_title,
          "design_path": row.design_path,
          "design_source":row.design_source,
          "fp_id": row.fp_id,
          "likes": row.design_likes,
          "description": row.description,
          "design_price": row.design_price,
          "design_id": row.design_id,
          "user_id":row.user_id,
          "template_id": row.template_id,
          "fp_price": row.fp_price,
          "size": row.size,
          "template_before": row.template_before,
          "template_after": row.template_after



         
        };
      });
      response.render('home', {start_index,num_record,resType,"user_id": request.session.user_id, user_name,likedDesigns, blogs, cart: request.session.cart });

    }
    else {
      next();
    }



  }
  else {
    response.render('404');
  }

});
router.post('/heartedDesign', async (req, res) => {

  let design_id = req.body.design_id;
  let isLiked = req.body.isLiked;

  let getDesignsByDesignIdTable = await getDesignsByDesignId(design_id);
  let profileId =  getDesignsByDesignIdTable[0].user_id;
  let usersTableById = await getUsersById(profileId);
  let profileName = usersTableById[0].user_name;
  //console.log(design_id);
  //console.log(isLiked);
  if (isLiked == 'notLiked') {
    let deleteFavoritesTable = await deleteFavorites(design_id, req.session.user_id)

  }
  else if (isLiked == 'Liked') {
    let insertFavoritesTable = await insertFavorites(design_id, req.session.user_id);



  }





  res.redirect(`/home`)







})
router.post('/cart', async (req, res, next) => {
  if (req.session.user_id) {
    const productId = req.body.proId;
    const userId = req.session.user_id;
    const quantity = req.body.quantity;
    const AddorRemove = req.body.AddorRemove;
    

    if (AddorRemove == "Remove") {
      let insertIntoCart1 = await insertIntoCart(userId, productId, joining_date, quantity)

        res.redirect(`/product${productId}`);
      

      //delete
    }
    else if (AddorRemove == "Add") {
      let deleteFromCart1 = await deleteFromCart(userId, productId, quantity)

    

        res.redirect(`/product${productId}`);
     


    }
    else {
      next();
    }


  }
  else {
    res.render('404');
  }


});
getDesignsByDesignId = (design_id) => {
  return new Promise((resolve, reject) => {
    database.query('SELECT * FROM gitart.designs WHERE design_id= ?', [design_id], (error, data) => {
      if (error) {
        return reject(error);
      }
      return resolve(data);
    });
  });
};
getUsersById = (id) => {
  return new Promise((resolve, reject) => {
    database.query('SELECT * FROM gitart.users WHERE user_id= ?', [id], (error, data) => {
      if (error) {
        return reject(error);
      }
      return resolve(data);
    });
  });
};
deleteFavorites = (design_id, user_id) => {
  return new Promise((resolve, reject) => {
    database.query(`DELETE FROM favorites
      WHERE design_id="${design_id}" and user_id="${user_id}"`, (error, data) => {
      if (error) {
        return reject(error);
      }
      return resolve(data);
    });
  });
};
insertFavorites = (design_id, user_id) => {
  return new Promise((resolve, reject) => {
    database.query(`INSERT INTO favorites (design_id,user_id) VALUES ("${design_id}","${user_id}")`, (error, data) => {
      if (error) {
        return reject(error);
      }
      return resolve(data);
    });
  });
};


module.exports = router;