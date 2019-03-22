const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataController.js');



router.put('/data', dataController.addData); 
router.get('/data', dataController.getAllData);
router.delete('/data', dataController.deleteAllData);



module.exports = router;