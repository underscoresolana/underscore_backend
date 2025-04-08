import { Token, AIReport, MarketState, PriceChange, TrendingMarket, TokensResponse } from './types';

const API_URL = 'http://localhost:8000/api';

export async function fetchTokens(skip: number = 0, limit: number = 30): Promise<TokensResponse> {
  const response = await fetch(`${API_URL}/tokens?skip=${skip}&limit=${limit}`);
  if (!response.ok) {
    throw new Error('Failed to fetch tokens');
  }
  return response.json();
}

export async function fetchToken(tokenId: string): Promise<Token> {
  const response = await fetch(`${API_URL}/tokens/${tokenId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch token with ID: ${tokenId}`);
  }
  return response.json();
}

export async function fetchMarketState(): Promise<MarketState> {
  const response = await fetch(`${API_URL}/market-state`);
  if (!response.ok) {
    throw new Error('Failed to fetch market state');
  }
  return response.json();
}

export async function fetchOverbought(): Promise<PriceChange[]> {
  const response = await fetch(`${API_URL}/overbought`);
  if (!response.ok) {
    throw new Error('Failed to fetch overbought data');
  }
  return response.json();
}

export async function fetchOversold(): Promise<PriceChange[]> {
  const response = await fetch(`${API_URL}/oversold`);
  if (!response.ok) {
    throw new Error('Failed to fetch oversold data');
  }
  return response.json();
}

export async function fetchUnderradarPicks(): Promise<Array<{name: string; hasReport: boolean}>> {
  const response = await fetch(`${API_URL}/underradar-picks`);
  if (!response.ok) {
    throw new Error('Failed to fetch underradar picks');
  }
  return response.json();
}

export async function fetchAIReport(): Promise<AIReport> {
  const response = await fetch(`${API_URL}/ai-report`);
  if (!response.ok) {
    throw new Error('Failed to fetch AI report');
  }
  return response.json();
}

export async function fetchTrendingMarkets(): Promise<TrendingMarket[]> {
  const response = await fetch(`${API_URL}/trending-markets`);
  if (!response.ok) {
    throw new Error('Failed to fetch trending markets');
  }
  return response.json();
}

export async function fetchUnderradarMarkets(): Promise<TrendingMarket[]> {
  const response = await fetch(`${API_URL}/underradar-markets`);
  if (!response.ok) {
    throw new Error('Failed to fetch underradar markets');
  }
  return response.json();
}

export async function fetchChartData(points: number = 20): Promise<Array<{x: number; y: number}>> {
  const response = await fetch(`${API_URL}/market-chart-data?points=${points}`);
  if (!response.ok) {
    throw new Error('Failed to fetch chart data');
  }
  return response.json();
}

export async function fetchBestPerformer(): Promise<Token> {
  const response = await fetch(`${API_URL}/best-performer`);
  if (!response.ok) {
    throw new Error('Failed to fetch best performer');
  }
  return response.json();
}

export async function fetchPriceDynamics(tokenId: string, days: number = 30): Promise<any> {
  const response = await fetch(`${API_URL}/price-dynamics/${tokenId}?days=${days}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch price dynamics for token: ${tokenId}`);
  }
  return response.json();
}

export async function fetchFundamentals(tokenId: string): Promise<any> {
  const response = await fetch(`${API_URL}/fundamentals/${tokenId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch fundamentals for token: ${tokenId}`);
  }
  return response.json();
}

export async function fetchMarketHeatmap(): Promise<any[]> {
  const response = await fetch(`${API_URL}/market-heatmap`);
  if (!response.ok) {
    throw new Error('Failed to fetch market heatmap data');
  }
  return response.json();
}

export async function fetchTopMarketTokens(marketId: string, limit: number = 3): Promise<Token[]> {
  const response = await fetch(`${API_URL}/top-market-tokens/${marketId}?limit=${limit}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch top tokens for market: ${marketId}`);
  }
  return response.json();
} 