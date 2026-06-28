import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ToolCard from '../components/ToolCard';
import { useSearchParams } from 'react-router-dom';

const ToolLibrary = () => {
    const [tools, setTools] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();

    // Filters
    const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || 'All');
    const searchTerm = searchParams.get('search') || '';

    useEffect(() => {
        const fetchTools = async () => {
            setLoading(true);
            try {
                // Use relative path with Vite proxy
                let url = '/api/tools';
                if (categoryFilter !== 'All') {
                    // For now, simpler to fetch all and filter client side if backend category endpoint is complex with specific names
                    // But we implemented /api/tools/<category>
                    // Wait, the category names in backend might need exact match. client side filter is safer for MVP if names mismatch slightly.
                    // But let's try to use the backend filter if possible, or just fetch all.
                }

                const res = await axios.get(url);
                setTools(res.data);
            } catch (error) {
                console.error("Failed to fetch tools", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTools();
    }, [categoryFilter]);

    // Client-side filtering for search term and precise category match if fetched all
    const filteredTools = tools.filter(tool => {
        const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tool.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'All' || tool.category === categoryFilter ||
            // Handle partial matches or backend category response format
            tool.category.includes(categoryFilter);

        return matchesSearch && matchesCategory;
    });

    const categories = ['All', 'Network Scanning', 'Vulnerability Assessment', 'Penetration Testing', 'Packet Sniffers / Analyzers', 'Wireless Network Tools'];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h2 className="text-3xl font-bold text-white">Tool Library</h2>
                <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setCategoryFilter(cat)}
                            className={`px-3 py-1 rounded-full text-sm border transition-colors ${categoryFilter === cat
                                ? 'bg-cyber-green text-black border-cyber-green font-bold'
                                : 'bg-transparent text-gray-400 border-gray-700 hover:border-gray-500'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="text-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyber-green mx-auto"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTools.map(tool => (
                        <ToolCard key={tool.id} tool={tool} />
                    ))}
                    {filteredTools.length === 0 && (
                        <div className="col-span-full text-center py-20 text-gray-500">
                            No tools found matching your criteria.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ToolLibrary;
