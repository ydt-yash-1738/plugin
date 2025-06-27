import { useLocation } from 'react-router-dom';

const steps = [
  { label: 'Property Details', path: '/quickquote' },
  { label: 'Tentative Quote', path: '/quickquotedisplay' },
  { label: 'Property Information', path: '/prequote' },
  { label: 'Additional Coverages', path: '/coverages' },
  { label: 'Quote Display', path: '/quotedisplay' },
  { label: 'Payment', path: '/payment' },
  { label: 'Thank You', path: '/thankyou' }
];

const ProgressBar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const currentIndex = steps.findIndex(step => step.path === currentPath);

  return (
    <div className="w-full bg-black py-4 px-2 text-center shadow-md">
      <h2 className="text-white text-3xl font-semibold mb-2">
        Home Insurance Policy designed to protect what matters most!
      </h2>

      <div className="flex justify-center gap-4 flex-wrap">
        {steps.map((step, index) => {
          let barColor = 'bg-gray-500'; // default - upcoming

          if (index < currentIndex) {
            barColor = 'bg-blue-500'; // completed
          } else if (index === currentIndex) {
            barColor = 'bg-cyan-400'; // current
          }

          return (
            <div key={index} className="flex flex-col items-center text-sm text-white w-40">
              <div className={`w-full h-1.5 mb-1 rounded-full transition-all duration-300 ${barColor}`} />
              <span className={`text-[18px] ${index === currentIndex ? 'font-bold' : 'text-gray-300'}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressBar;
