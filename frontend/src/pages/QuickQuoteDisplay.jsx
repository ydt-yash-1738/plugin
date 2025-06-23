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

  const handlePlanProceed = () => {
    const selectedPackage = packages.find(pkg => pkg.name === selectedPlan);

    if (selectedPackage) {
      // Update localStorage
      const storedQuote = JSON.parse(localStorage.getItem('quickQuoteData'));
      if (storedQuote) {
        storedQuote.selectedPlan = selectedPackage.name;
        storedQuote.premium = selectedPackage.premium;
        localStorage.setItem('quickQuoteData', JSON.stringify(storedQuote));
      }

      // Navigate to next page
      navigate('/prequote', {
        state: {
          selectedPlan: selectedPackage.name,
          premium: selectedPackage.premium,
          form,
          weatherData,
          disasterInfo
        }
      });
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white px-6 py-10">
      <div className="max-w-6xl mx-auto space-y-12">
        <div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 text-transparent bg-clip-text mb-8 text-center">
            Home Insurance Tentative Quote
          </h1>
          <div className="grid md:grid-cols-2 gap-8 text-gray-200 mb-8">
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 border border-gray-600/50 rounded-2xl p-6 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-blue-400/50">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl mr-3 shadow-lg">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Property Address</h3>
                </div>
                <p className="text-gray-300 text-lg leading-relaxed pl-11">{form.address}</p>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 border border-gray-600/50 rounded-2xl p-6 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-green-400/50">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl mr-3 shadow-lg">
                    <Home className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Square Footage</h3>
                </div>
                <p className="text-gray-300 text-lg leading-relaxed pl-11">{Number(form.sqFt).toLocaleString()} sq ft</p>
              </div>
            </div>
          </div>
        </div>

        <div className="group relative mb-8">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 border border-cyan-500/30 rounded-2xl p-6 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl mr-3 shadow-lg">
                <Thermometer className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-white">Current Weather</h2>
            </div>
            <div className="pl-12">
              <p className="text-gray-200 text-xl leading-relaxed">
                <span className="font-semibold text-cyan-300">{weatherData.location.name}</span> —
                <span className="font-bold text-2xl text-white mx-2">{weatherData.current.temp_f}°F</span>
                <span className="text-gray-300">{weatherData.current.condition.text}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="group relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative bg-gradient-to-br from-red-900/20 via-gray-800/90 to-orange-900/20 border border-red-500/30 rounded-2xl p-6 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl mr-3 shadow-lg animate-pulse">
                <AlertTriangle className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-white">Disaster History in {disasterInfo.stateName}</h2>
            </div>
            <div className="pl-12">
              {uniqueDisasters.length > 0 ? (
                <div className="space-y-3">
                  {uniqueDisasters.map((d, i) => (
                    <div key={i} className="flex items-start space-x-3 p-3 bg-red-900/10 border border-red-500/20 rounded-lg hover:bg-red-900/20 transition-colors">
                      <div className="w-2 h-2 bg-gradient-to-r from-red-400 to-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1">
                        <span className="text-gray-200 text-lg leading-relaxed">
                          <span className="font-semibold text-red-300">{d.declarationTitle || d.incidentType}</span>
                          <span className="text-gray-400 mx-2">—</span>
                          <span className="text-gray-300">{new Date(d.declarationDate).toLocaleDateString()}</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center space-x-3 p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <p className="text-green-300 font-semibold text-lg">No recent disaster declarations.</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-600/50 rounded-3xl p-8 backdrop-blur-sm shadow-2xl">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-3">
              Our Protection Plans
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-10">
            {packages.map((pkg, i) => {
              const Icon = pkg.icon;
              const isSelected = selectedPlan === pkg.name;
              const isStandard = pkg.name === "Standard";

              return (
                <div
                  key={i}
                  className={`relative group transition-all duration-300 cursor-pointer transform hover:scale-105 hover:-translate-y-2 ${isSelected ? 'z-10' : 'hover:z-10'
                    }`}
                  onClick={() => setSelectedPlan(pkg.name)}
                >
                  {/* Glow effect for selected plan */}
                  {isSelected && (
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 rounded-3xl blur opacity-60 animate-pulse"></div>
                  )}

                  {/* Popular badge for Standard plan */}
                  {isStandard && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                      <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                        Most Popular
                      </div>
                    </div>
                  )}

                  <div
                    className={`relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 border-2 rounded-3xl p-8 shadow-xl backdrop-blur-sm flex flex-col h-full transition-all duration-300 ${isSelected
                      ? 'border-blue-400 shadow-blue-500/25 shadow-2xl bg-gradient-to-br from-gray-800/95 to-gray-900/95'
                      : 'border-gray-600/50 hover:border-gray-500/70 hover:shadow-xl'
                      }`}
                  >
                    {/* Selection indicator */}
                    <div className="absolute top-6 left-6">
                      {isSelected ? (
                        <div className="relative">
                          <CheckCircle className="w-7 h-7 text-blue-400 drop-shadow-lg" />
                          <div className="absolute inset-0 w-7 h-7 bg-blue-400/20 rounded-full animate-ping"></div>
                        </div>
                      ) : (
                        <Circle className="w-7 h-7 text-gray-500 group-hover:text-gray-400 transition-colors" />
                      )}
                    </div>

                    {/* Icon with enhanced styling */}
                    <div className={`w-fit p-4 rounded-2xl mb-6 bg-gradient-to-r ${pkg.color} ml-auto shadow-lg transform transition-transform group-hover:scale-110`}>
                      <Icon className="w-8 h-8 text-white drop-shadow-sm" />
                    </div>

                    {/* Plan name and description */}
                    <div className="mb-6">
                      <h3 className="text-2xl font-bold mb-2 text-white">{pkg.name}</h3>
                      <p className="text-gray-300 text-base leading-relaxed">{pkg.description}</p>
                    </div>

                    {/* Coverage list with enhanced styling */}
                    <div className="mb-8 flex-grow">
                      <div className="space-y-3">
                        {pkg.coverages.map((coverage, idx) => (
                          <div key={idx} className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-300 text-base leading-relaxed">{coverage}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pricing with enhanced styling */}
                    <div className="mt-auto pt-6 border-t border-gray-700/50">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <span className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            ${pkg.premium}
                          </span>
                          <span className="text-gray-400 text-lg ml-2">/month</span>
                        </div>
                        {isSelected && (
                          <div className="text-blue-400 text-sm font-semibold">
                            ✓ Selected
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Enhanced proceed button */}
          <div className="flex justify-center">
            <button
              onClick={handlePlanProceed}
              className="group relative px-12 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 hover:from-blue-700 hover:via-purple-700 hover:to-blue-700 rounded-2xl font-bold text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out"></div>
              <span className="relative flex items-center space-x-2">
                <span>Proceed with {selectedPlan} Plan</span>
                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickQuoteDisplay;

