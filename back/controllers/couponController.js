const CouponModel = require("../models/coupon"); // Import the Coupon model
const { sequelize } = require("../config/db");

const Coupon = CouponModel(sequelize, require("sequelize").DataTypes);






exports.fetchAllCoupons = async (req, res) => {
  try {
    // Use a raw query to fetch all coupons
    const [coupons] = await sequelize.query('SELECT * FROM coupon');

    res.status(200).json({ status: true, data: coupons }); // Send the coupons as a JSON response
  } catch (error) {
    console.error('Error fetching coupons:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Controller to validate a coupon
exports.validateCoupon = async (req, res) => {
  const { couponcode } = req.body;

  // Validate input data
  if (!couponcode) {
    return res.status(400).json({
      status: false,
      message: "Coupon code is required."
    });
  }

  try {
    // Fetch the coupon from the database
    const coupon = await Coupon.findOne({
      where: {
        name: couponcode,
        status: 'active' // Assuming status should be active to be valid
      }
    });

    // Check if the coupon exists and is valid
    if (!coupon) {
      return res.status(201).json({
        status: false,
        message: "Invalid or inactive coupon code."
      });
    }

    // If coupon exists and is valid, return success
    res.status(200).json({
      status: true,
      message: "Coupon is valid.",
      data:coupon
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: false,
      message: "Error validating coupon.",
      error: err.message
    });
  }
};



exports.addCoupon = async (req, res) => {
  const { id, name, value, description='', type, status, validFrom, validTo } = req.body;

  try {
    // Create a new coupon
    const newCoupon = await Coupon.create({

      name,
      value,
      /* description: description, */ // Assuming 'description' field is named 'desc' in the database
      type,
      status,
      validfrom: validFrom, // Matching database field 'validfrom'
      validto: validTo      // Matching database field 'validto'
    });

    // Return a success response
    res.status(201).json({
      status: true,
      message: "Coupon created successfully.",
      data: newCoupon
    });
  } catch (err) {
    console.error("Error creating coupon:", err);
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
      error: err.message
    });
  }
};


exports.editCoupon = async (req, res) => {
 // Get the coupon ID from the URL parameters
  const {id, name, value, description = '', type, status, validFrom, validTo } = req.body; // Get the new data from the request body

  try {
    // Find the coupon by ID
    const coupon = await Coupon.findOne({
      where: {
        id: id, // Match the coupon ID
      },
    });

    // Check if the coupon exists
    if (!coupon) {
      return res.status(404).json({
        status: false,
        message: "Coupon not found.",
      });
    }

    // Update the coupon details
    const updatedCoupon = await coupon.update({
      name,
      value,
      desc: description, // Assuming the database field is named 'desc'
      type,
      status,
      validfrom: validFrom, // Matching database field 'validfrom'
      validto: validTo,     // Matching database field 'validto'
    });

    // Return a success response
    res.status(200).json({
      status: true,
      message: "Coupon updated successfully.",
      data: updatedCoupon,
    });
  } catch (err) {
    console.error("Error updating coupon:", err);
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};


exports.deleteCoupon = async (req, res) => {
  const { id } = req.body; // Get the coupon ID from the URL parameters

  try {
    // Attempt to delete the coupon from the database
    const result = await Coupon.destroy({
      where: {
        id: id, // Match the coupon ID
      },
    });

    // Check if a coupon was deleted
    if (result === 0) {
      return res.status(404).json({
        status: false,
        message: "Coupon not found.",
      });
    }

    res.status(200).json({
      status: true,
      message: "Coupon deleted successfully.",
    });
  } catch (err) {
    console.error("Error deleting coupon:", err);
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};






