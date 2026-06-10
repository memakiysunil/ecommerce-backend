const User = require('../models/User');
const {generateToken} = require('../middleware/authMiddleware');

class UserService {

    async signup (data) {
        const adminUser = await User.findOne({role:"admin"});
        if(data.role === "admin" && adminUser){
            const error = new Error("Admin user already exists");
            error.statusCode = 400;
            throw error;
        }

        const existingUser = await User.findOne({email:data.email});
        if(existingUser){
            const error = new Error("Email is already registered");
            error.statusCode = 400;
            throw error;
        }

        const newuser = await new User(data).save();
        const payload = {id:newuser.id};
        const token = generateToken(payload);

        return {newuser,token};
    }

    async login(email,password){
        const user = await User.findOne({email});
        if(!user || !(await user.comparePassword(password))){
            const error = new Error("Invalid email or password");
            error.statusCode = 401;
            throw error;
        }
        const payload = {id:user.id};
        const token = generateToken(payload);

        return {token};
    }

    async getprofile(userId){
        const user = await User.findById(userId);
        if(!user){
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }
        return {user};
    }

    async updatePassword(userId,currentPassword, newPassword){
        const user = await User.findById(userId);
        if(!user|| !(await user.comparePassword(currentPassword))){
            const error = new Error("Invalid current password");
            error.statusCode = 400;
            throw error;
        }

        user.password = newPassword;
        await user.save();

        return { message: 'Password updated successfully' };

    }
};

module.exports = new UserService();