import { useState } from 'react';
import { IrisInput, IrisResponse } from '../types/iris';
import { Crosshair, SlidersHorizontal } from 'lucide-react';

interface MorphologyVisualizerProps {
  currentInput: IrisInput;
  lastPrediction: IrisResponse | null;
}

type AxisPair = 'petal_dims' | 'sepal_dims' | 'length_dims';

export function MorphologyVisualizer({
  currentInput,
  lastPrediction,
}: MorphologyVisualizerProps) {
  const [axisPair, setAxisPair] = useState<AxisPair>('petal_dims');

  // Axis configuration
  const configs = {
    petal_dims: {
      title: 'Espaço Morfológico das Pétalas',
      xAxis: 'Comprimento da Pétala (cm)',
      yAxis: 'Largura da Pétala (cm)',
      xKey: 'petal_length' as keyof IrisInput,
      yKey: 'petal_width' as keyof IrisInput,
      xMin: 0.5,
      xMax: 7.5,
      yMin: 0.0,
      yMax: 3.0,
      clusters: [
        { name: 'Setosa', x: [1.0, 1.9], y: [0.1, 0.6], color: 'rgba(16, 185, 129, 0.18)', stroke: '#10B981' },
        { name: 'Versicolor', x: [3.0, 5.1], y: [1.0, 1.8], color: 'rgba(14, 165, 233, 0.18)', stroke: '#0EA5E9' },
        { name: 'Virginica', x: [4.5, 6.9], y: [1.4, 2.5], color: 'rgba(99, 102, 241, 0.18)', stroke: '#6366F1' },
      ],
    },
    sepal_dims: {
      title: 'Espaço Morfológico das Sépalas',
      xAxis: 'Comprimento da Sépala (cm)',
      yAxis: 'Largura da Sépala (cm)',
      xKey: 'sepal_length' as keyof IrisInput,
      yKey: 'sepal_width' as keyof IrisInput,
      xMin: 4.0,
      xMax: 8.5,
      yMin: 1.8,
      yMax: 4.6,
      clusters: [
        { name: 'Setosa', x: [4.3, 5.8], y: [2.3, 4.4], color: 'rgba(16, 185, 129, 0.18)', stroke: '#10B981' },
        { name: 'Versicolor', x: [4.9, 7.0], y: [2.0, 3.4], color: 'rgba(14, 165, 233, 0.18)', stroke: '#0EA5E9' },
        { name: 'Virginica', x: [4.9, 7.9], y: [2.2, 3.8], color: 'rgba(99, 102, 241, 0.18)', stroke: '#6366F1' },
      ],
    },
    length_dims: {
      title: 'Comparativo de Comprimentos (Sépala vs Pétala)',
      xAxis: 'Comprimento da Sépala (cm)',
      yAxis: 'Comprimento da Pétala (cm)',
      xKey: 'sepal_length' as keyof IrisInput,
      yKey: 'petal_length' as keyof IrisInput,
      xMin: 4.0,
      xMax: 8.5,
      yMin: 0.5,
      yMax: 7.5,
      clusters: [
        { name: 'Setosa', x: [4.3, 5.8], y: [1.0, 1.9], color: 'rgba(16, 185, 129, 0.18)', stroke: '#10B981' },
        { name: 'Versicolor', x: [4.9, 7.0], y: [3.0, 5.1], color: 'rgba(14, 165, 233, 0.18)', stroke: '#0EA5E9' },
        { name: 'Virginica', x: [4.9, 7.9], y: [4.5, 6.9], color: 'rgba(99, 102, 241, 0.18)', stroke: '#6366F1' },
      ],
    },
  };

  const active = configs[axisPair];

  // SVG coordinate transformation
  const svgWidth = 560;
  const svgHeight = 280;
  const padding = { top: 20, right: 30, bottom: 40, left: 50 };
  const plotWidth = svgWidth - padding.left - padding.right;
  const plotHeight = svgHeight - padding.top - padding.bottom;

  const toSvgX = (val: number) => {
    const clamped = Math.max(active.xMin, Math.min(active.xMax, val));
    return padding.left + ((clamped - active.xMin) / (active.xMax - active.xMin)) * plotWidth;
  };

  const toSvgY = (val: number) => {
    const clamped = Math.max(active.yMin, Math.min(active.yMax, val));
    return svgHeight - padding.bottom - ((clamped - active.yMin) / (active.yMax - active.yMin)) * plotHeight;
  };

  const currentX = currentInput[active.xKey];
  const currentY = currentInput[active.yKey];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 lg:p-7">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Crosshair className="w-4 h-4 text-indigo-600" />
            <span>Mapeamento Morfológico no Espaço de Decisão</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Localização da amostra atual em relação aos agrupamentos das 3 espécies do dataset Iris.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start sm:self-auto">
          <button
            onClick={() => setAxisPair('petal_dims')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
              axisPair === 'petal_dims'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pétalas (C x L)
          </button>
          <button
            onClick={() => setAxisPair('sepal_dims')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
              axisPair === 'sepal_dims'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sépalas (C x L)
          </button>
          <button
            onClick={() => setAxisPair('length_dims')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
              axisPair === 'length_dims'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Comprimentos
          </button>
        </div>
      </div>

      {/* SVG Scatter & Cluster Map */}
      <div className="pt-4">
        <div className="w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-auto max-h-[300px] select-none font-mono text-[10px]"
          >
            {/* Grid Lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
              const yVal = active.yMin + pct * (active.yMax - active.yMin);
              const yPos = toSvgY(yVal);
              return (
                <g key={`y-${i}`}>
                  <line
                    x1={padding.left}
                    y1={yPos}
                    x2={svgWidth - padding.right}
                    y2={yPos}
                    stroke="#F1F5F9"
                    strokeWidth="1"
                  />
                  <text
                    x={padding.left - 8}
                    y={yPos + 3}
                    textAnchor="end"
                    fill="#94A3B8"
                    className="tabular-nums"
                  >
                    {yVal.toFixed(1)}
                  </text>
                </g>
              );
            })}

            {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
              const xVal = active.xMin + pct * (active.xMax - active.xMin);
              const xPos = toSvgX(xVal);
              return (
                <g key={`x-${i}`}>
                  <line
                    x1={xPos}
                    y1={padding.top}
                    x2={xPos}
                    y2={svgHeight - padding.bottom}
                    stroke="#F1F5F9"
                    strokeWidth="1"
                  />
                  <text
                    x={xPos}
                    y={svgHeight - padding.bottom + 16}
                    textAnchor="middle"
                    fill="#94A3B8"
                    className="tabular-nums"
                  >
                    {xVal.toFixed(1)}
                  </text>
                </g>
              );
            })}

            {/* Species Cluster Boundary Boxes */}
            {active.clusters.map((cluster) => {
              const x1 = toSvgX(cluster.x[0]);
              const x2 = toSvgX(cluster.x[1]);
              const y1 = toSvgY(cluster.y[1]); // top
              const y2 = toSvgY(cluster.y[0]); // bottom
              const boxW = Math.max(8, x2 - x1);
              const boxH = Math.max(8, y2 - y1);

              return (
                <g key={cluster.name}>
                  <rect
                    x={x1}
                    y={y1}
                    width={boxW}
                    height={boxH}
                    fill={cluster.color}
                    stroke={cluster.stroke}
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                    rx="6"
                  />
                  <text
                    x={x1 + 6}
                    y={y1 + 14}
                    fill={cluster.stroke}
                    fontWeight="bold"
                    fontSize="11"
                    fontFamily="sans-serif"
                  >
                    {cluster.name}
                  </text>
                </g>
              );
            })}

            {/* Current Input Point & Crosshair */}
            {currentX > 0 && currentY > 0 && (
              <g>
                {/* Horizontal Guide */}
                <line
                  x1={padding.left}
                  y1={toSvgY(currentY)}
                  x2={svgWidth - padding.right}
                  y2={toSvgY(currentY)}
                  stroke="#6366F1"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                  opacity="0.6"
                />
                {/* Vertical Guide */}
                <line
                  x1={toSvgX(currentX)}
                  y1={padding.top}
                  x2={toSvgX(currentX)}
                  y2={svgHeight - padding.bottom}
                  stroke="#6366F1"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                  opacity="0.6"
                />
                {/* Outer Ring */}
                <circle
                  cx={toSvgX(currentX)}
                  cy={toSvgY(currentY)}
                  r="9"
                  fill="none"
                  stroke="#4F46E5"
                  strokeWidth="2"
                  className="animate-ping"
                  style={{ transformOrigin: `${toSvgX(currentX)}px ${toSvgY(currentY)}px` }}
                />
                {/* Inner Core */}
                <circle
                  cx={toSvgX(currentX)}
                  cy={toSvgY(currentY)}
                  r="6"
                  fill="#4F46E5"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                />
              </g>
            )}

            {/* Axis Titles */}
            <text
              x={padding.left + plotWidth / 2}
              y={svgHeight - 4}
              textAnchor="middle"
              fill="#64748B"
              fontWeight="600"
              fontSize="11"
              fontFamily="sans-serif"
            >
              {active.xAxis}
            </text>

            <text
              x={- (padding.top + plotHeight / 2)}
              y={14}
              transform="rotate(-90)"
              textAnchor="middle"
              fill="#64748B"
              fontWeight="600"
              fontSize="11"
              fontFamily="sans-serif"
            >
              {active.yAxis}
            </text>
          </svg>
        </div>

        {/* Legend */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-emerald-500/30 border border-emerald-500 inline-block"></span>
              <span>Zona Setosa</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-sky-500/30 border border-sky-500 inline-block"></span>
              <span>Zona Versicolor</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-indigo-500/30 border border-indigo-500 inline-block"></span>
              <span>Zona Virginica</span>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px] text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md">
            <span>Amostra Atual:</span>
            <span>({currentX.toFixed(1)} cm, {currentY.toFixed(1)} cm)</span>
            {lastPrediction && (
              <span className="font-sans font-bold">→ {lastPrediction.predicao}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
