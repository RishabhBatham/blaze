const { sequelize } = require("../config/db");
const DesignModel = require("../models/design");
const PaymentModel = require("../models/payment")


const Design = DesignModel(sequelize, require("sequelize").DataTypes);
const Payment = PaymentModel(sequelize,require("sequelize").DataTypes)
const upload = require('../multer')

exports.submitDesign = async (req, res) => {
  try {
    const { userid, category } = req.body; // Form data
    const files = req.files; // Uploaded files



    if (!files || files.length === 0) {
      return res.status(400).json({
        status: false,
        message: "At least one file must be uploaded",
      });
    }

    // Check if payment exists for the user and if it's not verified
    const paymentLog = await Payment.findOne({
      where: {
        userid: userid,
        verified: false, // Only proceed if payment is not verified
      },
    });

    if (!paymentLog) {
      return res.status(400).json({
        status: false,
        message: "Payment not found. Please complete payment verification first.",
      });
    }

    // Extract filenames and join them with commas
    const filenames = files.map((file) => file.filename).join(',');

    // Save design to the database
    const newDesign = await Design.create({
      category: category,
      images: filenames,
      userid: userid, // User ID
    });

    // After the design is submitted, update the payment log as verified
    await Payment.update(
      { verified: true },
      { where: { userid: userid, verified: false} }
    );

    res.status(201).json({
      status: true,
      message: "Design submitted successfully, and payment verified.",
      data: newDesign,
    });
  } catch (err) {
    console.error("Error submitting design:", err);
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

exports.getAllDesigns = async (req, res) => {
  try {
    // Fetch all designs from the database
    const designs = await Design.findAll();

    if (designs.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No designs found.",
      });
    }

    res.status(200).json({
      status: true,
      message: "All designs fetched successfully.",
      data: designs,
    });
  } catch (err) {
    console.error("Error fetching designs:", err);
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

