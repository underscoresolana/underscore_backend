import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Token } from '@/lib/types';

const BestPerformer = () => {
  const [bestMarket, setBestToken] = useState<Token | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/best-performer');
        if (!response.ok) {
          throw new Error('Failed to fetch best performer');
        }
        const data = await response.json();
        setBestToken(data);
      } catch (error) {
        console.error('Error fetching best performer:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading || !bestMarket) {
    return (
      <div className="market-card h-full flex flex-col">
        <h3 className="font-semibold mb-3">Best performing market</h3>
        <div className="flex-grow flex items-center justify-center">
          Loading...
        </div>
      </div>
    );
  }
  
  return (
    <div className="market-card h-full flex flex-col">
      <h3 className="font-semibold mb-3">Best performing market</h3>
      
      <Link 
        to={`/deep-dive?token=${bestMarket.id}`}
        className="flex flex-col items-center p-3 rounded-lg bg-muted/30 border border-border hover:bg-muted/50 transition-colors flex-grow"
      >
        <div className="text-lg font-medium mb-4">{bestMarket.name}</div>
        <div className="flex gap-6 text-base">
          <div>
            <span className="trend-positive text-xl">+{bestMarket.change24h}%</span>
            <span className="text-muted-foreground ml-1">Δ24h</span>
          </div>
          <div>
            <span className="trend-positive text-xl">+{bestMarket.change7d}%</span>
            <span className="text-muted-foreground ml-1">Δ7d</span>
          </div>
        </div>
      </Link>
      
      <div className="text-center mt-3">
        <Link to="/markets" className="text-sm text-primary hover:underline">
          Explore markets
        </Link>
      </div>
    </div>
  );
};

export default BestPerformer;
