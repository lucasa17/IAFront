import { IRIS_SPECIES, anatomyImg } from '../constants/speciesData';
import { BookOpen, CheckCircle, Info } from 'lucide-react';

export function BotanicalGuide() {
  const speciesList = Object.values(IRIS_SPECIES);

  return (
    <div className="space-y-6">
      {/* Botanical Anatomy Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="p-6 lg:p-7 border-b border-slate-150">
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-semibold mb-1">
            <BookOpen className="w-4 h-4" />
            <span>Guia Botânico & Morfologia Floral</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            Anatomia da Flor Iris: Sépalas vs Pétalas
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            O célebre dataset criado pelo estatístico Ronald Fisher em 1936 utiliza quatro medições morfológicas distintas da estrutura periantal da flor Iris.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 lg:p-7">
          <div className="lg:col-span-5 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shadow-2xs">
            <img
              src={anatomyImg}
              alt="Ilustração Botânica Científica da Anatomia da Flor Iris"
              className="w-full h-auto object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="lg:col-span-7 flex flex-col justify-center space-y-4 text-xs text-slate-600">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <h4 className="font-bold text-slate-900 text-sm mb-1">
                1. Sépalas (Sepals ou "Falls")
              </h4>
              <p className="leading-relaxed">
                São os três segmentos externos curvados para baixo. Na flor Iris, as sépalas são vistosas, coloridas e possuem padrões de sinalização (guias de néctar) para atrair polinizadores. O modelo analisa tanto o <strong>comprimento longitudinal (sepal_length)</strong> quanto a <strong>largura máxima (sepal_width)</strong>.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <h4 className="font-bold text-slate-900 text-sm mb-1">
                2. Pétalas (Petals ou "Standards")
              </h4>
              <p className="leading-relaxed">
                São os três segmentos internos eretos que se elevam no centro da flor. As pétalas oferecem o maior poder discriminante no algoritmo de classificação: enquanto a <em>Iris setosa</em> possui pétalas minúsculas (1 a 1.9 cm), a <em>Iris virginica</em> ultrapassa 5 a 6.9 cm com largura expressiva.
              </p>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-600 font-mono">
              <Info className="w-4 h-4 text-indigo-500 shrink-0" />
              <span>Dataset histórico: 150 amostras divididas equitativamente entre as 3 espécies.</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Species Showcase Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {speciesList.map((sp) => (
          <div
            key={sp.id}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col"
          >
            <div className="aspect-4/3 overflow-hidden relative bg-slate-100">
              <img
                src={sp.image}
                alt={`Espécime de Iris ${sp.name}`}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-white/90 backdrop-blur-xs text-xs font-bold text-slate-900 shadow-2xs">
                Iris {sp.name}
              </div>
              <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-black/60 text-[10px] font-mono text-white">
                Código: {sp.code}
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <p className="text-xs text-slate-500 italic font-serif">
                  {sp.scientificName}
                </p>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {sp.description}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                  <div className="text-[11px] font-bold text-slate-800">
                    Faixas Médias de Medição:
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                    <div className="p-1.5 rounded bg-slate-50 border border-slate-200">
                      <span className="text-slate-600 block text-[9px]">SÉPALA (C x L)</span>
                      <span className="font-semibold text-slate-800">
                        {sp.typicalRanges.sepal_length[0]}-{sp.typicalRanges.sepal_length[1]} / {sp.typicalRanges.sepal_width[0]}-{sp.typicalRanges.sepal_width[1]}
                      </span>
                    </div>
                    <div className="p-1.5 rounded bg-slate-50 border border-slate-200">
                      <span className="text-slate-600 block text-[9px]">PÉTALA (C x L)</span>
                      <span className="font-semibold text-slate-800">
                        {sp.typicalRanges.petal_length[0]}-{sp.typicalRanges.petal_length[1]} / {sp.typicalRanges.petal_width[0]}-{sp.typicalRanges.petal_width[1]}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                {sp.distinguishingFeatures.map((feat, i) => (
                  <div key={i} className="flex items-start gap-1.5 text-[11px] text-slate-600">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
