import Layout from '@/components/Layout';
import TerminalSearchBar from '@/components/TerminalSearchBar';
import TokenInfo from '@/components/TokenInfo';
import PriceDynamics from '@/components/PriceDynamics';
import Fundamentals from '@/components/Fundamentals';

const DeepDive = () => {
  return (
    <Layout>
      <div className="mb-6">
        <TerminalSearchBar />
      </div>
      
      <div className="space-y-6">
        <TokenInfo />
        <PriceDynamics />
        <Fundamentals />
      </div>
    </Layout>
  );
};

export default DeepDive;
