// import { useLocation, useNavigate } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import {
//   MapPin, Home, Thermometer, AlertTriangle, Shield, Star, Crown, CheckCircle, Circle, X, Plus, Sun, Moon,
//   Umbrella, Waves, Flame, Zap, Building, Heart
// } from 'lucide-react';
// import axios from "axios";

// const QuickQuoteDisplay = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   // Initialize state from localStorage or location.state
//   const [form, setForm] = useState(null);
//   const [weatherData, setWeatherData] = useState(null);
//   const [disasterInfo, setDisasterInfo] = useState(null);
//   const [uniqueDisasters, setUniqueDisasters] = useState([]);
//   const [selectedDisasterCoverages, setSelectedDisasterCoverages] = useState([]);
//   const [showPremiumSection, setShowPremiumSection] = useState(false);
//   const [premiumFromBackend, setPremiumFromBackend] = useState(null);
//   const [premiumBreakdown, setPremiumBreakdown] = useState(null);
//   const [loadingQuote, setLoadingQuote] = useState(false);

//   // New state to track if coverages have changed since last quote
//   const [coveragesChanged, setCoveragesChanged] = useState(false);
//   const [lastQuotedCoverages, setLastQuotedCoverages] = useState([]);

//   // Coverage details with descriptions and icons
//   const coverageDetails = {
//     "Coverage A: Dwelling Protection": {
//       description: "Covers the structure of your home and attached structures",
//       icon: Home,
//       category: "Essential"
//     },
//     "Coverage B: Other Structures": {
//       description: "Protects detached structures like garages, sheds, and fences",
//       icon: Building,
//       category: "Essential"
//     },
//     "Coverage C: Personal Property": {
//       description: "Covers your belongings inside the home",
//       icon: Shield,
//       category: "Essential"
//     },
//     "Coverage D: Loss of Use": {
//       description: "Pays for temporary living expenses if your home is uninhabitable",
//       icon: Home,
//       category: "Essential"
//     },
//     "Personal Liability": {
//       description: "Protects you from lawsuits for accidents on your property",
//       icon: Shield,
//       category: "Essential"
//     },
//     "Medical Payments": {
//       description: "Covers medical expenses for guests injured on your property",
//       icon: Heart,
//       category: "Essential"
//     },
//     "Flood Coverage": {
//       description: "Protection against flood damage not covered by standard policies",
//       icon: Waves,
//       category: "Disaster"
//     },
//     "Earthquake Protection": {
//       description: "Coverage for earthquake-related damages",
//       icon: AlertTriangle,
//       category: "Disaster"
//     },
//     "Wind/Hailstorm Protection": {
//       description: "Enhanced protection against severe storms and wind damage",
//       icon: Zap,
//       category: "Disaster"
//     },
//     "Wildfire Protection": {
//       description: "Specialized coverage for wildfire-related losses",
//       icon: Flame,
//       category: "Disaster"
//     },
//     "Winter Coverage": {
//       description: "Protect against winter disasters and weather-related damages",
//       icon: AlertTriangle,
//       category: "Disaster"
//     }
//   };

//   // Mandatory coverages (from Standard plan)
//   const mandatoryCoverages = [
//     "Coverage A: Dwelling Protection",
//     "Coverage C: Personal Property"
//   ];

//   // Function to load data from localStorage
//   const loadDataFromStorage = () => {
//     try {
//       const quickQuoteRaw = localStorage.getItem("quickQuoteData");
//       if (quickQuoteRaw) {
//         const quickQuoteData = JSON.parse(quickQuoteRaw);

//         // Reconstruct form data from localStorage
//         const formData = {
//           address: quickQuoteData.address,
//           sqFt: quickQuoteData.sqFt || quickQuoteData.form?.sqFt,
//           addressLine: quickQuoteData.form?.addressLine,
//           city: quickQuoteData.form?.city,
//           state: quickQuoteData.form?.state,
//           zip: quickQuoteData.form?.zip,
//           country: quickQuoteData.form?.country
//         };

//         setForm(formData);
//         setWeatherData(quickQuoteData.weatherData);
//         setDisasterInfo(quickQuoteData.disasterInfo);

//         return true; // Successfully loaded from storage
//       }
//     } catch (error) {
//       console.error('Error loading data from localStorage:', error);
//     }
//     return false; // Failed to load from storage
//   };

//   // Function to save coverages to localStorage
//   const saveCoveragesToStorage = (disaster = []) => {
//     try {
//       const allSelectedCoverages = [...mandatoryCoverages, ...disaster];
//       const storageData = {
//         mandatoryCoverages,
//         disasterCoverages: disaster,
//         allCoverages: allSelectedCoverages,
//         timestamp: new Date().toISOString(),
//         formData: form ? {
//           address: form.address,
//           sqFt: form.sqFt
//         } : null
//       };

//       localStorage.setItem('selectedInsuranceCoverages', JSON.stringify(storageData));
//       console.log('Coverages saved to localStorage:', storageData);
//     } catch (error) {
//       console.error('Error saving to localStorage:', error);
//     }
//   };

//   // Function to load coverages from localStorage
//   const loadCoveragesFromStorage = () => {
//     try {
//       const stored = localStorage.getItem('selectedInsuranceCoverages');
//       if (stored) {
//         const data = JSON.parse(stored);
//         console.log('Loaded coverages:', data.disasterCoverages || []);
//         return data.disasterCoverages || [];
//       }
//     } catch (error) {
//       console.error('Error loading from localStorage:', error);
//     }
//     return [];
//   };

//   // Function to check if coverages have changed
//   const checkCoveragesChanged = (currentCoverages, lastQuotedCoverages) => {
//     if (currentCoverages.length !== lastQuotedCoverages.length) return true;

//     const currentSorted = [...currentCoverages].sort();
//     const lastSorted = [...lastQuotedCoverages].sort();

//     return !currentSorted.every((coverage, index) => coverage === lastSorted[index]);
//   };

//   // MAIN useEffect - runs once on component mount
//   useEffect(() => {
//     console.log('Main useEffect running...');

//     // 1. Try to get data from location.state first, then localStorage
//     const { form: locationForm, weatherData: locationWeather, disasterInfo: locationDisaster } = location.state || {};

//     if (locationForm && locationWeather && locationDisaster) {
//       // Use data from navigation state
//       setForm(locationForm);
//       setWeatherData(locationWeather);
//       setDisasterInfo(locationDisaster);
//       console.log('Using data from location.state');
//     } else {
//       // Try to load from localStorage
//       const loaded = loadDataFromStorage();
//       if (!loaded) {
//         console.log('No data available from either source');
//         return;
//       }
//       console.log('Using data from localStorage');
//     }

//     // 2. Restore premium from localStorage
//     const storedPremium = localStorage.getItem("quotePremium");
//     if (storedPremium) {
//       console.log('Restoring premium:', storedPremium);
//       setPremiumFromBackend(storedPremium);
//       setShowPremiumSection(true);
//     }

//     // 3. Restore breakdown from localStorage
//     const storedBreakdown = localStorage.getItem("quoteBreakdown");
//     if (storedBreakdown) {
//       try {
//         const breakdown = JSON.parse(storedBreakdown);
//         console.log('Restoring breakdown:', breakdown);
//         setPremiumBreakdown(breakdown);
//       } catch (err) {
//         console.error("Failed to parse breakdown:", err);
//       }
//     }

//     // 4. Restore coverage selections from localStorage
//     const loadedCoverages = loadCoveragesFromStorage();
//     console.log('Restoring coverages:', loadedCoverages);
//     setSelectedDisasterCoverages(loadedCoverages);

//     // 5. Set last quoted coverages to current coverages initially
//     setLastQuotedCoverages(loadedCoverages);
//   }, []); // Empty dependency array - runs only once

//   // Process disasters when disaster info is available
//   useEffect(() => {
//     if (disasterInfo) {
//       const seen = new Set();
//       const filtered = disasterInfo.disasters.filter(d => {
//         const key = `${d.disasterNumber}-${d.declarationDate}`;
//         if (seen.has(key)) return false;
//         seen.add(key);
//         return true;
//       });
//       setUniqueDisasters(filtered);
//     }
//   }, [disasterInfo]);

//   // Save to localStorage whenever selectedDisasterCoverages changes
//   useEffect(() => {
//     console.log('Coverage change detected, saving to storage...');
//     if (form) { // Only save if we have form data
//       saveCoveragesToStorage(selectedDisasterCoverages);

//       // Check if coverages have changed since last quote
//       if (showPremiumSection && premiumFromBackend) {
//         const hasChanged = checkCoveragesChanged(selectedDisasterCoverages, lastQuotedCoverages);
//         setCoveragesChanged(hasChanged);
//       }
//     }
//   }, [selectedDisasterCoverages, form, showPremiumSection, premiumFromBackend, lastQuotedCoverages]);

//   // Show loading or error state while data is being loaded
//   if (!form || !weatherData || !disasterInfo) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-xl bg-gradient-to-br from-black via-gray-900 to-black text-white">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
//           <p>Loading quote data...</p>
//           <p className="text-sm text-gray-400 mt-2">If this persists, please start a new quote</p>
//         </div>
//       </div>
//     );
//   }

//   // Disaster-specific coverages based on location
//   const disasterTypes = disasterInfo.disasters.map(d =>
//     (d.declarationTitle || d.incidentType || '').toLowerCase()
//   );

//   const hasFlood = disasterTypes.some(type =>
//     type.includes("flood") || type.includes("storm") || type.includes("debby") || type.includes("tropical")
//   );
//   const hasEarthquake = disasterTypes.some(type => type.includes("earthquake"));
//   const hasWind = disasterTypes.some(type =>
//     type.includes("hurricane") || type.includes("tornado") || type.includes("wind") || type.includes("storm")
//   );
//   const hasFire = disasterTypes.some(type => type.includes("fire"));

//   const disasterCoverages = [
//     hasFlood && "Flood Coverage",
//     hasEarthquake && "Earthquake Protection",
//     hasWind && "Wind/Hailstorm Protection",
//     hasFire && "Wildfire Protection",
//     "Winter Coverage"
//   ].filter(Boolean);

//   const handleAddCoverage = (coverage) => {
//     if (!selectedDisasterCoverages.includes(coverage)) {
//       const newSelection = [...selectedDisasterCoverages, coverage];
//       console.log('Adding coverage:', coverage);
//       setSelectedDisasterCoverages(newSelection);
//     }
//   };

//   const handleRemoveCoverage = (coverage) => {
//     const newSelection = selectedDisasterCoverages.filter(c => c !== coverage);
//     console.log('Removing coverage:', coverage);
//     setSelectedDisasterCoverages(newSelection);
//   };

//   const sendToBackend = async () => {
//     try {
//       console.log("sendToBackend started...");
//       setLoadingQuote(true);

//       // Step 1: Read localStorage
//       const quickQuoteRaw = localStorage.getItem("quickQuoteData");
//       const coveragesRaw = localStorage.getItem("selectedInsuranceCoverages");

//       console.log("Raw quickQuoteData:", quickQuoteRaw);
//       console.log("Raw selectedInsuranceCoverages:", coveragesRaw);

//       // Step 2: Parse
//       const quickQuoteData = JSON.parse(quickQuoteRaw);
//       const coveragesData = JSON.parse(coveragesRaw);

//       // Step 3: Extract
//       const address = quickQuoteData?.address?.trim();
//       const sqFt = Number(quickQuoteData?.sqFt);
//       const mandatoryCoverages = coveragesData?.mandatoryCoverages;
//       const disasterCoverages = coveragesData?.disasterCoverages;

//       console.log("Extracted →", { address, sqFt, mandatoryCoverages, disasterCoverages });

//       // Step 4: Validate
//       if (!address || isNaN(sqFt) || sqFt <= 0 || !Array.isArray(mandatoryCoverages) || !Array.isArray(disasterCoverages)) {
//         console.error("Validation failed before sending", { address, sqFt, mandatoryCoverages, disasterCoverages });
//         return false;
//       }

//       const payload = {
//         address,
//         sqFt,
//         mandatoryCoverages,
//         disasterCoverages
//       };

//       console.log("Payload sending to backend:", payload);

//       // Step 5: POST to backend
//       const response = await axios.post("http://localhost:5000/api/sqft", payload);

//       // Step 6: Handle response
//       console.log("Backend response:", response.data);

//       if (response.data?.premium) {
//         setPremiumFromBackend(response.data.premium);
//         setPremiumBreakdown(response.data.breakdown);
//         localStorage.setItem('quotePremium', response.data.premium);
//         localStorage.setItem('quoteBreakdown', JSON.stringify(response.data.breakdown));

//         // Update last quoted coverages and reset changed flag
//         setLastQuotedCoverages([...selectedDisasterCoverages]);
//         setCoveragesChanged(false);

//         console.log("Premium stored in state + localStorage:", response.data);
//         return true;
//       } else {
//         console.error("Unexpected backend response:", response.data);
//         return false;
//       }

//     } catch (err) {
//       console.error("Backend send failed:", err.message);
//       console.error("🪵 Full error:", err);
//       return false;
//     } finally {
//       setLoadingQuote(false);
//       console.log("sendToBackend finished.");
//     }
//   };

//   const handleBack = () => {
//     navigate('/prequote')
//   }

//   const handleProceed = () => {
//     // Save final selection before proceeding
//     console.log('Proceeding with final coverages save...');
//     saveCoveragesToStorage(selectedDisasterCoverages);

//     const quoteData = {
//       form,
//       weatherData,
//       disasterInfo,
//       mandatoryCoverages,
//       selectedDisasterCoverages
//     };

//     navigate('/additionalcoverages', { state: quoteData });
//   };

//   const getCategoryColor = (category) => {
//     switch (category) {
//       case 'Essential': return 'from-green-500 to-emerald-600';
//       case 'Disaster': return 'from-orange-500 to-red-600';
//       default: return 'from-gray-500 to-gray-600';
//     }
//   };

//   const getCategoryBadge = (category) => {
//     const colors = {
//       'Essential': 'bg-green-500/20 text-green-300 border-green-500/30',
//       'Disaster': 'bg-orange-500/20 text-orange-300 border-orange-500/30'
//     };
//     return colors[category] || colors['Essential'];
//   };

//   const CoverageCard = ({ coverage, isSelected, onAdd, onRemove, isMandatory = false }) => {
//     const coverageInfo = coverageDetails[coverage];
//     if (!coverageInfo) return null;

//     const IconComponent = coverageInfo.icon;

//     return (
//       <div className={`group relative p-3 rounded-lg border transition-all duration-300 ${isSelected || isMandatory
//         ? 'bg-blue-900/30 border-blue-500/50 shadow-lg shadow-blue-500/20'
//         : 'bg-gray-800/50 border-gray-600/30 hover:bg-gray-700/50 hover:border-gray-500/50'
//         }`}>

//         {/* Header Row */}
//         <div className="flex items-center justify-between mb-2">
//           <div className="flex items-center space-x-2">
//             <div className={`p-1.5 rounded-md bg-gradient-to-r ${getCategoryColor(coverageInfo.category)}`}>
//               <IconComponent className="w-4 h-4 text-white" />
//             </div>
//             <div>
//               <h4 className="font-medium text-white text-sm">{coverage}</h4>
//               <span className={`text-xs px-1.5 py-0.5 rounded-md border ${getCategoryBadge(coverageInfo.category)}`}>
//                 {isMandatory ? 'Mandatory' : coverageInfo.category}
//               </span>
//             </div>
//           </div>

//           {/* Status/Action Section */}
//           <div className="flex items-center space-x-2">
//             {isMandatory && (
//               <CheckCircle className="w-4 h-4 text-green-400" />
//             )}

//             {isMandatory ? (
//               <span className="text-xs px-2 py-1 rounded-md bg-green-600/20 text-green-300 border border-green-500/30">
//                 Included
//               </span>
//             ) : isSelected ? (
//               <button
//                 onClick={() => onRemove(coverage)}
//                 className="flex items-center space-x-1 px-2 py-1 rounded-md bg-red-600/20 text-red-300 border border-red-500/30 hover:bg-red-600/30 transition-colors"
//               >
//                 <X className="w-3 h-3" />
//                 <span className="text-xs">Remove</span>
//               </button>
//             ) : (
//               <button
//                 onClick={() => onAdd(coverage)}
//                 className="flex items-center space-x-1 px-2 py-1 rounded-md bg-green-600/20 text-green-300 border border-green-500/30 hover:bg-green-600/30 transition-colors"
//               >
//                 <Plus className="w-3 h-3" />
//                 <span className="text-xs">Add</span>
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Description */}
//         <p className="text-xs text-gray-400 leading-relaxed">{coverageInfo.description}</p>
//       </div>
//     );
//   };

//   const CoverageItem = ({ coverage, isMandatory = false, isDisaster = false, isAdditional = false }) => (
//     <div className={`flex items-center p-2 rounded-md border transition-colors ${isMandatory ? 'bg-green-900/20 border-green-500/30' :
//       isDisaster ? 'bg-orange-900/20 border-orange-500/30' :
//         'bg-blue-900/20 border-blue-500/30'
//       }`}>
//       <CheckCircle className={`w-4 h-4 mr-2 ${isMandatory ? 'text-green-400' :
//         isDisaster ? 'text-orange-400' :
//           'text-blue-400'
//         }`} />
//       <span className="text-white text-sm font-medium truncate">{coverage}</span>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white px-6 py-10 mt-5">
//       <div className="max-w-7xl mx-auto space-y-12">
//         {/* Header */}
//         <div className="text-center">
//           <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 text-transparent bg-clip-text">
//             Your Insurance Quote
//           </h1>
//           <p className="text-xl text-gray-300">Customize your protection based on your location's risk profile</p>
//           <div className="w-24 h-1 mx-auto mt-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
//         </div>

//         {/* Property Information */}
//         {/* Property and Coverage A Info */}
//         <div className="group relative">
//           <div className="absolute -inset-0.5 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-emerald-500/20"></div>

//           <div className="relative rounded-2xl p-4 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-gray-800/90 to-gray-900/90 border border-gray-600/50 hover:border-cyan-400/50">

//             <div className="flex flex-col md:flex-row gap-6">

//               {/* LEFT: Property Info */}
//               <div className="flex-1">
//                 <div className="flex items-center mb-3">
//                   <div className="p-2 rounded-xl mr-3 shadow-lg bg-gradient-to-r from-blue-500 to-green-500">
//                     <Home className="w-5 h-5 text-white" />
//                   </div>
//                   <h3 className="text-lg font-semibold text-white">Property Details</h3>
//                 </div>
//                 <div className="pl-10 space-y-2">
//                   <div className="flex items-center text-gray-300">
//                     <MapPin className="w-4 h-4 mr-2 text-blue-400" />
//                     <span className="text-sm font-medium mr-2">Address:</span>
//                     <span className="text-sm">{form.address}</span>
//                   </div>
//                   <div className="flex items-center text-gray-300">
//                     <Home className="w-4 h-4 mr-2 text-green-400" />
//                     <span className="text-sm font-medium mr-2">Size:</span>
//                     <span className="text-sm">{Number(form.sqFt).toLocaleString()} sq ft</span>
//                   </div>
//                 </div>
//               </div>

//               {/* RIGHT: Coverage A Info */}
//               <div className="flex-1 border-l border-gray-700 pl-6">
//                 <div className="flex items-center mb-3">
//                   <div className="p-2 rounded-xl mr-3 shadow-lg bg-gradient-to-r from-purple-500 to-blue-500">
//                     <Home className="w-5 h-5 text-white" />
//                   </div>
//                   <h3 className="text-lg font-semibold text-white">Coverage A: Dwelling Protection</h3>
//                 </div>
//                 <div className="pl-10 text-sm text-gray-300 space-y-2">
//                   <p>This coverage protects your physical home (walls, roof, foundation) from risks like fire, storm, vandalism, etc.</p>
//                   <p>It typically covers the cost of rebuilding or repairing the structure.</p>
//                   <p className="text-blue-400 font-medium">Required for all properties.</p>
//                 </div>
//               </div>
//             </div>

//           </div>
//         </div>
//         {/* Coverage Selection */}
//         <div className="rounded-2xl p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-600/50">
//           <div className="text-center mb-8">
//             <h2 className="text-3xl font-bold mb-3 text-white">Recommended Coverage Options</h2>
//             <p className="text-gray-300">Based on your location's disaster history</p>
//           </div>

//           {/* Disaster Coverage Section */}
//           {disasterCoverages.length > 0 && (
//             <div className="mb-8">
//               <h3 className="text-2xl font-semibold mb-4 text-white flex items-center">
//                 <AlertTriangle className="w-6 h-6 mr-2 text-orange-400" />
//                 Recommended for Your Area
//               </h3>
//               <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {disasterCoverages.map((coverage, idx) => (
//                   <CoverageCard
//                     key={idx}
//                     coverage={coverage}
//                     isSelected={selectedDisasterCoverages.includes(coverage)}
//                     onAdd={handleAddCoverage}
//                     onRemove={handleRemoveCoverage}
//                   />
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Actions */}
//           <div className="flex justify-center space-x-4 mb-8">
//             <button
//               onClick={handleBack}
//               className="px-8 py-3 rounded-xl font-semibold text-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors"
//             >
//               ← Back
//             </button>
//             <button
//               onClick={async () => {
//                 setLoadingQuote(true);
//                 const success = await sendToBackend();
//                 setLoadingQuote(false);
//                 if (success) setShowPremiumSection(true);
//               }}
//               disabled={loadingQuote}
//               className={`px-8 py-3 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${loadingQuote ? 'opacity-60 cursor-not-allowed' : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/30'
//                 } flex items-center space-x-2`}
//             >
//               {loadingQuote && (
//                 <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//               )}
//               <span>{loadingQuote ? 'Getting Quote...' : showPremiumSection && coveragesChanged ? 'Get New Quick Quote' : 'Get Quick Quote'}</span>
//             </button>
//           </div>

//           {/* Premium Section */}
//           {showPremiumSection && (
//             <div className="rounded-2xl p-6 bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/30">
//               <div className="text-center mb-6">
//                 <h3 className="text-2xl font-semibold mb-2 text-white">Your Tentative Premium</h3>
//                 <div className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
//                   {premiumFromBackend ? `$${premiumFromBackend}` : '...'}
//                 </div>
//                 {coveragesChanged && (
//                   <p className="mt-2 text-yellow-400 text-sm">
//                     ⚠️ Coverage selection has changed. Get a new quote to update premium.
//                   </p>
//                 )}
//               </div>

//               {premiumBreakdown && (
//                 <div className="mb-6">
//                   <h4 className="text-lg font-semibold mb-3 text-white">Premium Breakdown</h4>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
//                     {Object.entries(premiumBreakdown.base).map(([key, value]) => {
//                       // Skip entries with undefined or 0 values and no meaningful key
//                       if (value === 0 && !key) return null;

//                       return (
//                         <div key={key} className="flex justify-between p-2 bg-gray-800/50 rounded border-b border-gray-600">
//                           <span className="text-gray-300">
//                             {{
//                               CoverageA: 'Coverage A: Dwelling Protection',
//                               CoverageB: 'Coverage B: Other Structures',
//                               CoverageC: 'Coverage C: Personal Property',
//                               CoverageD: 'Coverage D: Loss of Use'
//                             }[key] || key}
//                           </span>
//                           <span className="text-white font-medium">${value.toFixed(2)}</span>
//                         </div>
//                       );
//                     })}

//                     {premiumBreakdown.disasterCoverages &&
//                       Object.entries(premiumBreakdown.disasterCoverages).map(([key, value]) => (
//                         <div key={key} className="flex justify-between p-2 bg-orange-800/20 rounded border-b border-orange-600/30">
//                           <span className="text-orange-200">{key}</span>
//                           <span className="text-white font-medium">${value.toFixed(2)}</span>
//                         </div>
//                       ))}
//                   </div>
//                 </div>
//               )}

//               <div className="text-center">
//                 <button
//                   onClick={handleProceed}
//                   disabled={coveragesChanged}
//                   className={`px-12 py-4 rounded-xl font-bold text-xl transition-all duration-300 transform ${coveragesChanged
//                       ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
//                       : 'bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/30 hover:scale-105'
//                     }`}
//                 >
//                   {coveragesChanged ? 'Get New Quote First' : 'Proceed'}
//                 </button>
//                 {coveragesChanged && (
//                   <p className="mt-2 text-yellow-400 text-sm">
//                     Please get a new quote before proceeding
//                   </p>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default QuickQuoteDisplay;


import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  MapPin, Home, Thermometer, AlertTriangle, Shield, Star, Crown, CheckCircle, Circle, X, Plus, Sun, Moon,
  Umbrella, Waves, Flame, Zap, Building, Heart
} from 'lucide-react';
import axios from "axios";

const QuickQuoteDisplay = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Initialize state from localStorage or location.state
  const [form, setForm] = useState(null);
  const [preQuoteData, setPreQuoteData] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [disasterInfo, setDisasterInfo] = useState(null);
  const [uniqueDisasters, setUniqueDisasters] = useState([]);
  const [selectedDisasterCoverages, setSelectedDisasterCoverages] = useState([]);
  const [showPremiumSection, setShowPremiumSection] = useState(false);
  const [premiumFromBackend, setPremiumFromBackend] = useState(null);
  const [premiumBreakdown, setPremiumBreakdown] = useState(null);
  const [loadingQuote, setLoadingQuote] = useState(false);

  // New state to track if coverages have changed since last quote
  const [coveragesChanged, setCoveragesChanged] = useState(false);
  const [lastQuotedCoverages, setLastQuotedCoverages] = useState([]);

  // Coverage details with descriptions and icons
  const coverageDetails = {
    "Coverage A: Dwelling Protection": {
      description: "Covers the structure of your home and attached structures",
      icon: Home,
      category: "Essential"
    },
    "Coverage B: Other Structures": {
      description: "Protects detached structures like garages, sheds, and fences",
      icon: Building,
      category: "Essential"
    },
    "Coverage C: Personal Property": {
      description: "Covers your belongings inside the home",
      icon: Shield,
      category: "Essential"
    },
    "Coverage D: Loss of Use": {
      description: "Pays for temporary living expenses if your home is uninhabitable",
      icon: Home,
      category: "Essential"
    },
    "Personal Liability": {
      description: "Protects you from lawsuits for accidents on your property",
      icon: Shield,
      category: "Essential"
    },
    "Medical Payments": {
      description: "Covers medical expenses for guests injured on your property",
      icon: Heart,
      category: "Essential"
    },
    "Flood Coverage": {
      description: "Protection against flood damage not covered by standard policies",
      icon: Waves,
      category: "Disaster"
    },
    "Earthquake Protection": {
      description: "Coverage for earthquake-related damages",
      icon: AlertTriangle,
      category: "Disaster"
    },
    "Wind/Hailstorm Protection": {
      description: "Enhanced protection against severe storms and wind damage",
      icon: Zap,
      category: "Disaster"
    },
    "Wildfire Protection": {
      description: "Specialized coverage for wildfire-related losses",
      icon: Flame,
      category: "Disaster"
    },
    "Winter Coverage": {
      description: "Protect against winter disasters and weather-related damages",
      icon: AlertTriangle,
      category: "Disaster"
    }
  };

  // Function to get mandatory coverages based on preQuote responses
  const getMandatoryCoverages = (preQuoteResponses) => {
    const mandatory = ["Coverage A: Dwelling Protection"];

    if (preQuoteResponses) {
      // Add Coverage B if user selected "Yes" for detached structures
      if (preQuoteResponses.coverageB === "Yes") {
        mandatory.push("Coverage B: Other Structures");
      }

      // Add Coverage C if user selected "Yes" for personal belongings
      if (preQuoteResponses.coverageC === "Yes") {
        mandatory.push("Coverage C: Personal Property");
      }

      // Add Coverage D if user selected "Yes" for additional living expenses
      if (preQuoteResponses.coverageD === "Yes") {
        mandatory.push("Coverage D: Loss of Use");
      }
    }

    return mandatory;
  };

  // Dynamic mandatory coverages based on preQuote data
  const mandatoryCoverages = getMandatoryCoverages(preQuoteData);

  // Function to load data from localStorage
  const loadDataFromStorage = () => {
    try {
      const quickQuoteRaw = localStorage.getItem("quickQuoteData");
      const preQuoteRaw = localStorage.getItem("preQuoteData");

      if (quickQuoteRaw) {
        const quickQuoteData = JSON.parse(quickQuoteRaw);

        // Reconstruct form data from localStorage
        const formData = {
          address: quickQuoteData.address,
          sqFt: quickQuoteData.sqFt || quickQuoteData.form?.sqFt,
          addressLine: quickQuoteData.form?.addressLine,
          city: quickQuoteData.form?.city,
          state: quickQuoteData.form?.state,
          zip: quickQuoteData.form?.zip,
          country: quickQuoteData.form?.country
        };

        setForm(formData);
        setWeatherData(quickQuoteData.weatherData);
        setDisasterInfo(quickQuoteData.disasterInfo);

        // Load preQuote data
        if (preQuoteRaw) {
          const preQuoteData = JSON.parse(preQuoteRaw);
          console.log("Loaded preQuote data:", preQuoteData);
          setPreQuoteData(preQuoteData.preQuoteData || preQuoteData);
        }

        return true; // Successfully loaded from storage
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    }
    return false; // Failed to load from storage
  };

  // Function to save coverages to localStorage
  const saveCoveragesToStorage = (disaster = []) => {
    try {
      const currentMandatory = getMandatoryCoverages(preQuoteData);
      const allSelectedCoverages = [...currentMandatory, ...disaster];
      const storageData = {
        mandatoryCoverages: currentMandatory,
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
        console.log('Loaded coverages:', data.disasterCoverages || []);
        return data.disasterCoverages || [];
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
    return [];
  };

  // Function to check if coverages have changed
  const checkCoveragesChanged = (currentCoverages, lastQuotedCoverages) => {
    if (currentCoverages.length !== lastQuotedCoverages.length) return true;

    const currentSorted = [...currentCoverages].sort();
    const lastSorted = [...lastQuotedCoverages].sort();

    return !currentSorted.every((coverage, index) => coverage === lastSorted[index]);
  };

  // MAIN useEffect - runs once on component mount
  useEffect(() => {
    console.log('Main useEffect running...');

    // 1. Try to get data from location.state first, then localStorage
    const { form: locationForm, weatherData: locationWeather, disasterInfo: locationDisaster, preQuoteForm } = location.state || {};

    if (locationForm && locationWeather && locationDisaster) {
      // Use data from navigation state
      setForm(locationForm);
      setWeatherData(locationWeather);
      setDisasterInfo(locationDisaster);

      // Set preQuote data from location state or localStorage
      if (preQuoteForm) {
        setPreQuoteData(preQuoteForm);
      } else {
        // Try to load preQuote data from localStorage
        const preQuoteRaw = localStorage.getItem("preQuoteData");
        if (preQuoteRaw) {
          try {
            const preQuoteData = JSON.parse(preQuoteRaw);
            setPreQuoteData(preQuoteData.preQuoteData || preQuoteData);
          } catch (err) {
            console.error("Failed to parse preQuoteData:", err);
          }
        }
      }

      console.log('Using data from location.state');
    } else {
      // Try to load from localStorage
      const loaded = loadDataFromStorage();
      if (!loaded) {
        console.log('No data available from either source');
        return;
      }
      console.log('Using data from localStorage');
    }

    // 2. Restore premium from localStorage
    const storedPremium = localStorage.getItem("quotePremium");
    if (storedPremium) {
      console.log('Restoring premium:', storedPremium);
      setPremiumFromBackend(storedPremium);
      setShowPremiumSection(true);
    }

    // 3. Restore breakdown from localStorage
    const storedBreakdown = localStorage.getItem("quoteBreakdown");
    if (storedBreakdown) {
      try {
        const breakdown = JSON.parse(storedBreakdown);
        console.log('Restoring breakdown:', breakdown);
        setPremiumBreakdown(breakdown);
      } catch (err) {
        console.error("Failed to parse breakdown:", err);
      }
    }

    // 4. Restore coverage selections from localStorage
    const loadedCoverages = loadCoveragesFromStorage();
    console.log('Restoring coverages:', loadedCoverages);
    setSelectedDisasterCoverages(loadedCoverages);

    // 5. Set last quoted coverages to current coverages initially
    setLastQuotedCoverages(loadedCoverages);
  }, []); // Empty dependency array - runs only once

  // Process disasters when disaster info is available
  useEffect(() => {
    if (disasterInfo) {
      const seen = new Set();
      const filtered = disasterInfo.disasters.filter(d => {
        const key = `${d.disasterNumber}-${d.declarationDate}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
      setUniqueDisasters(filtered);
    }
  }, [disasterInfo]);

  // Save to localStorage whenever selectedDisasterCoverages changes
  useEffect(() => {
    console.log('Coverage change detected, saving to storage...');
    if (form && preQuoteData) { // Only save if we have both form and preQuote data
      saveCoveragesToStorage(selectedDisasterCoverages);

      // Check if coverages have changed since last quote
      if (showPremiumSection && premiumFromBackend) {
        const hasChanged = checkCoveragesChanged(selectedDisasterCoverages, lastQuotedCoverages);
        setCoveragesChanged(hasChanged);
      }
    }
  }, [selectedDisasterCoverages, form, preQuoteData, showPremiumSection, premiumFromBackend, lastQuotedCoverages]);


  // Show loading or error state while data is being loaded
  if (!form || !weatherData || !disasterInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl bg-gradient-to-br from-black via-gray-900 to-black text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading quote data...</p>
          <p className="text-sm text-gray-400 mt-2">If this persists, please start a new quote</p>
        </div>
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
      console.log('Adding coverage:', coverage);
      setSelectedDisasterCoverages(newSelection);
    }
  };

  const handleRemoveCoverage = (coverage) => {
    const newSelection = selectedDisasterCoverages.filter(c => c !== coverage);
    console.log('Removing coverage:', coverage);
    setSelectedDisasterCoverages(newSelection);
  };

  const sendToBackend = async () => {
    try {
      console.log("sendToBackend started...");
      setLoadingQuote(true);

      // Step 1: Read localStorage
      const quickQuoteRaw = localStorage.getItem("quickQuoteData");
      const coveragesRaw = localStorage.getItem("selectedInsuranceCoverages");
      const preQuoteRaw = localStorage.getItem("preQuoteData");

      console.log("Raw quickQuoteData:", quickQuoteRaw);
      console.log("Raw selectedInsuranceCoverages:", coveragesRaw);
      console.log("Raw preQuoteData:", preQuoteRaw);

      // Step 2: Parse
      const quickQuoteData = JSON.parse(quickQuoteRaw);
      const coveragesData = JSON.parse(coveragesRaw);
      const preQuoteData = preQuoteRaw ? JSON.parse(preQuoteRaw) : null;

      // Step 3: Extract
      const address = quickQuoteData?.address?.trim();
      const sqFt = Number(quickQuoteData?.sqFt);

      // Get mandatory coverages based on preQuote responses
      const currentMandatory = getMandatoryCoverages(preQuoteData?.preQuoteData || preQuoteData);
      const disasterCoverages = coveragesData?.disasterCoverages || [];

      console.log("Extracted →", { address, sqFt, mandatoryCoverages: currentMandatory, disasterCoverages });

      // Step 4: Validate
      if (!address || isNaN(sqFt) || sqFt <= 0 || !Array.isArray(currentMandatory) || !Array.isArray(disasterCoverages)) {
        console.error("Validation failed before sending", { address, sqFt, mandatoryCoverages: currentMandatory, disasterCoverages });
        return false;
      }

      const payload = {
        address,
        sqFt,
        mandatoryCoverages: currentMandatory,
        disasterCoverages
      };

      console.log("Payload sending to backend:", payload);

      // Step 5: POST to backend
      const response = await axios.post("http://localhost:5000/api/sqft", payload);

      // Step 6: Handle response
      console.log("Backend response:", response.data);

      if (response.data?.premium) {
        setPremiumFromBackend(response.data.premium);
        setPremiumBreakdown(response.data.breakdown);
        localStorage.setItem('quotePremium', response.data.premium);
        localStorage.setItem('quoteBreakdown', JSON.stringify(response.data.breakdown));
        localStorage.setItem("quotedPreQuoteData", JSON.stringify(preQuoteData));

        // Update last quoted coverages and reset changed flag
        setLastQuotedCoverages([...selectedDisasterCoverages]);
        setCoveragesChanged(false);

        console.log("Premium stored in state + localStorage:", response.data);
        return true;
      } else {
        console.error("Unexpected backend response:", response.data);
        return false;
      }

    } catch (err) {
      console.error("Backend send failed:", err.message);
      console.error("🪵 Full error:", err);
      return false;
    } finally {
      setLoadingQuote(false);
      console.log("sendToBackend finished.");
    }
  };

  const handleBack = () => {
    navigate('/prequote')
  }

  const handleProceed = () => {
    // Save final selection before proceeding
    console.log('Proceeding with final coverages save...');
    saveCoveragesToStorage(selectedDisasterCoverages);

    const quoteData = {
      form,
      weatherData,
      disasterInfo,
      mandatoryCoverages,
      selectedDisasterCoverages,
      preQuoteData
    };

    navigate('/additionalcoverages', { state: quoteData });
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Essential': return 'from-green-500 to-emerald-600';
      case 'Disaster': return 'from-orange-500 to-red-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getCategoryBadge = (category) => {
    const colors = {
      'Essential': 'bg-green-500/20 text-green-300 border-green-500/30',
      'Disaster': 'bg-orange-500/20 text-orange-300 border-orange-500/30'
    };
    return colors[category] || colors['Essential'];
  };

  const CoverageCard = ({ coverage, isSelected, onAdd, onRemove, isMandatory = false }) => {
    const coverageInfo = coverageDetails[coverage];
    if (!coverageInfo) return null;

    const IconComponent = coverageInfo.icon;

    return (
      <div className={`group relative p-3 rounded-lg border transition-all duration-300 ${isSelected || isMandatory
        ? 'bg-blue-900/30 border-blue-500/50 shadow-lg shadow-blue-500/20'
        : 'bg-gray-800/50 border-gray-600/30 hover:bg-gray-700/50 hover:border-gray-500/50'
        }`}>

        {/* Header Row */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className={`p-1.5 rounded-md bg-gradient-to-r ${getCategoryColor(coverageInfo.category)}`}>
              <IconComponent className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="font-medium text-white text-sm">{coverage}</h4>
              <span className={`text-xs px-1.5 py-0.5 rounded-md border ${getCategoryBadge(coverageInfo.category)}`}>
                {isMandatory ? 'Mandatory' : coverageInfo.category}
              </span>
            </div>
          </div>

          {/* Status/Action Section */}
          <div className="flex items-center space-x-2">
            {isMandatory && (
              <CheckCircle className="w-4 h-4 text-green-400" />
            )}

            {isMandatory ? (
              <span className="text-xs px-2 py-1 rounded-md bg-green-600/20 text-green-300 border border-green-500/30">
                Included
              </span>
            ) : isSelected ? (
              <button
                onClick={() => onRemove(coverage)}
                className="flex items-center space-x-1 px-2 py-1 rounded-md bg-red-600/20 text-red-300 border border-red-500/30 hover:bg-red-600/30 transition-colors"
              >
                <X className="w-3 h-3" />
                <span className="text-xs">Remove</span>
              </button>
            ) : (
              <button
                onClick={() => onAdd(coverage)}
                className="flex items-center space-x-1 px-2 py-1 rounded-md bg-green-600/20 text-green-300 border border-green-500/30 hover:bg-green-600/30 transition-colors"
              >
                <Plus className="w-3 h-3" />
                <span className="text-xs">Add</span>
              </button>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-400 leading-relaxed">{coverageInfo.description}</p>
      </div>
    );
  };

  const CoverageItem = ({ coverage, isMandatory = false, isDisaster = false, isAdditional = false }) => (
    <div className={`flex items-center p-2 rounded-md border transition-colors ${isMandatory ? 'bg-green-900/20 border-green-500/30' :
      isDisaster ? 'bg-orange-900/20 border-orange-500/30' :
        'bg-blue-900/20 border-blue-500/30'
      }`}>
      <CheckCircle className={`w-4 h-4 mr-2 ${isMandatory ? 'text-green-400' :
        isDisaster ? 'text-orange-400' :
          'text-blue-400'
        }`} />
      <span className="text-white text-sm font-medium truncate">{coverage}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white px-6 py-10 mt-5">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 text-transparent bg-clip-text">
            Your Insurance Quote
          </h1>
          <p className="text-xl text-gray-300">Customize your protection based on your location's risk profile</p>
          <div className="w-24 h-1 mx-auto mt-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
        </div>

        {/* Property Information */}
        <div className="group relative">
          <div className="absolute -inset-0.5 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-emerald-500/20"></div>

          <div className="relative rounded-2xl p-4 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-gray-800/90 to-gray-900/90 border border-gray-600/50 hover:border-cyan-400/50">

            <div className="flex flex-col md:flex-row gap-6">

              {/* LEFT: Property Info */}
              <div className="flex-1">
                <div className="flex items-center mb-3">
                  <div className="p-2 rounded-xl mr-3 shadow-lg bg-gradient-to-r from-blue-500 to-green-500">
                    <Home className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Property Details</h3>
                </div>
                <div className="pl-10 space-y-2">
                  <div className="flex items-center text-gray-300">
                    <MapPin className="w-4 h-4 mr-2 text-blue-400" />
                    <span className="text-sm font-medium mr-2">Address:</span>
                    <span className="text-sm">{form.address}</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Home className="w-4 h-4 mr-2 text-green-400" />
                    <span className="text-sm font-medium mr-2">Size:</span>
                    <span className="text-sm">{Number(form.sqFt).toLocaleString()} sq ft</span>
                  </div>
                </div>
              </div>

              {/* RIGHT: Mandatory Coverages */}
              <div className="flex-1 border-l border-gray-700 pl-6">
                <div className="flex items-center mb-3">
                  <div className="p-2 rounded-xl mr-3 shadow-lg bg-gradient-to-r from-purple-500 to-blue-500">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Included Coverages</h3>
                </div>
                <div className="pl-10 space-y-2">
                  {mandatoryCoverages.map((coverage, index) => (
                    <div key={index} className="flex items-center text-gray-300">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                      <span className="text-sm">{coverage}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Coverage Selection */}
        <div className="rounded-2xl p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-600/50">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-3 text-white">Recommended Coverage Options</h2>
            <p className="text-gray-300">Based on your location's disaster history</p>
          </div>

          {/* Disaster Coverage Section */}
          {disasterCoverages.length > 0 && (
            <div className="mb-8">
              <h3 className="text-2xl font-semibold mb-4 text-white flex items-center">
                <AlertTriangle className="w-6 h-6 mr-2 text-orange-400" />
                Recommended for Your Area
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {disasterCoverages.map((coverage, idx) => (
                  <CoverageCard
                    key={idx}
                    coverage={coverage}
                    isSelected={selectedDisasterCoverages.includes(coverage)}
                    onAdd={handleAddCoverage}
                    onRemove={handleRemoveCoverage}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-center space-x-4 mb-8">
            <button
              onClick={handleBack}
              className="px-8 py-3 rounded-xl font-semibold text-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors"
            >
              ← Back
            </button>
            <button
              onClick={async () => {
                setLoadingQuote(true);
                const success = await sendToBackend();
                setLoadingQuote(false);
                if (success) setShowPremiumSection(true);
              }}
              disabled={loadingQuote}
              className={`px-8 py-3 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${loadingQuote ? 'opacity-60 cursor-not-allowed' : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/30'
                } flex items-center space-x-2`}
            >
              {loadingQuote && (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              )}
              <span>{loadingQuote ? 'Getting Quote...' : showPremiumSection && coveragesChanged ? 'Get New Quick Quote' : 'Get Quick Quote'}</span>
            </button>
          </div>

          {/* Premium Section */}
          {showPremiumSection && (
            <div className="rounded-2xl p-6 bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/30">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-semibold mb-2 text-white">Your Tentative Premium</h3>
                <div className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {premiumFromBackend ? `$${premiumFromBackend}` : '...'}
                </div>
                {coveragesChanged && (
                  <p className="mt-2 text-yellow-400 text-sm">
                    ⚠️ Coverage selection has changed. Get a new quote to update premium.
                  </p>
                )}
              </div>

              {premiumBreakdown && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-3 text-white">Premium Breakdown</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    {Object.entries(premiumBreakdown.base).map(([key, value]) => {
                      // Skip entries with undefined or 0 values and no meaningful key
                      if (value === 0 && !key) return null;

                      return (
                        <div key={key} className="flex justify-between p-2 bg-gray-800/50 rounded border-b border-gray-600">
                          <span className="text-gray-300">
                            {{
                              CoverageA: 'Coverage A: Dwelling Protection',
                              CoverageB: 'Coverage B: Other Structures',
                              CoverageC: 'Coverage C: Personal Property',
                              CoverageD: 'Coverage D: Loss of Use'
                            }[key] || key}
                          </span>
                          <span className="text-white font-medium">${value.toFixed(2)}</span>
                        </div>
                      );
                    })}

                    {premiumBreakdown.disasterCoverages &&
                      Object.entries(premiumBreakdown.disasterCoverages).map(([key, value]) => (
                        <div key={key} className="flex justify-between p-2 bg-orange-800/20 rounded border-b border-orange-600/30">
                          <span className="text-orange-200">{key}</span>
                          <span className="text-white font-medium">${value.toFixed(2)}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              <div className="text-center">
                <button
                  onClick={handleProceed}
                  disabled={coveragesChanged}
                  className={`px-12 py-4 rounded-xl font-bold text-xl transition-all duration-300 transform ${coveragesChanged
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/30 hover:scale-105'
                    }`}
                >
                  {coveragesChanged ? 'Get New Quote First' : 'Proceed'}
                </button>
                {coveragesChanged && (
                  <p className="mt-2 text-yellow-400 text-sm">
                    Please get a new quote before proceeding
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuickQuoteDisplay;

