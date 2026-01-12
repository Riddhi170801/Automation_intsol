import { useConfigurator } from '@/contexts/ConfiguratorContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface StepNavigationProps {
  showPrev?: boolean;
  showNext?: boolean;
  prevStep?: number;
  nextStep?: number;
  onNext?: () => boolean; // Return false to prevent navigation
}

export function StepNavigation({
  showPrev = true,
  showNext = true,
  prevStep,
  nextStep,
  onNext,
}: StepNavigationProps) {
  const { state, navigateToStep, validateStep1 } = useConfigurator();

  const handlePrev = () => {
    if (prevStep !== undefined) {
      navigateToStep(prevStep);
    } else if (state.currentStep > 1) {
      navigateToStep(state.currentStep - 1);
    }
  };

  const handleNext = () => {
    if (state.currentStep === 1 && !validateStep1()) {
      alert('Please fill out all required fields before proceeding.');
      return;
    }
    
    if (onNext && !onNext()) {
      return;
    }

    if (nextStep !== undefined) {
      navigateToStep(nextStep);
    } else if (state.currentStep < 5) {
      navigateToStep(state.currentStep + 1);
    }
  };

  return (
    <div className="flex justify-between items-center mt-8 pt-6 border-t border-border">
      {showPrev && state.currentStep > 1 ? (
        <button
          onClick={handlePrev}
          className="btn-secondary flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>
      ) : (
        <div />
      )}

      {showNext && state.currentStep < 5 ? (
        <button
          onClick={handleNext}
          className="btn-primary flex items-center gap-2"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      ) : (
        <div />
      )}
    </div>
  );
}
