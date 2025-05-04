import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchToken } from '@/lib/api';
import { Token } from '@/lib/types';

const TokenInfo = () => {
  const [searchParams] = useSearchParams();
  const tokenId = searchParams.get('token') || 'moodeng';
  const [token, setToken] = useState<Token | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchToken(tokenId);
        setToken(data);
      } catch (error) {
        console.error('Error fetching token:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tokenId]);

  if (loading || !token) {
    return <div className="market-card">Loading token information...</div>;
  }
  
  return (
    <div className="market-card">
      <div className="flex items-center">
        <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
        <div className="ml-4">
          <h1 className="text-2xl font-bold">{token.name}</h1>
          <div className="text-gray-500">{token.symbol}</div>
        </div>
      </div>
      
      <div className="mt-4 border-t border-gray-100 pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <div className="text-sm text-gray-500">FDV:</div>
          <div className="font-medium">${(token.fdv / 1000000).toFixed(0)}M</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">24H:</div>
          <div className={token.change24h >= 0 ? "trend-positive" : "trend-negative"}>
            {token.change24h >= 0 ? "+" : ""}{token.change24h}%
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-500">7D:</div>
          <div className={token.change7d >= 0 ? "trend-positive" : "trend-negative"}>
            {token.change7d >= 0 ? "+" : ""}{token.change7d}%
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-2 flex items-center">
        <div className="mr-4">
          <div className="text-sm text-gray-500">under__score:</div>
          <div className="text-xl font-bold flex items-center">
            {token.underScore}
            <span className={`ml-2 text-sm rounded-full px-3 py-0.5 ${
              token.scoreRating === 'Excellent' || token.scoreRating === 'Great' 
                ? 'bg-green-100 text-green-800' 
                : token.scoreRating === 'Good' 
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
            }`}>
              {token.scoreRating}
            </span>
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-2 border-t border-gray-100 grid grid-cols-2 gap-4">
        <div>
          <div className="text-sm text-gray-500">Beta:</div>
          <div className="font-medium">{token.beta}%</div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Volatility Beta:</div>
          <div className="font-medium">{token.volatilityBeta}%</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">USens:</div>
          <div className="font-medium">{token.usens}%</div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Group rank:</div>
          <div className="font-medium">{token.groupRank} (of {token.groupTotal})</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">DSens:</div>
          <div className="font-medium">{token.dsens}%</div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Overbought / oversold:</div>
          <div className={token.overboughtOversold && token.overboughtOversold >= 0 ? "trend-positive" : "trend-negative"}>
            {token.overboughtOversold ? (token.overboughtOversold >= 0 ? "+" : "") + token.overboughtOversold + "%" : "N/A"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenInfo;
