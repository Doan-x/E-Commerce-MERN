const router = require('express').Router();
const controllers = require('../controllers/user');
const { verifyAccessToken } = require('../middlewares/verifyToken');

router.post('/register', controllers.registerUser);
router.post('/login', controllers.login);
router.get("/current",verifyAccessToken,controllers.getCurrent)
router.post("/refresh-token", controllers.refreshAccessToken)
router.get("/logout", controllers.logout)
router.get("/forgot-password", controllers.forgotPassword)
router.put('/resetpassword', controllers.resetPassword)

module.exports = router;
