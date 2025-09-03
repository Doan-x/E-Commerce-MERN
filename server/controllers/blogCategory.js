const expressAsyncHandler = require("express-async-handler")
const BlogCategory = require("../models/blogCategory")

const createCategory = expressAsyncHandler(async (req, res) => {
    if (Object.keys(req.body).length === 0) throw new Error('Missing inputs')
    const newBlogCategory = await BlogCategory.create(req.body)
    return res.status(200).json({
        success: newBlogCategory ? true : false,
        newBlogCategory: newBlogCategory ? newBlogCategory : 'Cannot create new category'
    })
})

const getCategories = expressAsyncHandler(async (req, res) => {
    const categories = await BlogCategory.find()
    return res.status(200).json({
        success: categories ? true : false,
        blogCategories: categories ? categories : 'Cannot get categories'
    })
})

const getCategory = expressAsyncHandler(async (req, res) => {
    const { cid } = req.params
    const blogCategory = await BlogCategory.findById(cid)
    return res.status(200).json({
        success: blogCategory ? true : false,
        blogCategory: blogCategory ? blogCategory : 'Cannot get category'
    })
})

const updateCategory = expressAsyncHandler(async (req, res) => {
    const { cid } = req.params
    const updatedCategory = await BlogCategory.findByIdAndUpdate(cid, req.body, { new: true })
    return res.status(200).json({
        success: updatedCategory ? true : false,
        updatedCategory: updatedCategory ? updatedCategory : 'Cannot update category'
    })
})

const deleteCategory = expressAsyncHandler(async (req, res) => {
    const { cid } = req.params
    const deletedCategory = await BlogCategory.findByIdAndDelete(cid)
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