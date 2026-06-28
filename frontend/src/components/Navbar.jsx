import React from 'react';
import { Shield, Home, Search, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="bg-cyber-gray border-b border-gray-800 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center space-x-2">
                        <Shield className="h-8 w-8 text-cyber-green" />
                        <span className="text-xl font-bold tracking-wider text-white">HackGenius</span>
                    </Link>
                    <div className="flex items-center space-x-6">
                        <Link to="/" className="text-gray-300 hover:text-cyber-green transition-colors flex items-center gap-2">
                            <Home size={18} /> Home
                        </Link>
                        <Link to="/tools" className="text-gray-300 hover:text-cyber-green transition-colors flex items-center gap-2">
                            <Search size={18} /> Library
                        </Link>
                        <div className="text-gray-500 text-sm border border-gray-700 px-2 py-1 rounded">
                            v1.0.0
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
