import React from 'react';

const Loader = ({ label = 'Studio' }) => {
    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center min-h-screen w-full z-[9999]" style={{ background: '#0d0d12' }}>
            {/* Ambient glow */}
            <div style={{
                position: 'absolute',
                width: 400,
                height: 400,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(173,198,255,0.08) 0%, transparent 70%)',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%,-60%)',
                filter: 'blur(40px)',
                pointerEvents: 'none'
            }} />
            
            {/* Logo Section */}
            <div style={{ marginBottom: 32, display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    overflow: 'hidden',
                    boxShadow: '0 0 20px rgba(173,198,255,0.3)',
                    background: '#131315',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <img src="https://i.postimg.cc/8z7j15Yw/Dark_Logo.png" alt="Nirmana" style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
                </div>
                <span style={{
                    fontFamily: 'Manrope, sans-serif',
                    fontWeight: 700,
                    fontSize: 18,
                    letterSpacing: 2,
                    color: 'rgba(255,255,255,0.9)',
                    textTransform: 'uppercase'
                }}>Nirmana</span>
            </div>
            
            {/* Spinner ring */}
            <div style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                border: '2px solid rgba(173,198,255,0.15)',
                borderTopColor: '#adc6ff',
                animation: 'spin 0.9s linear infinite',
                marginBottom: 20
            }} />
            
            {/* Dynamic Label */}
            <p style={{
                fontFamily: 'Manrope, sans-serif',
                fontSize: 11,
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: 'rgba(173,198,255,0.5)',
                fontWeight: 600
            }}>
                Loading {label}
            </p>

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default Loader;
