import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign } from 'lucide-react';

const CoverageLimits = () => {
  const navigate = useNavigate();

  const [selectedLimits, setSelectedLimits] = useState({
    "Coverage A: Dwelling Protection": 350000,
    "Coverage B: Other Structures": 35000,
    "Coverage C: Personal Property": 175000,
    "Coverage D: Loss of Use": 70000,
    "Personal Liability": 300000,
    "Medical Payments": 5000
  });

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

  const handleLimitChange = (coverage, value) => {
    setSelectedLimits(prev => ({
      ...prev,
      [coverage]: value
    }));
  };

  const handleContinue = () => {
    localStorage.setItem('selectedLimits', JSON.stringify(selectedLimits));
    navigate('/additionalcoverages');
  };

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold mb-2 text-white">Select Coverage Limits</h2>
        <p className="text-gray-400 text-lg">Customize limits to match your home's needs.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {Object.entries(coverageLimits).map(([coverage, limits]) => (
          <div key={coverage} className="p-6 bg-gray-900 border border-gray-700 rounded-2xl shadow-md">
            <h4 className="text-xl font-semibold mb-4 text-white flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-green-400" />
              {coverage}
            </h4>
            <div className="space-y-2">
              {limits.map((limit, idx) => (
                <label
                  key={idx}
                  className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
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

      <div className="flex justify-center mt-12">
        <button
          onClick={handleContinue}
          className="px-10 py-4 rounded-xl font-semibold text-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 transform hover:scale-105"
        >
          Continue to Add-Ons
        </button>
      </div>
    </div>
  );
};

export default CoverageLimits;
