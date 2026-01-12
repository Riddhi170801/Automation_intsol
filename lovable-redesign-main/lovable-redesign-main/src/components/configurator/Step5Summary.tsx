import { useConfigurator } from '@/contexts/ConfiguratorContext';
import { StepNavigation } from './StepNavigation';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { FileText, FileSpreadsheet, Check, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export function Step5Summary() {
  const { state, generateTextSummary, validateStep1, navigateToStep } = useConfigurator();
  const [textSummary, setTextSummary] = useState<string>('Click "Generate Text Summary" to see your complete configuration.');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleGenerateSummary = () => {
    const summary = generateTextSummary();
    setTextSummary(summary);
  };

  const handleGenerateExcel = () => {
    if (!validateStep1()) {
      navigateToStep(1);
      toast({
        title: 'Validation Error',
        description: 'Please fill out all required fields in the "Details & Machine" section.',
        variant: 'destructive',
      });
      return;
    }

    // Excel generation logic would go here
    toast({
      title: 'Excel Generation',
      description: 'Excel file generation would run here with all collected data.',
    });
  };

  const handleSubmit = () => {
    setIsSubmitted(!isSubmitted);
    toast({
      title: isSubmitted ? 'Submission Withdrawn' : 'Submitted Successfully',
      description: isSubmitted ? 'Your configuration has been withdrawn.' : 'Your configuration has been submitted for review.',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="form-card">
        <h3 className="form-card-header">Final Configuration & Actions</h3>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <button
            onClick={handleGenerateSummary}
            className="btn-primary flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Generate Text Summary
          </button>
          <button
            onClick={handleGenerateExcel}
            className="btn-success flex items-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Generate Excel
          </button>
        </div>

        {/* Summary Output */}
        <div className="bg-secondary/50 rounded-lg border border-border overflow-hidden">
          <div className="p-3 bg-secondary border-b border-border">
            <span className="text-sm font-medium text-muted-foreground">Configuration Summary</span>
          </div>
          <pre className="p-4 font-mono text-sm whitespace-pre-wrap overflow-y-auto max-h-[400px] scrollbar-thin">
            {textSummary}
          </pre>
        </div>

        {/* Submit Section */}
        <div className="mt-8 pt-6 border-t border-border">
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handleSubmit}
              className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${
                isSubmitted
                  ? 'bg-success text-success-foreground hover:opacity-90'
                  : 'btn-primary'
              }`}
            >
              {isSubmitted ? (
                <>
                  <Check className="w-4 h-4" />
                  Submitted
                </>
              ) : (
                'Submit'
              )}
            </button>
            <div className={`flex items-center gap-2 text-sm font-medium ${isSubmitted ? 'text-success' : 'text-destructive'}`}>
              {isSubmitted ? (
                <>
                  <Check className="w-4 h-4" />
                  Submitted Successfully
                </>
              ) : (
                <>
                  <X className="w-4 h-4" />
                  Not Submitted
                </>
              )}
            </div>
          </div>
        </div>

        <StepNavigation showNext={false} />
      </div>
    </motion.div>
  );
}
