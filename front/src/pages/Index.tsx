import React from 'react';
import Layout from '@/components/Layout';
import MarketStateCard from '@/components/MarketStateCard';
import OverboughtOversold from '@/components/OverboughtOversold';
import BestPerformer from '@/components/BestPerformer';
import UnderradarPicks from '@/components/UnderradarPicks';
import ScoreLeaderboard from '@/components/ScoreLeaderboard';
import TerminalSearchBar from '@/components/TerminalSearchBar';

const Index = () => {
  return (
    <Layout>
      <TerminalSearchBar />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-full">
          <MarketStateCard />
        </div>
        <div className="h-full">
          <BestPerformer />
        </div>
      </div>
      
      <div className="mt-6">
        <OverboughtOversold />
      </div>
      
      <div className="mt-6">
        <UnderradarPicks />
      </div>
      
      <div className="mt-6">
        <ScoreLeaderboard />
      </div>
    </Layout>
  );
};

export default Index;
