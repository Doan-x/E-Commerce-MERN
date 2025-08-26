const router = require('express').Router();
const controllers = require('../controllers/user');

router.post('/register', controllers.registerUser);

module.exports = router;
