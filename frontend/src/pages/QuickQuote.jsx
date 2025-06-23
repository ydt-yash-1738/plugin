// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// // import { AlertTriangle, Cloud } from 'lucide-react';

// const QuickQuote = () => {
//     const [form, setForm] = useState({ address: '', sqFt: '' });
//     const [weatherData, setWeatherData] = useState(null);
//     const [disasterInfo, setDisasterInfo] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const navigate = useNavigate();


//     const storedAuth = JSON.parse(localStorage.getItem('auth')) || {};
//     const storedUser = storedAuth.user || {};
//     const userData = {
//         firstName: storedUser.firstName || 'User',
//         lastName: storedUser.lastName || '',
//         email: storedUser.email || ''
//     };

//     const handleChange = (e) => {
//         setForm({ ...form, [e.target.name]: e.target.value });
//     };

//     const fetchDisasterInfo = async (lat, lon) => {
//         try {
//             const geoRes = await fetch(`https://geo.fcc.gov/api/census/block/find?latitude=${lat}&longitude=${lon}&format=json`);
//             if (!geoRes.ok) throw new Error('Geocoding failed');

//             const geoData = await geoRes.json();
//             if (!geoData || !geoData.State) return { error: 'Location is outside US or state unavailable.', isUS: false };

//             const stateCode = geoData.State.code;
//             const stateName = geoData.State.name;

//             const disastersRes = await fetch(
//                 `https://www.fema.gov/api/open/v2/DisasterDeclarationsSummaries?$filter=state eq '${stateCode}'&$orderby=declarationDate desc&$top=5`
//             );
//             if (!disastersRes.ok) throw new Error('FEMA API request failed');

//             const disastersData = await disastersRes.json();
//             const summaries = disastersData.DisasterDeclarationsSummaries;

//             return summaries.length > 0
//                 ? { stateName, disasters: summaries, isUS: true }
//                 : { stateName, disasters: [], message: 'No recent disaster declarations', isUS: true };
//         } catch (err) {
//             return { error: 'Failed to fetch disaster info.', details: err.message };
//         }
//     };

//     const fetchWeatherData = async (location) => {
//         try {
//             const res = await fetch(`http://localhost:5000/weather?location=${encodeURIComponent(location)}`);
//             const data = await res.json();
//             if (res.ok) return data;
//             throw new Error(data.error?.message || 'Weather API error');
//         } catch (err) {
//             console.error('Weather error:', err);
//             return null;
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);

//         const weather = await fetchWeatherData(form.address);
//         if (weather) {
//             setWeatherData(weather);
//             const lat = weather.location.lat;
//             const lon = weather.location.lon;

//             const disasters = await fetchDisasterInfo(lat, lon);
//             setDisasterInfo(disasters);

//             navigate('/quickquotedisplay', {
//                 state: {
//                     form,
//                     weatherData: weather,
//                     disasterInfo: disasters
//                 }
//             });
//         }

//         setLoading(false);
//     };

//     return (
//         <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center">
//             <div className="absolute inset-0 opacity-20">
//                 <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gray-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
//                 <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-gray-800 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
//                 <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-gray-700 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000"></div>
//             </div>

//             <div className="relative z-10 backdrop-blur-xl bg-black/40 border border-gray-800 rounded-2xl p-8 w-full max-w-md mx-2 shadow-2xl">
//                 <h1 className="text-2xl font-bold mb-6 text-white">Quick Home Insurance Quote</h1>
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     <div>
//                         <label className="block mb-1 font-medium text-white">Property Address</label>
//                         <input
//                             type="text"
//                             name="address"
//                             value={form.address}
//                             onChange={handleChange}
//                             className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
//                             placeholder="Enter full address"
//                             required
//                         />
//                     </div>
//                     <div>
//                         <label className="block mb-1 font-medium text-white">Square Footage</label>
//                         <input
//                             type="number"
//                             name="sqFt"
//                             value={form.sqFt}
//                             onChange={handleChange}
//                             className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
//                             placeholder="e.g., 2000"
//                             required
//                         />
//                     </div>
//                     <button
//                         type="submit"
//                         className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
//                         disabled={loading}
//                     >
//                         {loading ? 'Fetching...' : 'Get Quick Quote'}
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default QuickQuote;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const QuickQuote = () => {
    const [form, setForm] = useState({ address: '', sqFt: '' });
    const [weatherData, setWeatherData] = useState(null);
    const [disasterInfo, setDisasterInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const storedAuth = JSON.parse(localStorage.getItem('auth')) || {};
    const storedUser = storedAuth.user || {};
    const userData = {
        firstName: storedUser.firstName || 'User',
        lastName: storedUser.lastName || '',
        email: storedUser.email || ''
    };

    // Function to generate a unique quote reference ID
    const generateQuoteRef = () => {
        const timestamp = Date.now();
        const randomNum = Math.floor(Math.random() * 1000);
        return `QR${timestamp}${randomNum}`;
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const fetchDisasterInfo = async (lat, lon) => {
        try {
            const geoRes = await fetch(`https://geo.fcc.gov/api/census/block/find?latitude=${lat}&longitude=${lon}&format=json`);
            if (!geoRes.ok) throw new Error('Geocoding failed');

            const geoData = await geoRes.json();
            if (!geoData || !geoData.State) return { error: 'Location is outside US or state unavailable.', isUS: false };

            const stateCode = geoData.State.code;
            const stateName = geoData.State.name;

            const disastersRes = await fetch(
                `https://www.fema.gov/api/open/v2/DisasterDeclarationsSummaries?$filter=state eq '${stateCode}'&$orderby=declarationDate desc&$top=5`
            );
            if (!disastersRes.ok) throw new Error('FEMA API request failed');

            const disastersData = await disastersRes.json();
            const summaries = disastersData.DisasterDeclarationsSummaries;

            return summaries.length > 0
                ? { stateName, disasters: summaries, isUS: true }
                : { stateName, disasters: [], message: 'No recent disaster declarations', isUS: true };
        } catch (err) {
            return { error: 'Failed to fetch disaster info.', details: err.message };
        }
    };

    const fetchWeatherData = async (location) => {
        try {
            const res = await fetch(`http://localhost:5000/weather?location=${encodeURIComponent(location)}`);
            const data = await res.json();
            if (res.ok) return data;
            throw new Error(data.error?.message || 'Weather API error');
        } catch (err) {
            console.error('Weather error:', err);
            return null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Generate quote reference ID immediately when user clicks "Get Quick Quote"
        const quoteRef = generateQuoteRef();

        const weather = await fetchWeatherData(form.address);
        if (weather) {
            setWeatherData(weather);
            const lat = weather.location.lat;
            const lon = weather.location.lon;

            const disasters = await fetchDisasterInfo(lat, lon);
            setDisasterInfo(disasters);

            // Prepare initial quote data to store in localStorage
            const quickQuoteData = {
                quoteRef: quoteRef,
                address: form.address,
                sqFt: form.sqFt,
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                weatherData: weather,
                disasterInfo: disasters,
                createdAt: new Date().toISOString(),
                selectedPlan: null 
            };

            // Store the quote data in localStorage
            localStorage.setItem('quickQuoteData', JSON.stringify(quickQuoteData));

            navigate('/quickquotedisplay', {
                state: {
                    form,
                    weatherData: weather,
                    disasterInfo: disasters,
                    quoteRef: quoteRef
                }
            });
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gray-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
                <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-gray-800 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-gray-700 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000"></div>
            </div>

            <div className="relative z-10 backdrop-blur-xl bg-black/40 border border-gray-800 rounded-2xl p-8 w-full max-w-md mx-2 shadow-2xl">
                <h1 className="text-2xl font-bold mb-6 text-white">Quick Home Insurance Quote</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1 font-medium text-white">Property Address</label>
                        <input
                            type="text"
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                            placeholder="Enter full address"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium text-white">Square Footage</label>
                        <input
                            type="number"
                            name="sqFt"
                            value={form.sqFt}
                            onChange={handleChange}
                            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                            placeholder="e.g., 2000"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
                        disabled={loading}
                    >
                        {loading ? 'Fetching...' : 'Get Quick Quote'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default QuickQuote;