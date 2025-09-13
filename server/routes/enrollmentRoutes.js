const express = require('express');
const router = express.Router();
const { 
    createEnrollment,
    getMyEnrollments,
    deleteEnrollment 
} = require('../controllers/enrollmentController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, createEnrollment);

router.route('/myenrollments')
    .get(protect, getMyEnrollments);

router.route('/:id')
    .delete(protect, deleteEnrollment);

module.exports = router; 