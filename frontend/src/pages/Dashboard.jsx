import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProjects, createProject } from '../api/api';
import './Dashboard.css';

function Dashboard() {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [projectName, setProjectName] = useState('');
    const [framework, setFramework] = useState('react');
    const [isCreating, setIsCreating] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLightMode, setIsLightMode] = useState(document.documentElement.classList.contains('light'));

    useEffect(() => {
        fetchProjects();
    }, []);

    useEffect(() => {
        if (isLightMode) {
            document.documentElement.classList.add('light');
            document.documentElement.classList.remove('dark');
        } else {
            document.documentElement.classList.add('dark');
            document.documentElement.classList.remove('light');
        }
    }, [isLightMode]);

    const fetchProjects = async () => {
        try {
            const { data } = await getProjects();
            setProjects(data);
        } catch (err) {
            console.error('Failed to fetch projects:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        if (!projectName.trim()) return;
        setIsCreating(true);
        try {
            const { data } = await createProject(projectName.trim(), framework.toLowerCase());
            navigate(`/workspace/${data.projectId}`);
        } catch (err) {
            alert('Failed to create project: ' + (err.response?.data?.error || err.message));
        } finally {
            setIsCreating(false);
        }
    };

    const formatDate = (dateStr) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const hrs = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(hrs / 24);
        if (days > 0) return `Last edited ${days}d ago`;
        if (hrs > 0) return `Last edited ${hrs}h ago`;
        return 'Just now';
    };

    const filteredProjects = projects.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getFrameworkDetails = (fw) => {
        switch(fw?.toLowerCase()) {
            case 'react': return { icon: 'movie_filter', colorClass: 'text-primary bg-primary/10', glowClass: 'hover:border-primary/30', blurClass: 'bg-primary/5 group-hover:bg-primary/10', bgDot: 'bg-primary/50' };
            case 'vue': return { icon: 'auto_awesome', colorClass: 'text-secondary bg-secondary/10', glowClass: 'hover:border-secondary/30', blurClass: 'bg-secondary/5 group-hover:bg-secondary/10', bgDot: 'bg-secondary/50' };
            case 'python': return { icon: 'model_training', colorClass: 'text-tertiary bg-tertiary/10', glowClass: 'hover:border-tertiary/30', blurClass: 'bg-tertiary/5 group-hover:bg-tertiary/10', bgDot: 'bg-tertiary/50' };
            default: return { icon: 'data_object', colorClass: 'text-primary bg-primary/10', glowClass: 'hover:border-primary/30', blurClass: 'bg-primary/5 group-hover:bg-primary/10', bgDot: 'bg-primary/50' };
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen w-full">
                <span className="loading-spinner text-primary text-4xl" />
            </div>
        );
    }

    return (
        <div className="dashboard-page flex bg-background overflow-hidden relative min-h-[1024px] w-full">
            {/* NavigationDrawer */}
            <aside className="w-64 fixed left-0 top-0 flex flex-col h-full border-r border-white/5 bg-[#131315]/80 backdrop-blur-xl shadow-[20px_0px_40px_rgba(173,198,255,0.03)] z-50 transition-all duration-300">
                <div className="p-8">
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary font-manrope tracking-tight">DEVELOP WITH<div>NIRMANA</div></h1>
                </div>
                <nav className="flex-1 px-4 space-y-2 mt-4 font-manrope tracking-tight">
                    <a className="flex items-center gap-4 px-4 py-3 text-primary bg-primary/10 border-r-2 border-primary transition-all duration-300 ease-in-out cursor-pointer">
                        <span className="material-symbols-outlined">dashboard</span>
                        <span className="text-sm font-medium">Dashboard</span>
                    </a>
                    <a className="flex items-center gap-4 px-4 py-3 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300 ease-in-out cursor-pointer">
                        <span className="material-symbols-outlined">folder_open</span>
                        <span className="text-sm font-medium">Library</span>
                    </a>
                    <a className="flex items-center gap-4 px-4 py-3 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300 ease-in-out cursor-pointer">
                        <span className="material-symbols-outlined">insights</span>
                        <span className="text-sm font-medium">Analytics</span>
                    </a>
                    <a className="flex items-center gap-4 px-4 py-3 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300 ease-in-out cursor-pointer">
                        <span className="material-symbols-outlined">settings</span>
                        <span className="text-sm font-medium">Settings</span>
                    </a>
                </nav>
                <footer className="flex justify-between items-center px-6 py-4 mt-auto border-t border-white/5 font-inter text-[10px] uppercase tracking-widest text-slate-500">
                    <span className="leading-relaxed">© 2026 Nirmana Inc.</span>
                </footer>
            </aside>

            {/* Main Canvas */}
            <main className="flex-1 ml-64 min-h-[1024px] relative overflow-y-auto transition-all duration-300">
                {/* TopAppBar */}
                <header className="fixed top-0 right-0 w-[calc(100%-16rem)] z-40 bg-[#131315]/40 backdrop-blur-md flex justify-between items-center px-8 h-16 border-b border-white/5 transition-all duration-300">
                    <div className="flex items-center gap-4 flex-1 max-w-xl">
                        <div className="relative w-full">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
                            <input 
                                className="w-full bg-surface-container-lowest border-none rounded-xl pl-10 pr-4 py-2 text-xs text-on-surface focus:ring-1 focus:ring-primary-container placeholder:text-slate-400/50 transition-all outline-none" 
                                placeholder="Search cinematic workflows..." 
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        {/* Theme Toggle */}
                        <button 
                            className="p-2 rounded-full hover:bg-slate-500/10 text-slate-500 dark:text-slate-300 transition-colors flex items-center justify-center" 
                            onClick={() => setIsLightMode(!isLightMode)}
                        >
                            <span className="material-symbols-outlined" id="theme-icon">{isLightMode ? 'light_mode' : 'dark_mode'}</span>
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden md:block">
                                <p className="text-xs font-semibold text-on-surface font-manrope">Project Alpha</p>
                                <p className="text-[10px] text-primary">Active Session</p>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center p-[1px]">
                                <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden">
                                    <img alt="User Profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBEwsmZzyjOawnG17OyWppFKBOyP1UeuWIPxqud-Kz-NrfCqijP4E0I0EeDGxIk9y5Z20zwb5Ld6Jqb4H_WIOMvU1i7vTH91FSXUSSSnyhsj3S7BZa5dyaJeaftL7vEp03KbJsf1gU1-ggFEf_kJx8GmXtpUKOiK-s49Oobq73bDoULcdvJ_kIxwapBFci4ZoQG4cWx06ozIGchNQkKyIEDDACFWtGtLIiLGerYFO7sa5t_9bpgGUziUaiBc18a-puE65EgeEgseqg" />
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="pt-24 pb-12 px-12">
                    {/* Hero Header */}
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="text-5xl font-extrabold font-headline tracking-tighter mb-2 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent transition-all duration-300">Your Projects</h2>
                            <p className="text-on-surface-variant max-w-lg font-body transition-colors duration-300">Manage and deploy your high-fidelity cinematic websites within our ethereal integrated development environment.</p>
                        </div>
                        <button 
                            className="bg-gradient-to-br from-primary to-primary-container text-on-primary font-manrope font-bold py-3 px-8 rounded-xl glow-primary hover:scale-[1.02] transition-all duration-300 flex items-center gap-2"
                            onClick={() => setShowModal(true)}
                        >
                            <span className="material-symbols-outlined text-lg">add</span>
                            New Project
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProjects.map((project) => {
                            const fw = getFrameworkDetails(project.framework);
                            return (
                                <div 
                                    key={project._id} 
                                    className={`project-card glass-card group p-6 rounded-2xl cinematic-shadow hover:scale-[1.02] ${fw.glowClass} transition-all duration-500 cursor-pointer relative overflow-hidden`}
                                    onClick={() => navigate(`/workspace/${project._id}`)}
                                >
                                    <div className={`absolute -right-12 -top-12 w-32 h-32 ${fw.blurClass} blur-3xl transition-all`}></div>
                                    <div className="flex justify-between items-start mb-16">
                                        <div className="p-3 rounded-xl bg-surface-container-low border border-white/5 transition-colors duration-300 z-10 relative">
                                            <span className={`material-symbols-outlined ${fw.colorClass.split(' ')[0]}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                                                {fw.icon}
                                            </span>
                                        </div>
                                        <span className={`text-[10px] font-bold tracking-widest px-2 py-1 rounded transition-colors duration-300 z-10 relative ${fw.colorClass}`}>
                                            {(project.framework || 'REACT').toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="z-10 relative">
                                        <h3 className="project-title text-xl font-bold font-headline mb-1 transition-colors duration-300 text-on-surface">{project.name}</h3>
                                        <p className="text-xs text-on-surface-variant transition-colors duration-300">{formatDate(project.createdAt)}</p>
                                    </div>
                                    <div className="mt-6 flex items-center justify-between z-10 relative">
                                        <div className="flex -space-x-2">
                                            <div className="w-6 h-6 rounded-full border-2 border-background bg-surface-variant"></div>
                                            <div className={`w-6 h-6 rounded-full border-2 border-background ${fw.bgDot.split(' ')[0]}`}></div>
                                        </div>
                                        <span className={`material-symbols-outlined text-on-surface-variant group-hover:${fw.colorClass.split(' ')[0]} transition-colors`}>arrow_forward</span>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Featured Empty Template Card */}
                        <div className="project-card md:col-span-2 glass-card rounded-2xl overflow-hidden relative h-64 group cursor-pointer hover:border-white/20 transition-all duration-500 keep-dark-context">
                            <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent z-10 p-8 flex flex-col justify-center">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
                                    <span className="text-[10px] font-bold tracking-widest text-on-surface-variant">NEW TEMPLATE</span>
                                </div>
                                <h3 className="project-title text-3xl font-bold font-headline mb-4 max-w-sm text-white">Infinite Horizon Cinematic Renderer</h3>
                                <div className="flex gap-4">
                                    <button className="bg-white/10 backdrop-blur-md px-6 py-2 rounded-lg text-xs font-bold hover:bg-white/20 transition-all text-white border border-white/10">View Demo</button>
                                </div>
                            </div>
                            <img alt="Atmospheric visualization" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQyCqRcUwIESvlXQHEz0KFD7FAaPk2sa2zd3TIptvI3fmJntojZS88z-2zSfHb9RduXdXO7sXI9zGTFvWBNVmif7ckpbszAszOTcxjzXCFHl7dpQZOBCxDB2CQ2bJtEIFNjCrMfKime5hLGpg-2VGJsv8y5D1L1rIkH7zAMoqrmnBcLxvzFqDw-yyODkQGKzR8pmOkZeAhFMZ1aO6lqdDrW2WL70qkkKEDka_ddhboGfsrTc7kkI8UAiIsKF8VsaaNnjyhwgg14dA" />
                        </div>
                    </div>
                </div>
            </main>

            {/* Create New Project Modal */}
            <div className={`fixed inset-0 bg-background/60 backdrop-blur-sm z-[100] flex items-center justify-center transition-all duration-300 ${showModal ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                <div className="glass-card w-full max-w-lg rounded-3xl p-10 cinematic-shadow border border-white/20" onClick={e => e.stopPropagation()}>
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-2xl font-bold font-headline text-on-surface">Create New Project</h3>
                        <span className="material-symbols-outlined cursor-pointer hover:text-white text-on-surface-variant" onClick={() => setShowModal(false)}>close</span>
                    </div>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest font-bold text-outline mb-2">Project Name</label>
                            <div className="relative">
                                <input 
                                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-3 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-outline/30 text-on-surface" 
                                    placeholder="e.g. Neon_Dream_System" 
                                    type="text"
                                    value={projectName}
                                    onChange={(e) => setProjectName(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest font-bold text-outline mb-2">Select Framework</label>
                            <div className="grid grid-cols-3 gap-3">
                                <button 
                                    onClick={() => setFramework('react')}
                                    className={`p-4 rounded-xl flex flex-col items-center gap-2 transition-all ${framework === 'react' ? 'bg-surface-container-low border border-primary/40 text-primary' : 'bg-surface-container-low border border-black/5 dark:border-white/5 text-on-surface-variant hover:border-primary/20'}`}
                                >
                                    <span className="material-symbols-outlined">data_object</span>
                                    <span className="text-[10px] font-bold">React</span>
                                </button>
                                <button 
                                    onClick={() => setFramework('node')}
                                    className={`p-4 rounded-xl flex flex-col items-center gap-2 transition-all ${framework === 'node' ? 'bg-surface-container-low border border-primary/40 text-primary' : 'bg-surface-container-low border border-black/5 dark:border-white/5 text-on-surface-variant hover:border-primary/20'}`}
                                >
                                    <span className="material-symbols-outlined">api</span>
                                    <span className="text-[10px] font-bold">Node.js</span>
                                </button>
                                <button 
                                    onClick={() => setFramework('python')}
                                    className={`p-4 rounded-xl flex flex-col items-center gap-2 transition-all ${framework === 'python' ? 'bg-surface-container-low border border-primary/40 text-primary' : 'bg-surface-container-low border border-black/5 dark:border-white/5 text-on-surface-variant hover:border-primary/20'}`}
                                >
                                    <span className="material-symbols-outlined">terminal</span>
                                    <span className="text-[10px] font-bold">Python</span>
                                </button>
                            </div>
                        </div>
                        <div className="pt-4 flex gap-4">
                            <button 
                                className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-headline font-bold py-4 rounded-xl glow-primary hover:opacity-90 transition-all disabled:opacity-50"
                                onClick={handleCreate}
                                disabled={isCreating || !projectName.trim()}
                            >
                                {isCreating ? 'Initializing Studio...' : 'Initialize Studio Environment'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Pulse */}
            <div className="fixed bottom-8 right-8 flex items-center gap-4 bg-surface-container-high/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 cinematic-shadow z-[60]">
                <div className="relative w-3 h-3">
                    <span className="absolute inset-0 bg-[#4ADE80] rounded-full animate-ping opacity-75"></span>
                    <span className="relative block w-3 h-3 bg-[#4ADE80] rounded-full"></span>
                </div>
                <span className="text-xs font-bold font-headline tracking-tight text-on-surface">AI Engine Online</span>
            </div>
        </div>
    );
}

export default Dashboard;
