import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student'
  });
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', form);
      loginUser(data);
      toast.success('Account created');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="name" placeholder="Full Name" className="w-full border p-2 rounded" onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" className="w-full border p-2 rounded" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" className="w-full border p-2 rounded" onChange={handleChange} required />
        <select name="role" className="w-full border p-2 rounded" onChange={handleChange}>
          <option value="student">Student</option>
          <option value="educator">Educator</option>
        </select>
        <button disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded">
          {loading ? 'Creating account...' : 'Register'}
        </button>
      </form>
      <p className="text-sm mt-3">Already have account? <Link className="text-blue-600" to="/login">Login</Link></p>
    </div>
  );
};

export default RegisterPage;
