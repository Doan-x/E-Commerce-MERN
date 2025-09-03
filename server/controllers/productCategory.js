const expressAsyncHandler = require("express-async-handler")
const Category = require("../models/productCategory")

const createCategory = expressAsyncHandler(async (req, res) => {
    if (Object.keys(req.body).length === 0) throw new Error('Missing inputs')
    const newCategory = await Category.create(req.body)
    return res.status(200).json({
        success: newCategory ? true : false,
        newCategory: newCategory ? newCategory : 'Cannot create new category'
    })
})

const getCategories = expressAsyncHandler(async (req, res) => {
    const categories = await Category.find()
    return res.status(200).json({
        success: categories ? true : false,
        categories: categories ? categories : 'Cannot get categories'
    })
})

const getCategory = expressAsyncHandler(async (req, res) => {
    const { cid } = req.params
    const category = await Category.findById(cid)
    return res.status(200).json({
        success: category ? true : false,
        category: category ? category : 'Cannot get category'
    })
})

const updateCategory = expressAsyncHandler(async (req, res) => {
    const { cid } = req.params
    const updatedCategory = await Category.findByIdAndUpdate(cid, req.body, { new: true })
    return res.status(200).json({
        success: updatedCategory ? true : false,
        updatedCategory: updatedCategory ? updatedCategory : 'Cannot update category'
    })
})

const deleteCategory = expressAsyncHandler(async (req, res) => {
    const { cid } = req.params
    const deletedCategory = await Category.findByIdAndDelete(cid)
    return res.status(200).json({
        success: deletedCategory ? true : false,
        deletedCategory: deletedCategory ? deletedCategory : 'Cannot delete category'
    })
})

module.exports = {
    createCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory
}