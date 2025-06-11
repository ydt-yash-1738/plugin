import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { auth, logout } = useContext(AuthContext);
  return (
    <nav className="bg-black/90 backdrop-blur-xl border-b border-gray-800 text-white p-6 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <span className="text-black font-bold text-sm">🏠</span>
          </div>
          <span className="text-2xl font-bold">House Insurance Assistant</span>
        </div>

        {auth && (
          <button
            onClick={logout}
            className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-300 backdrop-blur-sm"
          >
            Sign Out
          </button>
        )}
      </div>
    </nav>
  );
};
export default Navbar;