const userRouter = require('./user');
const productRouter = require('./product')
const { notFound, errHandler } = require('../middlewares/errorHandler');
const productCategoryRouter = require('./productCategory');
const blogCategoryRouter = require('./blogCategory');


const initRoute = (app) => {
    app.use('/api/user', userRouter)
    app.use('/api/product', productRouter)
    app.use('/api/product-category', productCategoryRouter)
    app.use('/api/blog-category', blogCategoryRouter)


    app.use(notFound);
    app.use(errHandler);
}
module.exports = initRoute