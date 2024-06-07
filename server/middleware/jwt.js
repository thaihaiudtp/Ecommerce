const jwt = require('jsonwebtoken')

const generestAccessToken = (uid, role) => jwt.sign({_id: uid, role}, process.env.JWT_SECRET, {expiresIn: '120m'})
const generestRefreshToken = (uid) => jwt.sign({_id: uid}, process.env.JWT_SECRET, {expiresIn:'3d'})
module.exports = {
    generestAccessToken, generestRefreshToken
}
