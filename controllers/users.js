//ROUTER SETUP
//=========================================
var express = require('express');
var router = express.Router();

//EXTERNAL FILES
//======================================
var User = require('../models/user');
var Item = require('../models/item').model;
var findItemIndex = require('../public/js/logic.js');


//Adding a new item
router.post('/add-item', function(req, res){
  console.log("new item", req.body);
  User.findOne({
    username: req.user.username
  })
  .then(function(user){
    if(!req.body.favorite){
      var favorite = false;
    }
    user.groceryList.push({
      name: req.body.name,
      description: req.body.description,
      // favorite: favorite,
      favorite: req.body.favorite,
      purchased: false
    });
    user.save();
    res.json(user);
    console.log(user);
  })
  .catch(function(err){
    console.log(err);
  });
});

// Adding a new favorite item
router.post('/favorite-item', function(req, res){
  console.log("new item", req.body);
  User.findOne({
    username: req.user.username
  })
  .then(function(user){
    user.favorites.push({
      name: req.body.name,
      description: req.body.description,
      // favorite: favorite,
      favorite: req.body.favorite,
      purchased: false
    });
    user.save();
    res.json(user);
    console.log(user);
  })
  .catch(function(err){
    console.log(err);
  });
});

//Edit an existing item
router.put('/edit-item', function(req, res){
  User.findOne({
    username:  req.user.username
  }, function(err, user){
    console.log("CURRENT ITEM ID", req.body.currentItemId);
    //function to find Item in groceryList
    var itemIndex = findItemIndex(req.body.currentItemId, user.groceryList);
    console.log("THIS IS THE EDITED ITEM RESULTS", req.body.editedItem);
    user.groceryList[itemIndex] = req.body.editedItem;
    
    // var favIndex = findItemIndex(req.body.currentItemId, user.favorites);
    // user.favorites[favIndex] = req.body.editedItem;

    user.save(function(err){
      if(err) console.log(err);
      console.log("Edited Item Saved to User!!!");
    });
    res.json(user);
  });
});

//deleting an item
router.delete('/delete/:id', function(req, res){
  User.findOne({
    username: req.user.username
  }, function(err, user){
    console.log("CURRENT ITEM ID", req.params.id);
    var itemIndex = findItemIndex(req.params.id, user.groceryList);
    console.log("ITEM INDEX", itemIndex);
    user.groceryList.splice(itemIndex, 1);

    user.save(function(err){
      if(err) console.log(err);
      console.log("Item deleted from User");
    });

    res.json(user);
  });
});

// Removing a favorite item
router.delete('/unfavorite-item/:id', function(req, res){
  User.findOne({
    username: req.user.username
  }, function(err, user){
    console.log("CURRENT FAVORITE ITEM ID", req.params.id);
    var itemIndex = findItemIndex(req.params.id, user.favorites);
    console.log("ITEM INDEX", itemIndex);
    user.favorites.splice(itemIndex, 1);

    user.save(function(err){
      if(err) console.log(err);
      console.log("Item deleted from Favorites");
    });

    res.json(user);
  });
});




module.exports = router;
