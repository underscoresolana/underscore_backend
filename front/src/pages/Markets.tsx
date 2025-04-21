
import Layout from '@/components/Layout';
import HeatmapMarkets from '@/components/HeatmapMarkets';
import AIReport from '@/components/AIReport';
import UnderradarMarkets from '@/components/UnderradarMarkets';
import TopMarketTokens from '@/components/TopMarketTokens';

const Markets = () => {
  return (
    <Layout>
      <HeatmapMarkets />
      <UnderradarMarkets />
      <TopMarketTokens />
      <div className="mt-10">
        <AIReport />
      </div>
    </Layout>
  );
};

export default Markets;
