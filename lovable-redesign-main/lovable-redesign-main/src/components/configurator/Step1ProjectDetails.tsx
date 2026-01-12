import { useConfigurator } from '@/contexts/ConfiguratorContext';
import { StepNavigation } from './StepNavigation';
import { motion } from 'framer-motion';

export function Step1ProjectDetails() {
  const { state, updateState } = useConfigurator();

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    updateState({ [field]: e.target.value });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="form-card">
        <h3 className="form-card-header">Project & Machine Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">ENGINEER *</label>
            <input
              type="text"
              value={state.engineer}
              onChange={handleChange('engineer')}
              className="input-field"
              placeholder="Enter engineer name"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">EMAIL *</label>
            <input
              type="email"
              value={state.email}
              onChange={handleChange('email')}
              className="input-field"
              placeholder="engineer@company.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">CUSTOMER OFFER NO. *</label>
            <input
              type="text"
              value={state.offerNo}
              onChange={handleChange('offerNo')}
              className="input-field"
              placeholder="Enter offer number"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">CUSTOMER *</label>
            <input
              type="text"
              value={state.customer}
              onChange={handleChange('customer')}
              className="input-field"
              placeholder="Customer name"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">PROJECT *</label>
            <input
              type="text"
              value={state.project}
              onChange={handleChange('project')}
              className="input-field"
              placeholder="Project name"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">REFERENCE *</label>
            <input
              type="text"
              value={state.ref}
              onChange={handleChange('ref')}
              className="input-field"
              placeholder="Reference"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">BRANCH *</label>
            <input
              type="text"
              value={state.branch}
              onChange={handleChange('branch')}
              className="input-field"
              placeholder="Branch location"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">MACHINE</label>
            <input
              type="text"
              value={state.machine}
              onChange={handleChange('machine')}
              className="input-field"
              placeholder="Machine name"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">MACHINE TYPE</label>
            <select
              value={state.machineType}
              onChange={handleChange('machineType')}
              className="select-field"
            >
              <option value="">-- Select --</option>
              <option value="Horizontal">Horizontal</option>
              <option value="Vertical">Vertical</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">BEARING TYPE</label>
            <select
              value={state.bearingType}
              onChange={handleChange('bearingType')}
              className="select-field"
            >
              <option value="">-- Select --</option>
              <option value="Antifriction">Antifriction</option>
              <option value="Oil Sleeve Type">Oil Sleeve Type</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">MACHINE SPEED (RPM)</label>
            <input
              type="text"
              value={state.machineSpeed}
              onChange={handleChange('machineSpeed')}
              className="input-field"
              placeholder="e.g. 3000"
            />
          </div>
        </div>

        <StepNavigation showPrev={false} />
      </div>
    </motion.div>
  );
}
