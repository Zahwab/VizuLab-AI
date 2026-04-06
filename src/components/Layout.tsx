import React from 'react';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen relative p-3 lg:p-4 selection:bg-teal-accent/30 selection:text-white overflow-hidden">
            {/* Main Content */}
            <div className="max-w-[1920px] mx-auto min-h-[calc(100vh-1.5rem)] lg:h-[calc(100vh-2rem)] flex flex-col lg:flex-row gap-3 lg:gap-4 relative z-10 animate-fade-in-up">
                {children}
            </div>

            {/* Background Decor Layer - Cyber Lab Atmosphere */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                {/* Moving mesh grid background effect via inline style or CSS class if available - using pseudo elements in css would be cleaner but this works */}
                <div 
                  className="absolute inset-0 opacity-[0.03] animate-mesh"
                  style={{
                    backgroundImage: 'linear-gradient(var(--accent-teal) 1px, transparent 1px), linear-gradient(90deg, var(--accent-teal) 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                  }}
                ></div>
                
                {/* Animated glowing orbs */}
                <div className="absolute top-[-15%] left-[-10%] w-[600px] h-[600px] bg-teal-accent/10 rounded-full blur-[120px] animate-float delay-100"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-magenta-accent/10 rounded-full blur-[150px] animate-float delay-700"></div>
                
                {/* Overlay Vignette to keep edges dark */}
                <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(5,5,16,1)]"></div>
            </div>
        </div>
    );
};

