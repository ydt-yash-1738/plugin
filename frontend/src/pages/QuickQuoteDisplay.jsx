import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  MapPin, Home, Thermometer, AlertTriangle, Shield, Star, Crown, CheckCircle, Circle, Info, X, Plus, Sun, Moon
} from 'lucide-react';
import axios from "axios";

const QuickQuoteDisplay = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { form, weatherData, disasterInfo } = location.state || {};

  const [uniqueDisasters, setUniqueDisasters] = useState([]);
  const [selectedDisasterCoverages, setSelectedDisasterCoverages] = useState([]);
  const [hoveredCoverage, setHoveredCoverage] = useState(null);
  const [showPremiumSection, setShowPremiumSection] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [premiumFromBackend, setPremiumFromBackend] = useState(null);
  const [premiumBreakdown, setPremiumBreakdown] = useState(null);
  const [loadingQuote, setLoadingQuote] = useState(false);

  // Coverage details with descriptions
  const coverageDetails = {
    "Coverage A: Dwelling Protection": "Covers the structure of your home and attached structures",
    "Coverage B: Other Structures": "Protects detached structures like garages, sheds, and fences",
    "Coverage C: Personal Property": "Covers your belongings inside the home",
    "Coverage D: Loss of Use": "Pays for temporary living expenses if your home is uninhabitable",
    "Personal Liability": "Protects you from lawsuits for accidents on your property",
    "Medical Payments": "Covers medical expenses for guests injured on your property",
    "Flood Coverage": "Protection against flood damage not covered by standard policies",
    "Earthquake Protection": "Coverage for earthquake-related damages",
    "Wind/Hailstorm Protection": "Enhanced protection against severe storms and wind damage",
    "Wildfire Protection": "Specialized coverage for wildfire-related losses",
    "Building Code Compliance": "Covers additional costs to meet updated building codes",
    "Sewer/Water Backup": "Protection against sewer and water backup damage",
    "HVAC / Appliance Breakdown": "Covers repair/replacement of heating, cooling, and appliances",
    "High-Value Items Coverage": "Enhanced protection for jewelry, art, and collectibles",
    "Eco-Friendly Rebuild Options": "Green building materials and energy-efficient upgrades",
    "Identity Theft Expenses": "Covers costs related to identity theft recovery",
    "Umbrella Liability": "Additional liability protection beyond standard limits",
    "Home-Based Business Liability": "Protection for business activities conducted at home",
    "Mold & Fungus Remediation": "Coverage for mold removal and related damages",
    "Pest Infestation Coverage": "Protection against damage from pest infestations",
    "Equipment Rental Reimbursement": "Pays for rental equipment during repairs",
    "HOA Loss Assessment": "Covers special assessments from homeowners associations",
    "Boat / Dock Insurance": "Protection for watercraft and dock structures",
    "Vacation Home Flood Coverage": "Flood protection for secondary residences",
    "Green Energy Equipment": "Coverage for solar panels and renewable energy systems",
    "Enhanced Ordinance Limits": "Higher limits for building code upgrade costs",
    "Extended Living Expenses": "Longer coverage period for temporary housing costs"
  };

  // Mandatory coverages (from Standard plan)
  const mandatoryCoverages = [
    "Coverage A: Dwelling Protection",
    "Coverage B: Other Structures",
    "Coverage C: Personal Property",
    "Coverage D: Loss of Use"
  ];

  // Function to save coverages to localStorage
  const saveCoveragesToStorage = (disaster = []) => {
    try {
      const allSelectedCoverages = [...mandatoryCoverages, ...disaster];
      const storageData = {
        mandatoryCoverages,
        disasterCoverages: disaster,
        allCoverages: allSelectedCoverages,
        timestamp: new Date().toISOString(),
        formData: form ? {
          address: form.address,
          sqFt: form.sqFt
        } : null
      };

      localStorage.setItem('selectedInsuranceCoverages', JSON.stringify(storageData));
      console.log('Coverages saved to localStorage:', storageData);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  // Function to load coverages from localStorage
  const loadCoveragesFromStorage = () => {
    try {
      const stored = localStorage.getItem('selectedInsuranceCoverages');
      if (stored) {
        const data = JSON.parse(stored);
        console.log('Loaded coverages from localStorage:', data);
        return data.disasterCoverages || [];
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
    return [];
  };

  useEffect(() => {
    if (!form || !disasterInfo) return;

    const seen = new Set();
    const filtered = disasterInfo.disasters.filter(d => {
      const key = `${d.disasterNumber}-${d.declarationDate}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    setUniqueDisasters(filtered);

    // Load previously selected coverages when component mounts
    const storedDisasterCoverages = loadCoveragesFromStorage();
    setSelectedDisasterCoverages(storedDisasterCoverages);
  }, [form, disasterInfo]);

  // Save to localStorage whenever storedDisasterCoverages changes
  useEffect(() => {
    if (form) { // Only save if we have form data
      saveCoveragesToStorage(selectedDisasterCoverages);
    }
  }, [selectedDisasterCoverages, form]);

  if (!form || !weatherData || !disasterInfo) {
    return (
      <div className={`min-h-screen flex items-center justify-center text-xl bg-black text-white`}>
        <AlertTriangle className="w-6 h-6 mr-2 text-red-500" />
        Missing quote data. Please start again.
      </div>
    );
  }

  // Disaster-specific coverages based on location
  const disasterTypes = disasterInfo.disasters.map(d =>
    (d.declarationTitle || d.incidentType || '').toLowerCase()
  );

  const hasFlood = disasterTypes.some(type =>
    type.includes("flood") || type.includes("storm") || type.includes("debby") || type.includes("tropical")
  );
  const hasEarthquake = disasterTypes.some(type => type.includes("earthquake"));
  const hasWind = disasterTypes.some(type =>
    type.includes("hurricane") || type.includes("tornado") || type.includes("wind") || type.includes("storm")
  );
  const hasFire = disasterTypes.some(type => type.includes("fire"));

  const disasterCoverages = [
    hasFlood && "Flood Coverage",
    hasEarthquake && "Earthquake Protection",
    hasWind && "Wind/Hailstorm Protection",
    hasFire && "Wildfire Protection",
    "Winter Coverage"
  ].filter(Boolean);

  const handleAddCoverage = (coverage) => {
    if (!selectedDisasterCoverages.includes(coverage)) {
      const newSelection = [...selectedDisasterCoverages, coverage];
      setSelectedDisasterCoverages(newSelection);
    }
  };

  const handleRemoveCoverage = (coverage) => {
    const newSelection = selectedDisasterCoverages.filter(c => c !== coverage);
    setSelectedDisasterCoverages(newSelection);
  };

  const sendToBackend = async () => {
    try {
      setLoadingQuote(true); // Show spinner

      const quickQuoteRaw = localStorage.getItem("quickQuoteData");
      const coveragesRaw = localStorage.getItem("selectedInsuranceCoverages");

      const quickQuoteData = JSON.parse(quickQuoteRaw);
      const coveragesData = JSON.parse(coveragesRaw);

      const address = quickQuoteData?.address;
      const sqFt = quickQuoteData?.sqFt;
      const mandatoryCoverages = coveragesData?.mandatoryCoverages;
      const disasterCoverages = coveragesData?.disasterCoverages;

      if (!address || !sqFt || !Array.isArray(mandatoryCoverages) || !Array.isArray(disasterCoverages)) {
        console.error("❌ Missing required data", { address, sqFt, mandatoryCoverages, disasterCoverages });
        return false;
      }

      const response = await axios.post("http://localhost:5000/api/sqft", {
        address,
        sqFt,
        mandatoryCoverages,
        disasterCoverages
      });

      if (response.data?.premium) {
        setPremiumFromBackend(response.data.premium);
        setPremiumBreakdown(response.data.breakdown);
        console.log("✅ Backend Premium Received:", response.data);
        return true;
      } else {
        console.error("❌ Invalid response from backend:", response.data);
        return false;
      }
    } catch (err) {
      console.error("❌ Backend send failed:", err.message);
      return false;
    } finally {
      setLoadingQuote(false); // Hide spinner no matter what
    }
  };

  const handleProceed = () => {
    // Save final selection before proceeding
    saveCoveragesToStorage(selectedDisasterCoverages);

    const quoteData = {
      form,
      weatherData,
      disasterInfo,
      mandatoryCoverages,
      selectedDisasterCoverages
    };

    navigate('/prequote', { state: quoteData });
  };

  const CoverageItem = ({ coverage, isSelected, onAdd, onRemove, showAddButton = false, showRemoveButton = false, isMandatory = false }) => (
    <div className='flex items-center justify-between p-3 rounded-lg transition-colors group bg-gray-800/50 border border-gray-600/30 hover:bg-gray-700/50'>
      <div className="flex items-center space-x-3 flex-1">
        <div className="flex items-center space-x-2">
          {isMandatory ? (
            <CheckCircle className='text-green-400' />
          ) : isSelected ? (
            <CheckCircle className='w-5 h-5 text-blue-400' />
          ) : (
            <Circle className='w-5 h-5 text-gray-500' />
          )}
          <span
            className={`${isMandatory
              ? 'text-green-200'
              : isSelected
                ? 'text-blue-200'
                : 'text-gray-300'
              } font-medium`}
          >
            {coverage}
          </span>

        </div>
        <div className="relative">
          <Info
            className='w-4 h-4 cursor-help transition-colors text-gray-400 hover:text-blue-400'
            onMouseEnter={() => setHoveredCoverage(coverage)}
            onMouseLeave={() => setHoveredCoverage(null)}
          />
          {hoveredCoverage === coverage && (
            <div className="absolute bottom-full left-0 mb-2 w-64 p-3 rounded-lg shadow-xl z-50 bg-gray-900 border border-gray-600 text-gray-200">
              <p className="text-sm">{coverageDetails[coverage]}</p>
              <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>
          )}
        </div>
      </div>

      <div className="flex space-x-2">
        {showAddButton && !isSelected && (
          <button
            onClick={() => onAdd(coverage)}
            className="p-1 rounded-full transition-colors bg-green-600 hover:bg-green-700"
          >
            <Plus className="w-4 h-4 text-white" />
          </button>
        )}
        {showRemoveButton && isSelected && (
          <button
            onClick={() => onRemove(coverage)}
            className="p-1 rounded-full transition-colors bg-red-600 hover:bg-red-700"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen px-6 py-10 bg-gradient-to-br from-black via-gray-900 to-black text-white">

      <div className="max-w-6xl mx-auto space-y-12">
        <div>
          <h1 className='text-5xl font-bold mb-8 text-center bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 text-transparent bg-clip-text'>
            Home Insurance Tentative Quote
          </h1>
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="group relative">
              <div className="absolute -inset-0.5 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-blue-500/20 to-purple-500/20"></div>
              <div className="relative rounded-2xl p-6 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-gray-800/90 to-gray-900/90 border border-gray-600/50 hover:border-blue-400/50">
                <div className="flex items-center mb-4">
                  <div className="p-2 rounded-xl mr-3 shadow-lg bg-gradient-to-r from-blue-500 to-blue-600">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Property Address</h3>
                </div>
                <p className="text-lg leading-relaxed pl-11 text-gray-300">{form.address}</p>
              </div>
            </div>
            <div className="group relative">
              <div className="absolute -inset-0.5 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-green-500/20 to-emerald-500/20"></div>
              <div className="relative rounded-2xl p-6 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-gray-800/90 to-gray-900/90 border border-gray-600/50 hover:border-green-400/50">
                <div className="flex items-center mb-4">
                  <div className="p-2 rounded-xl mr-3 shadow-lg bg-gradient-to-r from-green-500 to-emerald-600">
                    <Home className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Square Footage</h3>
                </div>
                <p className="text-lg leading-relaxed pl-11 text-gray-300">
                  {Number(form.sqFt).toLocaleString()} sq ft
                </p>
              </div>
            </div>

          </div>
        </div>
        <div className="group relative mb-8">
          <div className="absolute -inset-0.5 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-cyan-500/20 to-blue-500/20"></div>
          <div className="relative rounded-2xl p-6 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-gray-800/90 to-gray-900/90 border border-cyan-500/30">
            <div className="flex items-center mb-4">
              <div className="p-2 rounded-xl mr-3 shadow-lg bg-gradient-to-r from-cyan-500 to-blue-600">
                <Thermometer className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-white">Current Weather</h2>
            </div>
            <div className="pl-12">
              <p className="text-xl leading-relaxed text-gray-200">
                <span className="font-semibold text-cyan-300">{weatherData.location.name}</span> —
                <span className="font-bold text-2xl mx-2 text-white">{weatherData.current.temp_f}°F</span>
                <span className="text-gray-300">{weatherData.current.condition.text}</span>
              </p>
            </div>
          </div>
        </div>
        <div className="group relative">
          <div className="absolute -inset-0.5 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-red-500/20 to-orange-500/20"></div>
          <div className="relative rounded-2xl p-6 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-red-900/20 via-gray-800/90 to-orange-900/20 border border-red-500/30">
            <div className="flex items-center mb-6">
              <div className="p-2 rounded-xl mr-3 shadow-lg animate-pulse bg-gradient-to-r from-red-500 to-orange-500">
                <AlertTriangle className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-white">
                Disaster History in {disasterInfo.stateName}
              </h2>
            </div>
            <div className="pl-12">
              {uniqueDisasters.length > 0 ? (
                <div className="space-y-3">
                  {uniqueDisasters.map((d, i) => (
                    <div
                      key={i}
                      className="flex items-start space-x-3 p-3 rounded-lg transition-colors bg-red-900/10 border border-red-500/20 hover:bg-red-900/20"
                    >
                      <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0 bg-gradient-to-r from-red-400 to-orange-400"></div>
                      <div className="flex-1">
                        <span className="text-lg leading-relaxed text-gray-200">
                          <span className="font-semibold text-red-300">{d.declarationTitle || d.incidentType}</span>
                          <span className="mx-2 text-gray-400">—</span>
                          <span className="text-gray-300">
                            {new Date(d.declarationDate).toLocaleDateString()}
                          </span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center space-x-3 p-4 rounded-lg bg-green-900/20 border border-green-500/30">
                  <div className="w-3 h-3 rounded-full animate-pulse bg-green-400"></div>
                  <p className="font-semibold text-lg text-green-300">No recent disaster declarations.</p>
                </div>
              )}
            </div>
          </div>
        </div>
        {/*Coverage Selection Section*/}
        <div className="rounded-3xl p-8 backdrop-blur-sm shadow-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-600/50">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
              Customize Your Coverage
            </h2>
            <div className="w-24 h-1 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
            <p className="text-sm mt-2 text-gray-400">Your selections are automatically saved</p>
          </div>
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Selected Coverages */}
            <div className="space-y-6">
              <div className="rounded-2xl p-6 h-100 bg-gradient-to-br from-green-900/20 to-gray-800/50 border border-green-500/30">
                <h3 className="text-2xl font-bold mb-4 flex items-center text-white">
                  <Shield className="w-6 h-6 mr-3 text-green-400" />
                  Your Selected Coverage
                </h3>
                <div className="h-80 overflow-y-auto pr-2">
                  {/* Mandatory Coverages */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold mb-3 text-green-300">Mandatory Coverage (Included)</h4>
                    <div className="space-y-2">
                      {mandatoryCoverages.map((coverage, idx) => (
                        <CoverageItem key={idx} coverage={coverage} isMandatory={true} />
                      ))}
                    </div>
                  </div>
                  {/* Selected Disaster Coverages */}
                  {selectedDisasterCoverages.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold mb-3 text-blue-300">Additional Coverage</h4>
                      <div className="space-y-2">
                        {selectedDisasterCoverages.map((coverage, idx) => (
                          <CoverageItem
                            key={idx}
                            coverage={coverage}
                            isSelected={true}
                            onRemove={handleRemoveCoverage}
                            showRemoveButton={true}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* Available Coverages */}
            <div className="space-y-6">
              {/* Disaster-Specific Coverages */}
              {disasterCoverages.length > 0 && (
                <div className="rounded-2xl p-6 h-100 bg-gradient-to-br from-orange-900/20 to-gray-800/50 border border-orange-500/30">
                  <h3 className="text-2xl font-bold mb-4 flex items-center text-white">
                    <AlertTriangle className="w-6 h-6 mr-3 text-orange-400" />
                    Recommended for Your Area
                  </h3>
                  <div className="h-80 pr-2">
                    <div className="space-y-2">
                      {disasterCoverages.map((coverage, idx) => (
                        <CoverageItem
                          key={idx}
                          coverage={coverage}
                          isSelected={selectedDisasterCoverages.includes(coverage)}
                          onAdd={handleAddCoverage}
                          onRemove={handleRemoveCoverage}
                          showAddButton={!selectedDisasterCoverages.includes(coverage)}
                          showRemoveButton={selectedDisasterCoverages.includes(coverage)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-center mb-8">
            <button
              onClick={async () => {
                setLoadingQuote(true);
                const success = await sendToBackend();
                setLoadingQuote(false);
                if (success) setShowPremiumSection(true);
              }}
              disabled={loadingQuote}
              className={`px-8 py-3 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${loadingQuote ? 'opacity-60 cursor-not-allowed' : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-blue-500/30'
                } shadow-lg hover:shadow-xl flex items-center gap-2`}
            >
              {loadingQuote && (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
              )}
              {loadingQuote ? 'Fetching Quote...' : 'Get Quick Quote'}
            </button>
          </div>
          {showPremiumSection && (
            <>
              <div className="rounded-2xl p-6 text-center mb-8 bg-gradient-to-br from-blue-900/20 to-gray-800/50 border border-blue-500/30">
                <h3 className="text-xl font-semibold mb-2 text-white">Monthly Premium</h3>
                <div className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {premiumFromBackend ? `$${premiumFromBackend}` : '...'}
                </div>
                <p className="mt-2 text-gray-400">
                  Based on {mandatoryCoverages.length + selectedDisasterCoverages.length} coverages
                </p>
                {premiumBreakdown && (
                  <div className="mt-6 text-left text-sm px-4 md:px-8 lg:px-16 text-gray-300">
                    <h4 className="text-lg font-semibold mb-2">Premium Breakdown</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {Object.entries(premiumBreakdown.base).map(([key, value]) => (
                        <div key={key} className="flex justify-between border-b pb-1">
                          <span>
                            {{
                              CoverageA: 'Coverage A : Dwelling Protection',
                              CoverageB: 'Coverage B : Other Structures',
                              CoverageC: 'Coverage C : Personal Property',
                              CoverageD: 'Coverage D : Loss of Use'
                            }[key] || key}
                          </span>
                          <span>${value.toFixed(2)}</span>
                        </div>
                      ))}

                      {premiumBreakdown.disasterCoverages &&
                        Object.entries(premiumBreakdown.disasterCoverages).map(([key, value]) => (
                          <div key={key} className="flex justify-between border-b pb-1">
                            <span>{key}</span>
                            <span>${value.toFixed(2)}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex justify-center">
                <button
                  onClick={handleProceed}
                  className="group relative px-12 py-4 rounded-2xl font-bold text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl overflow-hidden bg-gradient-to-r from-purple-900 via-blue-900 to-purple-900 text-white hover:from-purple-800 hover:via-blue-800 hover:to-purple-800 hover:shadow-purple-500/25"
                >
                  Proceed with Quote
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuickQuoteDisplay;