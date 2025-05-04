import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { fetchOverbought, fetchOversold } from '@/lib/api';
import { PriceChange } from '@/lib/types';

const OverboughtOversold = () => {
  const [overbought, setOverbought] = useState<PriceChange[]>([]);
  const [oversold, setOversold] = useState<PriceChange[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [overboughtData, oversoldData] = await Promise.all([
          fetchOverbought(),
          fetchOversold()
        ]);
        setOverbought(overboughtData);
        setOversold(oversoldData);
      } catch (error) {
        console.error('Error fetching overbought/oversold data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="flex gap-4">Loading...</div>;
  }

  return (
    <div className="flex gap-4">
      <div className="market-card flex-1">
        <h3 className="font-semibold mb-3">Overbought</h3>
        
        <div className="space-y-3">
          {overbought.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="w-5 h-5 rounded-full border border-gray-300 inline-flex"></span>
                <span className="ml-2">{item.symbol}</span>
              </div>
              <div className="trend-positive flex items-center">
                +{item.change}%
                <TrendingUp className="ml-1 h-3 w-3" />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="market-card flex-1">
        <h3 className="font-semibold mb-3">Oversold</h3>
        
        <div className="space-y-3">
          {oversold.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="w-5 h-5 rounded-full border border-gray-300 inline-flex"></span>
                <span className="ml-2">{item.symbol}</span>
              </div>
              <div className="trend-negative flex items-center">
                {item.change}%
                <TrendingDown className="ml-1 h-3 w-3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OverboughtOversold;
