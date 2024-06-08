const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require('bcrypt')
const crypto = require('crypto-js')
// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
    },
    lastname:{
        type:String,
        require:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobile:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        default:'user',
    },
    cart:{
        type:Array,
        default:[]
    },
    address: [
        {type: mongoose.Types.ObjectId, ref: 'Address'}
    ],
    wishlist: [
        {type: mongoose.Types.ObjectId, ref: 'Product'}
    ],
    isBlocked: {
        type: Boolean,
        default: false,
    },
    refreshToken: {
        type: String,
    },
    passwordChange: {
        type: String,
    },
    passwordResetToken:{
        type: String,
    },
    passwordResetTime: {
        type:String,
    }
}, {
    timestamps : true
});
//hash password
userSchema.pre('save', async function(next){
    const salt = bcrypt.genSaltSync(10)
    this.password = await bcrypt.hash(this.password, salt)
})
userSchema.methods = {
    isCorrectPassword: async function (password) {
        return await bcrypt.compareSync(password, this.password)
    }

     

}

//Export the model
module.exports = mongoose.model('User', userSchema);