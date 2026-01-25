import React from 'react';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-background text-white p-4 font-sans selection:bg-purple-500/30">
            <div className="max-w-[1920px] mx-auto h-[calc(100vh-2rem)] flex gap-4">
                {children}
            </div>

            {/* Background Decor */}
            <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] animate-pulse-slow"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px] animate-pulse-slow delay-1000"></div>
                <div className="absolute top-[20%] right-[30%] w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[80px]"></div>
            </div>
        </div>
    );
};
