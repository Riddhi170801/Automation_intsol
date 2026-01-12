import { ConfiguratorProvider, useConfigurator } from '@/contexts/ConfiguratorContext';
import { Sidebar } from '@/components/configurator/Sidebar';
import { LiveSummary } from '@/components/configurator/LiveSummary';
import { Step1ProjectDetails } from '@/components/configurator/Step1ProjectDetails';
import { Step2SensorSelection } from '@/components/configurator/Step2SensorSelection';
import { Step3Accessories } from '@/components/configurator/Step3Accessories';
import { Step4Monitoring } from '@/components/configurator/Step4Monitoring';
import { Step5Summary } from '@/components/configurator/Step5Summary';
import { AnimatePresence } from 'framer-motion';

function ConfiguratorContent() {
  const { state } = useConfigurator();

  const renderStep = () => {
    switch (state.currentStep) {
      case 1:
        return <Step1ProjectDetails key="step1" />;
      case 2:
        return <Step2SensorSelection key="step2" />;
      case 3:
        return <Step3Accessories key="step3" />;
      case 4:
        return <Step4Monitoring key="step4" />;
      case 5:
        return <Step5Summary key="step5" />;
      default:
        return <Step1ProjectDetails key="step1" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <main className="ml-72 min-h-screen">
        <div className="flex gap-8 p-8">
          {/* Main Form Area */}
          <div className="flex-1 max-w-4xl">
            <AnimatePresence mode="wait">
              {renderStep()}
            </AnimatePresence>
          </div>

          {/* Live Summary Panel */}
          <div className="w-80 hidden xl:block">
            <LiveSummary />
          </div>
        </div>
      </main>
    </div>
  );
}

export default function Index() {
  return (
    <ConfiguratorProvider>
      <ConfiguratorContent />
    </ConfiguratorProvider>
  );
}
