// routes/user.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const {userSignup, userSignin, getAllUsers, deleteUser, editUser, allIds, updatePassword, updateUser}  = require('../controllers/userController')

const { sequelize } = require('../config/db'); // Import your sequelize instance
const UserModel = require('../models/user'); // Import the User model
const adminAuthenticator = require('../middle/adminAuthenticator');



const User = UserModel(sequelize, require('sequelize').DataTypes); 


// POST /api/users
router.get('/', async (req, res) => {
 

  try {
    
   
   
    const user = await User.findOne();

    res.status(201).json({ data:user });
  } catch (err) {
   

 
  }

 

});


router.post('/signu', /* signupValidation, */ userSignup);
router.post('/login', /* signupValidation, */ userSignin);
router.get('/all',getAllUsers)
router.post('/deleteuser', deleteUser);
router.post('/edit',editUser)

router.get('/allids',allIds)
router.post('/updatepassword',updatePassword)
router.post('/updateuser',updateUser);





module.exports = router;
