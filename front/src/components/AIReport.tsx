import { useState, useEffect } from 'react';
import { fetchAIReport } from '@/lib/api';
import { AIReport as AIReportType } from '@/lib/types';

const AIReport = () => {
  const [report, setReport] = useState<AIReportType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAIReport();
        setReport(data);
      } catch (error) {
        console.error('Error fetching AI report:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading || !report) {
    return <div>Loading AI Report...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-5">AI Quant Report</h2>
      
      <div className="market-card">
        {report.statements.map((statement, index) => (
          <div key={index} className="mb-2">
            <div className="flex">
              <div>{statement.text}</div>
              {statement.confidence && (
                <div className="ml-2 text-muted-foreground">--- {statement.confidence}%</div>
              )}
            </div>
          </div>
        ))}
        
        <div className="bg-muted dark:bg-secondary p-4 mt-6 rounded-md">
          <div className="font-semibold">TLDR</div>
          <div className="mt-1">Buy some coins bruh lfg wagmi</div>
        </div>
      </div>
    </div>
  );
};

export default AIReport;
