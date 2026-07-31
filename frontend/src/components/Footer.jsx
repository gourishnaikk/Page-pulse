export default function Footer() {
    return (
        <footer className="relative z-10 w-full bg-black/20 backdrop-blur-md border-t border-white/5 py-12">
            <div className="max-w-container-max mx-auto px-gutter flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex items-center gap-2">
                    <span className="font-display-hero text-[24px] text-primary/60">Page Pulse</span>
                </div>
                <div className="text-on-surface-variant font-body-md text-sm">© 2026 Page Pulse. A Digital Heroes Training Task</div>
                <div className="flex gap-6 items-center">
                    <a
                        href="https://github.com/gourishnaikk/Page-pulse"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center"
                        aria-label="GitHub Repository"
                    >
                        <span className="material-symbols-outlined">code</span>
                    </a>
                    <a
                        href="https://www.linkedin.com/in/gourish-naik-876171334/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center"
                        aria-label="LinkedIn Profile"
                    >
                        <span className="material-symbols-outlined">hub</span>
                    </a>
                </div>
            </div>
        </footer>
    );
}
