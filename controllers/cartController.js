const Cart = require('../models/Cart');
const CartService = require('../services/CartService');


exports.addtocart = async (req, res, next) => {
    try{
        const quantity = req.body?.quantity ?? 1;
        const result = await CartService.addtocart(
            req.user.id,
            req.params.productID,
            quantity
        );

        res.status(200).json({success: true, result});
    }
    catch(err){
        next(err);
    }
};

exports.updatecart = async (req, res, next) => {
    try{
        const result = await CartService.updatecart(
            req.user.id,
            req.params.productID,
            req.body.quantity
        );

        res.status(200).json(
            {
                success: true,
                message: "Cart updated successfully",
                result,
            }
        );
    }
    catch(err){
        next(err);
    }
};

exports.deletecart = async (req, res, next) => {
    try{
        const result = await CartService.deletecart(
            req.user.id,
            req.params.productID
        );

        res.status(200).json(
            {
                success: true,
                message: "Product removed from cart successfully",
                totalPrice: result.totalPrice,
                deletedItem: result.deletedItem,
                cart:result.cart
            }
        );
    }
    catch(err){
        next(err);
    }
};

exports.getcart = async (req, res, next) => {
    try{
        const result = await CartService.getcart(req.user.id);
        
        res.status(200).json(
            {
                success: true,
                count: result.count,
                cart:result.cart,
                totalPrice: result.totalPrice
                
            }
        );
    }
    catch(err){
        next(err);
    }
};