import React from 'react';
import { ShieldAlert, CheckCircle, XCircle } from 'lucide-react';

const EthicalModal = ({ isOpen, onClose, onConfirm, toolName }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[60] backdrop-blur-sm">
            <div className="bg-gray-900 border border-cyber-green rounded-lg p-6 max-w-md w-full shadow-[0_0_30px_rgba(0,255,65,0.2)]">
                <div className="flex items-center gap-3 mb-4 text-cyber-green">
                    <ShieldAlert size={32} />
                    <h2 className="text-xl font-bold uppercase tracking-wider">Ethical Compliance Check</h2>
                </div>

                <p className="text-gray-300 mb-6 text-sm leading-relaxed">
                    You are creating to view usage commands for <span className="text-white font-bold">{toolName}</span>.
                    These tools maximize power and risk.
                </p>

                <div className="bg-red-900/20 border border-red-500/30 p-3 rounded mb-6">
                    <p className="text-red-400 text-xs font-mono">
                        WARNING: UNAUTHORIZED USE OF THIS TOOL MAY VIOLATE LOCAL AND INTERNATIONAL LAWS.
                    </p>
                </div>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={onConfirm}
                        className="flex items-center justify-center gap-2 bg-cyber-green text-black font-bold py-3 rounded hover:bg-white transition-all"
                    >
                        <CheckCircle size={18} />
                        I HAVE AUTHORIZATION
                    </button>
                    <button
                        onClick={onClose}
                        className="flex items-center justify-center gap-2 bg-transparent border border-gray-600 text-gray-400 font-bold py-2 rounded hover:border-white hover:text-white transition-all"
                    >
                        <XCircle size={18} />
                        CANCEL
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EthicalModal;
