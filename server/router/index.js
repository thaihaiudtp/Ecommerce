const userRouter = require('./user')
const productRouter = require('./product')
const initRouter = (app) => {
    app.use('/api/user', userRouter)
    app.use('/api/product', productRouter)
}

module.exports = initRouter