export interface Token {
  id: string;
  name: string;
  symbol: string;
  logoUrl?: string;
  fdv: number;
  change24h: number;
  change7d: number;
  underScore: number;
  scoreRating: 'Excellent' | 'Great' | 'Good' | 'Fair' | 'Poor';
  tags: string[];
  usens: number;
  dsens: number;
  beta: number;
  betaDesc: string;
  groupRank?: number;
  groupTotal?: number;
  volatilityBeta?: number;
  overboughtOversold?: number;
}

export interface TokensResponse {
  tokens: Token[];
  total: number;
}

export interface AIReport {
  statements: Array<{text: string; confidence?: number}>;
  finalScore: number;
  scoreRating: 'Excellent' | 'Great' | 'Good' | 'Fair' | 'Poor';
}

export interface MarketState {
  name: string;
  status: 'Comeback' | 'Bullish' | 'Bearish' | 'Sideways';
  changePercent: number;
  indexName: string;
}

export interface UnderradarPick {
  name: string;
  hasReport: boolean;
}

export interface TrendingMarket {
  id: string;
  name: string;
  size: 'sm' | 'md' | 'lg';
}

export interface PriceChange {
  symbol: string;
  change: number;
} 