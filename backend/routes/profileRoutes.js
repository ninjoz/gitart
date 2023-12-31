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
deleteFollowings = (follower, following) => {
  return new Promise((resolve, reject) => {
    database.query(`DELETE FROM gitart.followings
      WHERE follower="${follower}" and following="${following}"`, (error, data) => {
      if (error) {
        return reject(error);
      }
      return resolve(data);
    });
  });
};
let favorited = '';

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
insertFollowings = (follower, following) => {
  return new Promise((resolve, reject) => {
    database.query(`INSERT INTO gitart.followings (follower,following) VALUES ("${follower}","${following}")`, (error, data) => {
      if (error) {
        return reject(error);
      }
      return resolve(data);
    });
  });
};
deleteDesigns = (design_id) => {
  return new Promise((resolve, reject) => {
    database.query(`DELETE FROM gitart.designs WHERE design_id=${design_id};`, (error, data) => {
      if (error) {
        return reject(error);
      }
      return resolve(data);
    });
  });
};
getFollowings = (follower, following) => {
  return new Promise((resolve, reject) => {
    database.query(`select * FROM gitart.followings WHERE follower="${follower}" and following= "${following}"`, (error, data) => {
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
getUsersByName = (name) => {
  return new Promise((resolve, reject) => {
    database.query(`SELECT * FROM gitart.users WHERE user_name= "${name}"`, (error, data) => {
      if (error) {
        return reject(error);
      }
      return resolve(data);
    });
  });
};
getDesigns = (id) => {
  return new Promise((resolve, reject) => {
    database.query('SELECT * FROM gitart.designs WHERE user_id= ?', [id], (error, data) => {
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

uploadCovPic = (filename, user_id) => {
  return new Promise((resolve, reject) => {
    database.query(`update gitart.users set cover_photo = "${filename}" where user_id ="${user_id}"`, (error, data) => {
      if (error) {
        return reject(error);
      }
      return resolve(data);
    });
  });
};
uploadProfPic = (filename, user_id) => {
  return new Promise((resolve, reject) => {
    database.query(`update gitart.users set profile_photo = "${filename}" where user_id ="${user_id}"`, (error, data) => {
      if (error) {
        return reject(error);
      }
      return resolve(data);
    });
  });
};

//const path = require('path');
let profile_photo = '';
let cover_photo = '';
let followers = '';
let design_id = [];
let design_title = [];
let design_price = [];
let blogs = [];
let design_path = [];
let artist_id = '';
let id = '';
let hisProfile = false;
let likedDesigns = [];
let isFollowing = '';
let likes = [];
let followings = '';
let account_type = '';
let = design_likes = [];
let design_source = [];
router.get('/:id', async (req, res, next) => {
  profile_photo = '';
  cover_photo = '';
  followers = '';
  design_id = [];
  design_title = [];
  design_price = [];
  blogs = [];
  design_path = [];
  likedDesigns = [];
  artist_id = '';
  id = '';
  hisProfile = false;
  isFollowing = '';
  likes = [];
  account_type = '';
  followings = '';
  design_likes = [];
  design_source = [];
  id = req.params.id;
  console.log(id)
  if (req.session.user_id) {
    let getUsername1 = await getUsername(req.session.user_id)
    user_name = getUsername1[0].user_name;
    let usersTableByName = await getUsersByName(id);

    if (usersTableByName.length > 0) {
      artist_id = usersTableByName[0].user_id;
      if (artist_id == req.session.user_id) {
        hisProfile = true;
        account_type = usersTableByName[0].account_type;
        // console.log(account_type)

        if (account_type == 'artist') {
          followers = usersTableByName[0].followers;
          //console.log(followers)
          profile_photo = usersTableByName[0].profile_photo;
          //console.log(profile_photo);
          cover_photo = usersTableByName[0].cover_photo;
          let designsTable = await getDesigns(artist_id);
          if (designsTable.length > 0) {
            artworkNum = designsTable.length;

            for (let count = 0; count < designsTable.length; count += 1) {



              design_path[count] = designsTable[count].design_path;
              design_price[count] = designsTable[count].design_price;
              design_id[count] = designsTable[count].design_id;
              design_title[count] = designsTable[count].design_title;
              design_likes[count] = designsTable[count].design_likes;
              design_source[count] = designsTable[count].design_source;
              blogs[count] = {
                "design_path": design_path[count], "design_id": design_id[count], "design_title": design_title[count], "design_price": design_price[count], "likes": design_likes[count]
                , "design_source": design_source[count]

              };
            }
          }

          res.render('artistprofile', {
            user_name,
            artist_id,
            profile_photo,
            user_id: req.session.user_id,
            cover_photo,
            blogs,
            followers,
            hisProfile,
            likedDesigns,
            isFollowing
          });















        }
        else {

          followings = usersTableByName[0].followings;
          //console.log(followers)
          profile_photo = usersTableByName[0].profile_photo;
          //console.log(profile_photo);
          cover_photo = usersTableByName[0].cover_photo;
          //console.log(cover_photo);
          let designsTable = await getDesigns(artist_id);
          if (designsTable.length > 0) {
            artworkNum = designsTable.length;

            for (let count = 0; count < designsTable.length; count += 1) {





              design_path[count] = designsTable[count].design_path;
              design_id[count] = designsTable[count].design_id;
              design_title[count] = designsTable[count].design_title;
              design_source[count] = designsTable[count].design_source;

              blogs[count] = {
                "design_path": design_path[count], "design_id": design_id[count], "design_title": design_title[count], "design_source": design_source[count]

              };


            }

          }

          res.render('customerprofile', {
            user_name,
            artist_id,
            profile_photo,
            user_id: req.session.user_id,
            cover_photo,
            blogs,
            followings,
            hisProfile,
            isFollowing
          });













        }






      }
      else {
        hisProfile = false;
        account_type = usersTableByName[0].account_type;
        if (account_type == 'artist') {
          let followingsTable = await getFollowings(req.session.user_id, artist_id);
          if (followingsTable.length > 0) {

            isFollowing = true;

          }
          else {
            isFollowing = false;
          }
          followers = usersTableByName[0].followers;
          //console.log(followers)
          profile_photo = usersTableByName[0].profile_photo;
          //console.log(profile_photo);
          cover_photo = usersTableByName[0].cover_photo;
          //console.log(cover_photo);
          let favoritesTable = await getFavorites(req.session.user_id);
          if (favoritesTable.length > 0) {

            for (let count = 0; count < favoritesTable.length; count += 1) {
              likedDesigns[count] = favoritesTable[count].design_id;

            }

          }

          let designsTable = await getDesigns(artist_id);
          if (designsTable.length > 0) {
            artworkNum = designsTable.length;

            for (let count = 0; count < designsTable.length; count += 1) {


              design_path[count] = designsTable[count].design_path;
              design_price[count] = designsTable[count].design_price;
              design_id[count] = designsTable[count].design_id;
              design_title[count] = designsTable[count].design_title;
              design_likes[count] = designsTable[count].design_likes;
              design_source[count] = designsTable[count].design_source;

              blogs[count] = { "design_path": design_path[count], "design_id": design_id[count], "design_title": design_title[count], "design_price": design_price[count], "likes": design_likes[count], "design_source": design_source[count] };

            }



          }


          res.render('artistprofile', {
            user_name: id,
            artist_id,
            profile_photo,
            user_id: req.session.user_id,
            cover_photo,
            blogs,
            followers,
            hisProfile,
            likedDesigns,
            isFollowing
          });




        }
        else {
          
          res.render('404');


        }









      }



    }
    else {
      next();
    }
  }
  else {

    res.render('404');
  }

});


router.post('/profilePic', upload.single("changeProfile"), async (req, res) => {
  let getUsername1 = await getUsername(req.session.user_id)
  user_name = getUsername1[0].user_name;
  let filename = req.file.filename;
  console.log(filename);
  let uploadProfPic1 = await uploadProfPic(filename, req.session.user_id);

  res.redirect(`/${user_name}`);



})
router.post('/coverPic', upload.single("changeCover"), async (req, res) => {

  let filename = req.file.filename;
  console.log(filename);
  let uploadCovPic1 =  await uploadCovPic(filename, req.session.user_id);
  res.redirect(`/${user_name}`);



})

router.post('/remove', async (req, res) => {
  let getUsername1 = await getUsername(req.session.user_id)
  user_name = getUsername1[0].user_name;
  let design_id = req.body.design_id;
  let deleteDesignsTable = await deleteDesigns(design_id);

  res.redirect(`/${user_name}`);

});
let followingNumber = '';
router.post('/follow', async (req, res) => {




  let following = req.body.following;
  let usersTableById = await getUsersById(following);
  let profileName = usersTableById[0].user_name;
  //let followOrUnfollow = req.body.followOrUnfollow;
  let followingsTable = await getFollowings(req.session.user_id, following);
  if (followingsTable.length > 0) {
    let deleteFollowingsTable = await deleteFollowings(req.session.user_id, following);
    isFollowing = true;


  }
  else if (followingsTable.length == '0') {
    let insertFollowingsTable = await insertFollowings(req.session.user_id, following)

    isFollowing = false;





  }
  else {
    res.render('404')
  }


  res.redirect(`/${profileName}`)
})

router.post('/heartedDesign', async (req, res) => {

  let design_id = req.body.design_id;
  let isLiked = req.body.isLiked;

  let getDesignsByDesignIdTable = await getDesignsByDesignId(design_id);
  let profileId = getDesignsByDesignIdTable[0].user_id;
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





  res.redirect(`/${profileName}`)







})




module.exports = router;