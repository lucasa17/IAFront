export interface IrisInput {
  sepal_length: number;
  sepal_width: number;
  petal_length: number;
  petal_width: number;
}

export interface IrisResponse {
  codigo: number;
  dados_recebidos: {
    sepal_length: number;
    sepal_width: number;
    petal_length: number;
    petal_width: number;
  };
  predicao: string;
}

export interface PredictionHistoryItem {
  id: string;
  timestamp: string;
  input: IrisInput;
  response: IrisResponse;
}

export interface SpeciesInfo {
  id: string;
  name: string;
  scientificName: string;
  code: number;
  badgeColor: string;
  accentBg: string;
  borderColor: string;
  textColor: string;
  image: string;
  description: string;
  distinguishingFeatures: string[];
  typicalRanges: {
    sepal_length: [number, number];
    sepal_width: [number, number];
    petal_length: [number, number];
    petal_width: [number, number];
  };
}
