const ProductService = require("../services/ProductService");

exports.singleproduct = async (req, res, next) => {
    try{
        const result = await ProductService.singleproduct(req.body, req.user.id);
        res.status(201).json({success: true, result});
    }
    catch(err){
        next(err);
    }
};

exports.createManyProducts = async (req, res, next) => {
    try{
        const result = await ProductService.createManyProducts(req.body);
        res.status(201).json({success: true, result});
    }
    catch(err){
        next(err);
    }
};

exports.updateproduct = async (req, res, next) => {
    try{
        const result = await ProductService.updateproduct(req.params.productID, req.body);
        res.status(200).json({success: true, result});
    }
    catch(err){
        next(err);
    }
};

exports.deleteproduct = async (req, res, next) => {
    try{
        const result = await ProductService.deleteproduct(req.params.productID);
        res.status(200).json({success: true, result});
    }
    catch(err){
        next(err);
    }
};

exports.searchproducts = async (req, res, next) => {
    try{
        const {keyword, category, minPrice, maxPrice, page, limit} = req.query;

        const result = await ProductService.searchproducts({keyword, category, minPrice, maxPrice, page, limit});

        res.status(200).json({
            success: true,
            result,
            message: "Products fetched successfully"
        });
    }
    catch(err){
        next(err);
    }
}