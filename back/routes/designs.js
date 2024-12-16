const express = require('express');
const { submitDesign, getAllDesigns } = require('../controllers/designCont');
const router = express.Router();
const upload = require('../config/multer');









router.post('/submit', upload.array('images', 5),submitDesign)


router.get('/alldesigns',getAllDesigns)








module.exports = router;















