const User = require('../models/user')
const asyncHandler = require('express-async-handler')
const {generestAccessToken, generestRefreshToken} = require('../middleware/jwt')

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
        const {password, role, ...userData} = response.toObject() // tach password, role
        const accessToken = generestAccessToken(response._id, role) 
        const refreshToken = generestRefreshToken(response._id)
        res.cookie('refreshToken', refreshToken, {httpOnly: true, maxAge: 3*24*60*60*1000})
        await User.findByIdAndUpdate(response._id, {refreshToken}, {new: true})
        return res.status(200).json({
            sucess: true,
            accessToken,
            userData
        })
    } else {
        throw new Error('Password wrong')
    }
})
module.exports = {
    dangky, dangnhap
}
