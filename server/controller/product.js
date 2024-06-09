const Product = require('../models/product')
const asyncHandler = require('express-async-handler')
const slugify = require('slugify')
const createProduct = asyncHandler(async(req, res)=>{
    if(Object.keys(req.body).length === 0) throw new Error('Missing input')
    if(req.body && req.body.title){req.body.slug = slugify(req.body.title)}
    const newProduct = await Product.create(req.body)
    return res.status(200).json({
        success: newProduct? true : false,
        createdProduct: newProduct? newProduct : "Cann't create product"
    })
})
const getOneProduct = asyncHandler(async(req, res)=>{
    const {pid} = req.params
    const product = await Product.findById(pid)
    return res.status(200).json({
        success: product? true:false,
        product: product? product:'product dont exist'
    })
})
const getAllProduct = asyncHandler(async(req, res)=>{
    const product = await Product.find()
    return res.status(200).json({
        success: product? true:false,
        AllProduct: product?product:'cannt get all'
    })
})
const updateProduct = asyncHandler(async(req, res)=>{
    const {pid} = req.params
    if(req.body && req.body.title) req.body.slug = slugify(req.body.title)
    const response = await Product.findByIdAndUpdate(pid, req.body, {new:true})
    return res.status(200).json({
        success: response? true:false,
        updatedProduct: response? response : "Cannt update"
    })
})
const deleteProduct = asyncHandler(async(req, res)=>{
    const {pid} = req.params
    const response = await Product.findByIdAndDelete(pid)
    return res.status(200).json({
        success: response? true:false,
        deleted: response? "deleted":"cann't delete"
    })
})
module.exports = {
    createProduct,
    getOneProduct,
    getAllProduct,
    updateProduct,
    deleteProduct
}
