import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Send, User, Bot } from 'lucide-react';

const Assistant = () => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [isWelcomed, setIsWelcomed] = useState(false);
    const [userLocation, setUserLocation] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const recognitionRef = useRef(null);

    //localstoraage se user data fetching
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



    const handleLocationSubmit = (location) => {
        // location ko local storage mei rakh rhe hn backend mei bhejne k lye
        localStorage.setItem('city', location);
        setUserLocation(location);

        // baatein bot ki
        setTimeout(() => {
            setIsTyping(true);
            setTimeout(() => {
                setIsTyping(false);
                const acknowledgmentMessage = `Thank you for providing your location: ${location}. I'm working on getting your insurance information ready. We'll integrate the quote system here soon!`;

                addMessage(acknowledgmentMessage, 'bot');
            }, 1500);
        }, 500);
    };

    const processMessage = (message) => {
        const lowerMessage = message.toLowerCase();

        if (!userLocation && (lowerMessage.includes('city') || lowerMessage.includes('state') || lowerMessage.includes(',') || /^[a-zA-Z\s,]+$/.test(message))) {
            handleLocationSubmit(message);
            return;
        }

        // aur baatein bot ki
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
            // mic systum
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

                    // Clear any previous stop timers and start a new one
                    if (stopTimeout) clearTimeout(stopTimeout);
                    stopTimeout = setTimeout(() => {
                        recognitionRef.current.stop(); // Stop recognition after 2 seconds of silence
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
                                />
                            </div>

                            <button
                                type="button"
                                onClick={isRecording ? stopRecording : startRecording}
                                className={`p-4 rounded-xl transition-all duration-300 ${isRecording
                                    ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
                                    : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                                    }`}
                            >
                                {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
                            </button>

                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={!inputMessage.trim()}
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


