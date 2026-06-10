const Order = require('../models/Order');
const User = require('../models/User');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const CartService = require('../services/CartService');
  
class OrderService{
    async orders(userID, productID, shippingAddress, paymentMethod){
        const {cart} = await CartService.getcart(userID);

        const product = await Product.findById(productID);
                if(!product){
                    const error = new Error(`${productID} Product not found`);
                    error.statusCode = 404;
                    throw error;
                }

        const selectedItem = cart.items.find(
            item => item.product.equals(productID)
        );

        if(!selectedItem){
            const error = new Error("Product not found in cart");
            error.statusCode = 404;
            throw error;
        }

        const totalPrice = product.price *  selectedItem.quantity;
        

        const neworder = await Order.create({
            user:userID,
            items: [
                {
                    product: selectedItem.product,
                    quantity: selectedItem.quantity,
                    price: selectedItem.price
                }
            ],
            totalAmount:totalPrice,
            shippingAddress: shippingAddress,
            paymentMethod:paymentMethod,
            isPaid:false ,
            status:"pending"

        });
         
        product.stock -= selectedItem.quantity;
        await product.save();
    
        cart.items = cart.items.filter(item =>  !item.product.equals(productID));
        await cart.save();

        return{neworder};
    }


    async getorder(userID){
        const orders = await Order.find({user:userID})
        .populate("items.product", "name price image")
        .sort({createdAt: -1});

        if(!orders || orders.length === 0){
            const error = new Error("No orders found for this user");
            error.statusCode = 404;
            throw error
        }
        return {orders};
    }
}

module.exports = new OrderService();