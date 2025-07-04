import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign } from 'lucide-react';

const CoverageLimits = () => {
  const navigate = useNavigate();

  const [selectedLimits, setSelectedLimits] = useState({
    "Coverage A: Dwelling Protection": 0,
    "Personal Liability": 300000,
    "Medical Payments": 5000
  });

  const [allCoverages, setAllCoverages] = useState([]);
  const [isCoverageASelected, setIsCoverageASelected] = useState(false);

  useEffect(() => {
    const insuranceData = JSON.parse(localStorage.getItem('selectedInsuranceCoverages'));
    const coverages = insuranceData?.allCoverages || [];
    setAllCoverages(coverages);

    // Reset Coverage A
    setSelectedLimits(prev => ({
      ...prev,
      "Coverage A: Dwelling Protection": 0
    }));
  }, []);

  const handleLimitChange = (coverage, value) => {
    setSelectedLimits(prev => ({
      ...prev,
      [coverage]: value
    }));

    if (coverage === "Coverage A: Dwelling Protection") {
      setIsCoverageASelected(true);
    }
  };

  const handleContinue = () => {
    localStorage.setItem('selectedLimits', JSON.stringify(selectedLimits));
    navigate('/quotedisplay');
  };

  const handlePrevious = () => {
    navigate('/additionalcoverages');
  };

  const calculateOptionalLimit = (percentage) => {
    return Math.round(selectedLimits["Coverage A: Dwelling Protection"] * percentage);
  };

  const limitOptionsA = [250000, 350000, 500000, 750000, 1000000];
  const limitOptionsLiability = [100000, 300000, 500000, 1000000];
  const limitOptionsMedical = [1000, 5000, 10000, 25000];

  const shouldShow = (coverage) => allCoverages.includes(coverage);

  return (
    <div className="min-h-screen bg-black text-white py-16 px-6 md:px-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-3">Customize Your Coverage Limits</h1>
      </div>

      {/* Coverage A Selection */}
      <div className="mb-10 bg-gray-900 border border-gray-700 rounded-2xl p-6">
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <DollarSign className="w-5 h-5 mr-2 text-green-400" />
          Coverage A: Dwelling Protection
        </h2>
        <select
          value={selectedLimits["Coverage A: Dwelling Protection"]}
          onChange={(e) => handleLimitChange("Coverage A: Dwelling Protection", Number(e.target.value))}
          className="w-full bg-black border border-gray-600 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={0} disabled>Select a limit</option>
          {limitOptionsA.map((val) => (
            <option key={val} value={val}>${val.toLocaleString()}</option>
          ))}
        </select>
      </div>

      {/* Calculated Optional Coverages */}
      {isCoverageASelected && (
        <div className="grid md:grid-cols-3 gap-6 mb-12 animate-fade-in">
          {shouldShow("Coverage B: Other Structures") && (
            <AutoCoverageBox
              title="Coverage B: Other Structures"
              amount={calculateOptionalLimit(0.10)}
            />
          )}
          {shouldShow("Coverage C: Personal Property") && (
            <AutoCoverageBox
              title="Coverage C: Personal Property"
              amount={calculateOptionalLimit(0.50)}
            />
          )}
          {shouldShow("Coverage D: Loss of Use") && (
            <AutoCoverageBox
              title="Coverage D: Loss of Use"
              amount={calculateOptionalLimit(0.20)}
            />
          )}
        </div>
      )}

      {/* Manual Inputs for Liability & Medical */}
      <div className="grid md:grid-cols-2 gap-8 mb-14">
        <ManualLimitBox
          title="Personal Liability"
          options={limitOptionsLiability}
          value={selectedLimits["Personal Liability"]}
          onChange={(val) => handleLimitChange("Personal Liability", val)}
        />
        <ManualLimitBox
          title="Medical Payments"
          options={limitOptionsMedical}
          value={selectedLimits["Medical Payments"]}
          onChange={(val) => handleLimitChange("Medical Payments", val)}
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-6">
        <button
          onClick={handlePrevious}
          className="px-10 py-4 rounded-xl font-semibold text-lg bg-gradient-to-r from-gray-500 to-gray-700 text-white hover:shadow-lg hover:shadow-gray-500/30 transition-all duration-300 transform hover:scale-105"
        >
          Previous
        </button>
        <button
          onClick={handleContinue}
          disabled={selectedLimits["Coverage A: Dwelling Protection"] === 0}
          className="px-10 py-4 rounded-xl font-semibold text-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 transform hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Proceed
        </button>
      </div>
    </div>
  );
};

// Auto-Calculated Coverage Box
const AutoCoverageBox = ({ title, amount }) => (
  <div className="bg-gray-900 border border-gray-700 p-6 rounded-2xl shadow-md">
    <h4 className="text-xl font-semibold mb-2 flex items-center">
      <DollarSign className="w-5 h-5 mr-2 text-green-400" />
      {title}
    </h4>
    <p className="text-white text-lg">${amount.toLocaleString()}</p>
    <p className="text-gray-400 text-sm mt-1">(Auto-calculated)</p>
  </div>
);

// Manual Limit Selection Box
const ManualLimitBox = ({ title, options, value, onChange }) => (
  <div className="bg-gray-900 border border-gray-700 p-6 rounded-2xl shadow-md">
    <h4 className="text-xl font-semibold mb-4 flex items-center">
      <DollarSign className="w-5 h-5 mr-2 text-green-400" />
      {title}
    </h4>
    <select
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full bg-black border border-gray-600 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {options.map((val) => (
        <option key={val} value={val}>${val.toLocaleString()}</option>
      ))}
    </select>
  </div>
);

export default CoverageLimits;
