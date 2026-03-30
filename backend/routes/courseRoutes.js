const express = require('express');
const {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  addLecture,
  getEducatorCourses,
  getEnrolledStudents
} = require('../controllers/courseController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', getAllCourses);
router.get('/educator/my-courses', protect, authorizeRoles('educator'), getEducatorCourses);
router.get('/:id', getCourseById);
router.post('/', protect, authorizeRoles('educator'), createCourse);
router.put('/:id', protect, authorizeRoles('educator'), updateCourse);
router.delete('/:id', protect, authorizeRoles('educator'), deleteCourse);
router.post('/:id/lectures', protect, authorizeRoles('educator'), addLecture);
router.get('/:id/students', protect, authorizeRoles('educator'), getEnrolledStudents);

module.exports = router;
