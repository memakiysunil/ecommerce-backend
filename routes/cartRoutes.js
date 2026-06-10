const express = require('express');
const router = express.Router();
const {jwtAuthmiddlewere} = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateMiddleware');
const {addtocartSchema, updatecartSchema} = require('../validators/cartValidator');
const cartcontroller = require('../controllers/cartController');

router.post('/addtocart/:productID',jwtAuthmiddlewere,validateRequest(addtocartSchema),cartcontroller.addtocart);
router.patch('/updatecart/:productID',jwtAuthmiddlewere,validateRequest(updatecartSchema),cartcontroller.updatecart);
router.delete('/deletecart/:productID',jwtAuthmiddlewere,cartcontroller.deletecart);
router.get('/getcart',jwtAuthmiddlewere,cartcontroller.getcart);

module.exports = router;