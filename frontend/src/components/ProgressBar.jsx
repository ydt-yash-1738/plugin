import { useLocation } from 'react-router-dom';

const steps = [
  { label: 'Property Details', path: '/quickquote' },
  { label: 'Property Information', path: '/prequote' },
  { label: 'Tentative Quote', path: '/quickquotedisplay' },
  { label: 'Additional Coverages', path: '/additionalcoverages' },
  { label: 'Coverage Limits', path: '/coveragelimits' },
  { label: 'Quote Display', path: '/quotedisplay' },
  { label: 'Payment', path: '/payment' },
  { label: 'Thank You', path: '/thankyou' }
];

const ProgressBar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const currentIndex = steps.findIndex(step => step.path === currentPath);

  return (
    <div className="fixed top-20 left-0 w-full z-40 bg-black py-4 px-4 text-center shadow-md">
      <div className="flex justify-center gap-3 flex-wrap overflow-x-auto">
        {steps.map((step, index) => {
          let barColor = 'bg-gray-500';
          if (index < currentIndex) barColor = 'bg-blue-500';
          else if (index === currentIndex) barColor = 'bg-cyan-400';

          return (
            <div
              key={index}
              className="flex flex-col items-center min-w-[110px] text-xs sm:text-sm text-white"
            >
              <div className={`w-full h-1.5 mb-1 rounded-full transition-all duration-300 ${barColor}`} />
              <span className={`text-[13px] ${index === currentIndex ? 'font-bold' : 'text-gray-300'} text-center`}>
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
