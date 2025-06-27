import React, { useState } from 'react';
import { 
  Shield, 
  Plus, 
  X, 
  CheckCircle, 
  Circle, 
  Info, 
  Star, 
  Crown, 
  AlertTriangle,
  Home,
  DollarSign,
  Zap,
  Umbrella,
  Wrench,
  Car,
  Heart,
  Lock,
  Building,
  Leaf,
  Bug,
  Waves,
  Flame
} from 'lucide-react';

const AdditionalCoverage = () => {
  // Mock data for mandatory coverages
  const mandatoryCoverages = [
    "Coverage A: Dwelling Protection",
    "Coverage B: Other Structures", 
    "Coverage C: Personal Property",
    "Coverage D: Loss of Use"
  ];

  // Mock data for selected disaster coverages
  const selectedDisasterCoverages = [
    "Flood Coverage",
    "Wind/Hailstorm Protection",
    "Wildfire Protection"
  ];

  // Additional recommended coverages
  const additionalCoverages = [
    {
      name: "Personal Liability",
      icon: Shield,
      description: "Protects you from lawsuits for accidents on your property",
      recommended: true,
      category: "Essential"
    },
    {
      name: "Medical Payments",
      icon: Heart,
      description: "Covers medical expenses for guests injured on your property",
      recommended: true,
      category: "Essential"
    },
    {
      name: "Building Code Compliance",
      icon: Building,
      description: "Covers additional costs to meet updated building codes",
      recommended: true,
      category: "Essential"
    },
    {
      name: "Sewer/Water Backup",
      icon: Waves,
      description: "Protection against sewer and water backup damage",
      recommended: true,
      category: "Popular"
    },
    {
      name: "HVAC / Appliance Breakdown",
      icon: Wrench,
      description: "Covers repair/replacement of heating, cooling, and appliances",
      recommended: true,
      category: "Popular"
    },
    {
      name: "High-Value Items Coverage",
      icon: Crown,
      description: "Enhanced protection for jewelry, art, and collectibles",
      recommended: false,
      category: "Premium"
    },
    {
      name: "Eco-Friendly Rebuild Options",
      icon: Leaf,
      description: "Green building materials and energy-efficient upgrades",
      recommended: false,
      category: "Premium"
    },
    {
      name: "Identity Theft Expenses",
      icon: Lock,
      description: "Covers costs related to identity theft recovery",
      recommended: false,
      category: "Premium"
    },
    {
      name: "Umbrella Liability",
      icon: Umbrella,
      description: "Additional liability protection beyond standard limits",
      recommended: false,
      category: "Premium"
    },
    {
      name: "Home-Based Business Liability",
      icon: Building,
      description: "Protection for business activities conducted at home",
      recommended: false,
      category: "Premium"
    },
    {
      name: "Mold & Fungus Remediation",
      icon: Bug,
      description: "Coverage for mold removal and related damages",
      recommended: false,
      category: "Optional"
    },
    {
      name: "Equipment Rental Reimbursement",
      icon: Car,
      description: "Pays for rental equipment during repairs",
      recommended: false,
      category: "Optional"
    }
  ];

  // Coverage limits with mock values
  const coverageLimits = {
    "Coverage A: Dwelling Protection": [
      { value: 250000, label: "$250,000" },
      { value: 350000, label: "$350,000" },
      { value: 500000, label: "$500,000" },
      { value: 750000, label: "$750,000" },
      { value: 1000000, label: "$1,000,000" }
    ],
    "Coverage B: Other Structures": [
      { value: 25000, label: "$25,000 (10% of Dwelling)" },
      { value: 35000, label: "$35,000 (10% of Dwelling)" },
      { value: 50000, label: "$50,000 (10% of Dwelling)" },
      { value: 75000, label: "$75,000 (10% of Dwelling)" },
      { value: 100000, label: "$100,000 (10% of Dwelling)" }
    ],
    "Coverage C: Personal Property": [
      { value: 125000, label: "$125,000 (50% of Dwelling)" },
      { value: 175000, label: "$175,000 (50% of Dwelling)" },
      { value: 250000, label: "$250,000 (50% of Dwelling)" },
      { value: 375000, label: "$375,000 (50% of Dwelling)" },
      { value: 500000, label: "$500,000 (50% of Dwelling)" }
    ],
    "Coverage D: Loss of Use": [
      { value: 50000, label: "$50,000 (20% of Dwelling)" },
      { value: 70000, label: "$70,000 (20% of Dwelling)" },
      { value: 100000, label: "$100,000 (20% of Dwelling)" },
      { value: 150000, label: "$150,000 (20% of Dwelling)" },
      { value: 200000, label: "$200,000 (20% of Dwelling)" }
    ],
    "Personal Liability": [
      { value: 100000, label: "$100,000" },
      { value: 300000, label: "$300,000" },
      { value: 500000, label: "$500,000" },
      { value: 1000000, label: "$1,000,000" }
    ],
    "Medical Payments": [
      { value: 1000, label: "$1,000" },
      { value: 5000, label: "$5,000" },
      { value: 10000, label: "$10,000" },
      { value: 25000, label: "$25,000" }
    ]
  };

  const [selectedAdditionalCoverages, setSelectedAdditionalCoverages] = useState([]);
  const [hoveredCoverage, setHoveredCoverage] = useState(null);
  const [selectedLimits, setSelectedLimits] = useState({
    "Coverage A: Dwelling Protection": 350000,
    "Coverage B: Other Structures": 35000,
    "Coverage C: Personal Property": 175000,
    "Coverage D: Loss of Use": 70000,
    "Personal Liability": 300000,
    "Medical Payments": 5000
  });

  const handleAddCoverage = (coverage) => {
    if (!selectedAdditionalCoverages.includes(coverage.name)) {
      setSelectedAdditionalCoverages([...selectedAdditionalCoverages, coverage.name]);
    }
  };

  const handleRemoveCoverage = (coverageName) => {
    setSelectedAdditionalCoverages(selectedAdditionalCoverages.filter(c => c !== coverageName));
  };

  const handleLimitChange = (coverage, value) => {
    setSelectedLimits(prev => ({
      ...prev,
      [coverage]: value
    }));
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Essential': return 'from-green-500 to-emerald-600';
      case 'Popular': return 'from-blue-500 to-cyan-600';
      case 'Premium': return 'from-purple-500 to-pink-600';
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

  const CoverageCard = ({ coverage, isSelected, onAdd, onRemove }) => {
    const IconComponent = coverage.icon;
    return (
      <div className={`group relative p-4 rounded-xl border transition-all duration-300 ${
        isSelected 
          ? 'bg-blue-900/30 border-blue-500/50 shadow-lg shadow-blue-500/20' 
          : 'bg-gray-800/50 border-gray-600/30 hover:bg-gray-700/50 hover:border-gray-500/50'
      }`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg bg-gradient-to-r ${getCategoryColor(coverage.category)}`}>
              <IconComponent className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-white">{coverage.name}</h4>
              <span className={`text-xs px-2 py-1 rounded-full border ${getCategoryBadge(coverage.category)}`}>
                {coverage.category}
              </span>
            </div>
          </div>
          {coverage.recommended && (
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
          )}
        </div>
        
        <p className="text-sm text-gray-300 mb-4">{coverage.description}</p>
        
        <div className="flex justify-end">
          {isSelected ? (
            <button
              onClick={() => onRemove(coverage.name)}
              className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-red-600/20 text-red-300 border border-red-500/30 hover:bg-red-600/30 transition-colors"
            >
              <X className="w-4 h-4" />
              <span className="text-sm">Remove</span>
            </button>
          ) : (
            <button
              onClick={() => onAdd(coverage)}
              className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-green-600/20 text-green-300 border border-green-500/30 hover:bg-green-600/30 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm">Add</span>
            </button>
          )}
        </div>
      </div>
    );
  };

  const CoverageItem = ({ coverage, isMandatory = false, isDisaster = false, isAdditional = false }) => (
    <div className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
      isMandatory ? 'bg-green-900/20 border-green-500/30' :
      isDisaster ? 'bg-orange-900/20 border-orange-500/30' :
      'bg-blue-900/20 border-blue-500/30'
    }`}>
      <div className="flex items-center space-x-3">
        <CheckCircle className={`w-5 h-5 ${
          isMandatory ? 'text-green-400' :
          isDisaster ? 'text-orange-400' :
          'text-blue-400'
        }`} />
        <span className="text-white font-medium">{coverage}</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white px-6 py-10">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 text-transparent bg-clip-text">
            Enhance Your Protection
          </h1>
          <p className="text-xl text-gray-300">
            Customize your coverage with these additional protections
          </p>
          <div className="w-24 h-1 mx-auto mt-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
        </div>

        {/* Current Coverage Summary */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Mandatory Coverages */}
          <div className="rounded-2xl p-6 bg-gradient-to-br from-green-900/20 to-gray-800/50 border border-green-500/30">
            <div className="flex items-center mb-4">
              <Shield className="w-6 h-6 mr-3 text-green-400" />
              <h3 className="text-xl font-semibold text-white">Selected Mandatory Coverages</h3>
            </div>
            <div className="space-y-2">
              {mandatoryCoverages.map((coverage, idx) => (
                <CoverageItem key={idx} coverage={coverage} isMandatory={true} />
              ))}
            </div>
          </div>

          {/* Disaster Coverages */}
          <div className="rounded-2xl p-6 bg-gradient-to-br from-orange-900/20 to-gray-800/50 border border-orange-500/30">
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-6 h-6 mr-3 text-orange-400" />
              <h3 className="text-xl font-semibold text-white">Disaster Coverages</h3>
            </div>
            <div className="space-y-2">
              {selectedDisasterCoverages.map((coverage, idx) => (
                <CoverageItem key={idx} coverage={coverage} isDisaster={true} />
              ))}
            </div>
          </div>

          {/* Additional Selected */}
          <div className="rounded-2xl p-6 bg-gradient-to-br from-blue-900/20 to-gray-800/50 border border-blue-500/30">
            <div className="flex items-center mb-4">
              <Plus className="w-6 h-6 mr-3 text-blue-400" />
              <h3 className="text-xl font-semibold text-white">Additional Selected</h3>
            </div>
            <div className="h-48 overflow-y-auto pr-2">
              <div className="space-y-2">
                {selectedAdditionalCoverages.length > 0 ? (
                  selectedAdditionalCoverages.map((coverage, idx) => (
                    <CoverageItem key={idx} coverage={coverage} isAdditional={true} />
                  ))
                ) : (
                  <p className="text-gray-400 text-center py-4">No additional coverage selected</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Coverage Recommendations */}
        <div className="rounded-2xl p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-600/50">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-3 text-white">Additional Coverage Options</h2>
            <p className="text-gray-300">Enhance your protection with these recommended coverages</p>
          </div>

          {/* Coverage Categories */}
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

        {/* Coverage Limits Selection */}
        <div className="rounded-2xl p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-600/50">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-3 text-white">Select Coverage Limits</h2>
            <p className="text-gray-300">Choose the coverage limits that best protect your property</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {Object.entries(coverageLimits).map(([coverage, limits]) => (
              <div key={coverage} className="p-6 rounded-xl bg-gray-800/50 border border-gray-600/30">
                <h4 className="text-lg font-semibold mb-4 text-white flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-green-400" />
                  {coverage}
                </h4>
                <div className="space-y-2">
                  {limits.map((limit, idx) => (
                    <label key={idx} className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-gray-700/30 transition-colors">
                      <input
                        type="radio"
                        name={coverage}
                        value={limit.value}
                        checked={selectedLimits[coverage] === limit.value}
                        onChange={() => handleLimitChange(coverage, limit.value)}
                        className="w-4 h-4 text-blue-500 border-gray-600 focus:ring-blue-500 focus:ring-2"
                      />
                      <span className="text-gray-300">{limit.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <button className="px-8 py-3 rounded-xl font-semibold text-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors">
            Previous
          </button>
          <button className="px-8 py-3 rounded-xl font-semibold text-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 transform hover:scale-105">
            Continue to Final Quote
          </button>
        </div>

      </div>
    </div>
  );
};

export default AdditionalCoverage;