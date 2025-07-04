import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const PreQuote = () => {
    const [form, setForm] = useState({
        propertyType: '',
        yearBuilt: '',
        stories: '',
        framingSystem: '',
        foundationType: '',
        roofType: '',
        occupancyType: '',
        securitySystem: '',
        estimatedValue: '',
        coverageB: '',
        coverageC: '',
        coverageD: ''
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

    useEffect(() => {
        const storedData = localStorage.getItem('preQuoteData');
        if (storedData) {
            try {
                const parsed = JSON.parse(storedData);
                if (parsed.preQuoteData) {
                    console.log("Preloading preQuoteData:", parsed.preQuoteData);
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
        navigate('/quickquotedisplay', {
            state: {
                ...location.state, // includes form, weatherData, disasterInfo, selectedPlan, premium
                preQuoteForm: form
            }
        });
    };

    const handleBack = () => {
        navigate('/quickquote')
    }
    
    return (
        <div className="min-h-screen mt-20 bg-gradient-to-br from-black via-gray-900 to-black text-white px-6 py-10">
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

                    {/* Primary Framing System */}
                    <div>
                        <label className="block mb-2 font-medium text-gray-300">Primary Framing System</label>
                        <select
                            name="framingSystem"
                            value={form.framingSystem}
                            onChange={handleChange}
                            className="w-full bg-black border border-gray-700 p-3 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        >
                            <option value="">Select...</option>
                            <option value="Wood-Frame">Wood-Frame</option>
                            <option value="Reinforced Concrete">Reinforced Concrete</option>
                            <option value="Steel Moment Frame">Steel Moment Frame</option>
                            <option value="Masonry">Masonry</option>
                        </select>
                    </div>

                    {/* Foundation Type */}
                    <div>
                        <label className="block mb-2 font-medium text-gray-300">Foundation Type</label>
                        <select
                            name="foundationType"
                            value={form.foundationType}
                            onChange={handleChange}
                            className="w-full bg-black border border-gray-700 p-3 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        >
                            <option value="">Select...</option>
                            <option value="Slab">Slab</option>
                            <option value="Crawlspace">Crawlspace</option>
                            <option value="Pier & Beam">Pier & Beam</option>
                            <option value="Basement">Basement</option>
                        </select>
                    </div>

                    {/* Roof Type/Material */}
                    <div>
                        <label className="block mb-2 font-medium text-gray-300">Roof Type / Material</label>
                        <select
                            name="roofType"
                            value={form.roofType}
                            onChange={handleChange}
                            className="w-full bg-black border border-gray-700 p-3 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        >
                            <option value="">Select...</option>
                            <option value="Asphalt Shingles">Asphalt Shingles</option>
                            <option value="Tile">Tile</option>
                            <option value="Metal">Metal</option>
                            <option value="Flat Membrane">Flat Membrane</option>
                        </select>
                    </div>

                    {/* Occupancy Type */}
                    <div>
                        <label className="block mb-2 font-medium text-gray-300">Occupancy Type</label>
                        <select
                            name="occupancyType"
                            value={form.occupancyType}
                            onChange={handleChange}
                            className="w-full bg-black border border-gray-700 p-3 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        >
                            <option value="">Select...</option>
                            <option value="Primary Residence">Primary Residence</option>
                            <option value="Rental">Rental</option>
                            <option value="Vacant">Vacant</option>
                            <option value="Commercial">Commercial</option>
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
                    {/* Coverage B */}
                    <div>
                        <label className="block mb-2 font-medium text-gray-300">
                            Do you have detached structures (e.g., garage, shed) on your property?
                        </label>
                        <select
                            name="coverageB"
                            value={form.coverageB}
                            onChange={handleChange}
                            className="w-full bg-black border border-gray-700 p-3 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        >
                            <option value="">Select...</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>

                    {/* Coverage C */}
                    <div>
                        <label className="block mb-2 font-medium text-gray-300">
                            Do you want to insure your personal belongings (e.g., furniture, electronics)?
                        </label>
                        <select
                            name="coverageC"
                            value={form.coverageC}
                            onChange={handleChange}
                            className="w-full bg-black border border-gray-700 p-3 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        >
                            <option value="">Select...</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>

                    {/* Coverage D */}
                    <div>
                        <label className="block mb-2 font-medium text-gray-300">
                            Do you want coverage for additional living expenses if your home becomes uninhabitable?
                        </label>
                        <select
                            name="coverageD"
                            value={form.coverageD}
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
                            onClick={handleBack}
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

