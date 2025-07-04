import { useState, useEffect, useRef } from 'react';
import { MessageSquare, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';

const Bot = ({ contextTerms = [] }) => {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState('');
    const [hasFetchedSummary, setHasFetchedSummary] = useState(false);

    const scrollRef = useRef(null); // For auto-scroll

    useEffect(() => {
        if (contextTerms.length > 0) {
            const prompt = `Give 1-line summaries for these insurance terms: ${contextTerms.join(', ')}. Keep it beginner-friendly.`;

            // Prevent duplicate fetches for same terms
            const lastTerms = localStorage.getItem('lastContextTerms');
            if (lastTerms !== JSON.stringify(contextTerms)) {
                getBotResponse(prompt, true);
                localStorage.setItem('lastContextTerms', JSON.stringify(contextTerms));
            }
        }
    }, [contextTerms]);


    useEffect(() => {
        // Auto-scroll to latest message when summary or response updates
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [summary, response, loading]);

    const getBotResponse = async (userPrompt, isSummary = false) => {
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/api/bot', {
                prompt: userPrompt
            });
            const reply = res.data?.response || 'Sorry, something went wrong.';
            if (isSummary) {
                setSummary(reply);
            } else {
                setResponse(reply);
            }
        } catch (err) {
            console.error(err);
            setResponse('Error getting response from Gemini.');
        } finally {
            setLoading(false);
        }
    };

    // const handleAsk = () => {
    //     if (query.trim()) {
    //         getBotResponse(query);
    //         setResponse(''); // Clear old response before new one
    //     }
    // };

    const handleAsk = () => {
        if (query.trim()) {
            const userData = JSON.parse(localStorage.getItem("quickQuoteData")) || {};
            const preQuote = JSON.parse(localStorage.getItem("preQuoteData")) || {};

            const address = userData?.address || 'unknown';
            const sqFt = userData?.sqFt || 'unknown';

            const enhancedPrompt = `
You are an insurance assistant.

Here are user details:
- Address: ${address}
- Square Footage: ${sqFt}
- PreQuote Info: ${JSON.stringify(preQuote)}

User asked: "${query}"

If the question is about what coverage to choose, recommend based on their address and sqFt.
Keep your reply short, user-friendly, and only answer the question.
`;

            setResponse('');
            getBotResponse(enhancedPrompt);
            setQuery('');
        }
    };


    return (
        <div className="fixed bottom-6 right-6 z-50">
            {open ? (
                <div className="w-[300px] bg-gray-900 text-white rounded-xl shadow-lg border border-black overflow-hidden">
                    {/* Header */}
                    <div className="flex justify-between items-center bg-black px-4 py-2">
                        <h4 className="text-sm font-semibold">Insurance Bot</h4>
                        <button onClick={() => setOpen(false)}><X className="w-4 h-4" /></button>
                    </div>

                    {/* Message Area */}
                    <div ref={scrollRef} className="p-3 text-sm space-y-2 max-h-[280px] overflow-y-auto">
                        {summary && (
                            <div className="bg-gray-900/30 p-2 rounded text-white">
                                <strong>Quick Guide:</strong>
                                <div className="mt-1 whitespace-pre-line">
                                    <ReactMarkdown>{summary}</ReactMarkdown>
                                </div>

                            </div>
                        )}

                        {response && (
                            <div className="bg-gray-800 p-2 rounded">
                                <strong>Bot:</strong>
                                <p className="mt-1 whitespace-pre-line">{response}</p>
                            </div>
                        )}

                        {loading && (
                            <div className="text-gray-400 text-xs italic">Thinking...</div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="flex items-center p-2 bg-gray-800 border-t border-gray-700">
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
                            className="flex-1 px-3 py-1 bg-gray-700 text-sm rounded-l outline-none"
                            placeholder="Ask a question..."
                        />
                        <button
                            disabled={loading}
                            onClick={handleAsk}
                            className="px-3 py-1 bg-gray-600 hover:bg-black rounded-r text-white text-sm"
                        >
                            {loading ? '...' : 'Ask'}
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => setOpen(true)}
                    className="p-3 rounded-full bg-purple-600 hover:bg-purple-700 text-white shadow-lg"
                >
                    <MessageSquare className="w-5 h-5" />
                </button>
            )}
        </div>
    );
};

export default Bot;
