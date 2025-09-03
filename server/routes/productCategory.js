const router = require('express').Router()
const controllers = require('../controllers/productCategory')
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')

router.post('/', controllers.createCategory);
router.get('/', controllers.getCategories);
router.get('/:cid', controllers.getCategory);
router.put('/:cid', [verifyAccessToken, isAdmin], controllers.updateCategory);
router.delete('/:cid', [verifyAccessToken, isAdmin], controllers.deleteCategory);

module.exports = router