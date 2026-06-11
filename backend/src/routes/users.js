const express = require('express');
const router = express.Router();
const { listUsers, getUser } = require('../controllers/userController');
const { authenticate } = require('../middlewares/auth');
const { adminOnly } = require('../middlewares/adminOnly');

router.get('/', authenticate, adminOnly, listUsers);
router.get('/:id', authenticate, getUser);

module.exports = router;
