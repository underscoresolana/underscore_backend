import { Token } from '@/lib/types';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TokensListProps {
  tokens: Token[];
  title?: string;
  showDetails?: boolean;
}

const TokensList = ({ tokens, title, showDetails = true }: TokensListProps) => {
  return (
    <div className="market-card">
      {title && <h3 className="text-lg mb-3">{title}</h3>}
      
      <div>
        {tokens.map((token) => (
          <Link 
            to={`/deep-dive?token=${token.id}`} 
            key={token.id} 
            className="token-row hover:bg-muted/50 rounded"
          >
            <div className="flex items-center w-full">
              <div className="w-10 h-10 bg-muted rounded-full flex-shrink-0"></div>
              <div className="ml-3 flex-grow">
                <div className="flex justify-between">
                  <div>
                    <span>{token.name}</span>
                    <span className="text-xs text-muted-foreground ml-1">{token.symbol}</span>
                  </div>
                  {showDetails && (
                    <div className="text-right">
                      <div>
                        under__score: {token.underScore}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {token.scoreRating}
                      </div>
                    </div>
                  )}
                </div>
                
                {showDetails && (
                  <div className="flex text-sm mt-1">
                    <div className="mr-4">
                      <span className="text-muted-foreground">24H: </span>
                      <span className={token.change24h >= 0 ? "trend-positive" : "trend-negative"}>
                        {token.change24h >= 0 ? "+" : ""}{token.change24h}%
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">7D: </span>
                      <span className={token.change7d >= 0 ? "trend-positive" : "trend-negative"}>
                        {token.change7d >= 0 ? "+" : ""}{token.change7d}%
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TokensList;
