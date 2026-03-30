const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

const createCourse = async (req, res) => {
  try {
    const { title, description, price } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const course = await Course.create({
      title,
      description,
      price: Number(price) || 0,
      instructor: req.user.id
    });

    return res.status(201).json(course);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create course', error: error.message });
  }
};

const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate('instructor', 'name email');
    return res.status(200).json(courses);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch courses', error: error.message });
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('instructor', 'name email');
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    return res.status(200).json(course);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch course', error: error.message });
  }
};

const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only instructor can edit this course' });
    }

    const { title, description, price } = req.body;
    course.title = title || course.title;
    course.description = description || course.description;
    if (price !== undefined) {
      course.price = Number(price);
    }

    await course.save();
    return res.status(200).json(course);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update course', error: error.message });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only instructor can delete this course' });
    }

    await Enrollment.deleteMany({ courseId: course._id });
    await course.deleteOne();

    return res.status(200).json({ message: 'Course deleted' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete course', error: error.message });
  }
};

const addLecture = async (req, res) => {
  try {
    const { title, videoUrl, duration } = req.body;
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only instructor can add lectures' });
    }

    course.lectures.push({ title, videoUrl, duration });
    await course.save();

    return res.status(200).json(course);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to add lecture', error: error.message });
  }
};

const getEducatorCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user.id });
    return res.status(200).json(courses);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch educator courses', error: error.message });
  }
};

const getEnrolledStudents = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ courseId: req.params.id })
      .populate('userId', 'name email')
      .populate('courseId', 'title');

    return res.status(200).json(enrollments);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch enrolled students', error: error.message });
  }
};

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  addLecture,
  getEducatorCourses,
  getEnrolledStudents
};
