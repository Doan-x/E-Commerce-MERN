const User = require('../models/user');
const asyncHandler = require('express-async-handler');

const registerUser = asyncHandler(async (req, res) => {
    const{email, password, firstName, lastName, mobile} = req.body;
    if(!email || !password || !firstName || !lastName || !mobile){
        return res.status(400).json({message: 'All fields are required'});
    }
   const user = await User.findOne({ email })
    if (user) throw new Error('User has existed')
    else {
        const newUser = await User.create(req.body)
            return res.status(200).json(
       newUser ? {
        success: true, message: 'User registered successfully', userId: response._id} :
       {success: false, message: 'User registration failed'});
    }
});

module.exports ={
    registerUser
}