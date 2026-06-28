import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Terminal, ArrowLeft, Tag, Activity, FileText } from 'lucide-react';

const ToolDetail = () => {
    const { id } = useParams();
    const [tool, setTool] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTool = async () => {
            setLoading(true);
            try {
                // We fetched all tools in library, here we might need a single tool endpoint
                // But our backend only has /tools and /tools/<category>
                // We can fetch all and find by ID for now (Not efficient but works for MVP)
                // OR add GET /api/tools/id endpoint. 
                // Let's just fetch all and filter client side to avoid backend changes if not needed.
                // Use relative path via proxy
                const res = await axios.get('/api/tools');
                const found = res.data.find(t => t.id === parseInt(id));
                setTool(found);
            } catch (error) {
                console.error("Failed to fetch tool", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTool();
    }, [id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center text-cyber-green">Loading...</div>;
    if (!tool) return <div className="min-h-screen flex items-center justify-center text-red-500">Tool not found</div>;

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Link to="/tools" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
                <ArrowLeft size={16} className="mr-2" /> Back to Library
            </Link>

            <div className="bg-cyber-gray border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-gray-700 bg-gray-900/50">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-cyber-green font-mono text-sm tracking-wider uppercase border border-cyber-green/30 px-2 py-1 rounded">
                            {tool.category}
                        </span>
                        <div className="flex gap-2">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${tool.complexity === 'High' ? 'bg-red-900/50 text-red-400' :
                                tool.complexity === 'Medium' ? 'bg-yellow-900/50 text-yellow-400' :
                                    'bg-green-900/50 text-green-400'
                                }`}>
                                {tool.complexity}
                            </span>
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-4">{tool.name}</h1>
                    <p className="text-xl text-gray-400 leading-relaxed">
                        {tool.description}
                    </p>
                </div>

                <div className="p-8 space-y-8">
                    {/* Usage Command */}
                    <div>
                        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                            <Terminal size={20} className="text-cyber-blue" />
                            Usage Command
                        </h3>
                        <div className="bg-black rounded-lg p-4 font-mono text-sm text-gray-300 border border-gray-800 overflow-x-auto">
                            <code className="text-cyber-green">$</code> {tool.command_usage}
                        </div>
                    </div>

                    {/* Performance Notes */}
                    <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/50">
                        <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                            <Activity size={20} className="text-cyber-purple" />
                            Performance & Notes
                        </h3>
                        <p className="text-gray-300">
                            {tool.performance_notes}
                        </p>
                    </div>

                    {/* Meta Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700/50">
                            <span className="text-gray-500 text-xs uppercase tracking-wide">License</span>
                            <div className="text-white font-medium flex items-center gap-2 mt-1">
                                <FileText size={16} /> {tool.license}
                            </div>
                        </div>
                        {/* More meta if needed */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ToolDetail;
