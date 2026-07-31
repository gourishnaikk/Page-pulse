function Navbar() {
    return (
        <header className="fixed z-50 glass-header mt-6 mx-6 max-w-container-max md:mx-auto rounded-full border border-white/20 backdrop-blur-[32px] bg-white/10 shadow-2xl transition-all duration-500 inset-x-0 md:inset-x-6">
            <div className="h-16 w-full px-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary rounded shadow-[0_0_20px_rgba(155,203,255,0.4)] flex items-center justify-center">
                        <span className="material-symbols-outlined text-on-primary text-[20px]">bolt</span>
                    </div>
                    <span className="font-display-hero text-[32px] text-primary glow-text tracking-tighter">Page Pulse</span>
                </div>
                <nav className="hidden md:flex items-center gap-12 absolute left-1/2 -translate-x-1/2">
                    <a className="nav-link font-label-mono text-label-mono text-on-surface-variant hover:text-primary transition-colors tracking-widest uppercase" href="#main-content">Features</a>
                    <a className="nav-link font-label-mono text-label-mono text-on-surface-variant hover:text-primary transition-colors tracking-widest uppercase" href="#results">How it Works</a>
                    <a className="nav-link font-label-mono text-label-mono text-on-surface-variant hover:text-primary transition-colors tracking-widest uppercase" href="https://github.com/gourishnaikk/Page-pulse" target="_blank" rel="noopener noreferrer">GitHub</a>
                </nav>
                <div className="flex items-center gap-6">
                    <button className="cinematic-border bg-white/5 backdrop-blur-xl px-6 py-2 rounded-full font-label-mono text-label-mono text-primary uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-all" id="analyze-btn-top" onClick={() => document.getElementById('url-input')?.focus()}>Analyze</button>
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-[0_0_15px_rgba(155,203,255,0.2)]">
                        <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Navbar;
