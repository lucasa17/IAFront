interface NavbarProps {
  onNewAnalysis: () => void;
  activeSection: string;
  onNavigate: (section: string) => void;
}

export function Navbar({ onNewAnalysis, activeSection, onNavigate }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 lg:px-8 h-16">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('predictor');
          }}
          className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block"></span>
          Iris AI Predictor
        </a>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <button
            onClick={() => onNavigate('predictor')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 ${
              activeSection === 'predictor' ? 'text-indigo-600 font-semibold' : ''
            }`}
          >
            Preditor
          </button>
          <button
            onClick={() => onNavigate('morphology')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 ${
              activeSection === 'morphology' ? 'text-indigo-600 font-semibold' : ''
            }`}
          >
            Morfologia
          </button>
          <button
            onClick={() => onNavigate('species')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 ${
              activeSection === 'species' ? 'text-indigo-600 font-semibold' : ''
            }`}
          >
            Espécies
          </button>
          <button
            onClick={() => onNavigate('history')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 ${
              activeSection === 'history' ? 'text-indigo-600 font-semibold' : ''
            }`}
          >
            Histórico
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onNewAnalysis}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] rounded-lg transition-all shadow-sm shadow-indigo-200 whitespace-nowrap shrink-0"
          >
            Nova Análise
          </button>
        </div>
      </div>
    </header>
  );
}
