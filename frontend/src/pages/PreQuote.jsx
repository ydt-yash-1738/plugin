import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const PreQuote = () => {
    const [form, setForm] = useState({
        propertyType: '',
        yearBuilt: '',
        construction: '',
        stories: '',
        roofType: '',
        ownerOccupied: '',
        securitySystem: '',
        estimatedValue: ''
    });
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const storedData = localStorage.getItem('preQuoteData');
        if (storedData) {
            try {
                const parsed = JSON.parse(storedData);
                if (parsed.preQuoteData) {
                    setForm(parsed.preQuoteData);
                }
            } catch (err) {
                console.error("Failed to parse preQuoteData:", err);
            }
        }
    }, []);

    const isFormComplete = Object.values(form).every(val => val.trim() !== "");

    const handleChange = e => {
        const { name, value } = e.target;
        const updatedForm = { ...form, [name]: value };
        setForm(updatedForm);
        localStorage.setItem('preQuoteData', JSON.stringify({ preQuoteData: updatedForm }));
    };

    const handleSubmit = e => {
        e.preventDefault();
        navigate('/quotedisplay', {
            state: {
                ...location.state, // includes form, weatherData, disasterInfo, selectedPlan, premium
                preQuoteForm: form
            }
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white px-6 py-10">
            <div className="max-w-3xl mx-auto bg-gray-900/60 backdrop-blur-md p-8 rounded-2xl border border-gray-800 shadow-md">
                <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    Let's Know More...
                </h1>
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Property Type */}
                    <div>
                        <label className="block mb-2 font-medium text-gray-300">Property Type</label>
                        <select
                            name="propertyType"
                            value={form.propertyType}
                            onChange={handleChange}
                            className="w-full bg-black border border-gray-700 p-3 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        >
                            <option value="">Select...</option>
                            <option value="Single Family">Single Family</option>
                            <option value="Condo">Condo</option>
                            <option value="Townhouse">Townhouse</option>
                            <option value="Mobile Home">Mobile Home</option>
                        </select>
                    </div>

                    {/* Year Built */}
                    <div>
                        <label className="block mb-2 font-medium text-gray-300">Year Built</label>
                        <input
                            type="number"
                            name="yearBuilt"
                            value={form.yearBuilt}
                            onChange={handleChange}
                            placeholder="e.g. 2005"
                            className="w-full bg-black border border-gray-700 p-3 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Construction Material */}
                    <div>
                        <label className="block mb-2 font-medium text-gray-300">Construction Material</label>
                        <select
                            name="construction"
                            value={form.construction}
                            onChange={handleChange}
                            className="w-full bg-black border border-gray-700 p-3 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        >
                            <option value="">Select...</option>
                            <option value="Wood">Wood</option>
                            <option value="Brick">Brick</option>
                            <option value="Concrete">Concrete</option>
                            <option value="Steel">Steel</option>
                            <option value="Mixed">Mixed</option>
                        </select>
                    </div>

                    {/* Number of Stories */}
                    <div>
                        <label className="block mb-2 font-medium text-gray-300">Number of Stories</label>
                        <input
                            type="number"
                            name="stories"
                            value={form.stories}
                            onChange={handleChange}
                            placeholder="e.g. 2"
                            className="w-full bg-black border border-gray-700 p-3 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Roof Type */}
                    <div>
                        <label className="block mb-2 font-medium text-gray-300">Roof Type</label>
                        <select
                            name="roofType"
                            value={form.roofType}
                            onChange={handleChange}
                            className="w-full bg-black border border-gray-700 p-3 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        >
                            <option value="">Select...</option>
                            <option value="Asphalt Shingle">Asphalt Shingle</option>
                            <option value="Metal">Metal</option>
                            <option value="Tile">Tile</option>
                            <option value="Slate">Slate</option>
                        </select>
                    </div>

                    {/* Owner Occupied */}
                    <div>
                        <label className="block mb-2 font-medium text-gray-300">Is the property owner-occupied?</label>
                        <select
                            name="ownerOccupied"
                            value={form.ownerOccupied}
                            onChange={handleChange}
                            className="w-full bg-black border border-gray-700 p-3 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        >
                            <option value="">Select...</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>

                    {/* Security System */}
                    <div>
                        <label className="block mb-2 font-medium text-gray-300">Security System Installed?</label>
                        <select
                            name="securitySystem"
                            value={form.securitySystem}
                            onChange={handleChange}
                            className="w-full bg-black border border-gray-700 p-3 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        >
                            <option value="">Select...</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>

                    {/* Estimated Value */}
                    <div>
                        <label className="block mb-2 font-medium text-gray-300">Estimated Property Value ($)</label>
                        <input
                            type="number"
                            name="estimatedValue"
                            value={form.estimatedValue}
                            onChange={handleChange}
                            placeholder="e.g. 350000"
                            className="w-full bg-black border border-gray-700 p-3 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Submit */}
                    <div className="flex items-center justify-center gap-4">
                        {/* Back Button */}
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="w-[30%] py-3 mt-6 rounded-lg font-bold text-white bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black transition-all duration-300"
                        >
                            ← Back
                        </button>

                        {/* Continue Button */}
                        <button
                            type="submit"
                            disabled={!isFormComplete}
                            className={`w-[30%] py-3 mt-6 rounded-lg font-bold text-white transition-all duration-300 ${isFormComplete
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                                : 'bg-gray-600 cursor-not-allowed'
                                }`}
                        >
                            Continue →
                        </button>

                    </div>
                </form>
            </div>
        </div>
    );
};

export default PreQuote;

// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { MapPin, Home, Shield, CheckCircle, Circle, Info, X, Plus, Sun, Moon } from 'lucide-react';

// const SelectedCoveragesDisplay = () => {
//   const navigate = useNavigate();
//   const [selectedCoverages, setSelectedCoverages] = useState([]);
//   const [limitOfIndemnity, setLimitOfIndemnity] = useState('100000'); // Default limit
//   const [isDarkMode, setIsDarkMode] = useState(true);
//   const [hoveredCoverage, setHoveredCoverage] = useState(null); // Define hoveredCoverage state

//   // Coverage details with descriptions
//   const coverageDetails = {
//    "Dwelling Protection": "Covers the structure of your home and attached structures",
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

//   // Function to load coverages from localStorage
//   const loadCoveragesFromStorage = () => {
//     try {
//       const stored = localStorage.getItem('selectedInsuranceCoverages');
//       if (stored) {
//         const data = JSON.parse(stored);
//         return data.allCoverages || [];
//       }
//     } catch (error) {
//       console.error('Error loading from localStorage:', error);
//     }
//     return [];
//   };

//   useEffect(() => {
//     const storedCoverages = loadCoveragesFromStorage();
//     setSelectedCoverages(storedCoverages);
//   }, []);

//   const handleProceed = () => {
//     // Proceed to the next step or page
//     navigate('/next-step', { state: { selectedCoverages, limitOfIndemnity } });
//   };

//   const toggleTheme = () => {
//     setIsDarkMode(!isDarkMode);
//   };

//   const CoverageItem = ({ coverage }) => (
//     <div className={`flex items-center justify-between p-3 rounded-lg transition-colors group ${isDarkMode
//       ? 'bg-gray-800/50 border border-gray-600/30'
//       : 'bg-blue-50/50 border border-blue-200/30'
//       }`}>
//       <div className="flex items-center space-x-3 flex-1">
//         <div className="flex items-center space-x-2">
//           {selectedCoverages.includes(coverage) ? (
//             <CheckCircle className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
//           ) : (
//             <Circle className={`w-5 h-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
//           )}
//           <span className={`${selectedCoverages.includes(coverage) ? (isDarkMode ? 'text-blue-200' : 'text-blue-700') : (isDarkMode ? 'text-gray-300' : 'text-gray-600')} font-medium`}>
//             {coverage}
//           </span>
//         </div>
//         <div className="relative">
//           <Info
//             className={`w-4 h-4 cursor-help transition-colors ${isDarkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-500 hover:text-blue-600'}`}
//             onMouseEnter={() => setHoveredCoverage(coverage)}
//             onMouseLeave={() => setHoveredCoverage(null)}
//           />
//           {hoveredCoverage === coverage && (
//             <div className={`absolute bottom-full left-0 mb-2 w-64 p-3 rounded-lg shadow-xl z-50 ${isDarkMode
//               ? 'bg-gray-900 border border-gray-600 text-gray-200'
//               : 'bg-white border border-gray-300 shadow-lg text-gray-700'
//               }`}>
//               <p className="text-sm">{coverageDetails[coverage]}</p>
//               <div className={`absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent ${isDarkMode ? 'border-t-gray-900' : 'border-t-white'}`}></div>
//             </div>
//           )}
//         </div>
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
//         <h1 className={`text-5xl font-bold mb-8 text-center ${isDarkMode
//           ? 'bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 text-transparent bg-clip-text'
//           : 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text'
//           }`}>
//           Your Selected Coverages
//         </h1>

//         {/* Coverage Selection Section */}
//         <div className={`rounded-3xl p-8 backdrop-blur-sm shadow-2xl ${isDarkMode
//           ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-600/50'
//           : 'bg-gradient-to-br from-white via-blue-50/50 to-purple-50/50 border border-blue-200/30'
//           }`}>
//           <h2 className={`text-4xl font-bold mb-3 ${isDarkMode
//             ? 'bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent'
//             : 'bg-gradient-to-r from-gray-800 via-blue-800 to-purple-800 bg-clip-text text-transparent'
//             }`}>
//             Coverage Details
//           </h2>

//           <div className="space-y-6 mb-8">
//             {/* Dwelling Protection with Limit of Indemnity Dropdown */}
//             <div className="flex items-center justify-between">
//               <CoverageItem coverage="Dwelling Protection" />
//               <div className="ml-4">
//                 <label className={`block text-lg font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
//                   Limit of Indemnity
//                 </label>
//                 <select
//                   value={limitOfIndemnity}
//                   onChange={(e) => setLimitOfIndemnity(e.target.value)}
//                   className={`block w-full p-2 rounded-lg ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
//                 >
//                   <option value="100000">$100,000</option>
//                   <option value="150000">$150,000</option>
//                   <option value="200000">$200,000</option>
//                   <option value="250000">$250,000</option>
//                   <option value="300000">$300,000</option>
//                   <option value="350000">$350,000</option>
//                   <option value="400000">$400,000</option>
//                   <option value="500000">$500,000</option>
//                 </select>
//               </div>
//             </div>

//             {selectedCoverages.map((coverage, idx) => (
//               coverage !== "Dwelling Protection" && <CoverageItem key={idx} coverage={coverage} />
//             ))}
//           </div>

//           {/* Proceed Button */}
//           <div className="flex justify-center">
//             <button
//               onClick={handleProceed}
//               className={`px-12 py-4 rounded-2xl font-bold text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl overflow-hidden ${isDarkMode
//                 ? 'bg-gradient-to-r from-purple-900 via-blue-900 to-purple-900 text-white hover:from-purple-800 hover:via-blue-800 hover:to-purple-800 hover:shadow-purple-500/25'
//                 : 'bg-gradient-to-r from-purple-100 via-purple-300 to-purple-100 text-purple-900 hover:from-purple-200 hover:via-purple-400 hover:to-purple-200 hover:shadow-purple-300/40'
//                 }`}
//             >
//               Proceed with Selected Coverages
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SelectedCoveragesDisplay;



