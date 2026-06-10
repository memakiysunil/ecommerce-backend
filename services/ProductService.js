const User = require("../models/User");
const Product = require("../models/Product");
 

class ProductService {

    async singleproduct(data, userId){
        const{name, description, price, category, brand, stock, image} = data

        const product = await Product.create({ 
            name,
            description,
            price,
            category,
            brand,
            stock,
            image,
            createdBy:userId});

            return {product};
    }

    async createManyProducts(data){
        if(!Array.isArray(data)){
            const error = new Error("Data should be an array");
            error.statusCode = 400;
            throw error;
        }
        for(let item of data){
            if(!item.name || !item.price){
                const error = new Error("Each product must have name and price");
                error.statusCode = 400;
                throw error;
            }
        }
        const product = await Product.insertMany(data);
        return {count: product.length,product};
    }

    async updateproduct(productId, updatedData){
        const product = await Product.findByIdAndUpdate(productId,updatedData,{
            new : true,
            runValidators: true 
        });

        if(!product){
            const error = new Error(`Product not found with ID: ${productId}`);
            error.statusCode = 404;
            throw error;
        }
        return {product};
    }

    async deleteproduct(productId){
        const product = await Product.findByIdAndDelete(productId);
        if(!product){
            const error = new Error(`Product not found with ID ${productId}`);
            error.statusCode = 400;
            throw error;
        }
        return {message: 'Product deleted successfully'};
    }

    async searchproducts(
           {
            keyword,
            category,
            minPrice,
            maxPrice,
            page = 1,
            limit = 10
        }){

        let query = {};

        if(keyword){
            query.$or = [
                {name: {$regex:keyword, $options: "i"}},
                {category: {$regex:keyword, $options: "i"}}
            ];
        }

        if(category){
            query.category = category;
        }

        if(minPrice || maxPrice){
            query.price = {};
            if(minPrice) query.price.$gte = Number(minPrice);
            if(maxPrice) query.price.$lte = Number(maxPrice);
        }

        const skip = (page - 1) * limit;

        const total = await Product.countDocuments(query);

        if(total === 0){
            const error = new Error("No products found");
            error.statusCode = 404;
            throw error;
        }

        const product = await Product.find(query)
        .skip(skip)
        .limit(Number(limit));

        return {
            total,
            page: Number(page),
            pages: Math.ceil(total/limit),
            product
        }
    }

}

module.exports = new ProductService();