import { PredictionHistoryItem } from '../types/iris';
import { History, Download, Trash2, ArrowUpRight } from 'lucide-react';

interface HistoryLogProps {
  history: PredictionHistoryItem[];
  onSelectHistoryItem: (item: PredictionHistoryItem) => void;
  onClearHistory: () => void;
}

export function HistoryLog({
  history,
  onSelectHistoryItem,
  onClearHistory,
}: HistoryLogProps) {
  const exportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `iris_predictions_history_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 lg:p-7">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <History className="w-4 h-4 text-indigo-600" />
            <span>Histórico de Predições Realizadas</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Registro das requisições efetuadas nesta sessão de trabalho.
          </p>
        </div>

        {history.length > 0 && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={exportJson}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-white text-xs font-medium text-slate-700 hover:text-slate-900 transition-all shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              Exportar JSON
            </button>
            <button
              onClick={onClearHistory}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-rose-300 hover:bg-rose-50 text-xs font-medium text-slate-600 hover:text-rose-700 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Limpar
            </button>
          </div>
        )}
      </div>

      {history.length === 0 ? (
        <div className="py-12 text-center text-slate-400">
          <p className="text-xs font-medium">Nenhuma predição realizada ainda.</p>
          <p className="text-[11px] text-slate-400 mt-1">
            As análises executadas com sucesso aparecerão registradas aqui.
          </p>
        </div>
      ) : (
        <div className="pt-4 divide-y divide-slate-100 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-600 font-mono text-[11px]">
                <th className="pb-3 font-semibold">Horário</th>
                <th className="pb-3 font-semibold">Espécie Prevista</th>
                <th className="pb-3 font-semibold">Código</th>
                <th className="pb-3 font-semibold">Sépala (C × L)</th>
                <th className="pb-3 font-semibold">Pétala (C × L)</th>
                <th className="pb-3 text-right font-semibold">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {history.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 font-mono text-slate-600 tabular-nums">
                    {item.timestamp}
                  </td>
                  <td className="py-3">
                    <span className="font-bold text-slate-900">
                      Iris {item.response.predicao}
                    </span>
                  </td>
                  <td className="py-3 font-mono text-slate-600">
                    {item.response.codigo}
                  </td>
                  <td className="py-3 font-mono text-slate-700 tabular-nums">
                    {item.input.sepal_length} × {item.input.sepal_width} cm
                  </td>
                  <td className="py-3 font-mono text-slate-700 tabular-nums">
                    {item.input.petal_length} × {item.input.petal_width} cm
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => onSelectHistoryItem(item)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                      <span>Carregar</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
