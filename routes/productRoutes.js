const express = require('express');
const router = express.Router();
const {jwtAuthmiddlewere} = require('../middleware/authMiddleware');
const {singleproductSchema, createManyProductsSchema, updateproductSchema, searchproductsSchema} = require('../validators/productValidator');
const validateRequest = require('../middleware/validateMiddleware');
const checkAdminRole = require('../middleware/adminMiddleware');
const productController = require('../controllers/productController');

 
router.post('/singleproduct',jwtAuthmiddlewere,validateRequest(singleproductSchema),checkAdminRole,productController.singleproduct);
router.post('/createManyProducts',jwtAuthmiddlewere,validateRequest(createManyProductsSchema),checkAdminRole,productController.createManyProducts);
router.put('/updateproduct/:productID',jwtAuthmiddlewere,validateRequest(updateproductSchema),checkAdminRole,productController.updateproduct);
router.delete('/deleteproduct/:productID',jwtAuthmiddlewere,checkAdminRole,productController.deleteproduct);
router.get('/searchproducts',jwtAuthmiddlewere,validateRequest(searchproductsSchema),productController.searchproducts);

module.exports = router;