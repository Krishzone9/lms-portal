const crypto = require('crypto');
const Razorpay = require('razorpay');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const User = require('../models/User');

let razorpay = null;

if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
}

const enrollFreeCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const course = await Course.findById(courseId);

    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (course.price > 0) {
      return res.status(400).json({ message: 'This is a paid course. Please use payment route.' });
    }

    const enrollment = await Enrollment.findOneAndUpdate(
      { userId: req.user.id, courseId },
      { paymentStatus: 'paid' },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    await User.findByIdAndUpdate(req.user.id, {
      $addToSet: { enrolledCourses: courseId }
    });

    res.status(200).json({ message: 'Enrolled successfully', enrollment });
  } catch (error) {
    res.status(500).json({ message: 'Enrollment failed', error: error.message });
  }
};

const createPaymentOrder = async (req, res) => {
  try {
    if (!razorpay) {
      return res.status(500).json({ message: 'Razorpay not configured' });
    }

    const { courseId } = req.body;
    const course = await Course.findById(courseId);

    if (!course) return res.status(404).json({ message: 'Course not found' });

    const order = await razorpay.orders.create({
      amount: Math.round(course.price * 100),
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`
    });

    res.status(200).json({ order, course });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create payment order', error: error.message });
  }
};

const verifyPaymentAndEnroll = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId } = req.body;

    const generated = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'dummy')
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generated !== razorpay_signature) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    const enrollment = await Enrollment.findOneAndUpdate(
      { userId: req.user.id, courseId },
      { paymentStatus: 'paid' },
      { upsert: true, new: true }
    );

    await User.findByIdAndUpdate(req.user.id, {
      $addToSet: { enrolledCourses: courseId }
    });

    res.status(200).json({ message: 'Payment verified and enrolled', enrollment });
  } catch (error) {
    res.status(500).json({ message: 'Payment verification failed', error: error.message });
  }
};

const getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ userId: req.user.id })
      .populate('courseId')
      .sort({ createdAt: -1 });

    res.status(200).json(enrollments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch enrollments', error: error.message });
  }
};

const updateProgress = async (req, res) => {
  try {
    const { courseId, progress } = req.body;

    const enrollment = await Enrollment.findOneAndUpdate(
      { userId: req.user.id, courseId },
      { progress },
      { new: true }
    );

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    res.status(200).json({ message: 'Progress updated', enrollment });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update progress', error: error.message });
  }
};

module.exports = {
  enrollFreeCourse,
  createPaymentOrder,
  verifyPaymentAndEnroll,
  getMyEnrollments,
  updateProgress
};