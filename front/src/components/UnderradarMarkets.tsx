import { useState, useEffect } from 'react';
import { fetchUnderradarMarkets } from '@/lib/api';
import { TrendingMarket } from '@/lib/types';
import { Link } from 'react-router-dom';

const UnderradarMarkets = () => {
  const [markets, setMarkets] = useState<TrendingMarket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchUnderradarMarkets();
        setMarkets(data);
      } catch (error) {
        console.error('Error fetching underradar markets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading underradar markets...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl mb-5">Under Radar</h2>
      
      <div className="grid grid-cols-4 gap-4">
        {markets.map((market) => (
          <Link key={market.id} to={`/markets?category=${market.id}`} className="bg-black/70 backdrop-blur-sm rounded-none border border-border hover:bg-black/80 transition-colors">
            <div className="p-4">
              {market.name}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default UnderradarMarkets;
