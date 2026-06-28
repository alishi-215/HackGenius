import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ChatInterface from './components/ChatInterface';
import LandingPage from './pages/LandingPage';
import ToolLibrary from './pages/ToolLibrary';
import ToolDetail from './pages/ToolDetail';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-cyber-black flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/tools" element={<ToolLibrary />} />
            <Route path="/tool/:id" element={<ToolDetail />} />
          </Routes>
        </main>
        <ChatInterface />
      </div>
    </BrowserRouter>
  );
}

export default App;
