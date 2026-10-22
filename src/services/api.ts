import { IrisInput, IrisResponse } from '../types/iris';

const API_ENDPOINT = 'https://ia-izpw.onrender.com/api/predict';

export interface PredictApiOptions {
  onColdStartNotice?: (isColdStarting: boolean) => void;
  signal?: AbortSignal;
}

export class ApiError extends Error {
  statusCode?: number;
  isNetworkError: boolean;
  isTimeout: boolean;
  
  constructor(message: string, options?: { statusCode?: number; isNetworkError?: boolean; isTimeout?: boolean }) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = options?.statusCode;
    this.isNetworkError = options?.isNetworkError || false;
    this.isTimeout = options?.isTimeout || false;
  }
}

/**
 * Predicts the Iris species using the external ML API hosted on Render
 */
export async function predictIrisSpecies(
  input: IrisInput,
  options?: PredictApiOptions
): Promise<IrisResponse> {
  const controller = new AbortController();
  const timeoutMs = 45000; // Render free instances can take up to 30-40s during initial wake-up

  // Timer to notify if Render is taking longer (cold start)
  const coldStartTimer = setTimeout(() => {
    if (options?.onColdStartNotice) {
      options.onColdStartNotice(true);
    }
  }, 3500);

  const timeoutId = setTimeout(() => {
    controller.abort('timeout');
  }, timeoutMs);

  try {
    const payload = {
      sepal_length: Number(input.sepal_length),
      sepal_width: Number(input.sepal_width),
      petal_length: Number(input.petal_length),
      petal_width: Number(input.petal_width),
    };

    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
      signal: options?.signal || controller.signal,
    });

    clearTimeout(coldStartTimer);
    clearTimeout(timeoutId);
    if (options?.onColdStartNotice) {
      options.onColdStartNotice(false);
    }

    if (!response.ok) {
      let errorBody = '';
      try {
        errorBody = await response.text();
      } catch {
        // ignore
      }
      throw new ApiError(
        `Falha na resposta do servidor (HTTP ${response.status}): ${errorBody || response.statusText}`,
        { statusCode: response.status }
      );
    }

    const data: IrisResponse = await response.json();

    // Validate expected structure
    if (typeof data.predicao === 'undefined') {
      throw new ApiError('A resposta da API não conteve o campo "predicao" esperado.');
    }

    return data;
  } catch (error: any) {
    clearTimeout(coldStartTimer);
    clearTimeout(timeoutId);
    if (options?.onColdStartNotice) {
      options.onColdStartNotice(false);
    }

    if (error?.name === 'AbortError' || error === 'timeout') {
      throw new ApiError(
        'Tempo limite excedido (45s). O servidor na Render pode estar demorando para inicializar.',
        { isTimeout: true }
      );
    }

    if (error instanceof ApiError) {
      throw error;
    }

    const isNetwork = !window.navigator.onLine || error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError');

    throw new ApiError(
      isNetwork
        ? 'Erro de rede ou conexão ao tentar acessar a API. Verifique sua conexão com a internet.'
        : `Erro ao processar predição: ${error.message || 'Erro desconhecido'}`,
      { isNetworkError: isNetwork }
    );
  }
}
