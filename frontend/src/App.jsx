import { useState } from 'react';
import EmptyState from './components/EmptyState.jsx';
import Footer from './components/Footer.jsx';
import Hero from './components/Hero.jsx';
import Navbar from './components/Navbar.jsx';
import ResultsDashboard from './components/ResultsDashboard.jsx';
import { analyzeUrl } from './services/auditService.js';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [auditResult, setAuditResult] = useState(null);
  const [auditError, setAuditError] = useState('');
  const shouldShowEmptyState = !auditResult && !auditError && !isLoading;

  async function handleAnalyze(url) {
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    setAuditError('');
    setAuditResult(null);

    try {
      const response = await analyzeUrl(url);
      setAuditResult(response.data);
    } catch (error) {
      setAuditError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-950">
      <a
        href="#main-content"
        className="sr-only z-50 rounded bg-white px-4 py-3 text-sm font-semibold text-slate-950 shadow focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content" className="flex flex-1 flex-col" tabIndex={-1}>
        <Hero errorMessage={auditError} isLoading={isLoading} onAnalyze={handleAnalyze} />
        {shouldShowEmptyState ? <EmptyState /> : null}
        <ResultsDashboard result={auditResult} />
      </main>
      <Footer />
    </div>
  );
}

export default App;
