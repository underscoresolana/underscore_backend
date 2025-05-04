import { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine,
  Legend
} from 'recharts';
import { Info, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useSearchParams } from 'react-router-dom';

interface ChartProps {
  title: string;
  dataKey: string;
  baseKey: string;
  data: any[];
}

const DynamicsChart = ({ title, dataKey, baseKey, data }: ChartProps) => {
  return (
    <div className="bg-black/80 rounded-lg overflow-hidden p-4 border border-white/20 backdrop-blur-sm">
      <div className="flex justify-between items-center mb-3 text-white">
        <div className="font-medium">{title}</div>
        <Info className="w-4 h-4 text-gray-400" />
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart 
          data={data}
          margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
        >
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#44D7EB" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#44D7EB" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorBase" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
            </linearGradient>
          </defs>
          
          <CartesianGrid 
            strokeDasharray="3 3" 
            vertical={true} 
            horizontal={true} 
            stroke="rgba(255, 255, 255, 0.1)" 
          />
          
          <ReferenceLine y={1} stroke="rgba(255, 255, 255, 0.2)" strokeWidth={1} />
          
          <YAxis 
            domain={[0.6, 1.4]} 
            axisLine={false} 
            tick={{ fill: '#aaa', fontSize: 10 }} 
            tickLine={false}
            tickCount={5}
            tickFormatter={(value) => value.toFixed(1)}
            width={30}
          />
          
          <XAxis 
            dataKey="day" 
            axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
            tick={{ fill: '#aaa', fontSize: 10 }} 
            tickLine={false}
            tickCount={6}
          />
          
          <Tooltip 
            formatter={(value: number, name: string) => {
              const displayName = name === baseKey ? 'Market' : 'Token';
              return [value.toFixed(3), displayName];
            }}
            contentStyle={{ 
              backgroundColor: 'rgba(0, 0, 0, 0.8)', 
              border: '1px solid rgba(255, 255, 255, 0.2)', 
              borderRadius: '4px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
              padding: '8px 12px'
            }}
            labelStyle={{ color: '#aaa', marginBottom: '5px' }}
            itemStyle={{ color: '#fff', padding: '2px 0' }}
          />
          
          <Legend 
            verticalAlign="top" 
            height={36}
            formatter={(value) => {
              return value === baseKey ? 'Market' : 'Token';
            }}
          />
          
          <Line 
            type="monotone" 
            dataKey={baseKey} 
            name={baseKey}
            stroke="#8884d8" 
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6, strokeWidth: 0 }}
            animationDuration={1500}
          />
          
          <Line 
            type="monotone" 
            dataKey={dataKey}
            name={dataKey}
            stroke="#44D7EB" 
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 6, strokeWidth: 0, fill: "#44D7EB" }}
            animationDuration={1500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

interface PriceDynamicsData {
  data: any[];
  score: number;
  scoreRating: string;
}

const PriceDynamics = () => {
  const [searchParams] = useSearchParams();
  const tokenId = searchParams.get('token') || 'moodeng';
  const [dynamicsData, setDynamicsData] = useState<PriceDynamicsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/price-dynamics/${tokenId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch price dynamics data');
        }
        const data = await response.json();
        setDynamicsData(data);
      } catch (error) {
        console.error('Error fetching price dynamics data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tokenId]);

  if (loading || !dynamicsData) {
    return <div className="mt-6">Loading price dynamics data...</div>;
  }
  
  // Function to determine the glow color based on score rating
  const getGlowColor = (rating: string) => {
    switch(rating) {
      case 'Excellent': return 'rgba(52, 211, 153, 0.5)'; // Green
      case 'Great': return 'rgba(59, 130, 246, 0.5)'; // Blue
      case 'Good': return 'rgba(139, 92, 246, 0.5)'; // Purple
      case 'Fair': return 'rgba(251, 191, 36, 0.5)'; // Yellow
      case 'Poor': return 'rgba(239, 68, 68, 0.5)'; // Red
      default: return 'rgba(68, 215, 235, 0.5)'; // Default teal
    }
  };
  
  // Badge background color based on rating
  const getBadgeColor = (rating: string) => {
    switch(rating) {
      case 'Excellent': return 'bg-emerald-500';
      case 'Great': return 'bg-blue-500';
      case 'Good': return 'bg-violet-500';
      case 'Fair': return 'bg-amber-500';
      case 'Poor': return 'bg-red-500';
      default: return 'bg-primary';
    }
  };
  
  return (
    <div className="mt-6">
      <div className="market-card mb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center">
            <h2 className="text-xl font-bold">Performance Analysis</h2>
            <div className="ml-2 text-muted-foreground">
              <Info className="w-4 h-4" />
            </div>
          </div>
          
          <div className="flex items-center mt-2 md:mt-0">
            <div className="flex items-center mr-3">
              <TrendingUp className="w-4 h-4 text-emerald-400 mr-1" />
              <span className="text-sm text-muted-foreground">30-day analysis</span>
            </div>
            
            <div className="flex items-center">
              <div className="text-lg font-bold mr-2">
                Score: {dynamicsData.score.toFixed(1)}
              </div>
              <Badge 
                className={`${getBadgeColor(dynamicsData.scoreRating)} text-white px-3 py-0.5 text-xs font-medium`}
                style={{ 
                  boxShadow: `0 0 15px ${getGlowColor(dynamicsData.scoreRating)}` 
                }}
              >
                {dynamicsData.scoreRating}
              </Badge>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DynamicsChart 
          title="Price Performance vs Market" 
          dataKey="price" 
          baseKey="market" 
          data={dynamicsData.data} 
        />
        <DynamicsChart 
          title="Price Performance vs Group" 
          dataKey="price" 
          baseKey="group" 
          data={dynamicsData.data} 
        />
      </div>
    </div>
  );
};

export default PriceDynamics;
