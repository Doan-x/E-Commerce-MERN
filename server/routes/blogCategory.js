const router = require('express').Router()
const controllers = require('../controllers/blogCategory')
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')

router.post('/', controllers.createCategory);
router.get('/', controllers.getCategories);
router.get('/:cid', controllers.getCategory);
router.put('/:cid', controllers.updateCategory);
router.delete('/:cid', controllers.deleteCategory);

module.exports = router