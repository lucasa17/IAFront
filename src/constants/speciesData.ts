import { SpeciesInfo } from '../types/iris';
import anatomyImg from '../assets/images/iris_botanical_anatomy_1792667927472.jpg';
import setosaImg from '../assets/images/iris_setosa_flower_1792667927168.jpg';
import versicolorImg from '../assets/images/iris_versicolor_flower_1792667927954.jpg';
import virginicaImg from '../assets/images/iris_virginica_flower_1792667928127.jpg';

export { anatomyImg, setosaImg, versicolorImg, virginicaImg };

export const IRIS_SPECIES: Record<string, SpeciesInfo> = {
  Setosa: {
    id: 'setosa',
    name: 'Setosa',
    scientificName: 'Iris setosa Pall. ex Link',
    code: 0,
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    accentBg: 'bg-emerald-50/70',
    borderColor: 'border-emerald-200',
    textColor: 'text-emerald-700',
    image: setosaImg,
    description: 'Espécie nativa das regiões árticas e subárticas (Sibéria, Alasca, Japão). Facilmente identificável por possuir pétalas significativamente menores e mais curtas que as sépalas.',
    distinguishingFeatures: [
      'Pétalas muito reduzidas (comprimento médio de 1.4 cm)',
      'Largura da sépala ampla em relação ao tamanho total',
      'Excelente separabilidade linear nos modelos de Machine Learning',
    ],
    typicalRanges: {
      sepal_length: [4.3, 5.8],
      sepal_width: [2.3, 4.4],
      petal_length: [1.0, 1.9],
      petal_width: [0.1, 0.6],
    },
  },
  Versicolor: {
    id: 'versicolor',
    name: 'Versicolor',
    scientificName: 'Iris versicolor L.',
    code: 1,
    badgeColor: 'bg-sky-100 text-sky-800 border-sky-300',
    accentBg: 'bg-sky-50/70',
    borderColor: 'border-sky-200',
    textColor: 'text-sky-700',
    image: versicolorImg,
    description: 'Conhecida como "Blue Flag", é nativa da América do Norte úmida. Apresenta dimensões intermediárias e padrões venados delicados em tons violeta e amarelo.',
    distinguishingFeatures: [
      'Pétalas de comprimento médio (3.0 cm a 5.1 cm)',
      'Proporções equilibradas entre comprimento e largura',
      'Zona de transição clássica no hiperplano de decisão com a Virginica',
    ],
    typicalRanges: {
      sepal_length: [4.9, 7.0],
      sepal_width: [2.0, 3.4],
      petal_length: [3.0, 5.1],
      petal_width: [1.0, 1.8],
    },
  },
  Virginica: {
    id: 'virginica',
    name: 'Virginica',
    scientificName: 'Iris virginica L.',
    code: 2,
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    accentBg: 'bg-indigo-50/70',
    borderColor: 'border-indigo-200',
    textColor: 'text-indigo-700',
    image: virginicaImg,
    description: 'Nativa do sudeste dos Estados Unidos. Notável pelas maiores dimensões florais da família, com sépalas longas e pétalas robustas acima de 5 cm de comprimento.',
    distinguishingFeatures: [
      'Pétalas maiores e mais largas (comprimento até 6.9 cm e largura > 1.8 cm)',
      'Sépalas de maior envergadura longitudinal',
      'Geralmente associada a solos alagadiços e margens fluviais',
    ],
    typicalRanges: {
      sepal_length: [4.9, 7.9],
      sepal_width: [2.2, 3.8],
      petal_length: [4.5, 6.9],
      petal_width: [1.4, 2.5],
    },
  },
};

export interface BenchmarkPreset {
  name: string;
  species: string;
  data: {
    sepal_length: number;
    sepal_width: number;
    petal_length: number;
    petal_width: number;
  };
  description: string;
}

export const BENCHMARK_PRESETS: BenchmarkPreset[] = [
  {
    name: 'Exemplo do Modelo (Virginica)',
    species: 'Virginica',
    data: {
      sepal_length: 6.7,
      sepal_width: 3.0,
      petal_length: 5.2,
      petal_width: 2.3,
    },
    description: 'Padrão fornecido na documentação da API, com pétalas longas e largas.',
  },
  {
    name: 'Amostra Típica Setosa',
    species: 'Setosa',
    data: {
      sepal_length: 5.1,
      sepal_width: 3.5,
      petal_length: 1.4,
      petal_width: 0.2,
    },
    description: 'Pétalas diminutas e sépalas largas, clássico exemplo de Setosa.',
  },
  {
    name: 'Amostra Típica Versicolor',
    species: 'Versicolor',
    data: {
      sepal_length: 5.9,
      sepal_width: 2.8,
      petal_length: 4.2,
      petal_width: 1.3,
    },
    description: 'Dimensões intermediárias características de Iris versicolor.',
  },
];
