import { useState } from 'react';

const URL_ERROR_MESSAGE = 'Enter a valid URL starting with http:// or https://.';

function isValidUrl(value) {
    try {
        const url = new URL(value);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
        return false;
    }
}

function UrlAnalysisForm({ isLoading = false, onSubmit }) {
    const [url, setUrl] = useState('');
    const [error, setError] = useState('');

    function handleSubmit(event) {
        event.preventDefault();
        if (isLoading) return;

        const trimmedUrl = url.trim();
        if (!isValidUrl(trimmedUrl)) {
            setError(URL_ERROR_MESSAGE);
            return;
        }

        setError('');
        onSubmit(trimmedUrl);
    }

    function handleUrlChange(event) {
        setUrl(event.target.value);
        if (error) setError('');
    }

    return (
        <form className="w-full max-w-2xl group relative transition-transform duration-500 ease-out" onSubmit={handleSubmit} noValidate>
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-secondary-container/20 to-primary/20 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />
            <div className="relative flex items-center p-2 bg-black/10 backdrop-blur-[32px] rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
                <div className="flex-1 flex items-center px-6">
                    <span className="material-symbols-outlined text-primary/50 mr-4">language</span>
                    <input
                        id="url-input"
                        name="url"
                        type="url"
                        inputMode="url"
                        value={url}
                        onChange={handleUrlChange}
                        placeholder="https://your-digital-empire.com"
                        disabled={isLoading}
                        className="w-full bg-transparent border-none outline-none text-on-surface font-body-md placeholder:text-on-surface-variant/30 py-4 focus:ring-0"
                    />
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="relative overflow-hidden px-8 py-4 bg-primary text-on-primary rounded-xl font-label-mono text-label-mono uppercase tracking-widest flex items-center gap-2 group/btn transition-all active:scale-95 shadow-[0_0_20px_rgba(155,203,255,0.3)] hover:shadow-[0_0_35px_rgba(155,203,255,0.5)]"
                >
                    <span className="relative z-10">{isLoading ? 'Analyzing' : 'Analyze'}</span>
                    <span className="material-symbols-outlined relative z-10 text-[18px] group-hover/btn:translate-x-1 transition-transform">bolt</span>
                    <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-40 group-hover/btn:animate-[shine_1s_ease-in-out]" />
                </button>
            </div>
            {error && (
                <p className="absolute -bottom-8 left-0 right-0 text-center text-sm font-medium text-error" role="alert">
                    {error}
                </p>
            )}
        </form>
    );
}

export default UrlAnalysisForm;
