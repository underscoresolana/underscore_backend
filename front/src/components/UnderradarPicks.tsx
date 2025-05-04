import { useState, useEffect } from 'react';
import { fetchUnderradarPicks } from '@/lib/api';
import { UnderradarPick } from '@/lib/types';

const UnderradarPicks = () => {
  const [picks, setPicks] = useState<UnderradarPick[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchUnderradarPicks();
        setPicks(data);
      } catch (error) {
        console.error('Error fetching underradar picks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="market-card">Loading underradar picks...</div>;
  }

  return (
    <div className="market-card">
      <h3 className="mb-3">Underradar picks:</h3>
      
      <div className="flex flex-wrap gap-2">
        {picks.map((pick, index) => (
          <div key={index} className="flex-1 min-w-fit">
            <button className="w-full rounded-full bg-muted border border-border px-4 py-2 hover:bg-muted/80 transition-colors text-sm">
              {pick.name}
              {pick.hasReport && <span className="text-xs text-muted-foreground ml-1">(report)</span>}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UnderradarPicks;
