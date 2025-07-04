import { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      login(res.data);
      navigate('/quickquote');
    } catch (err) {
      alert(err.response.data.error);
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center py-6">
  <div className="absolute inset-0 opacity-20">
    <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-gray-700 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
    <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-gray-900 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000"></div>
  </div>
  
  <div className="relative z-10 backdrop-blur-xl bg-black/40 border border-gray-800 rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl">
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-1">Welcome Back</h2>
        <p className="text-gray-400 text-sm">Sign in to your account</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
          <input
            className="w-full p-3 bg-black/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent transition-all duration-300 text-sm"
            name="email"
            type="email"
            placeholder="Enter your email"
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
          <input
            className="w-full p-3 bg-black/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent transition-all duration-300 text-sm"
            name="password"
            type="password"
            placeholder="Enter your password"
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-white text-black p-3 rounded-xl font-semibold hover:bg-gray-200 transform hover:scale-105 transition-all duration-300 shadow-lg text-sm"
      >
        Sign In
      </button>

      <div className="text-center pt-2">
        <p className="text-gray-400 text-sm">
          Don't have an account?
          <span 
            className="text-white hover:text-gray-300 cursor-pointer ml-1 underline" 
            onClick={() => {navigate('/register')}}
          >
            Sign up
          </span>
        </p>
      </div>
    </form>
  </div>
</div>
  );
};
export default Login;