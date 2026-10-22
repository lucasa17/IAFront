import { useState } from 'react';
import { IrisResponse, IrisInput } from '../types/iris';
import { IRIS_SPECIES } from '../constants/speciesData';
import { 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  ExternalLink, 
  RefreshCw,
  Sparkles,
  Layers
} from 'lucide-react';

interface PredictionResultProps {
  result: IrisResponse | null;
  error: string | null;
  isLoading: boolean;
  onRetry: () => void;
  lastInput: IrisInput | null;
}

export function PredictionResult({
  result,
  error,
  isLoading,
  onRetry,
  lastInput,
}: PredictionResultProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-8 text-center flex flex-col items-center justify-center min-h-[380px]">
        <div className="relative mb-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-150 flex items-center justify-center animate-pulse">
            <Layers className="w-8 h-8 text-indigo-600 animate-spin" />
          </div>
        </div>
        <h3 className="text-base font-bold text-slate-900">Analisando Biometria Floral...</h3>
        <p className="text-xs text-slate-500 max-w-xs mt-1">
          Enviando medições para o modelo de classificação na API Render (ia-izpw.onrender.com).
        </p>
        <div className="mt-6 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></span>
          <span className="text-xs font-mono text-indigo-600">Calculando probabilidade e hiperplano</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl border border-rose-200/90 shadow-sm p-6 lg:p-7 min-h-[380px] flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2.5 text-rose-600 mb-3">
            <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-rose-900">Falha na Predição</h3>
              <p className="text-xs text-rose-600">Ocorreu um erro na comunicação com a API</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-150 text-xs text-rose-800 space-y-2 mt-4">
            <p className="font-medium">{error}</p>
            <p className="text-[11px] text-rose-600">
              Endpoints gratuitos na Render entram em hibernação após inatividade. Geralmente uma nova tentativa após alguns segundos resolve o problema.
            </p>
          </div>

          {lastInput && (
            <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-600 font-mono">
              <div className="font-bold text-slate-700 mb-1">Dados enviados na tentativa:</div>
              <div>sepal_length: {lastInput.sepal_length} · sepal_width: {lastInput.sepal_width}</div>
              <div>petal_length: {lastInput.petal_length} · petal_width: {lastInput.petal_width}</div>
            </div>
          )}
        </div>

        <div className="pt-6">
          <button
            onClick={onRetry}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 hover:border-rose-300 transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-8 text-center flex flex-col items-center justify-center min-h-[380px]">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4 text-slate-400">
          <Sparkles className="w-7 h-7 text-indigo-500/70" />
        </div>
        <h3 className="text-base font-bold text-slate-900">Aguardando Parâmetros</h3>
        <p className="text-xs text-slate-500 max-w-xs mt-1.5 leading-relaxed">
          Preencha o formulário com os comprimentos e larguras de sépala e pétala, ou selecione uma das amostras pré-configuradas acima.
        </p>
        <div className="mt-6 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-medium text-indigo-700">
          <span>API: ia-izpw.onrender.com/api/predict</span>
        </div>
      </div>
    );
  }

  const speciesKey = result.predicao.trim();
  const species = IRIS_SPECIES[speciesKey] || IRIS_SPECIES['Virginica'];
  const dados = result.dados_recebidos;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col">
      {/* Top Banner with prominent species title */}
      <div className={`p-6 border-b ${species.borderColor} ${species.accentBg}`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">Predição Identificada</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono">Código {result.codigo}</span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-baseline gap-2.5">
              <span>Iris {result.predicao}</span>
            </h2>
            <p className="text-xs text-slate-600 italic font-serif mt-0.5">
              {species.scientificName}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg bg-white/90 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-white text-xs font-medium transition-all shadow-2xs flex items-center gap-1.5"
              title="Copiar JSON de retorno"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-mono text-[11px]">Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span className="text-slate-600 font-mono text-[11px]">JSON</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Species Photo Thumbnail & Description */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
          <div className="sm:col-span-5 aspect-4/3 rounded-xl overflow-hidden border border-slate-200/80 shadow-2xs relative bg-slate-100">
            <img
              src={species.image}
              alt={`Flor Iris ${result.predicao}`}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[10px] font-mono text-white">
              Fotografia Espécime
            </div>
          </div>
          <div className="sm:col-span-7 text-xs text-slate-600 space-y-2">
            <p className="leading-relaxed">
              {species.description}
            </p>
            <div className="pt-1">
              <span className="text-[11px] font-semibold text-slate-800 block mb-1">
                Aspectos Diagnósticos:
              </span>
              <ul className="space-y-1 text-[11px] text-slate-600">
                {species.distinguishingFeatures.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Received Data Inspection Panel */}
      <div className="p-6 space-y-5">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Biometria Confirmada (dados_recebidos)
            </h4>
            <span className="text-[11px] font-mono text-slate-600">Unidade: Centímetros (cm)</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/60">
              <span className="text-[11px] font-mono text-slate-600 block">sepal_length</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl font-bold font-mono text-slate-900 tabular-nums">
                  {dados.sepal_length.toFixed(1)}
                </span>
                <span className="text-[10px] font-mono text-slate-600">cm</span>
              </div>
              <span className="text-[10px] text-slate-600 block mt-1">
                Ref: {species.typicalRanges.sepal_length[0]}-{species.typicalRanges.sepal_length[1]}
              </span>
            </div>

            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/60">
              <span className="text-[11px] font-mono text-slate-600 block">sepal_width</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl font-bold font-mono text-slate-900 tabular-nums">
                  {dados.sepal_width.toFixed(1)}
                </span>
                <span className="text-[10px] font-mono text-slate-600">cm</span>
              </div>
              <span className="text-[10px] text-slate-600 block mt-1">
                Ref: {species.typicalRanges.sepal_width[0]}-{species.typicalRanges.sepal_width[1]}
              </span>
            </div>

            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/60">
              <span className="text-[11px] font-mono text-slate-600 block">petal_length</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl font-bold font-mono text-slate-900 tabular-nums">
                  {dados.petal_length.toFixed(1)}
                </span>
                <span className="text-[10px] font-mono text-slate-600">cm</span>
              </div>
              <span className="text-[10px] text-slate-600 block mt-1">
                Ref: {species.typicalRanges.petal_length[0]}-{species.typicalRanges.petal_length[1]}
              </span>
            </div>

            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/60">
              <span className="text-[11px] font-mono text-slate-600 block">petal_width</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl font-bold font-mono text-slate-900 tabular-nums">
                  {dados.petal_width.toFixed(1)}
                </span>
                <span className="text-[10px] font-mono text-slate-600">cm</span>
              </div>
              <span className="text-[10px] text-slate-600 block mt-1">
                Ref: {species.typicalRanges.petal_width[0]}-{species.typicalRanges.petal_width[1]}
              </span>
            </div>
          </div>
        </div>

        {/* API JSON Payload Inspector */}
        <div className="p-3 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px] text-slate-400">
            <span>Payload HTTP 200 OK</span>
            <span className="text-emerald-400">ia-izpw.onrender.com</span>
          </div>
          <pre className="pt-2 overflow-x-auto text-[11px] leading-relaxed text-indigo-300">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
