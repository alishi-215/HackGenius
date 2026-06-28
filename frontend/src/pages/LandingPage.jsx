import React, { useState } from 'react';
import { Search, Shield, Cpu, Wifi, Radio, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (search) {
            navigate(`/tools?search=${encodeURIComponent(search)}`);
        }
    };

    const categories = [
        { name: 'Network Scanning', icon: <Radio size={32} />, color: 'text-cyber-blue' },
        { name: 'Vulnerability Assessment', icon: <Shield size={32} />, color: 'text-cyber-green' },
        { name: 'Penetration Testing', icon: <Lock size={32} />, color: 'text-red-500' },
        { name: 'Packet Analyzers', icon: <Cpu size={32} />, color: 'text-purple-500' },
        { name: 'Wireless Tools', icon: <Wifi size={32} />, color: 'text-yellow-400' },
    ];

    return (
        <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-4">
            <div className="text-center max-w-4xl mx-auto mb-16 animate-fade-in-up">
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6">
                    HACK<span className="text-cyber-green">GENIUS</span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-2xl mx-auto">
                    The AI-Driven Ethical Hacking Guide. Find the right tool for every mission.
                </p>

                <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto mb-12 group">
                    <div className="absolute inset-0 bg-cyber-green opacity-20 blur-xl group-hover:opacity-30 transition-opacity rounded-full"></div>
                    <div className="relative flex items-center bg-black border border-gray-700 rounded-full px-6 py-4 shadow-2xl focus-within:border-cyber-green transition-colors">
                        <Search className="text-gray-500 mr-4" size={24} />
                        <input
                            type="text"
                            placeholder="Describe your objective (e.g., 'Scan network for open ports')..."
                            className="bg-transparent border-none text-white text-lg w-full focus:outline-none placeholder-gray-600"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </form>

                <div className="flex flex-wrap justify-center gap-4">
                    {categories.map((cat, idx) => (
                        <button
                            key={idx}
                            onClick={() => navigate(`/tools?category=${encodeURIComponent(cat.name)}`)}
                            className="flex items-center gap-2 bg-gray-900 border border-gray-800 px-4 py-2 rounded-full hover:border-cyber-green hover:bg-gray-800 transition-all"
                        >
                            <span className={cat.color}>{cat.icon}</span>
                            <span className="text-sm font-medium">{cat.name}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
