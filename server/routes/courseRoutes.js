const express = require('express');
const router = express.Router();
const {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getTeachingCourses,
} = require('../controllers/courseController');
const { protect, admin, professor } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, admin, createCourse)
  .get(protect, getCourses);

router.route('/teaching')
  .get(protect, professor, getTeachingCourses);

router.route('/:id')
  .get(protect, getCourseById)
  .put(protect, admin, updateCourse)
  .delete(protect, admin, deleteCourse);

module.exports = router; 