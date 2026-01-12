import { useConfigurator } from '@/contexts/ConfiguratorContext';
import { StepNavigation } from './StepNavigation';
import { motion, AnimatePresence } from 'framer-motion';

export function Step3Accessories() {
  const { state, updateState } = useConfigurator();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="form-card">
        <h3 className="form-card-header">Accessories & Junction Box</h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Extension Cable & Mounting */}
          <div className="space-y-6">
            {/* Extension Cable */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-foreground">Extension Cable</h4>
              <div className="space-y-2">
                <select
                  value={state.extCable ? 'YES' : 'NO'}
                  onChange={(e) => updateState({ extCable: e.target.value === 'YES' })}
                  className="select-field"
                >
                  <option value="NO">Not Required</option>
                  <option value="YES">Required</option>
                </select>
              </div>

              <AnimatePresence>
                {state.extCable && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Length</label>
                      <select
                        value={state.extLength}
                        onChange={(e) => updateState({ extLength: e.target.value })}
                        className="select-field"
                      >
                        <option value="010">10m</option>
                        <option value="015">15m</option>
                        <option value="020">20m</option>
                        <option value="030">30m</option>
                      </select>
                    </div>
                    <div className="code-badge w-full justify-center">
                      FM-EXTC-SS-{state.extLength}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mounting Accessories */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-foreground">Mounting Accessories</h4>
              
              {/* Mounting Pad */}
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={state.mountPad}
                    onChange={(e) => updateState({ mountPad: e.target.checked })}
                    className="w-5 h-5 rounded border-border accent-primary"
                  />
                  <span className="font-medium">Mounting Pad</span>
                </label>

                <AnimatePresence>
                  {state.mountPad && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="ml-8 space-y-2"
                    >
                      <label className="text-sm font-medium text-muted-foreground">MOC</label>
                      <select
                        value={state.padMoc}
                        onChange={(e) => updateState({ padMoc: e.target.value })}
                        className="select-field"
                      >
                        <option>MS with SS insert (Standard)</option>
                        <option>SS304 (Non Standard)</option>
                        <option>SS316L (Non Standard)</option>
                      </select>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mounting Stud */}
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={state.mountStud}
                    onChange={(e) => updateState({ mountStud: e.target.checked })}
                    className="w-5 h-5 rounded border-border accent-primary"
                  />
                  <span className="font-medium">Mounting Stud</span>
                </label>

                <AnimatePresence>
                  {state.mountStud && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="ml-8 space-y-4"
                    >
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Thread</label>
                        <input
                          type="text"
                          value={state.threadStd}
                          onChange={(e) => updateState({ threadStd: e.target.value })}
                          className="input-field"
                          placeholder="ex. M6 x 1.25"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Depth (mm)</label>
                        <input
                          type="number"
                          value={state.threadDepth}
                          onChange={(e) => updateState({ threadDepth: e.target.value })}
                          className="input-field"
                          placeholder="ex. 10"
                          min={1}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">MOC</label>
                        <select
                          value={state.studMoc}
                          onChange={(e) => updateState({ studMoc: e.target.value })}
                          className="select-field"
                        >
                          <option>SS304 (Standard)</option>
                          <option>SS316L (Non Standard)</option>
                        </select>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Right Column - Junction Box */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-foreground">Junction Box</h4>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">JB MOC</label>
                <input
                  type="text"
                  value={state.jbMoc}
                  onChange={(e) => updateState({ jbMoc: e.target.value })}
                  className="input-field"
                  placeholder="e.g. FRP"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Configuration (In x Out)</label>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    value={state.jbIn || ''}
                    onChange={(e) => updateState({ jbIn: parseInt(e.target.value) || 0 })}
                    className="input-field"
                    placeholder="In"
                    min={0}
                  />
                  <input
                    type="number"
                    value={state.jbOut || ''}
                    onChange={(e) => updateState({ jbOut: parseInt(e.target.value) || 0 })}
                    className="input-field"
                    placeholder="Out"
                    min={0}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Gland MOC</label>
                <input
                  type="text"
                  value={state.glandMoc}
                  onChange={(e) => updateState({ glandMoc: e.target.value })}
                  className="input-field"
                  placeholder="e.g. SS304"
                />
              </div>

              {state.jbMoc && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 p-4 bg-secondary/50 rounded-lg space-y-2"
                >
                  <h5 className="text-sm font-medium text-muted-foreground">Calculated Values</h5>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Terminals: </span>
                      <span className="font-medium">{Math.ceil(state.jbIn * 3 * 1.2)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Glands: </span>
                      <span className="font-medium">{state.jbIn + state.jbOut}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">JB Qty: </span>
                      <span className="font-medium">
                        {state.jbIn > 0 ? Math.ceil(state.sensorQty / state.jbIn) : 'N/A'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        <StepNavigation />
      </div>
    </motion.div>
  );
}
