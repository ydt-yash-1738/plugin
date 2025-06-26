// import { useLocation, useNavigate } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import {
//   MapPin, Home, Thermometer, AlertTriangle, Shield, Star, Crown, CheckCircle, Circle
// } from 'lucide-react';

// const QuickQuoteDisplay = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { form, weatherData, disasterInfo } = location.state || {};

//   const [packages, setPackages] = useState([]);
//   const [uniqueDisasters, setUniqueDisasters] = useState([]);
//   const [selectedPlan, setSelectedPlan] = useState('Standard');

//   useEffect(() => {
//     if (!form || !disasterInfo) return;

//     const sqFt = Number(form.sqFt);
//     const baseRate = 0.5;
//     const disasterMultiplier = 1 + (disasterInfo?.disasters?.length || 0) * 0.05;

//     const disasterTypes = disasterInfo.disasters.map(d =>
//       (d.declarationTitle || d.incidentType || '').toLowerCase()
//     );

//     // Check for various disaster patterns
//     const hasFlood = disasterTypes.some(type =>
//       type.includes("flood") || type.includes("storm") || type.includes("debby") || type.includes("tropical")
//     );
//     const hasEarthquake = disasterTypes.some(type => type.includes("earthquake"));
//     const hasWind = disasterTypes.some(type =>
//       type.includes("hurricane") || type.includes("tornado") || type.includes("wind") || type.includes("storm")
//     );
//     const hasFire = disasterTypes.some(type => type.includes("fire"));

//     const economicCoverages = [
//       "Dwelling Protection",
//       "Other Structures",
//       "Personal Property",
//       "Loss of Use",
//       "Personal Liability",
//       "Medical Payments"
//     ];

//     const standardExtras = [
//       hasFlood && "Flood Coverage",
//       hasEarthquake && "Earthquake Protection",
//       hasWind && "Storm Damage Protection",
//       hasFire && "Wildfire Protection",
//       "Building Code Compliance",
//       "Sewer/Water Backup"
//     ].filter(Boolean);

//     const clubExtras = [
//       "HVAC / Appliance Breakdown",
//       "High-Value Items Coverage",
//       "Eco-Friendly Rebuild Options",
//       "Identity Theft Expenses",
//       "Umbrella Liability",
//       "Home-Based Business Liability",
//       "Mold & Fungus Remediation",
//       "Pest Infestation Coverage",
//       "Equipment Rental Reimbursement",
//       "HOA Loss Assessment",
//       "Boat / Dock Insurance",
//       "Vacation Home Flood Coverage",
//       "Green Energy Equipment",
//       "Enhanced Ordinance Limits",
//       "Extended Living Expenses"
//     ];

//     const plans = [
//       {
//         name: 'Economic',
//         premium: (sqFt * baseRate * 0.8 * disasterMultiplier).toFixed(2),
//         description: 'Budget friendly coverage plan.',
//         icon: Shield,
//         color: 'from-green-500 to-emerald-500',
//         coverages: economicCoverages
//       },
//       {
//         name: 'Standard',
//         premium: (sqFt * baseRate * 1.0 * disasterMultiplier).toFixed(2),
//         description: 'Economic + disaster-specific add-ons.',
//         icon: Star,
//         color: 'from-blue-500 to-cyan-500',
//         coverages: standardExtras
//       },
//       {
//         name: 'Club',
//         premium: (sqFt * baseRate * 1.3 * disasterMultiplier).toFixed(2),
//         description: 'Standard + premium extras for full protection.',
//         icon: Crown,
//         color: 'from-purple-500 to-pink-500',
//         coverages: clubExtras
//       }
//     ];

//     setPackages(plans);

//     const seen = new Set();
//     const filtered = disasterInfo.disasters.filter(d => {
//       const key = `${d.disasterNumber}-${d.declarationDate}`;
//       if (seen.has(key)) return false;
//       seen.add(key);
//       return true;
//     });
//     setUniqueDisasters(filtered);
//   }, [form, disasterInfo]);

//   if (!form || !weatherData || !disasterInfo) {
//     return (
//       <div className="min-h-screen bg-black flex items-center justify-center text-white text-xl">
//         <AlertTriangle className="w-6 h-6 mr-2 text-red-500" />
//         Missing quote data. Please start again.
//       </div>
//     );
//   }

//   const handlePlanProceed = () => {
//     const selectedPackage = packages.find(pkg => pkg.name === selectedPlan);

//     if (selectedPackage) {
//       // Update localStorage
//       const storedQuote = JSON.parse(localStorage.getItem('quickQuoteData'));
//       if (storedQuote) {
//         storedQuote.selectedPlan = selectedPackage.name;
//         storedQuote.premium = selectedPackage.premium;
//         localStorage.setItem('quickQuoteData', JSON.stringify(storedQuote));
//       }

//       // Navigate to next page
//       navigate('/prequote', {
//         state: {
//           selectedPlan: selectedPackage.name,
//           premium: selectedPackage.premium,
//           form,
//           weatherData,
//           disasterInfo
//         }
//       });
//     }
//   };


//   return (
//     <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white px-6 py-10">
//       <div className="max-w-6xl mx-auto space-y-12">
//         <div>
//           <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 text-transparent bg-clip-text mb-8 text-center">
//             Home Insurance Tentative Quote
//           </h1>
//           <div className="grid md:grid-cols-2 gap-8 text-gray-200 mb-8">
//             <div className="group relative">
//               <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//               <div className="relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 border border-gray-600/50 rounded-2xl p-6 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-blue-400/50">
//                 <div className="flex items-center mb-4">
//                   <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl mr-3 shadow-lg">
//                     <MapPin className="w-6 h-6 text-white" />
//                   </div>
//                   <h3 className="text-xl font-semibold text-white">Property Address</h3>
//                 </div>
//                 <p className="text-gray-300 text-lg leading-relaxed pl-11">{form.address}</p>
//               </div>
//             </div>

//             <div className="group relative">
//               <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//               <div className="relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 border border-gray-600/50 rounded-2xl p-6 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-green-400/50">
//                 <div className="flex items-center mb-4">
//                   <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl mr-3 shadow-lg">
//                     <Home className="w-6 h-6 text-white" />
//                   </div>
//                   <h3 className="text-xl font-semibold text-white">Square Footage</h3>
//                 </div>
//                 <p className="text-gray-300 text-lg leading-relaxed pl-11">{Number(form.sqFt).toLocaleString()} sq ft</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="group relative mb-8">
//           <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//           <div className="relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 border border-cyan-500/30 rounded-2xl p-6 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
//             <div className="flex items-center mb-4">
//               <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl mr-3 shadow-lg">
//                 <Thermometer className="w-7 h-7 text-white" />
//               </div>
//               <h2 className="text-2xl font-semibold text-white">Current Weather</h2>
//             </div>
//             <div className="pl-12">
//               <p className="text-gray-200 text-xl leading-relaxed">
//                 <span className="font-semibold text-cyan-300">{weatherData.location.name}</span> —
//                 <span className="font-bold text-2xl text-white mx-2">{weatherData.current.temp_f}°F</span>
//                 <span className="text-gray-300">{weatherData.current.condition.text}</span>
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="group relative">
//           <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//           <div className="relative bg-gradient-to-br from-red-900/20 via-gray-800/90 to-orange-900/20 border border-red-500/30 rounded-2xl p-6 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
//             <div className="flex items-center mb-6">
//               <div className="p-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl mr-3 shadow-lg animate-pulse">
//                 <AlertTriangle className="w-7 h-7 text-white" />
//               </div>
//               <h2 className="text-2xl font-semibold text-white">Disaster History in {disasterInfo.stateName}</h2>
//             </div>
//             <div className="pl-12">
//               {uniqueDisasters.length > 0 ? (
//                 <div className="space-y-3">
//                   {uniqueDisasters.map((d, i) => (
//                     <div key={i} className="flex items-start space-x-3 p-3 bg-red-900/10 border border-red-500/20 rounded-lg hover:bg-red-900/20 transition-colors">
//                       <div className="w-2 h-2 bg-gradient-to-r from-red-400 to-orange-400 rounded-full mt-2 flex-shrink-0"></div>
//                       <div className="flex-1">
//                         <span className="text-gray-200 text-lg leading-relaxed">
//                           <span className="font-semibold text-red-300">{d.declarationTitle || d.incidentType}</span>
//                           <span className="text-gray-400 mx-2">—</span>
//                           <span className="text-gray-300">{new Date(d.declarationDate).toLocaleDateString()}</span>
//                         </span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="flex items-center space-x-3 p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
//                   <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
//                   <p className="text-green-300 font-semibold text-lg">No recent disaster declarations.</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//         <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-600/50 rounded-3xl p-8 backdrop-blur-sm shadow-2xl">
//           <div className="text-center mb-10">
//             <h2 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-3">
//               Our Protection Plans
//             </h2>
//             <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
//           </div>

//           <div className="grid md:grid-cols-3 gap-8 mb-10">
//             {packages.map((pkg, i) => {
//               const Icon = pkg.icon;
//               const isSelected = selectedPlan === pkg.name;
//               const isStandard = pkg.name === "Standard";

//               return (
//                 <div
//                   key={i}
//                   className={`relative group transition-all duration-300 cursor-pointer transform hover:scale-105 hover:-translate-y-2 ${isSelected ? 'z-10' : 'hover:z-10'
//                     }`}
//                   onClick={() => setSelectedPlan(pkg.name)}
//                 >
//                   {/* Glow effect for selected plan */}
//                   {isSelected && (
//                     <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 rounded-3xl blur opacity-60 animate-pulse"></div>
//                   )}

//                   {/* Popular badge for Standard plan */}
//                   {isStandard && (
//                     <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
//                       <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
//                         Most Popular
//                       </div>
//                     </div>
//                   )}

//                   <div
//                     className={`relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 border-2 rounded-3xl p-8 shadow-xl backdrop-blur-sm flex flex-col h-full transition-all duration-300 ${isSelected
//                       ? 'border-blue-400 shadow-blue-500/25 shadow-2xl bg-gradient-to-br from-gray-800/95 to-gray-900/95'
//                       : 'border-gray-600/50 hover:border-gray-500/70 hover:shadow-xl'
//                       }`}
//                   >
//                     {/* Selection indicator */}
//                     <div className="absolute top-6 left-6">
//                       {isSelected ? (
//                         <div className="relative">
//                           <CheckCircle className="w-7 h-7 text-blue-400 drop-shadow-lg" />
//                           <div className="absolute inset-0 w-7 h-7 bg-blue-400/20 rounded-full animate-ping"></div>
//                         </div>
//                       ) : (
//                         <Circle className="w-7 h-7 text-gray-500 group-hover:text-gray-400 transition-colors" />
//                       )}
//                     </div>

//                     {/* Icon with enhanced styling */}
//                     <div className={`w-fit p-4 rounded-2xl mb-6 bg-gradient-to-r ${pkg.color} ml-auto shadow-lg transform transition-transform group-hover:scale-110`}>
//                       <Icon className="w-8 h-8 text-white drop-shadow-sm" />
//                     </div>

//                     {/* Plan name and description */}
//                     <div className="mb-6">
//                       <h3 className="text-2xl font-bold mb-2 text-white">{pkg.name}</h3>
//                       <p className="text-gray-300 text-base leading-relaxed">{pkg.description}</p>
//                     </div>

//                     {/* Coverage list with enhanced styling */}
//                     <div className="mb-8 flex-grow">
//                       <div className="space-y-3">
//                         {pkg.coverages.map((coverage, idx) => (
//                           <div key={idx} className="flex items-start space-x-3">
//                             <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mt-2 flex-shrink-0"></div>
//                             <span className="text-gray-300 text-base leading-relaxed">{coverage}</span>
//                           </div>
//                         ))}
//                       </div>
//                     </div>

//                     {/* Pricing with enhanced styling */}
//                     <div className="mt-auto pt-6 border-t border-gray-700/50">
//                       <div className="flex items-baseline justify-between">
//                         <div>
//                           <span className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
//                             ${pkg.premium}
//                           </span>
//                           <span className="text-gray-400 text-lg ml-2">/month</span>
//                         </div>
//                         {isSelected && (
//                           <div className="text-blue-400 text-sm font-semibold">
//                             ✓ Selected
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>

//           {/* Enhanced proceed button */}
//           <div className="flex justify-center">
//             <button
//               onClick={handlePlanProceed}
//               className="group relative px-12 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 hover:from-blue-700 hover:via-purple-700 hover:to-blue-700 rounded-2xl font-bold text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 overflow-hidden"
//             >
//               <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out"></div>
//               <span className="relative flex items-center space-x-2">
//                 <span>Proceed with {selectedPlan} Plan</span>
//                 <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                 </svg>
//               </span>
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default QuickQuoteDisplay;


// import { useLocation, useNavigate } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import {
//   MapPin, Home, Thermometer, AlertTriangle, Shield, Star, Crown, CheckCircle, Circle, Info, X, Plus
// } from 'lucide-react';

// const QuickQuoteDisplay = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { form, weatherData, disasterInfo } = location.state || {};

//   const [uniqueDisasters, setUniqueDisasters] = useState([]);
//   const [selectedOptionalCoverages, setSelectedOptionalCoverages] = useState([]);
//   const [hoveredCoverage, setHoveredCoverage] = useState(null);

//   // Coverage details with descriptions
//   const coverageDetails = {
//     "Dwelling Protection": "Covers the structure of your home and attached structures",
//     "Other Structures": "Protects detached structures like garages, sheds, and fences",
//     "Personal Property": "Covers your belongings inside the home",
//     "Loss of Use": "Pays for temporary living expenses if your home is uninhabitable",
//     "Personal Liability": "Protects you from lawsuits for accidents on your property",
//     "Medical Payments": "Covers medical expenses for guests injured on your property",
//     "Flood Coverage": "Protection against flood damage not covered by standard policies",
//     "Earthquake Protection": "Coverage for earthquake-related damages",
//     "Storm Damage Protection": "Enhanced protection against severe storms and wind damage",
//     "Wildfire Protection": "Specialized coverage for wildfire-related losses",
//     "Building Code Compliance": "Covers additional costs to meet updated building codes",
//     "Sewer/Water Backup": "Protection against sewer and water backup damage",
//     "HVAC / Appliance Breakdown": "Covers repair/replacement of heating, cooling, and appliances",
//     "High-Value Items Coverage": "Enhanced protection for jewelry, art, and collectibles",
//     "Eco-Friendly Rebuild Options": "Green building materials and energy-efficient upgrades",
//     "Identity Theft Expenses": "Covers costs related to identity theft recovery",
//     "Umbrella Liability": "Additional liability protection beyond standard limits",
//     "Home-Based Business Liability": "Protection for business activities conducted at home",
//     "Mold & Fungus Remediation": "Coverage for mold removal and related damages",
//     "Pest Infestation Coverage": "Protection against damage from pest infestations",
//     "Equipment Rental Reimbursement": "Pays for rental equipment during repairs",
//     "HOA Loss Assessment": "Covers special assessments from homeowners associations",
//     "Boat / Dock Insurance": "Protection for watercraft and dock structures",
//     "Vacation Home Flood Coverage": "Flood protection for secondary residences",
//     "Green Energy Equipment": "Coverage for solar panels and renewable energy systems",
//     "Enhanced Ordinance Limits": "Higher limits for building code upgrade costs",
//     "Extended Living Expenses": "Longer coverage period for temporary housing costs"
//   };

//   useEffect(() => {
//     if (!form || !disasterInfo) return;

//     const seen = new Set();
//     const filtered = disasterInfo.disasters.filter(d => {
//       const key = `${d.disasterNumber}-${d.declarationDate}`;
//       if (seen.has(key)) return false;
//       seen.add(key);
//       return true;
//     });
//     setUniqueDisasters(filtered);
//   }, [form, disasterInfo]);

//   if (!form || !weatherData || !disasterInfo) {
//     return (
//       <div className="min-h-screen bg-black flex items-center justify-center text-white text-xl">
//         <AlertTriangle className="w-6 h-6 mr-2 text-red-500" />
//         Missing quote data. Please start again.
//       </div>
//     );
//   }

//   // Mandatory coverages (from Standard plan)
//   const mandatoryCoverages = [
//     "Dwelling Protection",
//     "Other Structures", 
//     "Personal Property",
//     "Loss of Use",
//     "Personal Liability",
//     "Medical Payments"
//   ];

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
//     hasWind && "Storm Damage Protection",
//     hasFire && "Wildfire Protection",
//     "Building Code Compliance",
//     "Sewer/Water Backup"
//   ].filter(Boolean);

//   const additionalCoverages = [
//     "HVAC / Appliance Breakdown",
//     "High-Value Items Coverage",
//     "Eco-Friendly Rebuild Options",
//     "Identity Theft Expenses",
//     "Umbrella Liability",
//     "Home-Based Business Liability",
//     "Mold & Fungus Remediation",
//     "Pest Infestation Coverage",
//     "Equipment Rental Reimbursement",
//     "HOA Loss Assessment",
//     "Boat / Dock Insurance",
//     "Vacation Home Flood Coverage",
//     "Green Energy Equipment",
//     "Enhanced Ordinance Limits",
//     "Extended Living Expenses"
//   ];

//   const handleAddCoverage = (coverage) => {
//     if (!selectedOptionalCoverages.includes(coverage)) {
//       setSelectedOptionalCoverages([...selectedOptionalCoverages, coverage]);
//     }
//   };

//   const handleRemoveCoverage = (coverage) => {
//     setSelectedOptionalCoverages(selectedOptionalCoverages.filter(c => c !== coverage));
//   };

//   const calculatePremium = () => {
//     const sqFt = Number(form.sqFt);
//     const baseRate = 0.5;
//     const basePremium = sqFt * baseRate;
//     const disasterMultiplier = 1 + (disasterInfo?.disasters?.length || 0) * 0.05;
//     const optionalCoverageMultiplier = 1 + (selectedOptionalCoverages.length * 0.03);

//     return (basePremium * disasterMultiplier * optionalCoverageMultiplier).toFixed(2);
//   };

//   const handleProceed = () => {
//     const quoteData = {
//       form,
//       weatherData,
//       disasterInfo,
//       mandatoryCoverages,
//       selectedOptionalCoverages,
//       premium: calculatePremium()
//     };

//     navigate('/prequote', { state: quoteData });
//   };

//   const CoverageItem = ({ coverage, isSelected, onAdd, onRemove, showAddButton = false, showRemoveButton = false, isMandatory = false }) => (
//     <div className="flex items-center justify-between p-3 bg-gray-800/50 border border-gray-600/30 rounded-lg hover:bg-gray-700/50 transition-colors group">
//       <div className="flex items-center space-x-3 flex-1">
//         <div className="flex items-center space-x-2">
//           {isMandatory ? (
//             <CheckCircle className="w-5 h-5 text-green-400" />
//           ) : isSelected ? (
//             <CheckCircle className="w-5 h-5 text-blue-400" />
//           ) : (
//             <Circle className="w-5 h-5 text-gray-500" />
//           )}
//           <span className={`${isMandatory ? 'text-green-200' : isSelected ? 'text-blue-200' : 'text-gray-300'} font-medium`}>
//             {coverage}
//           </span>
//         </div>

//         <div className="relative">
//           <Info 
//             className="w-4 h-4 text-gray-400 hover:text-blue-400 cursor-help transition-colors"
//             onMouseEnter={() => setHoveredCoverage(coverage)}
//             onMouseLeave={() => setHoveredCoverage(null)}
//           />
//           {hoveredCoverage === coverage && (
//             <div className="absolute bottom-full left-0 mb-2 w-64 p-3 bg-gray-900 border border-gray-600 rounded-lg shadow-xl z-50">
//               <p className="text-sm text-gray-200">{coverageDetails[coverage]}</p>
//               <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="flex space-x-2">
//         {showAddButton && !isSelected && (
//           <button
//             onClick={() => onAdd(coverage)}
//             className="p-1 bg-green-600 hover:bg-green-700 rounded-full transition-colors"
//           >
//             <Plus className="w-4 h-4 text-white" />
//           </button>
//         )}
//         {showRemoveButton && isSelected && (
//           <button
//             onClick={() => onRemove(coverage)}
//             className="p-1 bg-red-600 hover:bg-red-700 rounded-full transition-colors"
//           >
//             <X className="w-4 h-4 text-white" />
//           </button>
//         )}
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white px-6 py-10">
//       <div className="max-w-6xl mx-auto space-y-12">
//         <div>
//           <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 text-transparent bg-clip-text mb-8 text-center">
//             Home Insurance Tentative Quote
//           </h1>
//           <div className="grid md:grid-cols-2 gap-8 text-gray-200 mb-8">
//             <div className="group relative">
//               <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//               <div className="relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 border border-gray-600/50 rounded-2xl p-6 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-blue-400/50">
//                 <div className="flex items-center mb-4">
//                   <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl mr-3 shadow-lg">
//                     <MapPin className="w-6 h-6 text-white" />
//                   </div>
//                   <h3 className="text-xl font-semibold text-white">Property Address</h3>
//                 </div>
//                 <p className="text-gray-300 text-lg leading-relaxed pl-11">{form.address}</p>
//               </div>
//             </div>

//             <div className="group relative">
//               <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//               <div className="relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 border border-gray-600/50 rounded-2xl p-6 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-green-400/50">
//                 <div className="flex items-center mb-4">
//                   <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl mr-3 shadow-lg">
//                     <Home className="w-6 h-6 text-white" />
//                   </div>
//                   <h3 className="text-xl font-semibold text-white">Square Footage</h3>
//                 </div>
//                 <p className="text-gray-300 text-lg leading-relaxed pl-11">{Number(form.sqFt).toLocaleString()} sq ft</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="group relative mb-8">
//           <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//           <div className="relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 border border-cyan-500/30 rounded-2xl p-6 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
//             <div className="flex items-center mb-4">
//               <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl mr-3 shadow-lg">
//                 <Thermometer className="w-7 h-7 text-white" />
//               </div>
//               <h2 className="text-2xl font-semibold text-white">Current Weather</h2>
//             </div>
//             <div className="pl-12">
//               <p className="text-gray-200 text-xl leading-relaxed">
//                 <span className="font-semibold text-cyan-300">{weatherData.location.name}</span> —
//                 <span className="font-bold text-2xl text-white mx-2">{weatherData.current.temp_f}°F</span>
//                 <span className="text-gray-300">{weatherData.current.condition.text}</span>
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="group relative">
//           <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//           <div className="relative bg-gradient-to-br from-red-900/20 via-gray-800/90 to-orange-900/20 border border-red-500/30 rounded-2xl p-6 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
//             <div className="flex items-center mb-6">
//               <div className="p-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl mr-3 shadow-lg animate-pulse">
//                 <AlertTriangle className="w-7 h-7 text-white" />
//               </div>
//               <h2 className="text-2xl font-semibold text-white">Disaster History in {disasterInfo.stateName}</h2>
//             </div>
//             <div className="pl-12">
//               {uniqueDisasters.length > 0 ? (
//                 <div className="space-y-3">
//                   {uniqueDisasters.map((d, i) => (
//                     <div key={i} className="flex items-start space-x-3 p-3 bg-red-900/10 border border-red-500/20 rounded-lg hover:bg-red-900/20 transition-colors">
//                       <div className="w-2 h-2 bg-gradient-to-r from-red-400 to-orange-400 rounded-full mt-2 flex-shrink-0"></div>
//                       <div className="flex-1">
//                         <span className="text-gray-200 text-lg leading-relaxed">
//                           <span className="font-semibold text-red-300">{d.declarationTitle || d.incidentType}</span>
//                           <span className="text-gray-400 mx-2">—</span>
//                           <span className="text-gray-300">{new Date(d.declarationDate).toLocaleDateString()}</span>
//                         </span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="flex items-center space-x-3 p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
//                   <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
//                   <p className="text-green-300 font-semibold text-lg">No recent disaster declarations.</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* New Coverage Selection Section */}
//         <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-600/50 rounded-3xl p-8 backdrop-blur-sm shadow-2xl">
//           <div className="text-center mb-10">
//             <h2 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-3">
//               Customize Your Coverage
//             </h2>
//             <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
//           </div>

//           <div className="grid lg:grid-cols-2 gap-8 mb-8">
//             {/* Selected Coverages */}
//             <div className="space-y-6">
//               <div className="bg-gradient-to-br from-green-900/20 to-gray-800/50 border border-green-500/30 rounded-2xl p-6">
//                 <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
//                   <Shield className="w-6 h-6 mr-3 text-green-400" />
//                   Your Selected Coverage
//                 </h3>

//                 {/* Mandatory Coverages */}
//                 <div className="mb-6">
//                   <h4 className="text-lg font-semibold text-green-300 mb-3">Mandatory Coverage (Included)</h4>
//                   <div className="space-y-2">
//                     {mandatoryCoverages.map((coverage, idx) => (
//                       <CoverageItem
//                         key={idx}
//                         coverage={coverage}
//                         isMandatory={true}
//                       />
//                     ))}
//                   </div>
//                 </div>

//                 {/* Selected Optional Coverages */}
//                 {selectedOptionalCoverages.length > 0 && (
//                   <div>
//                     <h4 className="text-lg font-semibold text-blue-300 mb-3">Additional Coverage</h4>
//                     <div className="space-y-2">
//                       {selectedOptionalCoverages.map((coverage, idx) => (
//                         <CoverageItem
//                           key={idx}
//                           coverage={coverage}
//                           isSelected={true}
//                           onRemove={handleRemoveCoverage}
//                           showRemoveButton={true}
//                         />
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {/* Premium Display */}
//               <div className="bg-gradient-to-br from-blue-900/20 to-gray-800/50 border border-blue-500/30 rounded-2xl p-6 text-center">
//                 <h3 className="text-xl font-semibold text-white mb-2">Monthly Premium</h3>
//                 <div className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
//                   ${calculatePremium()}
//                 </div>
//                 <p className="text-gray-400 mt-2">Based on {mandatoryCoverages.length + selectedOptionalCoverages.length} coverages</p>
//               </div>
//             </div>

//             {/* Available Coverages */}
//             <div className="space-y-6">
//               {/* Disaster-Specific Coverages */}
//               {disasterCoverages.length > 0 && (
//                 <div className="bg-gradient-to-br from-orange-900/20 to-gray-800/50 border border-orange-500/30 rounded-2xl p-6">
//                   <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
//                     <AlertTriangle className="w-6 h-6 mr-3 text-orange-400" />
//                     Recommended for Your Area
//                   </h3>
//                   <div className="space-y-2">
//                     {disasterCoverages.map((coverage, idx) => (
//                       <CoverageItem
//                         key={idx}
//                         coverage={coverage}
//                         isSelected={selectedOptionalCoverages.includes(coverage)}
//                         onAdd={handleAddCoverage}
//                         onRemove={handleRemoveCoverage}
//                         showAddButton={!selectedOptionalCoverages.includes(coverage)}
//                         showRemoveButton={selectedOptionalCoverages.includes(coverage)}
//                       />
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* Additional Coverages */}
//               <div className="bg-gradient-to-br from-purple-900/20 to-gray-800/50 border border-purple-500/30 rounded-2xl p-6">
//                 <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
//                   <Star className="w-6 h-6 mr-3 text-purple-400" />
//                   Additional Protection Options
//                 </h3>
//                 <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
//                   {additionalCoverages.map((coverage, idx) => (
//                     <CoverageItem
//                       key={idx}
//                       coverage={coverage}
//                       isSelected={selectedOptionalCoverages.includes(coverage)}
//                       onAdd={handleAddCoverage}
//                       onRemove={handleRemoveCoverage}
//                       showAddButton={!selectedOptionalCoverages.includes(coverage)}
//                       showRemoveButton={selectedOptionalCoverages.includes(coverage)}
//                     />
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Proceed Button */}
//           <div className="flex justify-center">
//             <button
//               onClick={handleProceed}
//               className="group relative px-12 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 hover:from-blue-700 hover:via-purple-700 hover:to-blue-700 rounded-2xl font-bold text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 overflow-hidden"
//             >
//               <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out"></div>
//               <span className="relative flex items-center space-x-2">
//                 <span>Proceed with Quote</span>
//                 <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                 </svg>
//               </span>
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default QuickQuoteDisplay;

// import { useLocation, useNavigate } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import {
//   MapPin, Home, Thermometer, AlertTriangle, Shield, Star, Crown, CheckCircle, Circle, Info, X, Plus, Sun, Moon
// } from 'lucide-react';

// const QuickQuoteDisplay = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { form, weatherData, disasterInfo } = location.state || {};

//   const [uniqueDisasters, setUniqueDisasters] = useState([]);
//   const [selectedOptionalCoverages, setSelectedOptionalCoverages] = useState([]);
//   const [hoveredCoverage, setHoveredCoverage] = useState(null);
//   const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
//   const [isDarkMode, setIsDarkMode] = useState(true);

//   // Coverage details with descriptions
//   const coverageDetails = {
//     "Dwelling Protection": "Covers the structure of your home and attached structures",
//     "Other Structures": "Protects detached structures like garages, sheds, and fences",
//     "Personal Property": "Covers your belongings inside the home",
//     "Loss of Use": "Pays for temporary living expenses if your home is uninhabitable",
//     "Personal Liability": "Protects you from lawsuits for accidents on your property",
//     "Medical Payments": "Covers medical expenses for guests injured on your property",
//     "Flood Coverage": "Protection against flood damage not covered by standard policies",
//     "Earthquake Protection": "Coverage for earthquake-related damages",
//     "Storm Damage Protection": "Enhanced protection against severe storms and wind damage",
//     "Wildfire Protection": "Specialized coverage for wildfire-related losses",
//     "Building Code Compliance": "Covers additional costs to meet updated building codes",
//     "Sewer/Water Backup": "Protection against sewer and water backup damage",
//     "HVAC / Appliance Breakdown": "Covers repair/replacement of heating, cooling, and appliances",
//     "High-Value Items Coverage": "Enhanced protection for jewelry, art, and collectibles",
//     "Eco-Friendly Rebuild Options": "Green building materials and energy-efficient upgrades",
//     "Identity Theft Expenses": "Covers costs related to identity theft recovery",
//     "Umbrella Liability": "Additional liability protection beyond standard limits",
//     "Home-Based Business Liability": "Protection for business activities conducted at home",
//     "Mold & Fungus Remediation": "Coverage for mold removal and related damages",
//     "Pest Infestation Coverage": "Protection against damage from pest infestations",
//     "Equipment Rental Reimbursement": "Pays for rental equipment during repairs",
//     "HOA Loss Assessment": "Covers special assessments from homeowners associations",
//     "Boat / Dock Insurance": "Protection for watercraft and dock structures",
//     "Vacation Home Flood Coverage": "Flood protection for secondary residences",
//     "Green Energy Equipment": "Coverage for solar panels and renewable energy systems",
//     "Enhanced Ordinance Limits": "Higher limits for building code upgrade costs",
//     "Extended Living Expenses": "Longer coverage period for temporary housing costs"
//   };

//   useEffect(() => {
//     if (!form || !disasterInfo) return;

//     const seen = new Set();
//     const filtered = disasterInfo.disasters.filter(d => {
//       const key = `${d.disasterNumber}-${d.declarationDate}`;
//       if (seen.has(key)) return false;
//       seen.add(key);
//       return true;
//     });
//     setUniqueDisasters(filtered);
//   }, [form, disasterInfo]);

//   if (!form || !weatherData || !disasterInfo) {
//     return (
//       <div className={`min-h-screen flex items-center justify-center text-xl ${isDarkMode ? 'bg-black text-white' : 'bg-white text-gray-900'
//         }`}>
//         <AlertTriangle className="w-6 h-6 mr-2 text-red-500" />
//         Missing quote data. Please start again.
//       </div>
//     );
//   }

//   // Mandatory coverages (from Standard plan)
//   const mandatoryCoverages = [
//     "Dwelling Protection",
//     "Other Structures",
//     "Personal Property",
//     "Loss of Use",
//     "Personal Liability",
//     "Medical Payments"
//   ];

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
//     hasWind && "Storm Damage Protection",
//     hasFire && "Wildfire Protection",
//     "Building Code Compliance",
//     "Sewer/Water Backup"
//   ].filter(Boolean);

//   const additionalCoverages = [
//     "HVAC / Appliance Breakdown",
//     "High-Value Items Coverage",
//     "Eco-Friendly Rebuild Options",
//     "Identity Theft Expenses",
//     "Umbrella Liability",
//     "Home-Based Business Liability",
//     "Mold & Fungus Remediation",
//     "Pest Infestation Coverage",
//     "Equipment Rental Reimbursement",
//     "HOA Loss Assessment",
//     "Boat / Dock Insurance",
//     "Vacation Home Flood Coverage",
//     "Green Energy Equipment",
//     "Enhanced Ordinance Limits",
//     "Extended Living Expenses"
//   ];

//   const handleAddCoverage = (coverage) => {
//     if (!selectedOptionalCoverages.includes(coverage)) {
//       setSelectedOptionalCoverages([...selectedOptionalCoverages, coverage]);
//     }
//   };

//   const handleRemoveCoverage = (coverage) => {
//     setSelectedOptionalCoverages(selectedOptionalCoverages.filter(c => c !== coverage));
//   };

//   const calculatePremium = () => {
//     const sqFt = Number(form.sqFt);
//     const baseRate = 0.5;
//     const basePremium = sqFt * baseRate;
//     const disasterMultiplier = 1 + (disasterInfo?.disasters?.length || 0) * 0.05;
//     const optionalCoverageMultiplier = 1 + (selectedOptionalCoverages.length * 0.03);

//     return (basePremium * disasterMultiplier * optionalCoverageMultiplier).toFixed(2);
//   };

//   const handleProceed = () => {
//     const quoteData = {
//       form,
//       weatherData,
//       disasterInfo,
//       mandatoryCoverages,
//       selectedOptionalCoverages,
//       premium: calculatePremium()
//     };

//     navigate('/prequote', { state: quoteData });
//   };

//   const toggleTheme = () => {
//     setIsDarkMode(!isDarkMode);
//   };

//   const CoverageItem = ({ coverage, isSelected, onAdd, onRemove, showAddButton = false, showRemoveButton = false, isMandatory = false }) => (
//     <div className={`flex items-center justify-between p-3 rounded-lg transition-colors group ${isDarkMode
//       ? 'bg-gray-800/50 border border-gray-600/30 hover:bg-gray-700/50'
//       : 'bg-blue-50/50 border border-blue-200/30 hover:bg-blue-100/50'
//       }`}>
//       <div className="flex items-center space-x-3 flex-1">
//         <div className="flex items-center space-x-2">
//           {isMandatory ? (
//             <CheckCircle className={`w-5 h-5 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
//           ) : isSelected ? (
//             <CheckCircle className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
//           ) : (
//             <Circle className={`w-5 h-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
//           )}
//           <span className={`${isMandatory
//             ? (isDarkMode ? 'text-green-200' : 'text-green-700')
//             : isSelected
//               ? (isDarkMode ? 'text-blue-200' : 'text-blue-700')
//               : (isDarkMode ? 'text-gray-300' : 'text-gray-600')
//             } font-medium`}>
//             {coverage}
//           </span>
//         </div>
//         <div className="relative">
//           <Info
//             className={`w-4 h-4 cursor-help transition-colors ${isDarkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-500 hover:text-blue-600'
//               }`}
//             onMouseEnter={() => setHoveredCoverage(coverage)}
//             onMouseLeave={() => setHoveredCoverage(null)}
//           />
//           {hoveredCoverage === coverage && (
//             <div className={`absolute bottom-full left-0 mb-2 w-64 p-3 rounded-lg shadow-xl z-50 ${isDarkMode
//               ? 'bg-gray-900 border border-gray-600 text-gray-200'
//               : 'bg-white border border-gray-300 shadow-lg text-gray-700'
//               }`}>
//               <p className="text-sm">{coverageDetails[coverage]}</p>
//               <div className={`absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent ${isDarkMode ? 'border-t-gray-900' : 'border-t-white'
//                 }`}></div>
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="flex space-x-2">
//         {showAddButton && !isSelected && (
//           <button
//             onClick={() => onAdd(coverage)}
//             className={`p-1 rounded-full transition-colors ${isDarkMode
//               ? 'bg-green-600 hover:bg-green-700'
//               : 'bg-green-500 hover:bg-green-600'
//               }`}
//           >
//             <Plus className="w-4 h-4 text-white" />
//           </button>
//         )}
//         {showRemoveButton && isSelected && (
//           <button
//             onClick={() => onRemove(coverage)}
//             className={`p-1 rounded-full transition-colors ${isDarkMode
//               ? 'bg-red-600 hover:bg-red-700'
//               : 'bg-red-500 hover:bg-red-600'
//               }`}
//           >
//             <X className="w-4 h-4 text-white" />
//           </button>
//         )}
//       </div>
//     </div>
//   );

//   return (
//     <div className={`min-h-screen px-6 py-10 transition-colors duration-300 ${isDarkMode
//       ? 'bg-gradient-to-br from-black via-gray-900 to-black text-white'
//       : 'bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-900'
//       }`}>
//       {/* Theme Toggle Button */}
//       <div className="fixed top-6 right-6 z-50">
//         <button
//           onClick={toggleTheme}
//           className={`p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 ${isDarkMode
//             ? 'bg-yellow-500 hover:bg-yellow-400 text-black'
//             : 'bg-gray-800 hover:bg-gray-700 text-white'
//             }`}
//         >
//           {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
//         </button>
//       </div>

//       <div className="max-w-6xl mx-auto space-y-12">
//         <div>
//           <h1 className={`text-5xl font-bold mb-8 text-center ${isDarkMode
//             ? 'bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 text-transparent bg-clip-text'
//             : 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text'
//             }`}>
//             Home Insurance Tentative Quote
//           </h1>
//           <div className="grid md:grid-cols-2 gap-8 mb-8">
//             <div className="group relative">
//               <div className={`absolute -inset-0.5 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isDarkMode
//                 ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20'
//                 : 'bg-gradient-to-r from-blue-300/30 to-purple-300/30'
//                 }`}></div>
//               <div className={`relative rounded-2xl p-6 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 ${isDarkMode
//                 ? 'bg-gradient-to-br from-gray-800/90 to-gray-900/90 border border-gray-600/50 hover:border-blue-400/50'
//                 : 'bg-gradient-to-br from-white/90 to-blue-50/90 border border-blue-200/50 hover:border-blue-400/70'
//                 }`}>
//                 <div className="flex items-center mb-4">
//                   <div className={`p-2 rounded-xl mr-3 shadow-lg ${isDarkMode
//                     ? 'bg-gradient-to-r from-blue-500 to-blue-600'
//                     : 'bg-gradient-to-r from-blue-600 to-blue-700'
//                     }`}>
//                     <MapPin className="w-6 h-6 text-white" />
//                   </div>
//                   <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Property Address</h3>
//                 </div>
//                 <p className={`text-lg leading-relaxed pl-11 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{form.address}</p>
//               </div>
//             </div>

//             <div className="group relative">
//               <div className={`absolute -inset-0.5 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isDarkMode
//                 ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20'
//                 : 'bg-gradient-to-r from-green-300/30 to-emerald-300/30'
//                 }`}></div>
//               <div className={`relative rounded-2xl p-6 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 ${isDarkMode
//                 ? 'bg-gradient-to-br from-gray-800/90 to-gray-900/90 border border-gray-600/50 hover:border-green-400/50'
//                 : 'bg-gradient-to-br from-white/90 to-green-50/90 border border-green-200/50 hover:border-green-400/70'
//                 }`}>
//                 <div className="flex items-center mb-4">
//                   <div className={`p-2 rounded-xl mr-3 shadow-lg ${isDarkMode
//                     ? 'bg-gradient-to-r from-green-500 to-emerald-600'
//                     : 'bg-gradient-to-r from-green-600 to-emerald-700'
//                     }`}>
//                     <Home className="w-6 h-6 text-white" />
//                   </div>
//                   <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Square Footage</h3>
//                 </div>
//                 <p className={`text-lg leading-relaxed pl-11 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{Number(form.sqFt).toLocaleString()} sq ft</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="group relative mb-8">
//           <div className={`absolute -inset-0.5 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isDarkMode
//             ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20'
//             : 'bg-gradient-to-r from-cyan-300/30 to-blue-300/30'
//             }`}></div>
//           <div className={`relative rounded-2xl p-6 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 ${isDarkMode
//             ? 'bg-gradient-to-br from-gray-800/90 to-gray-900/90 border border-cyan-500/30'
//             : 'bg-gradient-to-br from-white/90 to-cyan-50/90 border border-cyan-300/50'
//             }`}>
//             <div className="flex items-center mb-4">
//               <div className={`p-2 rounded-xl mr-3 shadow-lg ${isDarkMode
//                 ? 'bg-gradient-to-r from-cyan-500 to-blue-600'
//                 : 'bg-gradient-to-r from-cyan-600 to-blue-700'
//                 }`}>
//                 <Thermometer className="w-7 h-7 text-white" />
//               </div>
//               <h2 className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Current Weather</h2>
//             </div>
//             <div className="pl-12">
//               <p className={`text-xl leading-relaxed ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
//                 <span className={`font-semibold ${isDarkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>{weatherData.location.name}</span> —
//                 <span className={`font-bold text-2xl mx-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{weatherData.current.temp_f}°F</span>
//                 <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>{weatherData.current.condition.text}</span>
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="group relative">
//           <div className={`absolute -inset-0.5 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isDarkMode
//             ? 'bg-gradient-to-r from-red-500/20 to-orange-500/20'
//             : 'bg-gradient-to-r from-red-300/30 to-orange-300/30'
//             }`}></div>
//           <div className={`relative rounded-2xl p-6 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 ${isDarkMode
//             ? 'bg-gradient-to-br from-red-900/20 via-gray-800/90 to-orange-900/20 border border-red-500/30'
//             : 'bg-gradient-to-br from-red-50/90 via-white/90 to-orange-50/90 border border-red-300/50'
//             }`}>
//             <div className="flex items-center mb-6">
//               <div className={`p-2 rounded-xl mr-3 shadow-lg animate-pulse ${isDarkMode
//                 ? 'bg-gradient-to-r from-red-500 to-orange-500'
//                 : 'bg-gradient-to-r from-red-600 to-orange-600'
//                 }`}>
//                 <AlertTriangle className="w-7 h-7 text-white" />
//               </div>
//               <h2 className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Disaster History in {disasterInfo.stateName}</h2>
//             </div>
//             <div className="pl-12">
//               {uniqueDisasters.length > 0 ? (
//                 <div className="space-y-3">
//                   {uniqueDisasters.map((d, i) => (
//                     <div key={i} className={`flex items-start space-x-3 p-3 rounded-lg transition-colors ${isDarkMode
//                       ? 'bg-red-900/10 border border-red-500/20 hover:bg-red-900/20'
//                       : 'bg-red-50/50 border border-red-200/30 hover:bg-red-100/50'
//                       }`}>
//                       <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${isDarkMode
//                         ? 'bg-gradient-to-r from-red-400 to-orange-400'
//                         : 'bg-gradient-to-r from-red-500 to-orange-500'
//                         }`}></div>
//                       <div className="flex-1">
//                         <span className={`text-lg leading-relaxed ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
//                           <span className={`font-semibold ${isDarkMode ? 'text-red-300' : 'text-red-700'}`}>{d.declarationTitle || d.incidentType}</span>
//                           <span className={`mx-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>—</span>
//                           <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>{new Date(d.declarationDate).toLocaleDateString()}</span>
//                         </span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className={`flex items-center space-x-3 p-4 rounded-lg ${isDarkMode
//                   ? 'bg-green-900/20 border border-green-500/30'
//                   : 'bg-green-50/50 border border-green-300/30'
//                   }`}>
//                   <div className={`w-3 h-3 rounded-full animate-pulse ${isDarkMode ? 'bg-green-400' : 'bg-green-500'
//                     }`}></div>
//                   <p className={`font-semibold text-lg ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>No recent disaster declarations.</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* New Coverage Selection Section */}
//         <div className={`rounded-3xl p-8 backdrop-blur-sm shadow-2xl ${isDarkMode
//           ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-600/50'
//           : 'bg-gradient-to-br from-white via-blue-50/50 to-purple-50/50 border border-blue-200/30'
//           }`}>
//           <div className="text-center mb-10">
//             <h2 className={`text-4xl font-bold mb-3 ${isDarkMode
//               ? 'bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent'
//               : 'bg-gradient-to-r from-gray-800 via-blue-800 to-purple-800 bg-clip-text text-transparent'
//               }`}>
//               Customize Your Coverage
//             </h2>
//             <div className={`w-24 h-1 mx-auto rounded-full ${isDarkMode
//               ? 'bg-gradient-to-r from-blue-500 to-purple-500'
//               : 'bg-gradient-to-r from-blue-600 to-purple-600'
//               }`}></div>
//           </div>

//           <div className="grid lg:grid-cols-2 gap-8 mb-8">
//             {/* Selected Coverages */}
//             <div className="space-y-6">
//               <div className={`rounded-2xl p-6 ${isDarkMode
//                 ? 'bg-gradient-to-br from-green-900/20 to-gray-800/50 border border-green-500/30'
//                 : 'bg-gradient-to-br from-green-50/80 to-white/80 border border-green-300/50'
//                 }`}>
//                 <h3 className={`text-2xl font-bold mb-4 flex items-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
//                   <Shield className={`w-6 h-6 mr-3 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
//                   Your Selected Coverage
//                 </h3>

//                 {/* Mandatory Coverages */}
//                 <div className="mb-6">
//                   <h4 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>Mandatory Coverage (Included)</h4>
//                   <div className="space-y-2">
//                     {mandatoryCoverages.map((coverage, idx) => (
//                       <CoverageItem
//                         key={idx}
//                         coverage={coverage}
//                         isMandatory={true}
//                       />
//                     ))}
//                   </div>
//                 </div>

//                 {/* Selected Optional Coverages */}
//                 {selectedOptionalCoverages.length > 0 && (
//                   <div>
//                     <h4 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>Additional Coverage</h4>
//                     <div className="space-y-2">
//                       {selectedOptionalCoverages.map((coverage, idx) => (
//                         <CoverageItem
//                           key={idx}
//                           coverage={coverage}
//                           isSelected={true}
//                           onRemove={handleRemoveCoverage}
//                           showRemoveButton={true}
//                         />
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {/* Premium Display */}
//               <div className={`rounded-2xl p-6 text-center ${isDarkMode
//                 ? 'bg-gradient-to-br from-blue-900/20 to-gray-800/50 border border-blue-500/30'
//                 : 'bg-gradient-to-br from-blue-50/80 to-white/80 border border-blue-300/50'
//                 }`}>
//                 <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Monthly Premium</h3>
//                 <div className={`text-5xl font-bold ${isDarkMode
//                   ? 'bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'
//                   : 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'
//                   }`}>
//                   ${calculatePremium()}
//                 </div>
//                 <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Based on {mandatoryCoverages.length + selectedOptionalCoverages.length} coverages</p>
//               </div>
//             </div>

//             {/* Available Coverages */}
//             <div className="space-y-6">
//               {/* Disaster-Specific Coverages */}
//               {disasterCoverages.length > 0 && (
//                 <div className={`rounded-2xl p-6 ${isDarkMode
//                   ? 'bg-gradient-to-br from-orange-900/20 to-gray-800/50 border border-orange-500/30'
//                   : 'bg-gradient-to-br from-orange-50/80 to-white/80 border border-orange-300/50'
//                   }`}>
//                   <h3 className={`text-2xl font-bold mb-4 flex items-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
//                     <AlertTriangle className={`w-6 h-6 mr-3 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`} />
//                     Recommended for Your Area
//                   </h3>
//                   <div className="space-y-2">
//                     {disasterCoverages.map((coverage, idx) => (
//                       <CoverageItem
//                         key={idx}
//                         coverage={coverage}
//                         isSelected={selectedOptionalCoverages.includes(coverage)}
//                         onAdd={handleAddCoverage}
//                         onRemove={handleRemoveCoverage}
//                         showAddButton={!selectedOptionalCoverages.includes(coverage)}
//                         showRemoveButton={selectedOptionalCoverages.includes(coverage)}
//                       />
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* Additional Coverages */}
//               <div className={`rounded-2xl p-6 ${isDarkMode
//                 ? 'bg-gradient-to-br from-purple-900/20 to-gray-800/50 border border-purple-500/30 rounded-2xl p-6'
//                 : 'bg-gradient-to-br from-purple-50/80 to-white/50 border border-purple-300/50 rounded-2xl p-6'
//                 }`}>                <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
//                   <Star className="w-6 h-6 mr-3 text-purple-400" />
//                   Additional Protection Options
//                 </h3>
//                 <div className="space-y-2 max-h-96 overflow-y-auto pr-2 relative z-0">
//                   {additionalCoverages.map((coverage, idx) => (
//                     <CoverageItem
//                       key={idx}
//                       coverage={coverage}
//                       isSelected={selectedOptionalCoverages.includes(coverage)}
//                       onAdd={handleAddCoverage}
//                       onRemove={handleRemoveCoverage}
//                       showAddButton={!selectedOptionalCoverages.includes(coverage)}
//                       showRemoveButton={selectedOptionalCoverages.includes(coverage)}
//                     />
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Proceed Button */}
//           <div className="flex justify-center">
//             <button
//               onClick={handleProceed}
//               className={`group relative px-12 py-4 rounded-2xl font-bold text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl overflow-hidden ${isDarkMode
//                   ? 'bg-gradient-to-r from-purple-900 via-blue-900 to-purple-900 text-white hover:from-purple-800 hover:via-blue-800 hover:to-purple-800 hover:shadow-purple-500/25'
//                   : 'bg-gradient-to-r from-purple-100 via-purple-300 to-purple-100 text-purple-900 hover:from-purple-200 hover:via-purple-400 hover:to-purple-200 hover:shadow-purple-300/40'
//                 }`}
//             >
//               <div className={`absolute inset-0 bg-gradient-to-r from-purple-400/20 to-purple-600/20 ${isDarkMode ? 'opacity-10' : 'opacity-20'
//                 } translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out`}></div>
//               <span className="relative flex items-center space-x-2 z-10">
//                 <span>Proceed with Quote</span>
//                 <svg
//                   className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M9 5l7 7-7 7"
//                   />
//                 </svg>
//               </span>
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default QuickQuoteDisplay;




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