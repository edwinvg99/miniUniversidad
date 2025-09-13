const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getProfessors } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/professors', protect, admin, getProfessors);

module.exports = router; 