import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Send, User, Bot, AlertTriangle, Cloud, MapPin } from 'lucide-react';

const Assistant = () => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [isWelcomed, setIsWelcomed] = useState(false);
    const [userLocation, setUserLocation] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [weatherData, setWeatherData] = useState(null);
    const [disasterInfo, setDisasterInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const recognitionRef = useRef(null);

    const API_KEY = 'a163b02442f842648f864802250406';

    // Get user data from storage (using in-memory storage instead of localStorage)
    const storedAuth = JSON.parse(localStorage.getItem('auth')) || {};
    const storedUser = storedAuth.user || {};
    const userData = {
        firstName: storedUser.firstName || 'User',
        lastName: storedUser.lastName || '',
        email: storedUser.email || ''
    };

    const scrollToBottom = () => {
        if (messages.length > 1) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (!isWelcomed) {
            const welcomeMessage = {
                id: Date.now(),
                text: `Hello ${userData.firstName}! Welcome to Home Insurance Assistant. I'm here to help you find the perfect home insurance coverage. To get started, could you please tell me which city and state your property is located in?`,
                sender: 'bot',
                timestamp: new Date().toLocaleTimeString()
            };
            setMessages([welcomeMessage]);
            setIsWelcomed(true);
        }
    }, [isWelcomed, userData.firstName]);

    const addMessage = (text, sender = 'user') => {
        const newMessage = {
            id: Date.now(),
            text,
            sender,
            timestamp: new Date().toLocaleTimeString()
        };
        setMessages(prev => [...prev, newMessage]);
    };

    const fetchDisasterInfo = async (lat, lon) => {
        try {
            // Try to get US state info using FCC API
            const geoRes = await fetch(`https://geo.fcc.gov/api/census/block/find?latitude=${lat}&longitude=${lon}&format=json`);

            if (!geoRes.ok) {
                throw new Error('Geocoding failed');
            }

            const geoData = await geoRes.json();

            if (!geoData || !geoData.State) {
                return {
                    error: 'Location is outside US or state information unavailable.',
                    isUS: false
                };
            }

            const stateCode = geoData.State.code;
            const stateName = geoData.State.name;

            // Fetch FEMA disaster data
            const disastersRes = await fetch(
                `https://www.fema.gov/api/open/v2/DisasterDeclarationsSummaries?$filter=state eq '${stateCode}'&$orderby=declarationDate desc&$top=5`
            );

            if (!disastersRes.ok) {
                throw new Error('FEMA API request failed');
            }

            const disastersData = await disastersRes.json();

            if (!disastersData || !disastersData.DisasterDeclarationsSummaries || disastersData.DisasterDeclarationsSummaries.length === 0) {
                return {
                    stateName,
                    disasters: [],
                    message: 'No recent disaster declarations found for this state.',
                    isUS: true
                };
            }

            return {
                stateName,
                disasters: disastersData.DisasterDeclarationsSummaries,
                isUS: true
            };

        } catch (err) {
            console.error('Disaster info fetch error:', err);
            return {
                error: 'Failed to fetch disaster information. This feature only works for US locations.',
                details: err.message
            };
        }
    };

    const fetchWeatherData = async (city) => {
        if (!city.trim()) return null;

        try {
            const response = await fetch(
                `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${encodeURIComponent(city)}&aqi=no`
            );

            const data = await response.json();

            if (response.ok) {
                return data;
            } else {
                throw new Error(data.error?.message || 'City not found');
            }
        } catch (err) {
            console.error('Weather fetch error:', err);
            throw err;
        }
    };

    const handleLocationSubmit = async (location) => {
        // Store location in memory (replacing localStorage usage)
        const locationData = { city: location };
        setUserLocation(location);

        setLoading(true);

        setTimeout(async () => {
            setIsTyping(true);

            try {
                // Fetch weather data
                const weather = await fetchWeatherData(location);

                if (weather) {
                    setWeatherData(weather);

                    // Store coordinates in memory
                    const coordinates = {
                        latitude: weather.location.lat,
                        longitude: weather.location.lon
                    };

                    // Store in localStorage
                    localStorage.setItem('locationData', JSON.stringify({
                        city: location,
                        latitude: coordinates.latitude,
                        longitude: coordinates.longitude
                    }));

                    // Log to console
                    console.log('Stored Location:', {
                        city: location,
                        latitude: coordinates.latitude,
                        longitude: coordinates.longitude
                    });


                    // Fetch disaster information
                    const disasters = await fetchDisasterInfo(weather.location.lat, weather.location.lon);
                    setDisasterInfo(disasters);

                    // Create comprehensive response message
                    let responseMessage = `Thank you for providing your location: ${location}\n\n`;

                    // Add weather information
                    responseMessage += `🌤️ CURRENT WEATHER:\n`;
                    responseMessage += `Temperature: ${weather.current.temp_f}°F (${weather.current.temp_c}°C)\n`;
                    responseMessage += `Condition: ${weather.current.condition.text}\n`;
                    responseMessage += `Humidity: ${weather.current.humidity}%\n`;
                    responseMessage += `Wind: ${weather.current.wind_mph} mph\n\n`;

                    // Add disaster information
                    if (disasters.isUS) {
                        responseMessage += `🚨 DISASTER ALERTS FOR ${disasters.stateName}:\n`;

                        if (disasters.disasters && disasters.disasters.length > 0) {
                            responseMessage += `Recent disaster declarations found:\n`;

                            // Remove duplicates based on disaster number and date
                            const uniqueDisasters = disasters.disasters.filter((disaster, index, self) =>
                                index === self.findIndex(d =>
                                    d.disasterNumber === disaster.disasterNumber &&
                                    d.declarationDate === disaster.declarationDate
                                )
                            );

                            uniqueDisasters.slice(0, 3).forEach((disaster, index) => {
                                const date = new Date(disaster.declarationDate).toLocaleDateString();
                                const title = disaster.declarationTitle || disaster.incidentType || disaster.title || 'Disaster Declaration';
                                responseMessage += `• ${disaster.disasterNumber}: ${disaster.declarationType} - ${title} (${date})\n`;
                            });
                            responseMessage += `\n⚠️ These recent disasters may affect your insurance rates and coverage options.\n\n`;
                        } else {
                            responseMessage += `No recent disaster declarations found for your state.\n\n`;
                        }
                    } else {
                        responseMessage += `📍 Location noted. Disaster tracking is available for US locations only.\n\n`;
                    }

                    responseMessage += `Based on your location and current conditions, I can help you find appropriate home insurance coverage. Would you like to learn about coverage options?`;

                    setTimeout(() => {
                        setIsTyping(false);
                        setLoading(false);
                        addMessage(responseMessage, 'bot');
                    }, 1500);

                } else {
                    throw new Error('Unable to fetch weather data');
                }

            } catch (error) {
                setTimeout(() => {
                    setIsTyping(false);
                    setLoading(false);
                    const errorMessage = `Thank you for providing your location: ${location}. I'm having trouble fetching current weather and disaster information right now, but I can still help you with your home insurance needs. Would you like to learn about coverage options or speak with an agent?`;
                    addMessage(errorMessage, 'bot');
                }, 1500);
            }
        }, 500);
    };

    const processMessage = (message) => {
        const lowerMessage = message.toLowerCase();

        if (!userLocation && (lowerMessage.includes('city') || lowerMessage.includes('state') || lowerMessage.includes(',') || /^[a-zA-Z\s,]+$/.test(message))) {
            handleLocationSubmit(message);
            return;
        }

        // Other bot responses
        setTimeout(() => {
            setIsTyping(true);
            setTimeout(() => {
                setIsTyping(false);
                let response = "I understand you're interested in learning more about home insurance. ";

                if (lowerMessage.includes('coverage') || lowerMessage.includes('what') || lowerMessage.includes('cover')) {
                    response += "Our home insurance typically covers dwelling protection, personal property, liability protection, and additional living expenses. Would you like me to explain any of these in detail?";
                } else if (lowerMessage.includes('discount') || lowerMessage.includes('save')) {
                    response += "We offer various discounts including multi-policy, security system, new home, and claims-free discounts. I can help you identify which discounts you might qualify for!";
                } else if (lowerMessage.includes('agent') || lowerMessage.includes('speak') || lowerMessage.includes('call')) {
                    response += "I can connect you with one of our licensed insurance agents who can provide personalized guidance. Would you like me to schedule a consultation?";
                } else if (lowerMessage.includes('weather') || lowerMessage.includes('disaster')) {
                    if (weatherData) {
                        response = `Current weather in ${weatherData.location.name}: ${weatherData.current.temp_f}°F, ${weatherData.current.condition.text}. `;
                    }
                    if (disasterInfo && disasterInfo.disasters && disasterInfo.disasters.length > 0) {
                        response += `Recent disasters in your area may affect coverage options. Our agents can help you understand how local risks impact your insurance needs.`;
                    } else {
                        response += "Weather and disaster information helps us provide better coverage recommendations. Feel free to ask about specific risks in your area!";
                    }
                } else {
                    response += "I'm here to help with all your home insurance questions. Feel free to ask about coverage options, discounts, claims process, or anything else related to protecting your home!";
                }

                addMessage(response, 'bot');
            }, 1500);
        }, 300);
    };

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        if (inputMessage.trim()) {
            addMessage(inputMessage);
            processMessage(inputMessage);
            setInputMessage('');
        }
    };

    const startRecording = async () => {
        try {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

            if (!SpeechRecognition) {
                alert('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
                return;
            }

            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onstart = () => {
                setIsRecording(true);
            };

            let stopTimeout;

            recognitionRef.current.onresult = (event) => {
                let finalTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript;
                    }
                }

                if (finalTranscript) {
                    setInputMessage(prev => prev + finalTranscript);

                    if (stopTimeout) clearTimeout(stopTimeout);
                    stopTimeout = setTimeout(() => {
                        recognitionRef.current.stop();
                    }, 2000);
                }
            };

            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setIsRecording(false);
                if (event.error === 'not-allowed') {
                    alert('Microphone access denied. Please allow microphone permissions and try again.');
                } else {
                    alert('Speech recognition error. Please try again.');
                }
            };

            recognitionRef.current.onend = () => {
                setIsRecording(false);
            };

            recognitionRef.current.start();
        } catch (error) {
            console.error('Error starting speech recognition:', error);
            alert('Unable to start speech recognition. Please check your microphone permissions.');
            setIsRecording(false);
        }
    };

    const stopRecording = () => {
        if (recognitionRef.current && isRecording) {
            recognitionRef.current.stop();
            setIsRecording(false);
        }
    };

    return (
        <div className="min-h-screen bg-black relative overflow-hidden">
            {/* Smokey background effect */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gray-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
                <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-gray-800 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-gray-700 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000"></div>
            </div>

            {/* Weather & Disaster Info Bar */}
            {(weatherData || disasterInfo) && (
                <div className="relative z-20 bg-gray-900/90 backdrop-blur-sm border-b border-gray-700 p-3">
                    <div className="max-w-4xl mx-auto flex flex-wrap items-center gap-4 text-sm">
                        {weatherData && (
                            <div className="flex items-center gap-2 text-blue-400">
                                <Cloud size={16} />
                                <span>{weatherData.location.name}: {weatherData.current.temp_f}°F, {weatherData.current.condition.text}</span>
                            </div>
                        )}
                        {disasterInfo && disasterInfo.disasters && disasterInfo.disasters.length > 0 && (
                            <div className="flex items-center gap-2 text-orange-400">
                                <AlertTriangle size={16} />
                                <span>{disasterInfo.disasters.length} recent disaster(s) in {disasterInfo.stateName}</span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Main content */}
            <div className="relative z-10 flex flex-col h-screen">
                {/* Chat area */}
                <div className="flex-1 overflow-y-auto p-4 pb-0" style={{ paddingBottom: '100px' }}>
                    <div className="max-w-4xl mx-auto space-y-4">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl flex items-start gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                                        }`}
                                >
                                    {/* Avatar */}
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.sender === 'user'
                                            ? 'bg-blue-600'
                                            : 'bg-gray-700'
                                            }`}
                                    >
                                        {message.sender === 'user' ? (
                                            <User size={16} className="text-white" />
                                        ) : (
                                            <Bot size={16} className="text-white" />
                                        )}
                                    </div>

                                    {/* Message bubble */}
                                    <div
                                        className={`p-4 rounded-2xl ${message.sender === 'user'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-800 text-gray-100'
                                            }`}
                                    >
                                        <p className="whitespace-pre-line text-sm md:text-base leading-relaxed">
                                            {message.text}
                                        </p>
                                        <p className="text-xs opacity-70 mt-2">{message.timestamp}</p>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Typing indicator */}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                                        <Bot size={16} className="text-white" />
                                    </div>
                                    <div className="bg-gray-800 p-4 rounded-2xl">
                                        <div className="flex space-x-1">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Input area */}
                <div className="bg-black/50 backdrop-blur-xl border-t border-gray-800 p-4 fixed bottom-0 left-0 right-0">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center gap-3">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
                                    placeholder="Type your message or ask about home insurance..."
                                    className="w-full p-4 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-300"
                                    disabled={loading}
                                />
                                {loading && (
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                        <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={isRecording ? stopRecording : startRecording}
                                disabled={loading}
                                className={`p-4 rounded-xl transition-all duration-300 ${isRecording
                                    ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
                                    : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                                    } disabled:opacity-50`}
                            >
                                {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
                            </button>

                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={!inputMessage.trim() || loading}
                                className="p-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none"
                            >
                                <Send size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Assistant;