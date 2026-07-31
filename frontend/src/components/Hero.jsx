import ErrorAlert from './ErrorAlert.jsx';
import UrlAnalysisForm from './UrlAnalysisForm.jsx';

function Hero({ errorMessage, isLoading, onAnalyze }) {
    return (
        <section className="relative flex flex-col items-center justify-center px-gutter py-16 pb-4 min-h-[500px]">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            </div>
            <div className="relative z-10 text-center max-w-4xl mx-auto flex flex-col items-center w-full">
                <div className="mb-6 inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/5 backdrop-blur-2xl border border-white/10 shadow-xl">
                    <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse shadow-[0_0_10px_#00f1fd]" />
                    <span className="font-label-mono text-label-mono text-primary uppercase tracking-[0.2em]">System Status: Ready</span>
                </div>
                <h1 className="font-display-hero text-display-hero md:text-[140px] leading-none mb-6 tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-primary-fixed-dim to-primary/40 filter drop-shadow-[0_0_30px_rgba(155,203,255,0.4)] pixel-load glimmer-text">
                    PAGE PULSE
                </h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-10 leading-relaxed opacity-80">
                    Engineered for high-fidelity performance audits. Powerful website intelligence with elegant visual reports and real-time analysis.
                </p>
                <div className="w-full flex justify-center mt-4">
                    <UrlAnalysisForm isLoading={isLoading} onSubmit={onAnalyze} />
                </div>
                {errorMessage && (
                     <div className="absolute top-20 right-4 z-50">
                         <div className="bg-error/10 border border-error/20 px-6 py-4 rounded-xl backdrop-blur-md shadow-2xl">
                             <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-full bg-error/20 flex flex-col items-center justify-center">
                                      <span className="material-symbols-outlined text-error text-lg">error</span>
                                 </div>
                                 <p className="font-body-md text-error">{errorMessage}</p>
                             </div>
                         </div>
                     </div>
                )}
            </div>
        </section>
    );
}

export default Hero;
