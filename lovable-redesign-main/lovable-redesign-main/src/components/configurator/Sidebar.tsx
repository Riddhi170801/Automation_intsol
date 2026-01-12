import { useConfigurator } from '@/contexts/ConfiguratorContext';
import { motion } from 'framer-motion';
import { FileText, Radio, Wrench, Monitor, CheckCircle, Layers } from 'lucide-react';

const steps = [
  { id: 1, label: 'Details & Machine', icon: FileText },
  { id: 2, label: 'Sensor Selection', icon: Radio },
  { id: 3, label: 'Accessories & JB', icon: Wrench },
  { id: 4, label: 'Monitoring System', icon: Monitor },
  { id: 5, label: 'Final Summary', icon: CheckCircle },
];

export function Sidebar() {
  const { state, navigateToStep, validateStep1 } = useConfigurator();

  const handleNavClick = (stepId: number) => {
    if (stepId > 1 && !validateStep1()) {
      alert('Please fill out all required fields in the "Details & Machine" section before proceeding.');
      return;
    }
    navigateToStep(stepId);
  };

  return (
    <aside className="w-72 h-screen fixed top-0 left-0 flex flex-col bg-sidebar text-sidebar-foreground overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-4 p-6 border-b border-sidebar-border">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-sidebar-primary/20">
          <Layers className="w-5 h-5 text-sidebar-primary-foreground" />
        </div>
        <div>
          <h1 className="font-semibold text-base">Vibration</h1>
          <p className="text-xs text-sidebar-muted">Configurator</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {steps.map((step) => {
            const Icon = step.icon;
            const isActive = state.currentStep === step.id;
            const isCompleted = state.currentStep > step.id;

            return (
              <li key={step.id}>
                <button
                  onClick={() => handleNavClick(step.id)}
                  className={`sidebar-nav-item w-full text-left ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                >
                  <div className="relative">
                    <Icon className={`nav-icon w-5 h-5 ${isCompleted ? 'text-success' : ''}`} />
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute -inset-1 rounded-lg bg-sidebar-primary/20"
                        initial={false}
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </div>
                  <span className="nav-text text-sm">{step.label}</span>
                  {isCompleted && (
                    <CheckCircle className="w-4 h-4 ml-auto text-success" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <p className="text-xs text-sidebar-muted text-center">
          Step {state.currentStep} of 5
        </p>
        <div className="mt-2 h-1 bg-sidebar-accent rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-sidebar-primary"
            initial={{ width: 0 }}
            animate={{ width: `${(state.currentStep / 5) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
    </aside>
  );
}
