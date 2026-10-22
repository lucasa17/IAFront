import React from 'react';
import { IrisInput } from '../types/iris';
import { BENCHMARK_PRESETS } from '../constants/speciesData';
import { Sparkles, RotateCcw, ArrowRight, Loader2, Info } from 'lucide-react';

interface PredictionFormProps {
  formData: IrisInput;
  onChange: (field: keyof IrisInput, value: number) => void;
  onSubmit: (e: React.FormEvent) => void;
  onReset: () => void;
  onLoadPreset: (presetIndex: number) => void;
  isLoading: boolean;
  isColdStarting: boolean;
}

interface FieldConfig {
  key: keyof IrisInput;
  label: string;
  sublabel: string;
  min: number;
  max: number;
  step: number;
  description: string;
  typicalHint: string;
}

const FIELDS: FieldConfig[] = [
  {
    key: 'sepal_length',
    label: 'Comprimento da Sépala',
    sublabel: 'sepal_length',
    min: 3.5,
    max: 9.0,
    step: 0.1,
    description: 'Extensão longitudinal do cálice externo da flor.',
    typicalHint: 'Típico: 4.3 cm a 7.9 cm',
  },
  {
    key: 'sepal_width',
    label: 'Largura da Sépala',
    sublabel: 'sepal_width',
    min: 1.5,
    max: 5.5,
    step: 0.1,
    description: 'Dimensão transversal no ponto mais amplo da sépala.',
    typicalHint: 'Típico: 2.0 cm a 4.4 cm',
  },
  {
    key: 'petal_length',
    label: 'Comprimento da Pétala',
    sublabel: 'petal_length',
    min: 0.5,
    max: 8.0,
    step: 0.1,
    description: 'Medida do ápice à base das pétalas superiores (standards).',
    typicalHint: 'Típico: 1.0 cm a 6.9 cm',
  },
  {
    key: 'petal_width',
    label: 'Largura da Pétala',
    sublabel: 'petal_width',
    min: 0.1,
    max: 3.5,
    step: 0.1,
    description: 'Espessura transversal da corola da pétala.',
    typicalHint: 'Típico: 0.1 cm a 2.5 cm',
  },
];

export function PredictionForm({
  formData,
  onChange,
  onSubmit,
  onReset,
  onLoadPreset,
  isLoading,
  isColdStarting,
}: PredictionFormProps) {
  const handleNumberInput = (field: keyof IrisInput, rawVal: string) => {
    const val = parseFloat(rawVal);
    if (!isNaN(val)) {
      onChange(field, val);
    } else if (rawVal === '') {
      onChange(field, 0);
    }
  };

  const adjustValue = (field: keyof IrisInput, delta: number, min: number, max: number) => {
    const current = Number(formData[field]) || 0;
    const next = Math.min(max, Math.max(min, Number((current + delta).toFixed(1))));
    onChange(field, next);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 lg:p-7">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Parâmetros Morfológicos
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Insira as 4 medidas biométricas em centímetros para classificar a espécie.
          </p>
        </div>

        <button
          type="button"
          onClick={onReset}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors self-start sm:self-auto py-1 px-2.5 rounded-lg border border-slate-200 hover:border-slate-300 disabled:opacity-50"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Restaurar
        </button>
      </div>

      {/* Benchmark Presets Bar */}
      <div className="py-4 border-b border-slate-100">
        <div className="flex items-center gap-1.5 mb-2.5 text-xs font-medium text-slate-700">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Amostras de Calibração Rápida:</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {BENCHMARK_PRESETS.map((preset, idx) => (
            <button
              key={preset.species}
              type="button"
              onClick={() => onLoadPreset(idx)}
              disabled={isLoading}
              className="text-left p-2.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-indigo-300 hover:shadow-xs transition-all text-xs group disabled:opacity-60"
            >
              <div className="font-semibold text-slate-900 group-hover:text-indigo-700 flex items-center justify-between">
                <span>{preset.species}</span>
                <span className="text-[10px] text-slate-600 font-mono">
                  {preset.data.sepal_length}/{preset.data.petal_length}
                </span>
              </div>
              <p className="text-[11px] text-slate-700 line-clamp-1 mt-0.5 font-sans">
                {preset.name}
              </p>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={onSubmit} className="pt-5 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {FIELDS.map((field) => {
            const value = formData[field.key];
            return (
              <div
                key={field.key}
                className="p-4 rounded-xl border border-slate-150 bg-slate-50/50 hover:bg-slate-50/90 transition-colors"
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div>
                    <label
                      htmlFor={field.key}
                      className="block text-xs font-bold text-slate-800"
                    >
                      {field.label}
                    </label>
                    <span className="text-[11px] font-mono text-slate-600">
                      {field.sublabel}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg px-2 py-1 shadow-2xs">
                    <input
                      id={field.key}
                      name={field.key}
                      type="number"
                      step={field.step}
                      min={field.min}
                      max={field.max}
                      value={value === 0 ? '' : value}
                      onChange={(e) => handleNumberInput(field.key, e.target.value)}
                      disabled={isLoading}
                      required
                      className="w-16 text-right font-mono text-sm font-semibold text-slate-900 focus:outline-none tabular-nums"
                    />
                    <span className="text-xs font-mono text-slate-600 uppercase">cm</span>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => adjustValue(field.key, -0.1, field.min, field.max)}
                    disabled={isLoading || value <= field.min}
                    className="w-7 h-7 flex items-center justify-center rounded-md bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900 text-xs font-bold transition-all disabled:opacity-40"
                    title="-0.1 cm"
                  >
                    -
                  </button>

                  <input
                    type="range"
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    value={value || field.min}
                    onChange={(e) => onChange(field.key, parseFloat(e.target.value))}
                    disabled={isLoading}
                    className="flex-1 accent-indigo-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                  />

                  <button
                    type="button"
                    onClick={() => adjustValue(field.key, 0.1, field.min, field.max)}
                    disabled={isLoading || value >= field.max}
                    className="w-7 h-7 flex items-center justify-center rounded-md bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900 text-xs font-bold transition-all disabled:opacity-40"
                    title="+0.1 cm"
                  >
                    +
                  </button>
                </div>

                <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-600">
                  <span className="font-mono text-[10px]">{field.typicalHint}</span>
                  <span className="font-mono text-[10px] text-slate-600">
                    Range: {field.min} - {field.max} cm
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {isColdStarting && (
          <div className="p-3.5 bg-amber-50/90 border border-amber-200 rounded-xl flex items-start gap-2.5 text-amber-900 text-xs animate-pulse">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Servidor em inicialização (Cold Start)</p>
              <p className="text-amber-700 text-[11px] mt-0.5">
                A API na Render entra em modo repouso quando inativa. Ela está sendo ativada agora, aguarde alguns instantes...
              </p>
            </div>
          </div>
        )}

        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 flex items-center justify-center gap-2.5 px-6 rounded-xl font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] disabled:bg-indigo-400 disabled:cursor-not-allowed shadow-md shadow-indigo-200/50 transition-all cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processando inferência na API...</span>
              </>
            ) : (
              <>
                <span>Executar Predição da Espécie</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
