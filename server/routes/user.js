const router = require('express').Router();
const controllers = require('../controllers/user');
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');

router.post('/register', controllers.registerUser);
router.post('/login', controllers.login);
router.get("/current",verifyAccessToken,controllers.getCurrent)
router.post("/refresh-token", controllers.refreshAccessToken)
router.get("/logout", controllers.logout)
router.get("/forgot-password", controllers.forgotPassword)
router.put('/resetpassword', controllers.resetPassword)
router.get('/', [verifyAccessToken, isAdmin], controllers.getUsers)
router.delete('/', [verifyAccessToken, isAdmin], controllers.deleteUser)
router.put('/current', [verifyAccessToken], controllers.updateUser)
router.put('/:uid', [verifyAccessToken, isAdmin], controllers.updateUserByAdmin)

module.exports = router;
