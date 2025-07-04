// import { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const Register = () => {
//   const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
//   const [show, setShow] = useState(false);
//   const navigate = useNavigate();

//   const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
//   const handleSubmit = async e => {
//     e.preventDefault();
//     if (form.password !== form.confirmPassword) return alert('Passwords do not match');
//     try {
//       await axios.post('http://localhost:5000/api/auth/register', form);
//       navigate('/login');
//     } catch (err) {
//       alert(err.response.data.error);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center pt-5 pb-5">
//       <div className="absolute inset-0 opacity-30">
//         <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gray-700 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
//         <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-gray-900 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000"></div>
//       </div>
//       <div className="relative z-10 backdrop-blur-xl bg-black/40 border border-gray-800 rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl">
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="text-center mb-8">
//             <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
//             <p className="text-gray-400">Join us today</p>
//           </div>

//           <div className="space-y-4">
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
//                 <input
//                   className="w-full p-3 bg-black/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent transition-all duration-300"
//                   name="firstName"
//                   placeholder="First Name"
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
//                 <input
//                   className="w-full p-3 bg-black/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent transition-all duration-300"
//                   name="lastName"
//                   placeholder="Last Name"
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
//               <input
//                 className="w-full p-4 bg-black/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent transition-all duration-300"
//                 name="email"
//                 type="email"
//                 placeholder="Enter your email"
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
//               <div className="relative">
//                 <input
//                   className="w-full p-4 bg-black/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent transition-all duration-300"
//                   name="password"
//                   type={show ? 'text' : 'password'}
//                   placeholder="Create password"
//                   onChange={handleChange}
//                   required
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShow(!show)}
//                   className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
//                 >
//                   {show ? '🙈' : '👁️'}
//                 </button>
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
//               <div className="relative">
//                 <input
//                   className="w-full p-4 bg-black/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent transition-all duration-300"
//                   name="confirmPassword"
//                   type={show ? 'text' : 'password'}
//                   placeholder="Confirm password"
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//             </div>
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-white text-black p-4 rounded-xl font-semibold hover:bg-gray-200 transform hover:scale-105 transition-all duration-300 shadow-lg"
//           >
//             Create Account
//           </button>

//           <div className="text-center">
//             <p className="text-gray-400">
//               Already have an account?
//               <span className="text-white hover:text-gray-300 cursor-pointer ml-1 underline"
//               onClick={() => {navigate('/login')}}>Sign in</span>
//             </p>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };
// export default Register;

import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return alert('Passwords do not match');
    try {
      await axios.post('http://localhost:5000/api/auth/register', form);
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6 py-10">
      <div className="flex flex-col md:flex-row w-full max-w-6xl bg-black/40 border border-gray-800 rounded-2xl text-white overflow-hidden shadow-2xl">
        {/* Left Side - Welcome Info */}
        <div className="flex-1 p-10 flex flex-col justify-center">
          <h1 className="text-4xl font-bold mb-6">Welcome !</h1>
          <p className="text-gray-300 mb-8 text-lg leading-relaxed">
            Start Your Journey to Peace of Mind. Create your account today and take the first step toward securing a home insurance policy designed to protect what matters most.
          </p>

          <div className="space-y-3 text-white text-base">
            <div className="flex items-center"><span className="text-green-400 mr-2">✓</span> Tailored Coverage</div>
            <div className="flex items-center"><span className="text-green-400 mr-2">✓</span> No One-Size-Fits-All</div>
            <div className="flex items-center"><span className="text-green-400 mr-2">✓</span> Dynamic Risk Assessment</div>
            <div className="flex items-center"><span className="text-green-400 mr-2">✓</span> AI Powered</div>
          </div>

          <div className="mt-10 space-x-4">
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300"
            >
              Customer Login
            </button>
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="flex-1 bg-black/40 backdrop-blur-xl p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">Create Account</h2>
              <p className="text-gray-400">Join us today</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-300 mb-2 block">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  required
                  onChange={handleChange}
                  placeholder="First Name"
                  className="w-full p-3 rounded-xl bg-black/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600"
                />
              </div>
              <div>
                <label className="text-sm text-gray-300 mb-2 block">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  required
                  onChange={handleChange}
                  placeholder="Last Name"
                  className="w-full p-3 rounded-xl bg-black/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-300 mb-2 block">Email</label>
              <input
                type="email"
                name="email"
                required
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full p-4 rounded-xl bg-black/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600"
              />
            </div>

            <div>
              <label className="text-sm text-gray-300 mb-2 block">Password</label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  name="password"
                  required
                  onChange={handleChange}
                  placeholder="Create password"
                  className="w-full p-4 rounded-xl bg-black/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600"
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {show ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-300 mb-2 block">Confirm Password</label>
              <input
                type={show ? 'text' : 'password'}
                name="confirmPassword"
                required
                onChange={handleChange}
                placeholder="Confirm password"
                className="w-full p-4 rounded-xl bg-black/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-white text-black p-4 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300"
            >
              Create Account
            </button>

            <div className="text-center text-gray-400">
              Already have an account?
              <span
                onClick={() => navigate('/login')}
                className="text-white hover:text-gray-300 cursor-pointer ml-1 underline"
              >
                Sign in
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
