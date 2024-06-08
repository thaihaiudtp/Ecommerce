const User = require('../models/user')
const asyncHandler = require('express-async-handler')
const {generestAccessToken, generestRefreshToken} = require('../middleware/jwt')
const jwt = require('jsonwebtoken')


const dangky = asyncHandler(async(req, res)=>{
    const {email, password, firstname, lastname, role} = req.body
    if(!email || !password || !firstname || !lastname || !role)
        return res.status(400).json({
            sucess: false,
            mes: 'missing input'
        })
    const user = await User.findOne({email})
    if(user) throw new Error('User has existed!')
    else {
        //Tao tai khoan moi
        const newUser = await User.create(req.body)
        return res.status(200).json({
            sucess: newUser ? true : false,
            mes: newUser ? 'Dang ky thanh cong' : 'Co loi xay ra'
        })
    }       
})
const dangnhap = asyncHandler(async(req, res) => {
    const {email, password} = req.body
    if(!email || !password)
        return res.status(400).json({
            sucess: false,
            mes: 'missing input'
        })
    const response = await User.findOne({email})
    if(response && response.isCorrectPassword(password)) {
        const {password, role,refreshToken, ...userData} = response.toObject() // tach password, role
        const accessToken = generestAccessToken(response._id, role) 
        const newrefreshToken = generestRefreshToken(response._id)
        res.cookie('refreshToken', refreshToken, {httpOnly: true, maxAge: 3*24*60*60*1000})
        await User.findByIdAndUpdate(response._id, {refreshToken: newrefreshToken}, {new: true})
        return res.status(200).json({
            sucess: true,
            accessToken,
            userData
        })
    } else {
        throw new Error('Password wrong')
    }
})


const getCurrent = asyncHandler(async(req, res)=>{
    const {_id} = req.user
    const user = await User.findById({_id}).select('-refreshToken -password -role')
    return res.status(200).json({
        sucess: false, 
        rs: user ? user : 'user not found'
    })    
})

//cap phat 1 accessToken moi
const refreshAccessToken = asyncHandler(async(req, res)=>{
    const cookie = req.cookies
    //const {_id} = 
    if(!cookie && !cookie.refreshToken) throw new Error('no refresh token')
        const rs = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET)
        const response = await User.findOne({_id: rs._id, refreshToken: cookie.refreshToken})
        return res.status(200).json({
            success: response ? true : false,
            newAccessToken: response ? generestAccessToken(response._id, response.role) : 'ko hop le'
        })
        
   
})

const logout = asyncHandler(async(req, res)=>{
    const cookie = req.cookies
    if(!cookie || !cookie.refreshToken) throw new Error('no fresh token')
    //xoa token
    await User.findOneAndUpdate({refreshToken: cookie.refreshToken}, {refreshToken:''}, {new: true})
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true
    })
    return res.status(200).json({
        success: true, 
        mes: 'deleted'
    })
    
})
/*
const sendResetOtp = asyncHandler(async(req, res)=>{
    const {email} = req.query
    if(!email){return res.status(400).json({
        success: false,
        mes: 'Email is required'
    })}
    const user = await User.findOne({email})
    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }
    const resetToken = user.createPasswordChangeToken()
    await user.save()
}) */
// Ham lay thong tin tat ca nguoi dung
    const getUsers = asyncHandler(async(req, res)=>{
        const response = await User.find().select('-refreshToken -password -role')
        return res.status(200).json({
            success: response ? true : false,
            users: response
        })
    })
// Ham xoa user
    const deleteUser = asyncHandler(async(req, res)=>{
        const {_id} = req.query
        if(!_id) throw new Error("missing id")
        const response = await User.findByIdAndDelete(_id)
        return res.status(200).json({
            success: response ? true : false,
            deletedUser: response ? `user with email ${response.email} was deleted` : 'no user deleted' 
        })
    })
// Ham update user
    const updateUser = asyncHandler(async(req, res)=>{
        const {_id} = req.user
        if(!_id || Object.keys(req.body).length === 0) throw new Error('missing input')
        const { role, ...updateData } = req.body;
        const response = await User.findByIdAndUpdate(_id, updateData,{new:true}).select('-password -role')
        return res.status(200).json({
            success: response? true:false,
            updateuser: response?response:'wrong'
        })
    })
module.exports = {
    dangky, dangnhap, getCurrent, refreshAccessToken, logout, getUsers, deleteUser,updateUser
}
