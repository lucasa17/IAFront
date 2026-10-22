import React, { useState, useRef, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { PredictionForm } from './components/PredictionForm';
import { PredictionResult } from './components/PredictionResult';
import { MorphologyVisualizer } from './components/MorphologyVisualizer';
import { BotanicalGuide } from './components/BotanicalGuide';
import { HistoryLog } from './components/HistoryLog';
import { IrisInput, IrisResponse, PredictionHistoryItem } from './types/iris';
import { BENCHMARK_PRESETS } from './constants/speciesData';
import { predictIrisSpecies } from './services/api';
import { Activity, ShieldCheck, Cpu } from 'lucide-react';

const DEFAULT_FORM_DATA: IrisInput = {
  sepal_length: 6.7,
  sepal_width: 3.0,
  petal_length: 5.2,
  petal_width: 2.3,
};

export default function App() {
  const [formData, setFormData] = useState<IrisInput>(DEFAULT_FORM_DATA);
  const [result, setResult] = useState<IrisResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isColdStarting, setIsColdStarting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSubmittedInput, setLastSubmittedInput] = useState<IrisInput | null>(null);
  const [history, setHistory] = useState<PredictionHistoryItem[]>([]);
  const [activeSection, setActiveSection] = useState<string>('predictor');

  const predictorRef = useRef<HTMLDivElement>(null);
  const morphologyRef = useRef<HTMLDivElement>(null);
  const speciesRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);

  // Load history from localStorage if available
  useEffect(() => {
    try {
      const stored = localStorage.getItem('iris_prediction_history');
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  const saveHistory = (newItem: PredictionHistoryItem) => {
    setHistory((prev) => {
      const updated = [newItem, ...prev.slice(0, 19)];
      try {
        localStorage.setItem('iris_prediction_history', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const handleFieldChange = (field: keyof IrisInput, value: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleReset = () => {
    setFormData(DEFAULT_FORM_DATA);
    setError(null);
  };

  const handleLoadPreset = (index: number) => {
    const preset = BENCHMARK_PRESETS[index];
    if (preset) {
      setFormData(preset.data);
      setError(null);
    }
  };

  const runPrediction = async (inputToPredict = formData) => {
    setIsLoading(true);
    setIsColdStarting(false);
    setError(null);
    setLastSubmittedInput(inputToPredict);

    try {
      const apiResult = await predictIrisSpecies(inputToPredict, {
        onColdStartNotice: (cold) => setIsColdStarting(cold),
      });
      setResult(apiResult);

      const historyItem: PredictionHistoryItem = {
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        input: { ...inputToPredict },
        response: apiResult,
      };
      saveHistory(historyItem);
    } catch (err: any) {
      console.error('Prediction failed:', err);
      setError(err?.message || 'Falha inesperada ao tentar comunicar com a API.');
    } finally {
      setIsLoading(false);
      setIsColdStarting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runPrediction();
  };

  const handleRetry = () => {
    if (lastSubmittedInput) {
      runPrediction(lastSubmittedInput);
    } else {
      runPrediction();
    }
  };

  const handleSelectHistoryItem = (item: PredictionHistoryItem) => {
    setFormData(item.input);
    setResult(item.response);
    setError(null);
    scrollToSection('predictor');
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('iris_prediction_history');
    } catch {
      // ignore
    }
  };

  const scrollToSection = (section: string) => {
    setActiveSection(section);
    let targetRef = predictorRef;
    if (section === 'morphology') targetRef = morphologyRef;
    if (section === 'species') targetRef = speciesRef;
    if (section === 'history') targetRef = historyRef;

    targetRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Strict Top Bar Contract */}
      <Navbar
        onNewAnalysis={() => scrollToSection('predictor')}
        activeSection={activeSection}
        onNavigate={scrollToSection}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Hero Section with clear mission and credentials */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
            <span>Classificação Biométrica com Inteligência Artificial</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight text-balance">
                Classificador de Espécies da Flor Iris
              </h1>
              <p className="text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed text-balance">
                Interface analítica conectada à API de Machine Learning na nuvem para predição taxonômica instantânea entre <em>Setosa</em>, <em>Versicolor</em> e <em>Virginica</em>.
              </p>
            </div>

            {/* Micro telemetry indicator */}
            <div className="flex items-center gap-3 text-xs text-slate-500 bg-white border border-slate-200/90 rounded-xl px-3.5 py-2 shadow-2xs self-start lg:self-auto">
              <div className="flex items-center gap-1.5 font-mono">
                <Activity className="w-3.5 h-3.5 text-emerald-600" />
                <span>API Online</span>
              </div>
              <span className="text-slate-300">|</span>
              <div className="flex items-center gap-1.5 font-mono">
                <Cpu className="w-3.5 h-3.5 text-indigo-600" />
                <span>Vite 8 · Vercel Ready</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 1: Predictor Workspace Grid (Form + Prominent Result) */}
        <div ref={predictorRef} className="scroll-mt-24 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Input Form (7 cols on lg) */}
            <div className="lg:col-span-7">
              <PredictionForm
                formData={formData}
                onChange={handleFieldChange}
                onSubmit={handleSubmit}
                onReset={handleReset}
                onLoadPreset={handleLoadPreset}
                isLoading={isLoading}
                isColdStarting={isColdStarting}
              />
            </div>

            {/* Right Column: Prominent Result Card (5 cols on lg) */}
            <div className="lg:col-span-5 sticky top-24">
              <PredictionResult
                result={result}
                error={error}
                isLoading={isLoading}
                onRetry={handleRetry}
                lastInput={lastSubmittedInput}
              />
            </div>
          </div>
        </div>

        {/* Section 2: Morphology 2D Scatter Visualizer */}
        <div ref={morphologyRef} className="scroll-mt-24">
          <MorphologyVisualizer
            currentInput={formData}
            lastPrediction={result}
          />
        </div>

        {/* Section 3: Botanical Species Guide & Anatomy Illustration */}
        <div ref={speciesRef} className="scroll-mt-24">
          <BotanicalGuide />
        </div>

        {/* Section 4: History Log */}
        <div ref={historyRef} className="scroll-mt-24">
          <HistoryLog
            history={history}
            onSelectHistoryItem={handleSelectHistoryItem}
            onClearHistory={handleClearHistory}
          />
        </div>
      </main>

      {/* Footer conforming to design constitution */}
      <footer className="border-t border-slate-200 bg-white py-8 px-4 sm:px-6 lg:px-8 mt-16 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-slate-400" />
            <span>Iris Species Predictor · Preparado para deploy na Vercel com Vite 8 & esbuild ^0.28.0</span>
          </div>
          <div className="flex items-center gap-4 text-slate-600 font-mono text-[11px]">
            <span>Endpoint: https://ia-izpw.onrender.com/api/predict</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
