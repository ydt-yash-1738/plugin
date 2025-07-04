// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// const QuickQuote = () => {
//     const [form, setForm] = useState({
//         addressLine: '',
//         city: '',
//         state: '',
//         zip: '',
//         country: '',
//         sqFt: ''
//     });
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

//     useEffect(() => {
//         const stored = localStorage.getItem('quickQuoteData');
//         if (stored) {
//             try {
//                 const data = JSON.parse(stored);
//                 if (data?.form) {
//                     setForm(data.form);
//                 }
//             } catch (err) {
//                 console.error("Error parsing stored form data:", err);
//             }
//         }
//     }, []);

//     const generateQuoteRef = () => {
//         const timestamp = Date.now();
//         const randomNum = Math.floor(Math.random() * 1000);
//         return `QR${timestamp}${randomNum}`;
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

//         const address = `${form.addressLine}, ${form.city}, ${form.state} ${form.zip}, ${form.country}`;
//         const quoteRef = generateQuoteRef();

//         const weather = await fetchWeatherData(address);
//         if (weather) {
//             setWeatherData(weather);
//             const lat = weather.location.lat;
//             const lon = weather.location.lon;

//             const disasters = await fetchDisasterInfo(lat, lon);
//             setDisasterInfo(disasters);

//             const quickQuoteData = {
//                 quoteRef,
//                 address,
//                 sqFt: form.sqFt,
//                 firstName: userData.firstName,
//                 lastName: userData.lastName,
//                 email: userData.email,
//                 weatherData: weather,
//                 disasterInfo: disasters,
//                 createdAt: new Date().toISOString(),
//             };

//             localStorage.setItem('quickQuoteData', JSON.stringify({
//                 quoteRef,
//                 address,
//                 form,
//                 sqFt: form.sqFt,
//                 firstName: userData.firstName,
//                 lastName: userData.lastName,
//                 email: userData.email,
//                 weatherData: weather,
//                 disasterInfo: disasters,
//                 createdAt: new Date().toISOString(),
//             }));

//             // navigate('/quickquotedisplay', {
//             //     state: {
//             //         form: { ...form, address },
//             //         weatherData: weather,
//             //         disasterInfo: disasters,
//             //         quoteRef
//             //     }
//             // });
//             navigate('/prequote', {
//                 state: {
//                     form: { ...form, address },
//                     weatherData: weather,
//                     disasterInfo: disasters,
//                     quoteRef
//                 }
//             });
//         }

//         setLoading(false);
//     };

//     return (
//         <div className="min-h-screen bg-black flex items-center justify-center mt-10 p-4">
//             <div className="relative bg-zinc-900 text-white p-6 rounded-2xl w-full max-w-xl">
//                 <h2 className="text-xl font-semibold mb-4">Basic Details</h2>
//                 <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     <div>
//                         <label className="block mb-1">Property Address</label>
//                         <input
//                             type="text"
//                             name="addressLine"
//                             value={form.addressLine}
//                             onChange={handleChange}
//                             placeholder="Full Address"
//                             className="w-full p-2.5 rounded-md bg-zinc-800 text-white"
//                             required
//                         />
//                     </div>
//                     <div>
//                         <label className="block mb-1">City</label>
//                         <input
//                             type="text"
//                             name="city"
//                             value={form.city}
//                             onChange={handleChange}
//                             placeholder="City"
//                             className="w-full p-2.5 rounded-md bg-zinc-800 text-white"
//                             required
//                         />
//                     </div>
//                     <div>
//                         <label className="block mb-1">State</label>
//                         <input
//                             type="text"
//                             name="state"
//                             value={form.state}
//                             onChange={handleChange}
//                             placeholder="State"
//                             className="w-full p-2.5 rounded-md bg-zinc-800 text-white"
//                             required
//                         />
//                     </div>
//                     <div>
//                         <label className="block mb-1">Zip Code</label>
//                         <input
//                             type="text"
//                             name="zip"
//                             value={form.zip}
//                             onChange={handleChange}
//                             placeholder="Zip Code"
//                             className="w-full p-2.5 rounded-md bg-zinc-800 text-white"
//                             required
//                         />
//                     </div>
//                     <div>
//                         <label className="block mb-1">Country</label>
//                         <input
//                             type="text"
//                             name="country"
//                             value={form.country}
//                             onChange={handleChange}
//                             placeholder="Country"
//                             className="w-full p-2.5 rounded-md bg-zinc-800 text-white"
//                             required
//                         />
//                     </div>
//                     <div className="sm:col-span-2">
//                         <label className="block mb-1">Property Square Footage</label>
//                         <input
//                             type="number"
//                             name="sqFt"
//                             value={form.sqFt}
//                             onChange={handleChange}
//                             placeholder="eg 2000"
//                             className="w-full p-2.5 rounded-md bg-zinc-800 text-white"
//                             required
//                         />
//                     </div>
//                     <div className="sm:col-span-2 mt-2">
//                         <button
//                             type="submit"
//                             className="w-full bg-blue-500 hover:bg-blue-600 py-2.5 rounded-lg font-semibold transition"
//                             disabled={loading}
//                         >
//                             {loading ? 'Saving...' : 'Proceed'}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>

//     );
// };

// export default QuickQuote;



import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const sampleAddresses = [
    {
        addressLine: '3725 N Kiel Ave',
        city: 'Indianapolis',
        state: 'Indiana',
        zip: '46224',
        country: 'USA'
    },
    {
        addressLine: '1801-1819 E Lafayette Pl',
        city: 'Milwaukee',
        state: 'Wisconsin',
        zip: '53202',
        country: 'USA'
    },
    {
        addressLine: '421 S 15th St',
        city: ' Las Vegas',
        state: 'Neveda',
        zip: '89101',
        country: 'USA'
    },
    {
        addressLine: '1 Infinite Loop',
        city: 'Cupertino',
        state: 'California',
        zip: '95014',
        country: 'USA'
    }
];

const QuickQuote = () => {
    const [form, setForm] = useState({
        addressLine: '',
        city: '',
        state: '',
        zip: '',
        country: 'USA',
        sqFt: ''
    });

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

    useEffect(() => {
        const stored = localStorage.getItem('quickQuoteData');
        if (stored) {
            try {
                const data = JSON.parse(stored);
                if (data?.form) {
                    setForm({ ...data.form, country: 'USA' });
                }
            } catch (err) {
                console.error("Error parsing stored form data:", err);
            }
        }
    }, []);

    const generateQuoteRef = () => {
        const timestamp = Date.now();
        const randomNum = Math.floor(Math.random() * 1000);
        return `QR${timestamp}${randomNum}`;
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleAddressClick = (addressObj) => {
        setForm({ ...form, ...addressObj });
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

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     setLoading(true);

    //     const address = `${form.addressLine}, ${form.city}, ${form.state} ${form.zip}, ${form.country}`;
    //     const quoteRef = generateQuoteRef();

    //     const weather = await fetchWeatherData(address);
    //     if (weather) {
    //         setWeatherData(weather);
    //         const lat = weather.location.lat;
    //         const lon = weather.location.lon;

    //         const disasters = await fetchDisasterInfo(lat, lon);
    //         setDisasterInfo(disasters);

    //         const quickQuoteData = {
    //             quoteRef,
    //             address,
    //             sqFt: form.sqFt,
    //             firstName: userData.firstName,
    //             lastName: userData.lastName,
    //             email: userData.email,
    //             weatherData: weather,
    //             disasterInfo: disasters,
    //             createdAt: new Date().toISOString(),
    //         };

    //         localStorage.setItem('quickQuoteData', JSON.stringify({
    //             quoteRef,
    //             address,
    //             form,
    //             sqFt: form.sqFt,
    //             firstName: userData.firstName,
    //             lastName: userData.lastName,
    //             email: userData.email,
    //             weatherData: weather,
    //             disasterInfo: disasters,
    //             createdAt: new Date().toISOString(),
    //         }));

    //         navigate('/prequote', {
    //             state: {
    //                 form: { ...form, address },
    //                 weatherData: weather,
    //                 disasterInfo: disasters,
    //                 quoteRef
    //             }
    //         });
    //     }

    //     setLoading(false);
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const address = `${form.addressLine}, ${form.city}, ${form.state} ${form.zip}, ${form.country}`;
        const quoteRef = generateQuoteRef();

        const weather = await fetchWeatherData(address);
        if (!weather) {
            alert("Failed to fetch weather data for this address.");
            setLoading(false);
            return;
        }

        setWeatherData(weather);
        const lat = weather.location.lat;
        const lon = weather.location.lon;

        // 🔍 Validate location through backend (instead of direct FCC call)
        try {
            const validationRes = await fetch('http://localhost:5000/api/locationverify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ lat, lon })
            });

            const validationData = await validationRes.json();

            if (!validationData.valid) {
                alert('The provided address is not a valid USA location.');
                setLoading(false);
                return;
            }
        } catch (err) {
            alert("Error validating location. Please try again later.");
            console.error("Validation error:", err);
            setLoading(false);
            return;
        }

        // ✅ Proceed if valid
        const disasters = await fetchDisasterInfo(lat, lon);
        setDisasterInfo(disasters);

        const quickQuoteData = {
            quoteRef,
            address,
            sqFt: form.sqFt,
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            weatherData: weather,
            disasterInfo: disasters,
            createdAt: new Date().toISOString(),
        };

        localStorage.setItem('quickQuoteData', JSON.stringify({
            quoteRef,
            address,
            form,
            sqFt: form.sqFt,
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            weatherData: weather,
            disasterInfo: disasters,
            createdAt: new Date().toISOString(),
        }));

        navigate('/prequote', {
            state: {
                form: { ...form, address },
                weatherData: weather,
                disasterInfo: disasters,
                quoteRef
            }
        });

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-black flex flex-col md:flex-row gap-6 items-start justify-center p-6 mt-20">
            {/* Form Section */}
            <div className="bg-zinc-900 text-white p-6 rounded-2xl w-full max-w-xl">
                <h2 className="text-xl font-semibold mb-4">Basic Details</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* All fields same as before */}
                    <div>
                        <label className="block mb-1">Property Address</label>
                        <input
                            type="text"
                            name="addressLine"
                            value={form.addressLine}
                            onChange={handleChange}
                            placeholder="Full Address"
                            className="w-full p-2.5 rounded-md bg-zinc-800 text-white"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1">City</label>
                        <input
                            type="text"
                            name="city"
                            value={form.city}
                            onChange={handleChange}
                            placeholder="City"
                            className="w-full p-2.5 rounded-md bg-zinc-800 text-white"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1">State</label>
                        <input
                            type="text"
                            name="state"
                            value={form.state}
                            onChange={handleChange}
                            placeholder="State"
                            className="w-full p-2.5 rounded-md bg-zinc-800 text-white"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1">Zip Code</label>
                        <input
                            type="text"
                            name="zip"
                            value={form.zip}
                            onChange={handleChange}
                            placeholder="Zip Code"
                            className="w-full p-2.5 rounded-md bg-zinc-800 text-white"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1">Country</label>
                        <input
                            type="text"
                            name="country"
                            value={form.country}
                            onChange={handleChange}
                            placeholder="Country"
                            className="w-full p-2.5 rounded-md bg-zinc-800 text-white"
                            required
                        />
                    </div>
                    <div className="sm:col-span-2">
                        <label className="block mb-1">Property Square Footage</label>
                        <input
                            type="number"
                            name="sqFt"
                            value={form.sqFt}
                            onChange={handleChange}
                            placeholder="eg 2000"
                            className="w-full p-2.5 rounded-md bg-zinc-800 text-white"
                            required
                        />
                    </div>
                    <div className="sm:col-span-2 mt-2">
                        <button
                            type="submit"
                            className="w-full bg-blue-500 hover:bg-blue-600 py-2.5 rounded-lg font-semibold transition"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Proceed'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Sidebar - Sample Addresses */}
            <div className="bg-zinc-900 text-white p-4 w-full max-w-sm shadow-md">
                <h3 className="text-sm font-semibold mb-2 text-red-800">*For Dev Testing Purpose only (address uses geocoding API)</h3>
                <ul className="space-y-3">
                    {sampleAddresses.map((addr, idx) => (
                        <li
                            key={idx}
                            className="cursor-pointer p-2 rounded-md bg-zinc-800 hover:bg-blue-600 transition"
                            onClick={() => handleAddressClick(addr)}
                        >
                            <p className="font-medium">{addr.addressLine}</p>
                            <p className="text-sm text-gray-400">{addr.city}, {addr.state} {addr.zip}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default QuickQuote;
