import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import ChartComponent from './ChartComponent';
import { fetchMarketState, fetchChartData } from '@/lib/api';
import { MarketState } from '@/lib/types';

const MarketStateCard = () => {
  const [marketState, setMarketState] = useState<MarketState | null>(null);
  const [chartData, setChartData] = useState<Array<{x: number; y: number}>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [marketStateData, chartDataResult] = await Promise.all([
          fetchMarketState(),
          fetchChartData(8)
        ]);
        setMarketState(marketStateData);
        setChartData(chartDataResult);
      } catch (error) {
        console.error('Error fetching market state data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading || !marketState) {
    return <div className="market-card h-full">Loading...</div>;
  }

  const { name, status, changePercent, indexName } = marketState;

  return (
    <div className="market-card h-full flex flex-col md:flex-row">
      <div className="w-full md:w-1/3 md:pr-4 md:border-r border-border relative">
        <div className="absolute top-0 left-0 text-xs text-muted-foreground bg-background/50 px-2 py-1 rounded-br">
          24h Chart
        </div>
        <div className="h-32 flex items-center justify-center">
          <ChartComponent 
            data={chartData} 
            dataKey="y"
            height="100%"
            width="100%"
            color={status === 'Bullish' || status === 'Comeback' ? "#44D7EB" : "#FF8863"}
            showGrid={true}
            precision={2}
          />
        </div>
      </div>
      <div className="w-full md:w-2/3 md:pl-4 mt-4 md:mt-0">
        <div className="mb-1 text-sm text-muted-foreground">Market state</div>
        <h2 className="text-3xl font-bold mb-2">{name}</h2>
        <div className="flex items-center mt-1">
          <span className={`flex items-center ${changePercent >= 0 ? 'trend-positive' : 'trend-negative'}`}>
            {changePercent >= 0 ? '+' : ''}{changePercent.toFixed(1)}%
            {changePercent >= 0 ? 
              <TrendingUp className="ml-1 h-4 w-4" /> : 
              <TrendingDown className="ml-1 h-4 w-4" />
            }
          </span>
          <span className="ml-2 text-sm text-muted-foreground">{indexName}</span>
        </div>
      </div>
    </div>
  );
};

export default MarketStateCard;
