import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosInstance';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await api.get('/courses');
        setCourses(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) return <p>Loading courses...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">All Courses</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => (
          <div key={course._id} className="bg-white rounded shadow p-4">
            <h3 className="text-lg font-semibold">{course.title}</h3>
            <p className="text-gray-600 text-sm mt-1 line-clamp-3">{course.description}</p>
            <p className="text-blue-700 font-bold mt-2">₹{course.price}</p>
            <p className="text-xs text-gray-500 mt-1">By {course.instructor?.name || 'Educator'}</p>
            <Link to={`/courses/${course._id}`} className="inline-block mt-3 text-sm bg-blue-600 text-white px-3 py-1 rounded">
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoursesPage;
