const OrderService = require('../services/OrderService');

exports.orders = async (req, res, next) => {
    try{
        const result = await OrderService.orders(
                req.user.id,
                req.params.productID,
                req.body.shippingAddress,
                req.body.paymentMethod     
        );
        res.status(201).json({
            success: true,
            message: 'Your order successful',
            result
        });
    }
    catch(err){
        next(err);
    }
};


exports.getorder = async (req, res, next) => {
    try{
        const result = await OrderService.getorder(req.user.id);
        res.status(200).json({success: true, result});
    }
    catch(err){
        next(err);
    }
};
