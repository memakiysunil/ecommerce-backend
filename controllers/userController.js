const UserService = require('../services/UserService');

exports.signup = async (req, res, next) => {
    try{
        const result = await UserService.signup(req.body);
        res.status(201).json(
            {
                success: true,
                result
            }
        );
    }
    catch(err){
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try{
        const{email, password} = req.body;
        const result = await UserService.login(email,password);

        res.status(200).json(
        {
            success:true,
            result
        }
        );
    }
    catch(err){
        next(err);
    }
};

exports.getprofile = async (req, res, next) => {
    try{
        const result = await UserService.getprofile(req.user.id);
        res.status(200).json(
            {
                success: true,
                result
            }
        );
    }
    catch(err){
        next(err);
    }
};

exports.updatePassword = async (req, res, next) => {
    try{
        const{currentPassword,newPassword} = req.body;
        const result = await UserService.updatePassword(
            req.user.id, 
            currentPassword, 
            newPassword);

        res.status(200).json(
            {
                success: true,
                result
            }
        );
    }
    catch(err){
        next(err);
    }
};