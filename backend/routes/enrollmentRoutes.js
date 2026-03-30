const express = require('express');
const {
  enrollFreeCourse,
  createPaymentOrder,
  verifyPaymentAndEnroll,
  getMyEnrollments,
  updateProgress
} = require('../controllers/enrollmentController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/free-enroll', protect, authorizeRoles('student'), enrollFreeCourse);
router.post('/create-order', protect, authorizeRoles('student'), createPaymentOrder);
router.post('/verify-payment', protect, authorizeRoles('student'), verifyPaymentAndEnroll);
router.get('/my', protect, authorizeRoles('student'), getMyEnrollments);
router.put('/progress', protect, authorizeRoles('student'), updateProgress);

module.exports = router;
