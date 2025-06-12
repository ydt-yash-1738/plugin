import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  localStorage.setItem('firstName', firstName);
  localStorage.setItem('lastName', lastName);
  localStorage.setItem('email', email);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async e => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return alert('Passwords do not match');
    try {
      await axios.post('http://localhost:5000/api/auth/register', form);
      navigate('/login');
    } catch (err) {
      alert(err.response.data.error);
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center pt-5 pb-5">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gray-700 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-gray-900 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000"></div>
      </div>
      <div className="relative z-10 backdrop-blur-xl bg-black/40 border border-gray-800 rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
            <p className="text-gray-400">Join us today</p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
                <input
                  className="w-full p-3 bg-black/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent transition-all duration-300"
                  name="firstName"
                  placeholder="First Name"
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
                <input
                  className="w-full p-3 bg-black/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent transition-all duration-300"
                  name="lastName"
                  placeholder="Last Name"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                className="w-full p-4 bg-black/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent transition-all duration-300"
                name="email"
                type="email"
                placeholder="Enter your email"
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <div className="relative">
                <input
                  className="w-full p-4 bg-black/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent transition-all duration-300"
                  name="password"
                  type={show ? 'text' : 'password'}
                  placeholder="Create password"
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {show ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
              <div className="relative">
                <input
                  className="w-full p-4 bg-black/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent transition-all duration-300"
                  name="confirmPassword"
                  type={show ? 'text' : 'password'}
                  placeholder="Confirm password"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-white text-black p-4 rounded-xl font-semibold hover:bg-gray-200 transform hover:scale-105 transition-all duration-300 shadow-lg"
          >
            Create Account
          </button>

          <div className="text-center">
            <p className="text-gray-400">
              Already have an account?
              <span className="text-white hover:text-gray-300 cursor-pointer ml-1 underline"
              onClick={() => {navigate('/login')}}>Sign in</span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Register;