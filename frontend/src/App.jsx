// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import { AuthProvider } from './context/AuthContext';
// import PrivateRoute from './utils/PrivateRoute';
// import Navbar from './components/Navbar';
// import Register from './pages/Register';
// import Login from './pages/Login';
// import QuickQuote from './pages/QuickQuote';
// import QuickQuoteDisplay from './pages/QuickQuoteDisplay';
// import PreQuote from './pages/PreQuote';
// import QuoteDisplay from './pages/QuoteDisplay';
// import AppLayout from './layouts/AppLayout';
// import AdditionalCoverages from './pages/AdditionalCoverages';
// import CoverageLimits from './pages/CoverageLimits';
// import Scroll from './components/Scroll';

// const App = () => (
//   <AuthProvider>
//     <BrowserRouter>
//       <Scroll />
//       <Navbar />
//       <Routes>
//         <Route path="/" element={<Navigate to="/register" />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/login" element={<Login />} />

//         {/* Wrap private routes in AppLayout to show ProgressBar */}
//         <Route element={<PrivateRoute><AppLayout /></PrivateRoute>}>
//           <Route path="/quickquote" element={<QuickQuote />} />
//           <Route path="/prequote" element={<PreQuote />} />
//           <Route path="/quickquotedisplay" element={<QuickQuoteDisplay />} />
//           <Route path="/coveragelimits" element={<CoverageLimits />} />
//           <Route path="/additionalcoverages" element={<AdditionalCoverages />} />
//           <Route path="/quotedisplay" element={<QuoteDisplay />} />
//         </Route>
//       </Routes>
//     </BrowserRouter>
//   </AuthProvider>
// );

// export default App;


import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './utils/PrivateRoute';
import Navbar from './components/Navbar';
import Register from './pages/Register';
import Login from './pages/Login';
import QuickQuote from './pages/QuickQuote';
import QuickQuoteDisplay from './pages/QuickQuoteDisplay';
import PreQuote from './pages/PreQuote';
import QuoteDisplay from './pages/QuoteDisplay';
import AppLayout from './layouts/AppLayout';
import AdditionalCoverages from './pages/AdditionalCoverages';
import CoverageLimits from './pages/CoverageLimits';
import Scroll from './components/Scroll';
import Bot from './pages/Bot';

const AppWrapper = () => {
  const location = useLocation();
  const path = location.pathname;

  const botContextMap = {
    '/quickquote': ['Square Footage', 'Address Validation', 'Flood Zone'],
    '/prequote': ['Coverage B', 'Coverage C', 'Coverage D'],
    '/quickquotedisplay': ['Coverage A', 'Flood', 'Liability'],
    '/coveragelimits': ['Coverage Limits', 'Dwelling Protection', 'Deductibles'],
    '/additionalcoverages': ['Umbrella Liability Coverage', 'Sewer/Water Backup Coverage', 'Medical Payments Coverage'],
    '/quotedisplay': ['Premium Breakdown', 'Insurance Summary']
  };

  const contextTerms = botContextMap[path] || ['Insurance', 'Policy', 'Coverage'];

  return (
    <>
      <Scroll />
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/register" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route element={<PrivateRoute><AppLayout /></PrivateRoute>}>
          <Route path="/quickquote" element={<QuickQuote />} />
          <Route path="/prequote" element={<PreQuote />} />
          <Route path="/quickquotedisplay" element={<QuickQuoteDisplay />} />
          <Route path="/coveragelimits" element={<CoverageLimits />} />
          <Route path="/additionalcoverages" element={<AdditionalCoverages />} />
          <Route path="/quotedisplay" element={<QuoteDisplay />} />
        </Route>
      </Routes>

      {/* Show Bot on all pages except login/register */}
      {path !== '/login' && path !== '/register' && (
        <Bot contextTerms={contextTerms} />
      )}
    </>
  );

};

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  </AuthProvider>
);

export default App;
