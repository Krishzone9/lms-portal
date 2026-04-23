import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const CourseDetailsPage = () => {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const { data } = await api.get(`/courses/${id}`);
        setCourse(data);
      } catch (error) {
        toast.error('Could not load course details');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const handleEnroll = async () => {
    if (!user) {
      toast.error('Please login first');
      navigate('/login');
      return;
    }

    setEnrolling(true);

    try {
      if (course.price === 0) {
        await api.post('/enrollments/free-enroll', { courseId: course._id });
        toast.success('Enrolled in free course!');
        return;
      }

      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error('Failed to load Razorpay script');
        return;
      }

      const { data } = await api.post('/enrollments/create-order', { courseId: course._id });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency,
        name: 'LMS Portal',
        description: `Payment for ${course.title}`,
        order_id: data.order.id,
        handler: async function (response) {
          await api.post('/enrollments/verify-payment', {
            ...response,
            courseId: course._id
          });
          toast.success('Payment success and enrolled!');
        },
        theme: {
          color: '#2563eb'
        }
      };

      const razorpayObj = new window.Razorpay(options);
      razorpayObj.open();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Enrollment failed');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!course) return <p>Course not found</p>;

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-3xl font-bold">{course.title}</h2>
      <p className="text-gray-600 mt-2">{course.description}</p>
      <p className="font-bold text-blue-700 mt-3">Price: ₹{course.price}</p>
      <p className="text-sm text-gray-500">Instructor: {course.instructor?.name}</p>

      <h3 className="text-xl font-semibold mt-6 mb-2">Lectures in this course</h3>
      {course.lectures.length === 0 ? (
        <p className="text-sm text-gray-500">No lectures yet.</p>
      ) : (
        <ul className="list-disc pl-5 text-sm space-y-1">
          {course.lectures.map((lecture) => (
            <li key={lecture._id}>{lecture.title} ({lecture.duration})</li>
          ))}
        </ul>
      )}

      {user?.role === 'student' && (
        <button onClick={handleEnroll} disabled={enrolling} className="mt-6 bg-blue-600 text-white px-4 py-2 rounded">
          {enrolling ? 'Processing...' : course.price > 0 ? 'Pay & Enroll' : 'Enroll for Free'}
        </button>
      )}
    </div>
  );
};

export default CourseDetailsPage;
