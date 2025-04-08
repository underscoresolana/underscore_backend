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

export const mockTokens: Token[] = [
  {
    id: 'moodeng',
    name: 'Moodeng',
    symbol: 'MOO',
    fdv: 700000000,
    change24h: 24,
    change7d: 204,
    underScore: 71,
    scoreRating: 'Great',
    tags: ['meme', 'animal'],
    usens: 0.8,
    dsens: 0.5,
    beta: 2.5,
    betaDesc: 'HR',
    groupRank: 1,
    groupTotal: 30,
    volatilityBeta: 1.7,
    overboughtOversold: 13
  },
  {
    id: 'aiagnes',
    name: 'AiAgnes',
    symbol: 'AIAI',
    fdv: 250000000,
    change24h: -5,
    change7d: 35,
    underScore: 35,
    scoreRating: 'Fair',
    tags: ['ai'],
    usens: 0.8,
    dsens: 0.5,
    beta: 2.5,
    betaDesc: 'HR'
  },
  {
    id: 'depin',
    name: 'DePIN Memes',
    symbol: 'DEPIN',
    fdv: 420000000,
    change24h: 12,
    change7d: 34,
    underScore: 65,
    scoreRating: 'Good',
    tags: ['defi', 'infrastructure'],
    usens: 0.7,
    dsens: 0.6,
    beta: 1.8,
    betaDesc: 'MR'
  },
  {
    id: 'gamefi',
    name: 'GameFi',
    symbol: 'GAME',
    fdv: 320000000,
    change24h: -2,
    change7d: 18,
    underScore: 58,
    scoreRating: 'Good',
    tags: ['gaming', 'metaverse'],
    usens: 0.6,
    dsens: 0.6,
    beta: 1.9,
    betaDesc: 'MR'
  },
  {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    fdv: 85000000000,
    change24h: 3.2,
    change7d: 12.5,
    underScore: 82,
    scoreRating: 'Excellent',
    tags: ['l1', 'infrastructure'],
    usens: 0.5,
    dsens: 0.4,
    beta: 1.4,
    betaDesc: 'MR'
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    fdv: 420000000000,
    change24h: 1.8,
    change7d: 5.2,
    underScore: 79,
    scoreRating: 'Great',
    tags: ['l1', 'infrastructure'],
    usens: 0.4,
    dsens: 0.3,
    beta: 1.2,
    betaDesc: 'LR'
  },
  {
    id: 'dogwifhat',
    name: 'Dog Wif Hat',
    symbol: 'WIF',
    fdv: 3200000000,
    change24h: 8.7,
    change7d: 42.3,
    underScore: 68,
    scoreRating: 'Good',
    tags: ['meme', 'animal'],
    usens: 0.9,
    dsens: 0.8,
    beta: 2.8,
    betaDesc: 'HR'
  },
  {
    id: 'bonk',
    name: 'Bonk',
    symbol: 'BONK',
    fdv: 1800000000,
    change24h: 4.2,
    change7d: 28.7,
    underScore: 64,
    scoreRating: 'Good',
    tags: ['meme', 'animal'],
    usens: 0.85,
    dsens: 0.7,
    beta: 2.6,
    betaDesc: 'HR'
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    symbol: 'JUP',
    fdv: 5200000000,
    change24h: 2.1,
    change7d: 9.8,
    underScore: 76,
    scoreRating: 'Great',
    tags: ['defi', 'exchange'],
    usens: 0.6,
    dsens: 0.5,
    beta: 1.7,
    betaDesc: 'MR'
  },
  {
    id: 'pyth',
    name: 'Pyth Network',
    symbol: 'PYTH',
    fdv: 2800000000,
    change24h: -1.2,
    change7d: 15.3,
    underScore: 72,
    scoreRating: 'Great',
    tags: ['oracle', 'infrastructure'],
    usens: 0.65,
    dsens: 0.55,
    beta: 1.6,
    betaDesc: 'MR'
  }
];

export const mockOverbought: Array<{symbol: string; change: number}> = [
  { symbol: '$GNOME', change: 3.2 },
  { symbol: '$GNOME', change: 5.7 },
  { symbol: '$GNOME', change: 12.4 },
  { symbol: '$GNOME', change: 7.1 }
];

export const mockOversold: Array<{symbol: string; change: number}> = [
  { symbol: '$GNOME', change: -4.8 },
  { symbol: '$GNOME', change: -7.3 },
  { symbol: '$GNOME', change: -9.6 },
  { symbol: '$GNOME', change: -3.2 }
];

export const mockMarketState: MarketState = {
  name: 'Comeback',
  status: 'Comeback',
  changePercent: 12,
  indexName: 'Solana Leaders Index'
};

export const mockUnderradarPicks: Array<{name: string; hasReport: boolean}> = [
  { name: 'ATO', hasReport: true },
  { name: 'GHI', hasReport: true },
  { name: 'Bebracoin', hasReport: true }
];

export const mockAIReport: AIReport = {
  statements: [
    { text: 'Ai sigmo report', confidence: 80 },
    { text: 'Very good token', confidence: 6 },
    { text: 'Nice boobs' },
    { text: 'Market sdkjfnskd' },
    { text: 'adfgsdfgsd' },
    { text: 'dsfgsdfgsdfg' },
    { text: 'sdfgsdfgsdfg' },
    { text: 'sfgjtyu ghjfu dthjkghjdfgs -- good!' }
  ],
  finalScore: 65,
  scoreRating: 'Good'
};

export const mockTrendingMarkets = [
  {
    id: 'memes',
    name: 'Memes',
    size: 'lg' as const
  },
  {
    id: 'depin',
    name: 'DePIN',
    size: 'md' as const
  },
  {
    id: 'market3',
    name: 'Market 3',
    size: 'md' as const
  },
  {
    id: 'market4',
    name: 'Market 4',
    size: 'md' as const
  },
  {
    id: 'ai-agents',
    name: 'AI Agents',
    size: 'md' as const
  },
  {
    id: 'market5',
    name: 'Market 5',
    size: 'md' as const
  }
];

export const mockUnderradarMarkets = [
  {
    id: 'depin',
    name: 'DePIN',
    size: 'sm' as const
  },
  {
    id: 'gamefi',
    name: 'GameFi',
    size: 'sm' as const
  },
];
