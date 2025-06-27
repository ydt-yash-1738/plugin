// src/layouts/AppLayout.jsx
import { useLocation, Outlet } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar';

const routeStepMap = {
  "/quickquote": 0,
  "/quickquotedisplay": 1,
  "/prequote": 2,
  "/additionalcoverages": 3,
  "/quotedisplay": 4,
  "/payment": 5,
  "/confirmation": 6
};

const AppLayout = () => {
  const location = useLocation();
  const currentStep = routeStepMap[location.pathname] ?? 0;

  return (
    <div className='min-h-screen bg-black text-white'>
      <ProgressBar currentStep={currentStep} />
      <main className="p-4"><Outlet/></main>
    </div>
  );
};

export default AppLayout;
