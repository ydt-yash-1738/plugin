import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
    MapPin, Home, AlertTriangle, Thermometer, Shield, Star, Crown,
    Building, Calendar, Hammer, Layers, Warehouse, Users, Lock, DollarSign, ArrowRight, ArrowLeft
} from 'lucide-react';

const QuoteDisplay = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { selectedPlan, premium, form: quickQuoteForm, weatherData, disasterInfo, preQuoteForm } = location.state || {};

    const [packages, setPackages] = useState([]);
    const [uniqueDisasters, setUniqueDisasters] = useState([]);
    const [selectedPlanState, setSelectedPlanState] = useState(selectedPlan || 'Standard');

    useEffect(() => {
        if (!quickQuoteForm || !disasterInfo) return;

        const sqFt = Number(quickQuoteForm.sqFt);
        const baseRate = 0.5;
        const disasterMultiplier = 1 + (disasterInfo?.disasters?.length || 0) * 0.05;

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

        // Store complete data in localStorage
        const preQuoteData = {
            quickQuoteData: {
                form: quickQuoteForm,
                weatherData,
                disasterInfo
            },
            preQuoteData: preQuoteForm,
            selectedPlan: selectedPlanState,
            premium: plans.find(p => p.name === selectedPlanState)?.premium || premium,
            timestamp: new Date().toISOString()
        };

        localStorage.setItem('preQuoteData', JSON.stringify(preQuoteData));
    }, [quickQuoteForm, disasterInfo, preQuoteForm, selectedPlanState]);

    if (!quickQuoteForm || !weatherData || !disasterInfo || !preQuoteForm) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center text-white text-xl">
                <AlertTriangle className="w-6 h-6 mr-2 text-red-500" />
                Still Under Construction. Stay tuned.
            </div>
        );
    }

    const handleProceed = () => {
        const selectedPackage = packages.find(pkg => pkg.name === selectedPlanState);

        // Navigate to final quote or checkout
        navigate('/final-quote', {
            state: {
                quickQuoteData: { form: quickQuoteForm, weatherData, disasterInfo },
                preQuoteData: preQuoteForm,
                selectedPlan: selectedPackage.name,
                premium: selectedPackage.premium
            }
        });
    };

    const propertyDetails = [
        { icon: Building, label: 'Property Type', value: preQuoteForm.propertyType, color: 'from-blue-500 to-blue-600' },
        { icon: Calendar, label: 'Year Built', value: preQuoteForm.yearBuilt, color: 'from-green-500 to-emerald-600' },
        { icon: Hammer, label: 'Construction', value: preQuoteForm.construction, color: 'from-orange-500 to-red-600' },
        { icon: Layers, label: 'Stories', value: preQuoteForm.stories, color: 'from-purple-500 to-pink-600' },
        { icon: Warehouse, label: 'Roof Type', value: preQuoteForm.roofType, color: 'from-cyan-500 to-blue-600' },
        { icon: Users, label: 'Owner Occupied', value: preQuoteForm.ownerOccupied, color: 'from-indigo-500 to-purple-600' },
        { icon: Lock, label: 'Security System', value: preQuoteForm.securitySystem, color: 'from-red-500 to-pink-600' },
        { icon: DollarSign, label: 'Estimated Value', value: `$${Number(preQuoteForm.estimatedValue).toLocaleString()}`, color: 'from-green-500 to-teal-600' }
    ];

    return (
        // <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white px-6 py-10">
        //   <div className="max-w-7xl mx-auto space-y-12">

        //     {/* Header */}
        //     <div className="text-center">
        //       <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 text-transparent bg-clip-text mb-4">
        //         Complete Insurance Quote
        //       </h1>
        //       <p className="text-gray-300 text-xl">Your personalized home insurance quote with detailed property information</p>
        //     </div>

        //     {/* Quick Quote Summary */}
        //     <div className="grid md:grid-cols-2 gap-8">
        //       <div className="group relative">
        //         <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        //         <div className="relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 border border-gray-600/50 rounded-2xl p-6 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-blue-400/50">
        //           <div className="flex items-center mb-4">
        //             <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl mr-3 shadow-lg">
        //               <MapPin className="w-6 h-6 text-white" />
        //             </div>
        //             <h3 className="text-xl font-semibold text-white">Property Address</h3>
        //           </div>
        //           <p className="text-gray-300 text-lg leading-relaxed pl-11">{quickQuoteForm.address}</p>
        //         </div>
        //       </div>

        //       <div className="group relative">
        //         <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        //         <div className="relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 border border-gray-600/50 rounded-2xl p-6 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-green-400/50">
        //           <div className="flex items-center mb-4">
        //             <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl mr-3 shadow-lg">
        //               <Home className="w-6 h-6 text-white" />
        //             </div>
        //             <h3 className="text-xl font-semibold text-white">Square Footage</h3>
        //           </div>
        //           <p className="text-gray-300 text-lg leading-relaxed pl-11">{Number(quickQuoteForm.sqFt).toLocaleString()} sq ft</p>
        //         </div>
        //       </div>
        //     </div>

        //     {/* Property Details Grid */}
        //     <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 border border-gray-600/50 rounded-3xl p-8 backdrop-blur-sm shadow-2xl">
        //       <div className="text-center mb-8">
        //         <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-3">
        //           Property Details
        //         </h2>
        //         <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
        //       </div>

        //       <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        //         {propertyDetails.map((detail, i) => {
        //           const Icon = detail.icon;
        //           return (
        //             <div key={i} className="group relative">
        //               <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-500/20 to-gray-400/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        //               <div className="relative bg-gradient-to-br from-gray-700/50 to-gray-800/50 border border-gray-600/30 rounded-2xl p-6 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
        //                 <div className="flex items-center mb-3">
        //                   <div className={`p-2 bg-gradient-to-r ${detail.color} rounded-xl mr-3 shadow-lg`}>
        //                     <Icon className="w-5 h-5 text-white" />
        //                   </div>
        //                   <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">{detail.label}</h3>
        //                 </div>
        //                 <p className="text-white text-lg font-medium pl-10">{detail.value}</p>
        //               </div>
        //             </div>
        //           );
        //         })}
        //       </div>
        //     </div>

        //     {/* Selected Plan Summary */}
        //     <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-600/50 rounded-3xl p-8 backdrop-blur-sm shadow-2xl">
        //       <div className="text-center mb-8">
        //         <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-3">
        //           Selected Plan Summary
        //         </h2>
        //         <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
        //       </div>

        //       {packages.length > 0 && (
        //         <div className="max-w-2xl mx-auto">
        //           {(() => {
        //             const selectedPackage = packages.find(pkg => pkg.name === selectedPlanState);
        //             if (!selectedPackage) return null;

        //             const Icon = selectedPackage.icon;
        //             return (
        //               <div className="relative group">
        //                 <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 rounded-3xl blur opacity-60 animate-pulse"></div>
        //                 <div className="relative bg-gradient-to-br from-gray-800/95 to-gray-900/95 border-2 border-blue-400 rounded-3xl p-8 shadow-2xl shadow-blue-500/25 backdrop-blur-sm">
        //                   <div className="text-center">
        //                     <div className={`w-fit p-4 rounded-2xl mb-6 bg-gradient-to-r ${selectedPackage.color} mx-auto shadow-lg`}>
        //                       <Icon className="w-12 h-12 text-white drop-shadow-sm" />
        //                     </div>
        //                     <h3 className="text-3xl font-bold mb-2 text-white">{selectedPackage.name} Plan</h3>
        //                     <p className="text-gray-300 text-lg mb-6">{selectedPackage.description}</p>
        //                     <div className="text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
        //                       ${selectedPackage.premium}
        //                     </div>
        //                     <span className="text-gray-400 text-xl">/month</span>
        //                   </div>
        //                 </div>
        //               </div>
        //             );
        //           })()}
        //         </div>
        //       )}
        //     </div>

        //     {/* Action Buttons */}
        //     <div className="flex justify-center space-x-6">
        //       <button
        //         onClick={() => navigate(-1)}
        //         className="group relative px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 overflow-hidden"
        //       >
        //         <span className="relative flex items-center space-x-2">
        //           <ArrowLeft className="w-5 h-5" />
        //           <span>Back</span>
        //         </span>
        //       </button>

        //       <button
        //         onClick={handleProceed}
        //         className="group relative px-12 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 hover:from-blue-700 hover:via-purple-700 hover:to-blue-700 rounded-2xl font-bold text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 overflow-hidden"
        //       >
        //         <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out"></div>
        //         <span className="relative flex items-center space-x-2">
        //           <span>Get Final Quote</span>
        //           <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
        //         </span>
        //       </button>
        //     </div>
        //   </div>
        // </div>
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white px-6 py-10">
            {/* Animated Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
            </div>

            <div className="relative z-10 px-6 py-12">
                <div className="max-w-7xl mx-auto">

                    {/* Header Section - Redesigned */}
                    <div className="text-center mb-16 relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent blur-xl"></div>
                        <div className="relative">
                            <h1 className="text-7xl font-black bg-gradient-to-r from-blue-300 via-purple-400 to-pink-300 text-transparent bg-clip-text mb-6 tracking-tight">
                                Complete Insurance Quote
                            </h1>
                            <div className="w-32 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mx-auto rounded-full mb-6"></div>
                            <p className="text-gray-300 text-2xl font-light max-w-3xl mx-auto leading-relaxed">
                                Your personalized home insurance quote with detailed property information
                            </p>
                        </div>
                    </div>

                    {/* Hero Property Cards - Floating Design */}
                    <div className="grid lg:grid-cols-2 gap-8 mb-20">
                        <div className="group relative transform hover:-translate-y-2 transition-all duration-500">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 rounded-3xl blur-lg opacity-30 group-hover:opacity-60 transition-opacity duration-500"></div>
                            <div className="relative bg-gradient-to-br from-slate-800/80 via-slate-900/90 to-slate-800/80 backdrop-blur-xl border border-slate-600/30 rounded-3xl p-8 shadow-2xl">
                                <div className="flex items-start space-x-4 mb-6">
                                    <div className="p-4 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl shadow-xl">
                                        <MapPin className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-2xl font-bold text-white mb-2">Property Address</h3>
                                        <div className="w-16 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"></div>
                                    </div>
                                </div>
                                <p className="text-gray-200 text-xl leading-relaxed font-medium pl-16">{quickQuoteForm.address}</p>
                            </div>
                        </div>

                        <div className="group relative transform hover:-translate-y-2 transition-all duration-500">
                            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-600 rounded-3xl blur-lg opacity-30 group-hover:opacity-60 transition-opacity duration-500"></div>
                            <div className="relative bg-gradient-to-br from-slate-800/80 via-slate-900/90 to-slate-800/80 backdrop-blur-xl border border-slate-600/30 rounded-3xl p-8 shadow-2xl">
                                <div className="flex items-start space-x-4 mb-6">
                                    <div className="p-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-xl">
                                        <Home className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-2xl font-bold text-white mb-2">Square Footage</h3>
                                        <div className="w-16 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"></div>
                                    </div>
                                </div>
                                <p className="text-gray-200 text-xl leading-relaxed font-medium pl-16">{Number(quickQuoteForm.sqFt).toLocaleString()} sq ft</p>
                            </div>
                        </div>
                    </div>

                    {/* Property Details - Masonry Grid Layout */}
                    <div className="mb-20">
                        <div className="text-center mb-12">
                            <h2 className="text-5xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent mb-4">
                                Property Details
                            </h2>
                            <div className="flex items-center justify-center space-x-2">
                                <div className="w-8 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                                <div className="w-4 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                                <div className="w-8 h-1 bg-gradient-to-r from-pink-500 to-blue-500 rounded-full"></div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-max">
                            {propertyDetails.map((detail, i) => {
                                const Icon = detail.icon;
                                return (
                                    <div key={i} className="group relative transform hover:-translate-y-1 transition-all duration-300">
                                        <div className={`absolute -inset-0.5 bg-gradient-to-r ${detail.color} rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300`}></div>
                                        <div className="relative bg-gradient-to-br from-slate-800/70 via-slate-900/80 to-slate-800/70 backdrop-blur-sm border border-slate-600/40 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
                                            <div className="flex flex-col items-center text-center space-y-4">
                                                <div className={`p-3 bg-gradient-to-r ${detail.color} rounded-xl shadow-lg`}>
                                                    <Icon className="w-6 h-6 text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-2">{detail.label}</h3>
                                                    <p className="text-white text-lg font-semibold">{detail.value}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Selected Plan - Spotlight Design */}
                    <div className="mb-16">
                        <div className="text-center mb-12">
                            <h2 className="text-5xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent mb-4">
                                Selected Plan Summary
                            </h2>
                            <div className="flex items-center justify-center space-x-2">
                                <div className="w-8 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                                <div className="w-4 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                                <div className="w-8 h-1 bg-gradient-to-r from-pink-500 to-blue-500 rounded-full"></div>
                            </div>
                        </div>

                        {packages.length > 0 && (
                            <div className="max-w-2xl mx-auto">
                                {(() => {
                                    const selectedPackage = packages.find(pkg => pkg.name === selectedPlanState);
                                    if (!selectedPackage) return null;

                                    const Icon = selectedPackage.icon;
                                    return (
                                        <div className="relative group">
                                            <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 rounded-3xl blur-2xl opacity-40 animate-pulse group-hover:opacity-70 transition-opacity duration-500"></div>
                                            <div className="relative bg-gradient-to-br from-slate-800/90 via-slate-900/95 to-slate-800/90 backdrop-blur-xl border-2 border-blue-400/50 rounded-3xl shadow-2xl shadow-blue-500/25 overflow-hidden">
                                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-blue-500/5"></div>
                                                <div className="relative p-12 text-center">
                                                    <div className={`w-24 h-24 mx-auto p-6 rounded-3xl mb-8 bg-gradient-to-r ${selectedPackage.color} shadow-2xl shadow-blue-500/25`}>
                                                        <Icon className="w-12 h-12 text-white mx-auto" />
                                                    </div>
                                                    <h3 className="text-4xl font-black mb-4 text-white">{selectedPackage.name} Plan</h3>
                                                    <p className="text-gray-300 text-xl mb-8 max-w-md mx-auto leading-relaxed">{selectedPackage.description}</p>
                                                    <div className="space-y-2">
                                                        <div className="text-7xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                                                            ${selectedPackage.premium}
                                                        </div>
                                                        <span className="text-gray-400 text-2xl font-light">/month</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                        )}
                    </div>

                    {/* Action Buttons - Floating Design */}
                    <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8">
                        <button
                            onClick={() => navigate(-1)}
                            className="group relative px-10 py-5 bg-gradient-to-r from-slate-600 via-slate-700 to-slate-600 hover:from-slate-700 hover:via-slate-800 hover:to-slate-700 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-xl overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <span className="relative flex items-center space-x-3">
                                <ArrowLeft className="w-6 h-6 transform group-hover:-translate-x-1 transition-transform" />
                                <span>Back</span>
                            </span>
                        </button>

                        <button
                            onClick={handleProceed}
                            className="group relative px-16 py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 hover:from-blue-700 hover:via-purple-700 hover:to-blue-700 rounded-2xl font-bold text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 shadow-xl overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-blue-400/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out"></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <span className="relative flex items-center space-x-3 text-white">
                                <span>Get Final Quote</span>
                                <ArrowRight className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" />
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuoteDisplay;