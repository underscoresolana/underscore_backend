import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Info, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Statement {
  text: string;
  confidence?: number;
}

interface FundamentalsData {
  statements: Statement[];
  finalScore: number;
  scoreRating: string;
}

const Fundamentals = () => {
  const [searchParams] = useSearchParams();
  const tokenId = searchParams.get('token') || 'moodeng';
  const [fundamentals, setFundamentals] = useState<FundamentalsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/fundamentals/${tokenId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch fundamentals data');
        }
        const data = await response.json();
        setFundamentals(data);
      } catch (error) {
        console.error('Error fetching fundamentals data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tokenId]);

  if (loading || !fundamentals) {
    return <div className="mt-6">Loading fundamentals data...</div>;
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
            <h2 className="text-xl font-bold">Fundamentals Analysis</h2>
            <div className="ml-2 text-muted-foreground">
              <Info className="w-4 h-4" />
            </div>
          </div>
          
          <div className="flex items-center mt-2 md:mt-0">
            <div className="flex items-center mr-3">
              <FileText className="w-4 h-4 text-emerald-400 mr-1" />
              <span className="text-sm text-muted-foreground">Qualitative analysis</span>
            </div>
            
            <div className="flex items-center">
              <div className="text-lg font-bold mr-2">
                Score: {fundamentals.finalScore.toFixed(1)}
              </div>
              <Badge 
                className={`${getBadgeColor(fundamentals.scoreRating)} text-white px-3 py-0.5 text-xs font-medium`}
                style={{ 
                  boxShadow: `0 0 15px ${getGlowColor(fundamentals.scoreRating)}` 
                }}
              >
                {fundamentals.scoreRating}
              </Badge>
            </div>
          </div>
        </div>
      </div>
      
      <div className="market-card">
        <div className="space-y-3">
          {fundamentals.statements.map((statement, index) => (
            <div key={index} className="py-1 border-b border-border/30 last:border-0">
              <div className="flex items-start">
                <div className="flex-1">{statement.text}</div>
                {statement.confidence && (
                  <div className="ml-3 text-muted-foreground text-sm whitespace-nowrap">
                    {statement.confidence}% confidence
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 text-xs text-muted-foreground text-right italic">
          Analysis generated based on on-chain data and market signals
        </div>
      </div>
    </div>
  );
};

export default Fundamentals;
