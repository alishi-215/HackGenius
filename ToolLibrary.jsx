import React from 'react';
import { Link } from 'react-router-dom';
import { Terminal, ExternalLink, Activity, Unlock, AlertTriangle } from 'lucide-react';

const ToolCard = ({ tool }) => {
    const complexityColors = {
        'Low': 'bg-green-500/20 text-green-400 border-green-500/30',
        'Medium': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        'High': 'bg-red-500/20 text-red-400 border-red-500/30',
    };

    return (
        <div className="bg-cyber-gray border border-gray-800 rounded-lg p-6 hover:border-cyber-green transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,255,65,0.1)] group">
            <div className="flex justify-between items-start mb-4">
                <div className={`px-2 py-1 rounded text-xs font-mono border ${complexityColors[tool.complexity] || 'bg-gray-700 text-gray-300'}`}>
                    {tool.complexity} Complexity
                </div>
                <div className="text-xs text-gray-500 border border-gray-700 px-2 py-1 rounded">
                    {tool.license}
                </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyber-green transition-colors flex items-center gap-2">
                <Terminal size={20} />
                {tool.name}
            </h3>

            <p className="text-gray-400 text-sm mb-4 line-clamp-2 min-h-[40px]">
                {tool.description}
            </p>

            <Link
                to={`/tool/${tool.id}`}
                className="inline-flex items-center text-cyber-blue hover:text-white transition-colors text-sm font-medium mt-auto"
            >
                View Details <ExternalLink size={14} className="ml-1" />
            </Link>
        </div>
    );
};

export default ToolCard;
