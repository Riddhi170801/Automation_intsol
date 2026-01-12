import { useConfigurator } from '@/contexts/ConfiguratorContext';
import { StepNavigation } from './StepNavigation';
import { motion, AnimatePresence } from 'framer-motion';

const vm7Hardware = [
  { id: 'vm761', label: 'VM-761B/2B (Rack)' },
  { id: 'vm751', label: 'VM-751B/3B/4B (Power Supply)' },
  { id: 'vm742', label: 'VM-742B (Network Comm)' },
  { id: 'vm741', label: 'VM-741B (Local Comm/Phase)' },
  { id: 'vm701', label: 'VM-701B (Vib/Disp Monitor)' },
  { id: 'vm702', label: 'VM-702B (Abs Vib Monitor)' },
  { id: 'vm703', label: 'VM-703B (Tach/Ecc Monitor)' },
  { id: 'vm704', label: 'VM-704B (Temp Monitor)' },
  { id: 'vm706', label: 'VM-706B (Rod Drop Monitor)' },
  { id: 'vm721', label: 'VM-721B (18-Ch Relay)' },
  { id: 'vm722', label: 'VM-722B (9-Ch Relay)' },
];

const vm7Blanks = [
  { id: 'vz71', label: 'VZ-71 (30mm Blank)' },
  { id: 'vz75', label: 'VZ-75 (20mm Blank)' },
  { id: 'vz76', label: 'VZ-76 (50mm Blank)' },
];

const vm7Software = [
  { id: 'vm771', label: 'VM-771B' },
  { id: 'vm772', label: 'VM-772B' },
  { id: 'vm773', label: 'VM-773B' },
];

const getModelOptions = (type: string, make: string): string[] => {
  if (type === 'Standalone' && make === 'Shinkawa') return ['VM 21', 'VM 25'];
  if (type === 'Standalone' && make === 'FM') return ['FM Vibtrans II'];
  if (type === 'API' && make === 'Shinkawa') return ['VM 5', 'VM 7'];
  if (type === 'API' && make === 'FM') return ['Vibtrans R'];
  return [];
};

export function Step4Monitoring() {
  const { state, updateState } = useConfigurator();

  const handleVm7Change = (label: string, value: number) => {
    updateState({
      vm7Config: {
        ...state.vm7Config,
        [label]: value,
      },
    });
  };

  const modelOptions = getModelOptions(state.monitoringType, state.monitoringMake);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="form-card">
        <h3 className="form-card-header">Monitoring System</h3>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Monitoring System Required?</label>
            <select
              value={state.monitoringRequired ? 'Yes' : 'No'}
              onChange={(e) => updateState({
                monitoringRequired: e.target.value === 'Yes',
                monitoringType: '',
                monitoringMake: '',
                monitoringModel: '',
                vm7Config: {},
              })}
              className="select-field max-w-xs"
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>

          <AnimatePresence>
            {state.monitoringRequired && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">System Type</label>
                    <select
                      value={state.monitoringType}
                      onChange={(e) => updateState({
                        monitoringType: e.target.value,
                        monitoringMake: '',
                        monitoringModel: '',
                        vm7Config: {},
                      })}
                      className="select-field"
                    >
                      <option value="">-- Select --</option>
                      <option value="Standalone">Standalone</option>
                      <option value="API">API</option>
                    </select>
                  </div>

                  {state.monitoringType && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-2"
                    >
                      <label className="text-sm font-medium text-muted-foreground">Make</label>
                      <select
                        value={state.monitoringMake}
                        onChange={(e) => updateState({
                          monitoringMake: e.target.value,
                          monitoringModel: '',
                          vm7Config: {},
                        })}
                        className="select-field"
                      >
                        <option value="">-- Select --</option>
                        <option value="Shinkawa">Shinkawa</option>
                        <option value="FM">Forbes Marshall</option>
                      </select>
                    </motion.div>
                  )}

                  {state.monitoringMake && modelOptions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-2"
                    >
                      <label className="text-sm font-medium text-muted-foreground">Model</label>
                      <select
                        value={state.monitoringModel}
                        onChange={(e) => updateState({
                          monitoringModel: e.target.value,
                          vm7Config: {},
                        })}
                        className="select-field"
                      >
                        <option value="">-- Select --</option>
                        {modelOptions.map(model => (
                          <option key={model} value={model}>{model}</option>
                        ))}
                      </select>
                    </motion.div>
                  )}
                </div>

                {/* VM 7 Configuration */}
                {state.monitoringModel === 'VM 7' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-6 bg-secondary/30 rounded-lg space-y-6"
                  >
                    <h4 className="text-lg font-semibold">VM-7B Hardware Configuration</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {vm7Hardware.map(item => (
                        <div key={item.id} className="space-y-2">
                          <label className="text-xs font-medium text-muted-foreground">{item.label}</label>
                          <input
                            type="number"
                            value={state.vm7Config[item.label] || ''}
                            onChange={(e) => handleVm7Change(item.label, parseInt(e.target.value) || 0)}
                            className="input-field"
                            min={0}
                            placeholder="0"
                          />
                        </div>
                      ))}
                    </div>

                    <h4 className="text-lg font-semibold pt-4">Blank Panels</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {vm7Blanks.map(item => (
                        <div key={item.id} className="space-y-2">
                          <label className="text-xs font-medium text-muted-foreground">{item.label}</label>
                          <input
                            type="number"
                            value={state.vm7Config[item.label] || ''}
                            onChange={(e) => handleVm7Change(item.label, parseInt(e.target.value) || 0)}
                            className="input-field"
                            min={0}
                            placeholder="0"
                          />
                        </div>
                      ))}
                    </div>

                    <h4 className="text-lg font-semibold pt-4">Software</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {vm7Software.map(item => (
                        <div key={item.id} className="space-y-2">
                          <label className="text-xs font-medium text-muted-foreground">{item.label}</label>
                          <input
                            type="number"
                            value={state.vm7Config[item.label] || ''}
                            onChange={(e) => handleVm7Change(item.label, parseInt(e.target.value) || 0)}
                            className="input-field"
                            min={0}
                            placeholder="0"
                          />
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <StepNavigation />
      </div>
    </motion.div>
  );
}
