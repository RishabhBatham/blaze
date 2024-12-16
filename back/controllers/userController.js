const bcrypt = require("bcryptjs");

const UserModel = require("../models/user"); // Import the User model
const { sequelize } = require("../config/db");
const { route } = require("../routes/user");
const passport = require("passport");
const user = require("../models/user");
const jwt = require('jsonwebtoken');
const User = UserModel(sequelize, require("sequelize").DataTypes);
const IpAddress = UserModel(sequelize, require("sequelize").DataTypes);


require("../passport");


exports.userSignup = async (req, res, next) => {
  const {
    name,
    
    email,
    password,
  } = req.body;

  try {
    // Check if user with email or mobile already exists
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({
        status: false,
        message: "Email or mobile number already registered",
      });
    }

    // Hash password with bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Get the current date and time
    const currentDateTime = new Date();


  

    const newUser = await User.create({
      firstname:name,
      
      email,
      password: hashedPassword,

      role: "user",
      status: "active",
      // Save the current date and time
    });

    const token = jwt.sign(
      {
        userid: newUser.userid,
        email: newUser.email,
      },
      process.env.JWT_SECRET || "your_secret_key",
      {
        expiresIn: "45h",
      }
    );
    let myuser =newUser
    myuser['token'] =token 
    res.status(201).json({
      status: true,
      message: "User created successfully",
       user:myuser
       
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ status: false, message: "Server error" });
  }
};

exports.userSignin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Check if the user with the provided email exists
    const existingUser = await User.findOne({ where: { email } });

    if (!existingUser) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid email or password" });
    }

    // Compare the provided password with the hashed password in the database

    if(existingUser.dataValues.role=='admin'&&existingUser.dataValues.password==password)
    {
      const token = jwt.sign(
        { id: existingUser.userid, password: existingUser.password,email:existingUser.email },
        process.env.JWT_SECRET,
        { expiresIn: "41d" }
      );
      let myuser = existingUser.dataValues
      myuser['token']=token
      return res
      .status(200)
      .json({token:token, status: true, message: "adminlogged in", data:myuser,redirectUrl:'/admin' });   

       

    }
    else{
      console.log("password we recived is ",password)
      console.log("password from db is ",existingUser.password)
      const isPasswordValid = await bcrypt.compare(
        password,
        existingUser.password
      );
        


      if (!isPasswordValid) {
        return res
          .status(400)
          .json({ status: false, message: "Invalid email or password" });
      }
      console.log("existing user is", existingUser.dataValues.userid,existingUser.dataValues.firstname,existingUser.dataValues.email);
  
      const token = jwt.sign(
        { id: existingUser.userid, password: existingUser.password,email:existingUser.email },
        process.env.JWT_SECRET,
        { expiresIn: "45d" }
      );


      const myrole = existingUser.dataValues.status;
  
   
    
      // Respond with user details
      res.status(200).json({
        status: true,
        message: "Signed in",
        token:token,
        data: {
          user: {
            userid: existingUser.userid,
            firstname: existingUser.dataValues.firstname,
            mobile: existingUser.dataValues.mobile,
            role:existingUser.dataValues.role,
            lastname: existingUser.dataValues.lastname,
            gender: existingUser.dataValues.gender,
            
            email: existingUser.dataValues.email,
            town: existingUser.dataValues.town,
            country: existingUser.dataValues.country,
            state: existingUser.dataValues.state,
            address: existingUser.dataValues.address,
            zip: existingUser.dataValues.zip,
            status: existingUser.dataValues.status,
           
            token:token
            
          },
        },
      });
    }
  
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({
        status: false,
        message: "Something went wrong. Please try again later.",
      });
  }
};


exports.getAllUsers = async (req, res, next) => {
  try {
    // Fetch all users from the database
    const users = await User.findAll({
      attributes: [
         'userid', 'firstname', 'lastname', 'gender', 'mobile',
        'email',
        'username', 'role', 'status'
      ], 

    /*   order: [
        [sequelize.literal('dateandtime IS NULL'), 'ASC'], // Nulls last
        ['dateandtime', 'DESC'] // Non-null dates descending
      ] */

    });

    if (!users) {
      return res.status(404).json({ status: false, message: "No users found" });
    }

    // Respond with user details
    res.status(200).json({
      status: true,
      message: "Users fetched successfully",
      data: users
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: false,
      message: "Something went wrong. Please try again later."
    });
  }
};
exports.deleteUser = async (req, res, next) => {
  const { id } = req.body; // Assuming the user ID is passed as a URL parameter

  try {
    // Find the user by their ID
    const user = await User.findOne({ where: { id } });

    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    // Delete the user
    await user.destroy();

    // Respond with success
    res.status(200).json({
      status: true,
      message: `User with ID ${id} has been deleted successfully`,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};


exports.editUser = async (req, res, next) => {
  const { userid } = req.body; // Assume you pass userid as a URL parameter
  const {
      firstname,
      lastname,
      gender,
      mobile,
      email,
      town,
      country,
      state,
      address,
      zip,
      username,
      password,
      status,
  } = req.body;

  try {
      // Check if the user exists
      const existingUser = await User.findOne({ where: { userid } });

      if (!existingUser) {
          return res.status(404).json({ status: false, message: "User not found" });
      }

      // Create an update object with only the fields that are provided
      const updateData = {};
      if (firstname) updateData.firstname = firstname;
      if (lastname) updateData.lastname = lastname;
      if (gender) updateData.gender = gender;
      if (mobile) updateData.mobile = mobile;
      if (email) updateData.email = email;
      if (town) updateData.town = town;
      if (country) updateData.country = country;
      if (state) updateData.state = state;
      if (address) updateData.address = address;
      if (zip) updateData.zip = zip;
      if (username) updateData.username = username;
      if (password) updateData.password = password; // Make sure to hash the password if necessary before saving
      if (status) updateData.status = status;

      // Update user details only for the fields provided
      await User.update(updateData, {
          where: { userid },
      });

      // Respond with success message
      res.status(200).json({
          status: true,
          message: "User updated successfully",
          data: {
              userid,
              ...updateData, // Send back the updated fields
          },
      });
  } catch (err) {
      console.error(err);
      res.status(500).json({
          status: false,
          message: "Something went wrong. Please try again later.",
      });
  }
};



exports.getDashboardStats = async (req, res) => {
  try {
    // Fetch total customers from User model
    const totalCustomers = await User.count();

    // Fetch active customers from User model (assuming 'active' status indicates an active customer)
    const activeCustomers = await User.count({
      where: { status: 'active' }
    });

    // Fetch pending customers from the Accounts model
    const pendingAccounts = await Accounts(sequelize, require("sequelize").DataTypes).count({
      where: { status: 'pending' }
    });

    // Fetch total inquiries (assuming you have an Inquiry model)
    const totalInquiries = await InquiryModel(sequelize, require("sequelize").DataTypes).count();

    // Send the response with all the stats
    res.status(200).json({
      status: true,
      message: "Dashboard stats fetched successfully",
      data: {
        totalCustomers,
        activeCustomers,
        pendingAccounts,
        totalInquiries
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: false,
      message: "Error fetching dashboard stats",
      error: err.message,
    });
  }
};


exports.updateUserStatus = async (req, res) => {
  const { userid, status } = req.body; // Expecting userid and status in the request body

  try {
      // Check if the user exists
      const existingUser = await User.findOne({ where: { userid } });

      if (!existingUser) {
          return res.status(404).json({ status: false, message: "User not found" });
      }

      // Update the status
      await User.update({ status }, {
          where: { userid },
      });

      // Respond with success message
      res.status(200).json({
          status: true,
          message: "User status updated successfully",
          data: {
              userid,
              status // Send back the updated status
          },
      });
  } catch (err) {
      console.error(err);
      res.status(500).json({
          status: false,
          message: "Error updating user status",
          error: err.message,
      });
  }
};

exports.allIds = async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: [
        'userid'
      ]
    });

    if (!users || users.length === 0) {
      return res.status(404).json({ status: false, message: "No users found" });
    }

    res.status(200).json({
      status: true,
      message: "Users fetched successfully",
      data: users
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: false,
      message: "Something went wrong. Please try again later."
    });
  }
};

exports.updatePassword = async (req, res, next) => {
  const { userid, currentpass, newpass } = req.body;

  try {
    // Check if user with the given userid exists
    const user = await User.findOne({ where: { userid } });

    if (!user) {
      return res.status(200).json({ status: false, message: "User not found" });
    }

    // Compare the provided current password with the stored password in the database
    const isPasswordValid = await bcrypt.compare(currentpass, user.password);

    if (!isPasswordValid) {
      return res.status(200).json({ status: false, message: "Current password is incorrect" });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newpass, 10);

    // Update the user's password in the database
    await User.update(
      { password: hashedNewPassword },
      { where: { userid } }
    );

    res.status(200).json({
      status: true,
      message: "Password updated successfully",
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ status: false, message: "Server error" });
  }
};

exports.updateUser = async (req, res, next) => {
  const { 
    userid, firstname, lastname, gender, mobile, email, town, country, 
    state, address, zip, status 
  } = req.body;

  try {
    // Check if the user exists
    const existingUser = await User.findOne({ where: { userid } });

    if (!existingUser) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    // Create an object to store updated fields
    const updatedFields = {};

    // Only update the fields that are provided
    if (firstname) updatedFields.firstname = firstname;
    if (lastname) updatedFields.lastname = lastname;
    if (gender) updatedFields.gender = gender;
    if (mobile) updatedFields.mobile = mobile;
    if (email) updatedFields.email = email;
    if (town) updatedFields.town = town;
    if (country) updatedFields.country = country;
    if (state) updatedFields.state = state;
    if (address) updatedFields.address = address;
    if (zip) updatedFields.zip = zip;
    if (status) updatedFields.status = status;

    // Update the user data if any fields are provided
    if (Object.keys(updatedFields).length > 0) {
      await User.update(updatedFields, { where: { userid } });

      // Respond with the updated data
      res.status(200).json({
        status: true,
        message: "User updated successfully",
        data: {
          userid,
          ...updatedFields
        }
      });
    } else {
      res.status(400).json({ status: false, message: "No fields to update" });
    }

  } catch (err) {
    console.log(err);
    res.status(500).json({ status: false, message: "Server error" });
  }
};