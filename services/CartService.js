const Cart = require('../models/Cart');
const User = require('../models/User');
const Product = require('../models/Product');
 

class CartService{
    async addtocart(userID, productID, quantity = 1){
       quantity  = parseInt(quantity);
        if(quantity < 1){
            const error = new Error("Quantity must be at least 1");
            error.statusCode = 400;
            throw error;
        }

        const product = await Product.findById(productID);

        if(!product){
            const error = new Error(`${productID} Product not found`);
            error.statusCode = 404;
            throw error;
        }

        const price = product.price;

        let cart = await Cart.findOne({user:userID});

        if(!cart){
            cart = new Cart({user:userID,items:[]});
        }
        
        const index = cart.items.findIndex(
            item => item.product && item.product.equals(productID)
        );

        if(index > -1){
            const newQuantity = cart.items[index].quantity + quantity;

            if(product.stock < newQuantity){
                const error = new Error(`Only ${product.stock} items available in stock`);
                error.statusCode = 400;
                throw error;
            }

            cart.items[index].quantity = newQuantity;
        }
        else{
            if(product.stock < quantity){
                const error = new Error(`Only ${product.stock} items available in stock`);
                error.statusCode = 400;
                throw error;
            }
            cart.items.push(
                {
                    product: productID,
                    price: price,
                    quantity: quantity
                }
            );
        }

        await cart.save();

        const totalPrice = cart.items.reduce((acc, item) => {
            return acc + (item.price * item.quantity);
        },0);

        return {
            count: cart.items.length,
            cart, totalPrice
        };
    }

    async updatecart(userID, productID,quantity=1){
        quantity = parseInt(quantity);

        
        if(quantity < 1){
            const error = new Error("Quantity must be at least 1");
            error.statusCode = 400;
            throw error;
        }

        const product = await Product.findById(productID);
        if(!product){
            const error = new Error(`${productID} Product not found`);
            error.statusCode = 404;
            throw error;
        }

        const price = product.price;

        let cart = await Cart.findOne({user:userID});

        if(!cart){
            const error = new Error("Cart not found");
            error.statusCode = 404;
            throw error;
        }

        const index = cart.items.findIndex(
            item => item.product && item.product.equals(productID)
        );

        if(index === -1){
            const error = new Error("Item not found in cart");
            error.statusCode = 404;
            throw error;
        }
        
        cart.items[index].quantity = quantity;

        if(product.stock <quantity){
            const error = new Error(`Only ${product.stock} Items available in stock`);
            error.statusCode = 400;
            throw error;
        }
      
        await cart.save();

        const totalPrice = cart.items.reduce((acc, item) => {
            return acc + (item.quantity * item.price);
        },0);
        
        return{cart, totalPrice};
    }

    async deletecart(userID,productID){
        const product = await Product.findById(productID);
        if(!product){
            const error = new Error(`${productID} Product not found`);
            error.statusCode = 404;
            throw error;
        }

        let cart = await Cart.findOne({user:userID});
        if(!cart){
            const error = new Error("Cart not found");
            error.statusCode = 404;
            throw error;
        }

        let index = cart.items.findIndex(
            item => item.product && item.product.equals(productID),
            
        );

        if (index === -1) {
            const error = new Error("Item not found in cart");
            error.statusCode = 404;
            throw error;
        }
        const deletedItem = cart.items[index];
        const deletePrice = deletedItem.price * deletedItem.quantity;

        cart.items.splice(index, 1);
        await cart.save();

        const totalPrice = cart.items.reduce((acc, item) =>{
            return acc + (item.quantity * item.price);
        },0);

        return {
            cart,
            totalPrice,
            deletedItem: {
                product:productID,
                quantity: deletedItem.quantity,
                price: deletedItem.price,
                totalDeducted: -deletePrice
            }
        };
    }

    async getcart(userID){
        const cart = await Cart.findOne({user:userID}).populate("items.product");
      
        if(!cart || cart.items.length === 0){
            const error = new Error("Your cart is empty. Please add items before proceeding.");
            error.statusCode = 400;
            throw error;
        }

        const totalPrice = cart.items.reduce((total, item) => {
            return total + (item.product.price * item.quantity);
        },0);
        return {cart,count: cart.items.length, totalPrice};
    }
}

module.exports = new CartService();