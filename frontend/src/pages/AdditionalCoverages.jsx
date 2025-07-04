// AdditionalCoverage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield, Plus, X, CheckCircle, Circle, Info, Star, Crown, AlertTriangle,
  Home, DollarSign, Zap, Umbrella, Wrench, Car, Heart, Lock, Building,
  Leaf, Bug, Waves, Flame
} from 'lucide-react';

const AdditionalCoverage = () => {
  const mandatoryCoverages = [
    "Coverage A: Dwelling Protection",
    "Coverage C: Personal Property"
  ];

  const [selectedDisasterCoverages, setSelectedDisasterCoverages] = useState([]);
  useEffect(() => {
    const data = localStorage.getItem('selectedInsuranceCoverages');
    if (data) {
      try {
        const parsed = JSON.parse(data);
        setSelectedDisasterCoverages(parsed.disasterCoverages || []);
      } catch (err) {
        console.error("Failed to parse disaster coverages from localStorage:", err);
      }
    }
  }, []);


  const additionalCoverages = [
    { name: "Personal Liability", icon: Shield, description: "Protects you from lawsuits for accidents on your property", recommended: true, category: "Essential" },
    { name: "Medical Payments", icon: Heart, description: "Covers medical expenses for guests injured on your property", recommended: true, category: "Essential" },
    { name: "Building Code Compliance", icon: Building, description: "Covers additional costs to meet updated building codes", recommended: true, category: "Essential" },
    { name: "Sewer/Water Backup", icon: Waves, description: "Protection against sewer and water backup damage", recommended: true, category: "Popular" },
    { name: "HVAC / Appliance Breakdown", icon: Wrench, description: "Covers repair/replacement of heating, cooling, and appliances", recommended: true, category: "Popular" },
    { name: "High-Value Items Coverage", icon: Crown, description: "Enhanced protection for jewelry, art, and collectibles", recommended: false, category: "Premium" },
    { name: "Eco-Friendly Rebuild Options", icon: Leaf, description: "Green building materials and energy-efficient upgrades", recommended: false, category: "Premium" },
    { name: "Identity Theft Expenses", icon: Lock, description: "Covers costs related to identity theft recovery", recommended: false, category: "Premium" },
    { name: "Umbrella Liability", icon: Umbrella, description: "Additional liability protection beyond standard limits", recommended: false, category: "Premium" },
    { name: "Home-Based Business Liability", icon: Building, description: "Protection for business activities conducted at home", recommended: false, category: "Premium" },
    { name: "Mold & Fungus Remediation", icon: Bug, description: "Coverage for mold removal and related damages", recommended: false, category: "Optional" },
    { name: "Equipment Rental Reimbursement", icon: Car, description: "Pays for rental equipment during repairs", recommended: false, category: "Optional" }
  ];

  const [selectedAdditionalCoverages, setSelectedAdditionalCoverages] = useState([]);
  const navigate = useNavigate();

  const handleAddCoverage = (coverage) => {
    if (!selectedAdditionalCoverages.includes(coverage.name)) {
      setSelectedAdditionalCoverages([...selectedAdditionalCoverages, coverage.name]);
    }
  };

  const handleRemoveCoverage = (coverageName) => {
    setSelectedAdditionalCoverages(selectedAdditionalCoverages.filter(c => c !== coverageName));
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Essential': return 'from-green-500 to-emerald-600';
      case 'Popular': return 'from-blue-500 to-blue-500';
      case 'Premium': return 'from-purple-500 to-purple-500';
      case 'Optional': return 'from-gray-500 to-gray-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getCategoryBadge = (category) => {
    const colors = {
      'Essential': 'bg-green-500/20 text-green-300 border-green-500/30',
      'Popular': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      'Premium': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      'Optional': 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    };
    return colors[category] || colors['Optional'];
  };

  const handlePrevious = () => {
    navigate('/quickquotedisplay')
  }

  const handleProceed = () => {
    navigate('/coveragelimits')
  }

  const CoverageCard = ({ coverage, isSelected, onAdd, onRemove }) => {
    const IconComponent = coverage.icon;
    return (
      // <div className={`group relative p-4 rounded-xl border transition-all duration-300 ${isSelected
      //     ? 'bg-blue-900/30 border-blue-500/50 shadow-lg shadow-blue-500/20'
      //     : 'bg-gray-800/50 border-gray-600/30 hover:bg-gray-700/50 hover:border-gray-500/50'
      //   }`}>
      //   <div className="flex items-start justify-between mb-3">
      //     <div className="flex items-center space-x-3">
      //       <div className={`p-2 rounded-lg bg-gradient-to-r ${getCategoryColor(coverage.category)}`}>
      //         <IconComponent className="w-5 h-5 text-white" />
      //       </div>
      //       <div>
      //         <h4 className="font-semibold text-white">{coverage.name}</h4>
      //         <span className={`text-xs px-2 py-1 rounded-full border ${getCategoryBadge(coverage.category)}`}>
      //           {coverage.category}
      //         </span>
      //       </div>
      //     </div>
      //     {coverage.recommended && (
      //       <Star className="w-4 h-4 text-yellow-400 fill-current" />
      //     )}
      //   </div>

      //   <p className="text-sm text-gray-300 mb-4">{coverage.description}</p>

      //   <div className="flex justify-end">
      //     {isSelected ? (
      //       <button
      //         onClick={() => onRemove(coverage.name)}
      //         className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-red-600/20 text-red-300 border border-red-500/30 hover:bg-red-600/30 transition-colors"
      //       >
      //         <X className="w-4 h-4" />
      //         <span className="text-sm">Remove</span>
      //       </button>
      //     ) : (
      //       <button
      //         onClick={() => onAdd(coverage)}
      //         className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-green-600/20 text-green-300 border border-green-500/30 hover:bg-green-600/30 transition-colors"
      //       >
      //         <Plus className="w-4 h-4" />
      //         <span className="text-sm">Add</span>
      //       </button>
      //     )}
      //   </div>
      // </div>
      <div className={`group relative p-3 rounded-lg border transition-all duration-300 ${isSelected
  ? 'bg-blue-900/30 border-blue-500/50 shadow-lg shadow-blue-500/20'
  : 'bg-gray-800/50 border-gray-600/30 hover:bg-gray-700/50 hover:border-gray-500/50'
}`}>
  {/* Header Row */}
  <div className="flex items-center justify-between mb-2">
    <div className="flex items-center space-x-2">
      <div className={`p-1.5 rounded-md bg-gradient-to-r ${getCategoryColor(coverage.category)}`}>
        <IconComponent className="w-4 h-4 text-white" />
      </div>
      <div>
        <h4 className="font-medium text-white text-sm">{coverage.name}</h4>
        <span className={`text-xs px-1.5 py-0.5 rounded-md border ${getCategoryBadge(coverage.category)}`}>
          {coverage.category}
        </span>
      </div>
    </div>
  </div>

  {/* Description */}
  <p className="text-xs text-gray-400 leading-relaxed mb-3">{coverage.description}</p>

  {/* Action Buttons */}
  <div className="flex justify-end">
    {isSelected ? (
      <button
        onClick={() => onRemove(coverage.name)}
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

    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white px-6 py-10 mt-5">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 text-transparent bg-clip-text">
            Enhance Your Protection
          </h1>
          <p className="text-xl text-gray-300">Customize your coverage with these additional protections</p>
          <div className="w-24 h-1 mx-auto mt-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
        </div>

        {/* <div className="grid lg:grid-cols-3 gap-6">
          <div className="rounded-2xl p-6 bg-gradient-to-br from-green-900/20 to-gray-800/50 border border-green-500/30">
            <div className="flex items-center mb-4">
              <Shield className="w-6 h-6 mr-3 text-green-400" />
              <h3 className="text-xl font-semibold text-white">Mandatory Coverages</h3>
            </div>
            <div className="space-y-2">
              {mandatoryCoverages.map((c, i) => <CoverageItem key={i} coverage={c} isMandatory />)}
            </div>
          </div>

          <div className="rounded-2xl p-6 bg-gradient-to-br from-orange-900/20 to-gray-800/50 border border-orange-500/30">
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-6 h-6 mr-3 text-orange-400" />
              <h3 className="text-xl font-semibold text-white">Selected Disaster Coverages</h3>
            </div>
            <div className="space-y-2">
              {selectedDisasterCoverages.map((c, i) => <CoverageItem key={i} coverage={c} isDisaster />)}
            </div>
          </div>

          <div className="rounded-2xl p-6 bg-gradient-to-br from-blue-900/20 to-gray-800/50 border border-blue-500/30">
            <div className="flex items-center mb-4">
              <Plus className="w-6 h-6 mr-3 text-blue-400" />
              <h3 className="text-xl font-semibold text-white">Additional Selected</h3>
            </div>
            <div className="h-48 overflow-y-auto pr-2">
              <div className="space-y-2">
                {selectedAdditionalCoverages.length > 0 ? (
                  selectedAdditionalCoverages.map((c, i) => <CoverageItem key={i} coverage={c} isAdditional />)
                ) : (
                  <p className="text-gray-400 text-center py-4">No additional coverage selected</p>
                )}
              </div>
            </div>
          </div>
        </div> */}

        <div className="rounded-2xl p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-600/50">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-3 text-white">Additional Coverage Options</h2>
            <p className="text-gray-300">Enhance your protection with these recommended coverages</p>
          </div>

          {['Essential', 'Popular', 'Premium', 'Optional'].map(category => {
            const categoryCoverages = additionalCoverages.filter(c => c.category === category);
            if (categoryCoverages.length === 0) return null;

            return (
              <div key={category} className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-white flex items-center">
                  {category === 'Essential' && <Star className="w-6 h-6 mr-2 text-yellow-400" />}
                  {category === 'Popular' && <Zap className="w-6 h-6 mr-2 text-blue-400" />}
                  {category === 'Premium' && <Crown className="w-6 h-6 mr-2 text-purple-400" />}
                  {category === 'Optional' && <Circle className="w-6 h-6 mr-2 text-gray-400" />}
                  {category} Coverage
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryCoverages.map((coverage, idx) => (
                    <CoverageCard
                      key={idx}
                      coverage={coverage}
                      isSelected={selectedAdditionalCoverages.includes(coverage.name)}
                      onAdd={handleAddCoverage}
                      onRemove={handleRemoveCoverage}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center space-x-4">
          <button className="px-8 py-3 rounded-xl font-semibold text-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors" onClick={handlePrevious}>
            Previous
          </button>
          <button className="px-8 py-3 rounded-xl font-semibold text-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 transform hover:scale-105" onClick={handleProceed}>
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdditionalCoverage;
