const express = require('express');
const router = express.Router();
const {jwtAuthmiddlewere} = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateMiddleware');
const {createOrderValidation} = require('../validators/oderValidator');
const orderController = require('../controllers/orderController');
 

router.post('/orders/:productID', jwtAuthmiddlewere, validateRequest(createOrderValidation), orderController.orders);
router.get('/getorder', jwtAuthmiddlewere, orderController.getorder);
 
module.exports = router;