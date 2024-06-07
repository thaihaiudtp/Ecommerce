const express = require('express');
require('dotenv').config();
const dbconnect = require('./config/dbConnect')
const cookieParser = require('cookie-parser')
const app = express();
const initRouter =require('./router');
const port = process.env.PORT || 8888
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended: true}))
dbconnect()
initRouter(app)

app.listen(port, ()=>{
    console.log('server run: ' + port)
})