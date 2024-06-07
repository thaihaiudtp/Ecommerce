const{default : mongoose} = require('mongoose');

const dbconnect = async () =>{
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI)
        if (conn.connection.readyState==1) {
            console.log('db connect')
        } else {
            console.log('db failed')
        }
    } catch (error) {
        console.log('db faile')
        throw new Error(error)
    }
}

module.exports = dbconnect