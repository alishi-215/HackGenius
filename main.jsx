import React, { useState } from 'react';
import { MessageSquare, X, Send, Bot, TerminalSquare, ShieldAlert, ShieldCheck } from 'lucide-react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

const ChatInterface = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { type: 'bot', text: 'Hello! I am your Ethical Hacking Assistant. Ask me about any tool or technique.' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [isLogMode, setIsLogMode] = useState(false);
    const [persona, setPersona] = useState('neutral'); // neutral, red, blue

    const toggleChat = () => setIsOpen(!isOpen);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input;
        setMessages([...messages, { type: 'user', text: userMsg }]);
        setInput('');
        setLoading(true);

        try {
            // Use relative path via proxy
            const response = await axios.post('/api/chat', {
                query: userMsg,
                persona: persona
            });
            setMessages(prev => [...prev, { type: 'bot', text: response.data.response }]);
        } catch (error) {
            setMessages(prev => [...prev, { type: 'bot', text: 'Error: Could not reach the assistant.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {!isOpen && (
                <button
                    onClick={toggleChat}
                    className="relative group bg-gradient-to-br from-cyber-green to-emerald-600 text-black p-4 rounded-full shadow-lg hover:shadow-[0_0_30px_rgba(0,255,65,0.6)] transition-all duration-300 transform hover:scale-110 z-50 border border-green-400/50"
                >
                    <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
                    <MessageSquare size={28} className="relative z-10" />
                </button>
            )}

            {isOpen && (
                <div className="bg-black/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl w-80 sm:w-[450px] shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col h-[600px] overflow-hidden transition-all duration-500 ring-1 ring-white/10">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-4 flex flex-col gap-3 justify-between border-b border-gray-700/50 shadow-md relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyber-green/50 to-transparent"></div>
                        <div className="flex justify-between items-center w-full">
                            <h3 className="text-white font-bold flex items-center gap-3 text-lg tracking-wide">
                                <Bot className={persona === 'red' ? 'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]' : persona === 'blue' ? 'text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]' : 'text-cyber-green drop-shadow-[0_0_8px_rgba(0,255,65,0.8)]'} size={24} />
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Genius AI</span>
                            </h3>
                            <button onClick={toggleChat} className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Persona Switcher */}
                        <div className="flex bg-gray-900/50 rounded-lg p-1 border border-gray-700/50">
                            <button
                                onClick={() => setPersona('neutral')}
                                className={`flex-1 text-[10px] uppercase tracking-wider py-1 rounded transition-colors ${persona === 'neutral' ? 'bg-gray-700 text-white font-bold' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                                Neutral
                            </button>
                            <button
                                onClick={() => setPersona('blue')}
                                className={`flex-1 text-[10px] uppercase tracking-wider py-1 rounded flex items-center justify-center gap-1 transition-colors ${persona === 'blue' ? 'bg-blue-900/60 text-blue-400 font-bold border border-blue-500/30' : 'text-gray-500 hover:text-blue-400/70'}`}
                            >
                                <ShieldCheck size={12} /> Blue Team
                            </button>
                            <button
                                onClick={() => setPersona('red')}
                                className={`flex-1 text-[10px] uppercase tracking-wider py-1 rounded flex items-center justify-center gap-1 transition-colors ${persona === 'red' ? 'bg-red-900/60 text-red-400 font-bold border border-red-500/30' : 'text-gray-500 hover:text-red-400/70'}`}
                            >
                                <ShieldAlert size={12} /> Red Team
                            </button>
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-5 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                                <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.type === 'user'
                                    ? 'bg-gradient-to-br from-cyber-blue/90 to-blue-600/90 text-white rounded-tr-sm backdrop-blur-sm border border-blue-400/30'
                                    : 'bg-gray-800/80 text-gray-200 rounded-tl-sm border border-gray-700/50 markdown-body shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]'
                                    }`}>
                                    {msg.type === 'bot' ? (
                                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                                    ) : (
                                        msg.text
                                    )}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start animate-in fade-in duration-300">
                                <div className="bg-gray-800/60 text-cyber-green p-4 rounded-2xl rounded-tl-sm text-xs border border-green-900/50 flex items-center gap-3 backdrop-blur-sm">
                                    <div className="w-2 h-2 bg-cyber-green rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-cyber-green rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                    <div className="w-2 h-2 bg-cyber-green rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    <span className="ml-1 tracking-widest text-green-400/80 uppercase font-mono">Analyzing</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Mode Toggle */}
                    <div className="bg-gray-900/80 p-2 border-t border-gray-800 flex justify-center backdrop-blur-md">
                        <button
                            onClick={() => setIsLogMode(!isLogMode)}
                            className={`text-xs px-4 py-1.5 rounded-full flex items-center gap-2 transition-all duration-300 font-medium tracking-wide ${isLogMode ? 'bg-cyber-blue/20 text-cyber-blue border border-cyber-blue/50 shadow-[0_0_10px_rgba(0,184,255,0.2)]' : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 border border-transparent'}`}
                        >
                            <TerminalSquare size={14} className={isLogMode ? "animate-pulse" : ""} />
                            {isLogMode ? "Standard Chat" : "Switch to Log Analysis"}
                        </button>
                    </div>

                    {/* Input Area */}
                    <form onSubmit={sendMessage} className="p-4 bg-gray-900/90 border-t border-gray-800 flex flex-col gap-3 backdrop-blur-xl">
                        {isLogMode ? (
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Paste raw terminal logs (Nmap, Nikto, Wireshark)..."
                                className="w-full bg-black/50 border border-gray-700 text-gray-200 text-sm focus:outline-none focus:border-cyber-blue focus:ring-1 focus:ring-cyber-blue/50 resize-none h-28 scrollbar-thin scrollbar-thumb-gray-600 transition-all font-mono rounded-xl px-4 py-3"
                            />
                        ) : (
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask about tools, techniques, or vulnerabilities..."
                                className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-3 text-gray-200 text-sm focus:outline-none focus:border-cyber-green focus:ring-1 focus:ring-cyber-green/50 transition-all"
                            />
                        )}

                        <div className="flex justify-between items-center px-1">
                            <span className="text-[10px] text-gray-500 uppercase tracking-wider font-mono">
                                Powered by Local AI
                            </span>
                            <button
                                type="submit"
                                disabled={loading || !input.trim()}
                                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed font-bold shadow-lg ${isLogMode
                                        ? 'bg-gradient-to-r from-cyber-blue to-blue-500 text-black hover:shadow-[0_0_15px_rgba(0,184,255,0.4)]'
                                        : persona === 'red'
                                            ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white hover:shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                                            : persona === 'blue'
                                                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-[0_0_15px_rgba(59,130,246,0.4)]'
                                                : 'bg-gradient-to-r from-cyber-green to-emerald-500 text-black hover:shadow-[0_0_15px_rgba(0,255,65,0.4)]'
                                    }`}
                            >
                                {isLogMode ? "Analyze Log" : "Send"} <Send size={16} className={input.trim() && !loading ? "animate-pulse" : ""} />
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ChatInterface;
