const Product = require('../models/product')
const asyncHandler = require('express-async-handler')
const slugify = require('slugify')
const product = require('../models/product')

const createProduct = asyncHandler(async (req, res) => {
    if (Object.keys(req.body).length === 0) throw new Error('Missing inputs')
    if (req.body && req.body.title) req.body.slug = slugify(req.body.title)
    const newProduct = await Product.create(req.body)
    return res.status(200).json({
        success: newProduct ? true : false,
        createdProduct: newProduct ? newProduct : 'Cannot create new product'
    })
})
const getProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params
    const product = await Product.findById(pid)
    return res.status(200).json({
        success: product ? true : false,
        productData: product ? product : 'Cannot get product'
    })
})
// Filtering, sorting & pagination
const getProducts = asyncHandler(async (req, res) => {
    const queries = [...req.query]

    // Tách các trường đặc biệt ra khổi query string
    const excludeFields = ['limit', 'sort', 'page', 'fields']
    excludeFields.forEach(e => delete queries[e])

    // Format lại các operators cho đúng với mongoose
    let queryString = JSON.stringify(queries)
    queryString = queryString.replace(/\b(gte|lte|lt|gt)\b/g, match => `$${match}`)
    const formatQueries = JSON.parse(queryString)

    // Filtering
    if (queries?.title) formatQueries.title = { $regex: queries.title, $option: 'i' }
    let queryCommand = Product.find(formatQueries)

    //Sorting
    if(req.query.sort){
        const sortBy = req.query.sort.split(',').join(' ')
        queryCommand  = queryCommand.sort(sortBy)
    }

    // Fields limiting
    if(req.query.fields){
        const fieldBy = req.query.fields.split(',').join(' ')
        queryCommand = queryCommand.select(fieldBy)
    }
    
    // pagination
    const page = +req.query.page || 1
    const limit = +req.query.limit || process.env.LIMIT_PRODUCT
    const skip = (page -1 )* limit

    queryCommand.skip(skip).limit(limit)
    // Execute
    queryCommand.exec(async (err, response) => {
        if (err) throw new Error(err.message)
        const counts = await product.find(formatQueries).countDocuments()
        return res.status(200).json({
            success: response ? true : false,
            product: response ? response : 'Cannot get products',
            counts
        })
    })
})
const updateProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params
    if (req.body && req.body.title) req.body.slug = slugify(req.body.title)
    const updatedProduct = await Product.findByIdAndUpdate(pid, req.body, { new: true })
    return res.status(200).json({
        success: updatedProduct ? true : false,
        updatedProduct: updatedProduct ? updatedProduct : 'Cannot update product'
    })
})
const deleteProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params
    const deletedProduct = await Product.findByIdAndDelete(pid)
    return res.status(200).json({
        success: deletedProduct ? true : false,
        deletedProduct: deletedProduct ? deletedProduct : 'Cannot delete product'
    })
})

const ratings = asyncHandler(async (req, res) => {
    const {_id} = req.user
    const {star, comment, pid} = req.body
    if(!star || !pid) throw new Error("Missing inputs")

    const ratingProduct = await Product.findById(pid)
    const alreadyRating = ratingProduct?.ratings?.find(el => el.postedBy.toString() === _id);

    console.log(alreadyRating)
    if(alreadyRating){
        // update
        await Product.updateOne({
            ratings :{ $eleMatch : alreadyRating}
        }, {
            $set: {"ratings.$.star" : star, "ratings.$.comment": comment }
        }, {new : true})
    }else{
        // add new rating
        const response = await Product.findByIdAndUpdate(pid, {
            $push: {ratings : {star, comment, postedBy}}
        }, {new : true});
    }

    // sum ratings
    const updatedProduct = await Product.findById(pid)
    const ratingCount = updatedProduct.ratings.length
    const sumRatings = updatedProduct.ratings.reduce((sum, el)=> sum + + el.star, 0)
    updatedProduct.totalRatings = Math.round(sumRatings *10/ratingCount) / 10

    await updatedProduct.save()

    return res.status(201).json({
        status: true,
        updatedProduct
    })
})
module.exports = {
    createProduct,
    getProduct,
    getProducts,
    updateProduct,
    deleteProduct,
    ratings
}