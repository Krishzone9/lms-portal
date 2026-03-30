import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const { user } = useAuth();
  const [studentEnrollments, setStudentEnrollments] = useState([]);
  const [educatorCourses, setEducatorCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [courseForm, setCourseForm] = useState({ title: '', description: '', price: 0 });
  const [lectureForm, setLectureForm] = useState({ courseId: '', title: '', videoUrl: '', duration: '' });

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        if (user.role === 'student') {
          const { data } = await api.get('/enrollments/my');
          setStudentEnrollments(data);
        } else {
          const { data } = await api.get('/courses/educator/my-courses');
          setEducatorCourses(data);
        }
      } catch (error) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [user.role]);

  const createCourse = async (e) => {
    e.preventDefault();
    try {
      await api.post('/courses', courseForm);
      toast.success('Course created');
      const { data } = await api.get('/courses/educator/my-courses');
      setEducatorCourses(data);
      setCourseForm({ title: '', description: '', price: 0 });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create course');
    }
  };

  const addLecture = async (e) => {
    e.preventDefault();
    if (!lectureForm.courseId) {
      toast.error('Select a course first');
      return;
    }

    try {
      await api.post(`/courses/${lectureForm.courseId}/lectures`, {
        title: lectureForm.title,
        videoUrl: lectureForm.videoUrl,
        duration: lectureForm.duration
      });
      toast.success('Lecture added');
      const { data } = await api.get('/courses/educator/my-courses');
      setEducatorCourses(data);
      setLectureForm({ courseId: '', title: '', videoUrl: '', duration: '' });
    } catch (error) {
      toast.error('Failed to add lecture');
    }
  };

  const deleteCourse = async (courseId) => {
    try {
      await api.delete(`/courses/${courseId}`);
      toast.success('Course deleted');
      setEducatorCourses((prev) => prev.filter((course) => course._id !== courseId));
    } catch (error) {
      toast.error('Failed to delete course');
    }
  };

  if (loading) return <p>Loading dashboard...</p>;

  if (user.role === 'student') {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">Student Dashboard</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {studentEnrollments.map((entry) => (
            <div key={entry._id} className="bg-white rounded shadow p-4">
              <h3 className="font-semibold">{entry.courseId?.title}</h3>
              <p className="text-sm text-gray-500">Payment: {entry.paymentStatus}</p>
              <p className="text-sm">Progress: {entry.progress}%</p>
              <Link
                to={`/learn/${entry.courseId?._id}`}
                className="inline-block mt-2 bg-blue-600 text-white px-3 py-1 rounded text-sm"
              >
                Continue Learning
              </Link>
            </div>
          ))}
          {studentEnrollments.length === 0 && <p>You have not enrolled in any course yet.</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Educator Dashboard</h2>

      <section className="bg-white p-5 rounded shadow">
        <h3 className="font-semibold mb-3">Create New Course</h3>
        <form onSubmit={createCourse} className="grid gap-3">
          <input className="border p-2 rounded" placeholder="Course title" value={courseForm.title} onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })} required />
          <textarea className="border p-2 rounded" placeholder="Course description" value={courseForm.description} onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })} required />
          <input className="border p-2 rounded" type="number" placeholder="Price" value={courseForm.price} onChange={(e) => setCourseForm({ ...courseForm, price: e.target.value })} required />
          <button className="bg-blue-600 text-white py-2 rounded">Create Course</button>
        </form>
      </section>

      <section className="bg-white p-5 rounded shadow">
        <h3 className="font-semibold mb-3">Add Lecture</h3>
        <form onSubmit={addLecture} className="grid gap-3">
          <select className="border p-2 rounded" value={lectureForm.courseId} onChange={(e) => setLectureForm({ ...lectureForm, courseId: e.target.value })} required>
            <option value="">Select course</option>
            {educatorCourses.map((course) => (
              <option key={course._id} value={course._id}>{course.title}</option>
            ))}
          </select>
          <input className="border p-2 rounded" placeholder="Lecture title" value={lectureForm.title} onChange={(e) => setLectureForm({ ...lectureForm, title: e.target.value })} required />
          <input className="border p-2 rounded" placeholder="YouTube or video URL" value={lectureForm.videoUrl} onChange={(e) => setLectureForm({ ...lectureForm, videoUrl: e.target.value })} required />
          <input className="border p-2 rounded" placeholder="Duration (example 12:30)" value={lectureForm.duration} onChange={(e) => setLectureForm({ ...lectureForm, duration: e.target.value })} />
          <button className="bg-green-600 text-white py-2 rounded">Add Lecture</button>
        </form>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-3">My Courses</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {educatorCourses.map((course) => (
            <div key={course._id} className="bg-white rounded shadow p-4">
              <h4 className="font-semibold">{course.title}</h4>
              <p className="text-sm text-gray-600">{course.description}</p>
              <p className="text-sm">Lectures: {course.lectures.length}</p>
              <div className="mt-3 flex gap-2">
                <Link to={`/courses/${course._id}`} className="bg-blue-600 text-white px-3 py-1 rounded text-sm">View</Link>
                <button onClick={() => deleteCourse(course._id)} className="bg-red-500 text-white px-3 py-1 rounded text-sm">Delete</button>
              </div>
            </div>
          ))}
          {educatorCourses.length === 0 && <p>You have not created courses yet.</p>}
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
