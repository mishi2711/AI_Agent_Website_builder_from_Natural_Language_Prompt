import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
    const location = useLocation();
    const [isLightMode, setIsLightMode] = useState(false);

    useEffect(() => {
        // Apply theme classes to the html element
        if (isLightMode) {
            document.documentElement.classList.add('light');
            document.documentElement.classList.remove('dark');
        } else {
            document.documentElement.classList.add('dark');
            document.documentElement.classList.remove('light');
        }
    }, [isLightMode]);

    const toggleTheme = () => {
        setIsLightMode(!isLightMode);
    };

    return (
        <nav className="fixed top-0 w-full z-50 bg-[#131313]/60 backdrop-blur-xl border-b border-white/5 transition-colors duration-500">
            <div className="flex justify-between items-center px-8 py-4 max-w-[1440px] mx-auto">
                <div className="flex items-center">
                    <Link to="/">
                        <img 
                            alt="Nirmana Logo" 
                            className="h-8 w-auto object-contain hover:scale-110 transition-transform duration-500" 
                            id="theme-logo" 
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCG_H7eNItb5KOc8q7JoDIoExovh1LJT4d88h5m_9uuOoSjs7TH5sRVN5zueZaI4MzckfBYvD_iO49IzPWJ2aOI-oLIyoABS9Sbb1fzOlEzkMD1vYCI5I2P-9HuPxjMnGpCTaS4G056AyXTNbQM28WVgGwvIqkD5ifLP39aHQ_giRVEwNbIUpHmdx5489vEkRV-GyleQpY_w3xHnoLr-OZ2smOYM60ypJb80lWm4r_pzDnlGHQfhQxZ4e3vUVTAv-sathi05bP5ak0"
                        />
                    </Link>
                </div>
                
                <div className="hidden md:flex items-center space-x-12 absolute left-1/2 -translate-x-1/2 font-headline tracking-tighter">
                    <Link 
                        className={`font-bold text-[11px] uppercase tracking-tight transition-all duration-500 ${location.pathname === '/dashboard' ? 'text-[#adc6ff] border-b border-[#adc6ff]/50 pb-1' : 'text-[#e5e2e1]/70 hover:text-[#adc6ff]'}`} 
                        to="/dashboard"
                    >
                        Dashboard
                    </Link>
                    <Link 
                        className="text-[#e5e2e1]/70 hover:text-[#adc6ff] transition-all duration-500 font-bold text-[11px] uppercase tracking-tight" 
                        to="#"
                    >
                        Gallery
                    </Link>
                    <Link 
                        className="text-[#e5e2e1]/70 hover:text-[#adc6ff] transition-all duration-500 font-bold text-[11px] uppercase tracking-tight" 
                        to="#"
                    >
                        Pricing
                    </Link>
                </div>
                
                <div className="flex items-center space-x-6">
                    <button 
                        className="text-[#e5e2e1]/70 hover:text-[#adc6ff] transition-all duration-500 flex items-center justify-center p-2 rounded-full hover:bg-white/5 active:scale-90" 
                        id="theme-toggle"
                        onClick={toggleTheme}
                    >
                        <span className="material-symbols-outlined" id="theme-icon">
                            {isLightMode ? 'dark_mode' : 'light_mode'}
                        </span>
                    </button>
                    <Link to="/login">
                        <button className="text-[#e5e2e1] px-6 py-3 rounded-full font-bold text-[10px] uppercase tracking-widest border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-500 hover:border-white/30 active:scale-95">
                            Login / Sign Up
                        </button>
                    </Link>
                    <Link to="/dashboard">
                        <button className="bg-white text-black px-8 py-3 rounded-full font-bold text-[10px] uppercase tracking-widest hover:bg-[#adc6ff] transition-all duration-500 shadow-[0_20px_50px_rgba(173,198,255,0.05)] scale-95 active:scale-90">
                            Start Building
                        </button>
                    </Link>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
