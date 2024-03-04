const express = require('express');
const { getUserById, updateUser, getAllUsers } = require('../controllers/userController');
const router = express.Router();
const { authenticateToken } = require("../middlewares/authMiddleware")

router.get('/:id', getUserById);

router.put('/users/:id', authenticateToken, updateUser);

router.get('/users/all', authenticateToken, getAllUsers);

module.exports = router;
