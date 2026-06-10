const express = require('express');
const router = express.Router();
const {jwtAuthmiddlewere} = require('../middleware/authMiddleware');
const {strictLimiter} = require('../middleware/rateLimiterMiddleware');
const validateRequest = require('../middleware/validateMiddleware');
const {signup, login, updatePassword} = require('../validators/userValidator');
const userController = require('../controllers/userController');


router.post('/signup', validateRequest(signup), userController.signup);
router.post('/login', validateRequest(login),strictLimiter,userController.login);
router.get('/profile', jwtAuthmiddlewere, userController.getprofile);
router.patch('/profile/password', jwtAuthmiddlewere,strictLimiter,validateRequest(updatePassword), userController.updatePassword);


module.exports = router;