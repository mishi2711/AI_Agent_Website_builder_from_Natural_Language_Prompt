import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer className="bg-[#0e0e0e] border-t border-white/5 font-body text-sm tracking-wide transition-colors duration-500">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 px-12 py-24 max-w-[1440px] mx-auto">
                <div className="col-span-2 md:col-span-1">
                    <div className="flex items-center mb-10">
                        <img 
                            alt="Nirmana Logo Dark" 
                            className="h-8 w-auto object-contain mr-4 hidden dark:block" 
                            id="footer-logo-dark" 
                            src="https://i.postimg.cc/8z7j15Yw/Dark_Logo.png"
                        />
                        <img 
                            alt="Nirmana Logo Light" 
                            className="h-8 w-auto object-contain mr-4 block dark:hidden" 
                            id="footer-logo-light" 
                            src="https://i.postimg.cc/T3KpRws9/Light_Logo.png"
                        />
                        <span className="text-lg font-bold text-[#e5e2e1] uppercase italic fix-clipping">NIRMANA</span>
                    </div>
                    <p className="text-[#e5e2e1]/50 text-xs uppercase tracking-widest leading-loose max-w-sm">
                        Pioneering collective intelligence for cinematic digital experiences. The future is built by agents.
                    </p>
                </div>
                <div>
                    <h5 className="text-[#adc6ff] font-bold text-[10px] mb-8 uppercase tracking-[0.4em] heading-glow">Platform</h5>
                    <ul className="space-y-4">
                        <li><Link className="text-[#e5e2e1]/50 hover:text-[#e9c400] transition-colors duration-300 text-xs font-bold uppercase" to="/dashboard">Projects</Link></li>
                        <li><Link className="text-[#e5e2e1]/50 hover:text-[#e9c400] transition-colors duration-300 text-xs font-bold uppercase" to="#">Gallery</Link></li>
                        <li><Link className="text-[#e5e2e1]/50 hover:text-[#e9c400] transition-colors duration-300 text-xs font-bold uppercase" to="#">Pricing</Link></li>
                    </ul>
                </div>
                <div>
                    <h5 className="text-[#adc6ff] font-bold text-[10px] mb-8 uppercase tracking-[0.4em] heading-glow">Connect</h5>
                    <ul className="space-y-4">
                        <li><a className="text-[#e5e2e1]/50 hover:text-[#e9c400] transition-colors duration-300 text-xs font-bold uppercase" href="https://github.com/RupamGanguly46">Rupam Ganguly</a></li>
                        <li><a className="text-[#e5e2e1]/50 hover:text-[#e9c400] transition-colors duration-300 text-xs font-bold uppercase" href="https://github.com/mishi2711">Mishi Johri</a></li>
                    </ul>
                </div>
                <div>
                    <h5 className="text-[#adc6ff] font-bold text-[10px] mb-8 uppercase tracking-[0.4em] heading-glow">Legal</h5>
                    <ul className="space-y-4">
                        <li><a className="text-[#e5e2e1]/50 hover:text-[#e9c400] transition-colors duration-300 text-xs font-bold uppercase" href="#">Privacy</a></li>
                        <li><a className="text-[#e5e2e1]/50 hover:text-[#e9c400] transition-colors duration-300 text-xs font-bold uppercase" href="#">Terms</a></li>
                    </ul>
                </div>
            </div>
            <div className="pb-12 text-center text-[#e5e2e1]/10 text-[9px] font-bold tracking-[0.6em] uppercase">
                © 2026 NIRMANA STUDIO — ALL RIGHTS RESERVED
            </div>
        </footer>
    );
}

export default Footer;
