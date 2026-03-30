import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <section className="bg-white rounded-lg shadow p-8 text-center">
      <h1 className="text-4xl font-bold mb-3 text-blue-700">Learning Management System</h1>
      <p className="text-gray-600 mb-6">A small MERN LMS project for students and educators.</p>
      <div className="flex justify-center gap-4">
        <Link to="/courses" className="bg-blue-600 text-white px-5 py-2 rounded">Explore Courses</Link>
        <Link to="/register" className="border border-blue-600 text-blue-600 px-5 py-2 rounded">Get Started</Link>
      </div>
    </section>
  );
};

export default HomePage;
