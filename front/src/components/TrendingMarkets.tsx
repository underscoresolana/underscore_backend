import { useState, useEffect } from 'react';
import { fetchTrendingMarkets } from '@/lib/api';
import { TrendingMarket } from '@/lib/types';
import { Link } from 'react-router-dom';

// Define allowed sizes for the MarketBox component
type MarketBoxSize = 'lg' | 'md' | 'sm';

const MarketBox = ({ name, size }: { name: string; size: MarketBoxSize }) => {
  const sizeClasses = size === 'lg' ? 'col-span-2 row-span-2' : '';
  const colors = [
    'bg-green-200 dark:bg-green-900/30',
    'bg-blue-200 dark:bg-blue-900/30',
    'bg-yellow-200 dark:bg-yellow-900/30',
    'bg-purple-200 dark:bg-purple-900/30',
    'bg-indigo-200 dark:bg-indigo-900/30',
    'bg-orange-200 dark:bg-orange-900/30',
  ];
  
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  
  return (
    <div className={`${sizeClasses} ${randomColor} p-6 flex items-center justify-center hover:opacity-80 transition-opacity backdrop-blur-sm`}>
      <span className="text-gray-800 dark:text-gray-200 text-lg">{name}</span>
    </div>
  );
};

const TrendingMarkets = () => {
  const [markets, setMarkets] = useState<TrendingMarket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchTrendingMarkets();
        setMarkets(data);
      } catch (error) {
        console.error('Error fetching trending markets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading trending markets...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl mb-5">Trending Markets</h2>
      
      <div className="grid grid-cols-4 gap-4">
        {markets.map((market) => (
          <Link key={market.id} to={`/markets?category=${market.id}`} className={market.size === 'lg' ? 'col-span-2 row-span-2' : ''}>
            <MarketBox name={market.name} size={market.size as MarketBoxSize} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TrendingMarkets;
