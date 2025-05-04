import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { fetchTokens } from '@/lib/api';
import { Token } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ScoreLeaderboard = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalTokens, setTotalTokens] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const tokensPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const skip = currentPage * tokensPerPage;
        const response = await fetchTokens(skip, tokensPerPage);
        setTokens(response.tokens);
        setTotalTokens(response.total);
      } catch (error) {
        console.error('Error fetching tokens:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);

  if (loading) {
    return <div className="market-card">Loading score leaderboard...</div>;
  }

  const totalPages = Math.ceil(totalTokens / tokensPerPage);
  
  // Function to determine badge color based on rating
  const getRatingColor = (rating: string) => {
    if (rating === 'Excellent') return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    if (rating === 'Good') return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    if (rating === 'Medium') return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
    if (rating === 'Low') return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  };
  
  return (
    <div className="market-card">
      <h3 className="font-semibold mb-3">Score Leaderboard</h3>
      
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="text-left text-sm text-muted-foreground">
              <th className="pb-2">Token</th>
              <th className="pb-2">Tags</th>
              <th className="pb-2">USens</th>
              <th className="pb-2">DSens</th>
              <th className="pb-2">Beta</th>
              <th className="pb-2">under_score</th>
              <th className="pb-2"></th>
            </tr>
          </thead>
          <tbody>
            {tokens.map((token) => (
              <tr key={token.id} className="border-t border-border">
                <td className="py-2">
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-muted rounded-full"></div>
                    <span className="ml-2">{token.name}</span>
                  </div>
                </td>
                <td className="py-2">
                  <div className="flex flex-wrap gap-1">
                    {token.tags.map((tag, i) => (
                      <span key={i} className="text-xs bg-muted dark:bg-secondary px-2 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-2">
                  <div className="flex items-center gap-1">
                    <span>{token.usens}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${getRatingColor('Excellent')}`}>
                      Excellent
                    </span>
                  </div>
                </td>
                <td className="py-2">
                  <div className="flex items-center gap-1">
                    <span>{token.dsens}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${getRatingColor('Medium')}`}>
                      Medium
                    </span>
                  </div>
                </td>
                <td className="py-2">
                  <div className="flex items-center gap-1">
                    <span>{token.beta}</span>
                    <span className="text-xs text-muted-foreground bg-muted dark:bg-secondary px-2 py-0.5 rounded">
                      {token.betaDesc}
                    </span>
                  </div>
                </td>
                <td className="py-2">
                  <div className="flex items-center gap-1">
                    <span>{token.underScore}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${getRatingColor(token.scoreRating)}`}>
                      {token.scoreRating}
                    </span>
                  </div>
                </td>
                <td className="py-2 text-right">
                  <Link 
                    to={`/deep-dive?token=${token.id}`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Report
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-muted-foreground">
          Showing {tokens.length} of {totalTokens} tokens
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Page {currentPage + 1} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
            disabled={currentPage === totalPages - 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ScoreLeaderboard;
