import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Token } from '@/lib/types';

const TopMarketTokens = () => {
  // Get the current market from URL query parameters
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const category = searchParams.get('category') || 'memes';
  const [topTokens, setTopTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Get a formatted market name for display (capitalize first letter)
  const marketName = category.charAt(0).toUpperCase() + category.slice(1);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/top-market-tokens/${category}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch top tokens for market: ${category}`);
        }
        const data = await response.json();
        setTopTokens(data);
      } catch (error) {
        console.error('Error fetching top market tokens:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [category]);
  
  // Function to determine badge color based on rating
  const getRatingColor = (rating: string) => {
    if (rating === 'Excellent') return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    if (rating === 'Good') return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    if (rating === 'Medium') return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
    if (rating === 'Low') return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  };
  
  if (loading) {
    return (
      <div className="market-card mt-10">
        <h3 className="font-semibold mb-3">Top {marketName} Tokens</h3>
        <div className="py-4 text-center">Loading top tokens data...</div>
      </div>
    );
  }
  
  return (
    <div className="market-card mt-10">
      <h3 className="font-semibold mb-3">Top {marketName} Tokens</h3>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Token</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>USens</TableHead>
              <TableHead>DSens</TableHead>
              <TableHead>Beta</TableHead>
              <TableHead>under_score</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topTokens.map((token) => (
              <TableRow key={token.id}>
                <TableCell>
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-muted rounded-full"></div>
                    <span className="ml-2">{token.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {token.tags.map((tag, i) => (
                      <span key={i} className="text-xs bg-muted dark:bg-secondary px-2 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <span>{token.usens}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${getRatingColor('Excellent')}`}>
                      Excellent
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <span>{token.dsens}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${getRatingColor('Medium')}`}>
                      Medium
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <span>{token.beta}</span>
                    <span className="text-xs text-muted-foreground bg-muted dark:bg-secondary px-2 py-0.5 rounded">
                      {token.betaDesc}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <span>{token.underScore}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${getRatingColor(token.scoreRating)}`}>
                      {token.scoreRating}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Link 
                    to={`/deep-dive?token=${token.id}`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Report
                  </Link>
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground">...</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TopMarketTokens;
