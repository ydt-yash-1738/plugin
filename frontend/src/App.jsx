import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './utils/PrivateRoute';
import Navbar from './components/Navbar';
import Register from './pages/Register';
import Login from './pages/Login';
import QuickQuote from './pages/QuickQuote';
import QuickQuoteDisplay from './pages/QuickQuoteDisplay';
import PreQuote from './pages/PreQuote';
import QuoteDisplay from './pages/QuoteDisplay';

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/quickquote" element={<PrivateRoute><QuickQuote /></PrivateRoute>} />
        <Route path="/quickquotedisplay" element={<PrivateRoute><QuickQuoteDisplay /></PrivateRoute>} />
        <Route path="/prequote" element={<PrivateRoute><PreQuote /></PrivateRoute>} />
        <Route path="/quotedisplay" element={<PrivateRoute><QuoteDisplay /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;