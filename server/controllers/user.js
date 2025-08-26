const User = require('../models/user');
const asyncHandler = require('express-async-handler');
const {generateAccessToken, generateRefreshToken} = require('../middlewares/jwt')
const jwt = require('jsonwebtoken')

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
// Refresh token => Cấp mới access token
// Access token => Xác thực người dùng, quân quyên người dùng
const login = asyncHandler(async (req, res) => {
    console.log(".... connect");
    const { email, password } = req.body
    if (!email || !password)
        return res.status(400).json({
            success: false,
            mes: 'Missing inputs'
        })
    // plain object
    const response = await User.findOne({ email })
    if (response && await response.isCorrectPassword(password)) {
        // Tách password và role ra khỏi response
        const { password, role, refreshToken, ...userData } = response.toObject()
        // Tạo access token
        const accessToken = generateAccessToken(response._id, role)
        // Tạo refresh token
        const newRefreshToken = generateRefreshToken(response._id)
        // Lưu refresh token vào database
        await User.findByIdAndUpdate(response._id, { refreshToken: newRefreshToken }, { new: true })
        // Lưu refresh token vào cookie
        res.cookie('refreshToken', newRefreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 })
        return res.status(200).json({
            success: true,
            accessToken,
            userData
        })
    } else {
        throw new Error('Invalid credentials!')
    }
})
const getCurrent = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const user = await User.findById(_id).select('-refreshToken -password -role')
    return res.status(200).json({
        success: user ? true : false,
        rs: user ? user : 'User not found'
    })
})
const refreshAccessToken = asyncHandler(async (req, res) => {
    // Lấy token từ cookies
    const cookie = req.cookies
    // Check xem có token hay không
    if (!cookie?.refreshToken) throw new Error('No refresh token in cookies')
    // Check token có hợp lệ hay không
    const rs = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET, (err, decode) =>{
        if(err) throw new Error("Invalid refresh token")
                    
    })
    const response = await User.findOne({ _id: rs._id, refreshToken: cookie.refreshToken })
    return res.status(200).json({
        success: response ? true : false,
        newAccessToken: response ? generateAccessToken(response._id, response.role) : 'Refresh token not matched'
    })
})
const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies
    if (!cookie?.refreshToken) throw new Error('No refresh token in cookies')
    // Xóa refresh token ở db
    await User.findOneAndUpdate({ refreshToken: cookie.refreshToken }, { refreshToken: '' }, { new: true })
    // Xóa refresh token ở cookie trình duyệt
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true
    })
    return res.status(200).json({
        success: true,
        mes: 'Logout is done'
    })
})
module.exports ={
    registerUser,
    login,
    getCurrent,
    refreshAccessToken,
    logout
}