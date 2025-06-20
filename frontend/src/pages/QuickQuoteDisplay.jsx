// import { useLocation, useNavigate } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import { MapPin, Home, Thermometer, AlertTriangle, Shield, Star, Crown } from 'lucide-react';

// const QuickQuoteDisplay = () => {
//     const location = useLocation();
//     const navigate = useNavigate();
//     const { form, weatherData, disasterInfo } = location.state || {};

//     const [packages, setPackages] = useState([]);
//     const [uniqueDisasters, setUniqueDisasters] = useState([]);

//     useEffect(() => {
//         if (!form || !disasterInfo) return;

//         const sqFt = Number(form.sqFt);
//         const baseRate = 0.5;
//         const disasterMultiplier = 1 + (disasterInfo?.disasters?.length || 0) * 0.05;

//         const plans = [
//             {
//                 name: 'Economic',
//                 premium: (sqFt * baseRate * 0.8 * disasterMultiplier).toFixed(2),
//                 description: 'Budget friendly coverage plan.',
//                 icon: Shield,
//                 color: 'from-green-500 to-emerald-500'
//             },
//             {
//                 name: 'Standard',
//                 premium: (sqFt * baseRate * 1.0 * disasterMultiplier).toFixed(2),
//                 description: 'Standard protection with balanced features.',
//                 icon: Star,
//                 color: 'from-blue-500 to-cyan-500'
//             },
//             {
//                 name: 'Club',
//                 premium: (sqFt * baseRate * 1.3 * disasterMultiplier).toFixed(2),
//                 description: 'Comprehensive premium plan with full coverage.',
//                 icon: Crown,
//                 color: 'from-purple-500 to-pink-500'
//             }
//         ];

//         setPackages(plans);

//         const seen = new Set();
//         const filtered = disasterInfo.disasters.filter(d => {
//             const key = `${d.disasterNumber}-${d.declarationDate}`;
//             if (seen.has(key)) return false;
//             seen.add(key);
//             return true;
//         });
//         setUniqueDisasters(filtered);
//     }, [form, disasterInfo]);

//     if (!form || !weatherData || !disasterInfo) {
//         return (
//             <div className="min-h-screen bg-black flex items-center justify-center text-white text-xl">
//                 <AlertTriangle className="w-6 h-6 mr-2 text-red-500" />
//                 Missing quote data. Please start again.
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white px-6 py-10">
//             <div className="max-w-6xl mx-auto space-y-12">

//                 {/* Header */}
//                 <div>
//                     <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text mb-4">
//                         Home Insurance Tentative Quote
//                     </h1>
//                     <div className="grid md:grid-cols-2 gap-6 text-gray-300">
//                         <div className="bg-gray-800/70 border border-gray-700 rounded-xl p-5">
//                             <div className="flex items-center mb-2">
//                                 <MapPin className="w-5 h-5 text-blue-400 mr-2" />
//                                 <h3 className="text-lg font-semibold">Property Address</h3>
//                             </div>
//                             <p>{form.address}</p>
//                         </div>
//                         <div className="bg-gray-800/70 border border-gray-700 rounded-xl p-5">
//                             <div className="flex items-center mb-2">
//                                 <Home className="w-5 h-5 text-green-400 mr-2" />
//                                 <h3 className="text-lg font-semibold">Square Footage</h3>
//                             </div>
//                             <p>{Number(form.sqFt).toLocaleString()} sq ft</p>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Weather Info */}
//                 <div className="bg-gray-800/70 border border-cyan-700 rounded-xl p-5">
//                     <div className="flex items-center mb-3">
//                         <Thermometer className="w-6 h-6 text-cyan-400 mr-2" />
//                         <h2 className="text-xl font-semibold">Current Weather</h2>
//                     </div>
//                     <p className="text-gray-300 text-lg">
//                         {weatherData.location.name} — {weatherData.current.temp_f}°F, {weatherData.current.condition.text}
//                     </p>
//                 </div>

//                 {/* Disaster Info */}
//                 <div className="bg-gradient-to-br from-red-500/10 to-orange-400/10 border border-red-600/20 rounded-xl p-5">
//                     <div className="flex items-center mb-4">
//                         <AlertTriangle className="w-6 h-6 text-orange-400 mr-2" />
//                         <h2 className="text-xl font-semibold">Disaster History in {disasterInfo.stateName}</h2>
//                     </div>
//                     {uniqueDisasters.length > 0 ? (
//                         <ul className="list-disc list-inside space-y-1 text-gray-300">
//                             {uniqueDisasters.map((d, i) => (
//                                 <li key={i}>
//                                     {d.declarationTitle || d.incidentType} — {new Date(d.declarationDate).toLocaleDateString()}
//                                 </li>
//                             ))}
//                         </ul>
//                     ) : (
//                         <p className="text-green-400 font-medium">No recent disaster declarations.</p>
//                     )}
//                 </div>

//                 {/* Packages */}
//                 <div className="bg-gray-800/70 border border-gray-700 rounded-xl p-5">
//                     <h2 className="text-2xl font-bold text-center mb-6">Available Protection Plans</h2>
//                     <div className="grid md:grid-cols-3 gap-6">
//                         {packages.map((pkg, i) => {
//                             const Icon = pkg.icon;
//                             return (
//                                 <div
//                                     key={i}
//                                     className="bg-black border border-gray-700 rounded-2xl p-6 shadow hover:shadow-lg transition-transform hover:-translate-y-1"
//                                 >
//                                     <div className={`w-fit p-3 rounded-full mb-4 bg-gradient-to-r ${pkg.color}`}>
//                                         <Icon className="w-6 h-6 text-white" />
//                                     </div>
//                                     <h3 className="text-xl font-bold mb-1">{pkg.name}</h3>
//                                     <p className="text-gray-400 mb-3 text-sm">{pkg.description}</p>
//                                     <p className="text-3xl font-bold text-blue-400 mb-4">${pkg.premium}</p>
//                                     <button
//                                         onClick={() => navigate('/prequote', {
//                                             state: {
//                                                 selectedPlan: pkg.name,
//                                                 premium: pkg.premium,
//                                                 form,
//                                                 weatherData,
//                                                 disasterInfo
//                                             }
//                                         })}
//                                         className="w-full py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-semibold"
//                                     >
//                                         Select
//                                     </button>

//                                 </div>
//                             );
//                         })}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default QuickQuoteDisplay;

import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  MapPin, Home, Thermometer, AlertTriangle, Shield, Star, Crown, CheckCircle, Circle
} from 'lucide-react';

const QuickQuoteDisplay = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { form, weatherData, disasterInfo } = location.state || {};

  const [packages, setPackages] = useState([]);
  const [uniqueDisasters, setUniqueDisasters] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState('Standard');

  useEffect(() => {
    if (!form || !disasterInfo) return;

    const sqFt = Number(form.sqFt);
    const baseRate = 0.5;
    const disasterMultiplier = 1 + (disasterInfo?.disasters?.length || 0) * 0.05;
    
    // More comprehensive disaster type checking
    const disasterTypes = disasterInfo.disasters.map(d => 
      (d.declarationTitle || d.incidentType || '').toLowerCase()
    );
    
    // Check for various disaster patterns
    const hasFlood = disasterTypes.some(type => 
      type.includes("flood") || type.includes("storm") || type.includes("debby") || type.includes("tropical")
    );
    const hasEarthquake = disasterTypes.some(type => type.includes("earthquake"));
    const hasWind = disasterTypes.some(type => 
      type.includes("hurricane") || type.includes("tornado") || type.includes("wind") || type.includes("storm")
    );
    const hasFire = disasterTypes.some(type => type.includes("fire"));

    const economicCoverages = [
      "Dwelling Protection",
      "Other Structures",
      "Personal Property",
      "Loss of Use",
      "Personal Liability",
      "Medical Payments"
    ];

    const standardExtras = [
      hasFlood && "Flood Coverage",
      hasEarthquake && "Earthquake Protection",
      hasWind && "Storm Damage Protection",
      hasFire && "Wildfire Protection",
      "Building Code Compliance",
      "Sewer/Water Backup"
    ].filter(Boolean);

    const clubExtras = [
      "HVAC / Appliance Breakdown",
      "High-Value Items Coverage",
      "Eco-Friendly Rebuild Options",
      "Identity Theft Expenses",
      "Umbrella Liability",
      "Home-Based Business Liability",
      "Mold & Fungus Remediation",
      "Pest Infestation Coverage",
      "Equipment Rental Reimbursement",
      "HOA Loss Assessment",
      "Boat / Dock Insurance",
      "Vacation Home Flood Coverage",
      "Green Energy Equipment",
      "Enhanced Ordinance Limits",
      "Extended Living Expenses"
    ];

    const plans = [
      {
        name: 'Economic',
        premium: (sqFt * baseRate * 0.8 * disasterMultiplier).toFixed(2),
        description: 'Budget friendly coverage plan.',
        icon: Shield,
        color: 'from-green-500 to-emerald-500',
        coverages: economicCoverages
      },
      {
        name: 'Standard',
        premium: (sqFt * baseRate * 1.0 * disasterMultiplier).toFixed(2),
        description: 'Economic + disaster-specific add-ons.',
        icon: Star,
        color: 'from-blue-500 to-cyan-500',
        coverages: standardExtras
      },
      {
        name: 'Club',
        premium: (sqFt * baseRate * 1.3 * disasterMultiplier).toFixed(2),
        description: 'Standard + premium extras for full protection.',
        icon: Crown,
        color: 'from-purple-500 to-pink-500',
        coverages: clubExtras
      }
    ];

    setPackages(plans);

    const seen = new Set();
    const filtered = disasterInfo.disasters.filter(d => {
      const key = `${d.disasterNumber}-${d.declarationDate}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    setUniqueDisasters(filtered);
  }, [form, disasterInfo]);

  if (!form || !weatherData || !disasterInfo) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white text-xl">
        <AlertTriangle className="w-6 h-6 mr-2 text-red-500" />
        Missing quote data. Please start again.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white px-6 py-10">
      <div className="max-w-6xl mx-auto space-y-12">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text mb-4">
            Home Insurance Tentative Quote
          </h1>
          <div className="grid md:grid-cols-2 gap-6 text-gray-300">
            <div className="bg-gray-800/70 border border-gray-700 rounded-xl p-5">
              <div className="flex items-center mb-2">
                <MapPin className="w-5 h-5 text-blue-400 mr-2" />
                <h3 className="text-lg font-semibold">Property Address</h3>
              </div>
              <p>{form.address}</p>
            </div>
            <div className="bg-gray-800/70 border border-gray-700 rounded-xl p-5">
              <div className="flex items-center mb-2">
                <Home className="w-5 h-5 text-green-400 mr-2" />
                <h3 className="text-lg font-semibold">Square Footage</h3>
              </div>
              <p>{Number(form.sqFt).toLocaleString()} sq ft</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/70 border border-cyan-700 rounded-xl p-5">
          <div className="flex items-center mb-3">
            <Thermometer className="w-6 h-6 text-cyan-400 mr-2" />
            <h2 className="text-xl font-semibold">Current Weather</h2>
          </div>
          <p className="text-gray-300 text-lg">
            {weatherData.location.name} — {weatherData.current.temp_f}°F, {weatherData.current.condition.text}
          </p>
        </div>

        <div className="bg-gradient-to-br from-red-500/10 to-orange-400/10 border border-red-600/20 rounded-xl p-5">
          <div className="flex items-center mb-4">
            <AlertTriangle className="w-6 h-6 text-orange-400 mr-2" />
            <h2 className="text-xl font-semibold">Disaster History in {disasterInfo.stateName}</h2>
          </div>
          {uniqueDisasters.length > 0 ? (
            <ul className="list-disc list-inside space-y-1 text-gray-300">
              {uniqueDisasters.map((d, i) => (
                <li key={i}>
                  {d.declarationTitle || d.incidentType} — {new Date(d.declarationDate).toLocaleDateString()}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-green-400 font-medium">No recent disaster declarations.</p>
          )}
        </div>

        <div className="bg-gray-800/70 border border-gray-700 rounded-xl p-5">
          <h2 className="text-2xl font-bold text-center mb-6">Our Protection Plans</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {packages.map((pkg, i) => {
              const Icon = pkg.icon;
              const isSelected = selectedPlan === pkg.name;
              return (
                <div
                  key={i}
                  className={`bg-black border rounded-2xl p-6 shadow hover:shadow-lg transition-all cursor-pointer flex flex-col h-full relative ${
                    isSelected 
                      ? 'border-blue-500 ring-2 ring-blue-500/50' 
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                  onClick={() => setSelectedPlan(pkg.name)}
                >
                  <div className="absolute top-4 left-4">
                    {isSelected ? (
                      <CheckCircle className="w-6 h-6 text-blue-500" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-500" />
                    )}
                  </div>
                  <div className={`w-fit p-3 rounded-full mb-4 bg-gradient-to-r ${pkg.color} ml-auto`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-1">{pkg.name}</h3>
                  <p className="text-gray-400 mb-3 text-sm">{pkg.description}</p>
                  <div className="mb-4">
                    <ul className="list-disc list-inside text-gray-400 text-l space-y-1">
                      {pkg.coverages.map((coverage, idx) => (
                        <li key={idx}>{coverage}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex-grow"></div>
                  <div className="mt-auto">
                    <p className="text-3xl font-bold text-blue-400">${pkg.premium}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-center">
            <button
              onClick={() => {
                const selectedPackage = packages.find(pkg => pkg.name === selectedPlan);
                navigate('/prequote', {
                  state: {
                    selectedPlan: selectedPackage.name,
                    premium: selectedPackage.premium,
                    form,
                    weatherData,
                    disasterInfo
                  }
                });
              }}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-semibold text-lg transition-all"
            >
              Proceed with {selectedPlan} Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickQuoteDisplay;