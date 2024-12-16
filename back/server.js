const express = require('express');
const dotenv = require('dotenv');
const { connectDB, sequelize } = require('./config/db');
const upload = require('./config/multer')
const morgan = require("morgan");
const path = require('path');
const DesignModel = require("./models/design");
const PaymentModel = require("./models/payment")

const Design = DesignModel(sequelize, require("sequelize").DataTypes);
const Payment = PaymentModel(sequelize, require("sequelize").DataTypes);
const Razorpay = require('razorpay');
const razorpayInstance = new Razorpay({
  key_id: 'rzp_test_nt89OO93hs7lOa',
  key_secret: 'K2Bcit4uwQ1fMdhVr58TDEZj',
});
const crypto = require('crypto');



// Load environment variables from .env file
dotenv.config();

const cors = require('cors')

// Initialize Express
const app = express();
app.use(morgan("combined"));


// Middleware to log request details

const userRoutes = require('./routes/user')
const designRoutes = require('./routes/designs')


// This is your test secret API key.

app.use(cors())
// Middleware to parse JSON
app.use(express.json());

// Define Routes
app.use('/api/users', userRoutes);
app.use('/api/design',designRoutes)



// Sync models with the database
sequelize.sync({ force: false }).then(() => {
  console.log('Database & tables synced!');
});

// Connect to MySQL

connectDB();


// Set the server to listen on a port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
app.use(express.static(path.join(__dirname, "public")));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.post('/create-order', async (req, res) => {
  const { amount } = req.body; // Amount from the frontend
  try {
    const options = {
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };
    const order = await razorpayInstance.orders.create(options);
    res.json(order); // Send order details to the frontend
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating payment order');
  }
});



app.post('/verify-payment', upload.array('images', 5), async (req, res) => {
  const { payment_id, order_id, signature,userid } = req.body; // Received from frontend
  
  try {
    // Create the body string for verification: "order_id|payment_id"
    const body = order_id + "|" + payment_id;
    
    // Generate the expected signature using your Razorpay key_secret
    const expectedSignature = crypto
      .createHmac('sha256', razorpayInstance.key_secret)
      .update(body)
      .digest('hex');
    

      console.log('expected signature isssssssss',expectedSignature,signature);
    // Compare the expected signature with the received signature
    if (expectedSignature === signature) {
     
      await Payment.create({
        userid: userid, // Assuming userid is passed correctly from the frontend
        verified: false, // Mark as verified
        date: new Date(), // Current date
       
      });

      res.status(200).json({ success: true, message: 'Payment verified and logged successfully' });
   

    } else {
      res.status(400).json({ success: false, message: 'Payment verification failed' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error verifying payment');
  }
});

