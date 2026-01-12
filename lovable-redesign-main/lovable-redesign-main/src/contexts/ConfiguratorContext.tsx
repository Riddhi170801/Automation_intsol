import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { ConfiguratorState, SummaryData } from '@/types/configurator';

const initialState: ConfiguratorState = {
  currentStep: 1,
  engineer: '',
  email: '',
  offerNo: '',
  customer: '',
  project: '',
  ref: '',
  branch: '',
  machine: '',
  machineType: '',
  bearingType: '',
  machineSpeed: '',
  sensorArea: '',
  sensorType: '',
  measurementType: '',
  sensorQty: 1,
  sensorModel: '',
  sensorCode: '',
  sensorMake: '',
  extCable: false,
  extLength: '010',
  mountPad: false,
  padMoc: 'MS with SS insert (Standard)',
  mountStud: false,
  threadStd: '',
  threadDepth: '',
  studMoc: 'SS304 (Standard)',
  jbMoc: '',
  jbIn: 0,
  jbOut: 0,
  glandMoc: '',
  monitoringRequired: false,
  monitoringType: '',
  monitoringMake: '',
  monitoringModel: '',
  vm7Config: {},
};

interface ConfiguratorContextType {
  state: ConfiguratorState;
  updateState: (updates: Partial<ConfiguratorState>) => void;
  navigateToStep: (step: number) => boolean;
  validateStep1: () => boolean;
  getSummary: () => SummaryData;
  generateTextSummary: () => string;
  resetState: () => void;
}

const ConfiguratorContext = createContext<ConfiguratorContextType | undefined>(undefined);

export function ConfiguratorProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ConfiguratorState>(initialState);

  const updateState = useCallback((updates: Partial<ConfiguratorState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const validateStep1 = useCallback(() => {
    const requiredFields = ['engineer', 'email', 'offerNo', 'customer', 'project', 'ref', 'branch'];
    return requiredFields.every(field => state[field as keyof ConfiguratorState]);
  }, [state]);

  const navigateToStep = useCallback((step: number) => {
    if (step > state.currentStep && !validateStep1()) {
      return false;
    }
    setState(prev => ({ ...prev, currentStep: step }));
    return true;
  }, [state.currentStep, validateStep1]);

  const getSummary = useCallback((): SummaryData => {
    const jbRequired = state.jbMoc.trim() !== '';
    let jbTerminal: string | number = '...';
    let jbGland: string | number = '...';
    let jbQty: string | number = '...';

    if (jbRequired) {
      const terminals = Math.ceil(state.jbIn * 3 * 1.2);
      const glands = state.jbIn + state.jbOut;
      jbTerminal = terminals;
      jbGland = glands;
      if (state.jbIn > 0) {
        jbQty = Math.ceil(state.sensorQty / state.jbIn);
      } else {
        jbQty = state.sensorQty > 0 ? 'N/A' : 0;
      }
    }

    let monitoringSystem = 'Not Required';
    if (state.monitoringRequired) {
      monitoringSystem = state.monitoringModel || 'Yes, pending selection';
    }

    return {
      customer: state.customer || '...',
      project: state.project || '...',
      machine: state.machine || '...',
      machineType: state.machineType || '...',
      sensorModel: state.sensorModel || '...',
      sensorCode: state.sensorCode || '...',
      sensorQty: state.sensorQty,
      extCable: state.extCable ? `Yes (${parseInt(state.extLength)}m)` : 'No',
      mountPad: state.mountPad ? 'Yes' : 'No',
      mountStud: state.mountStud ? 'Yes' : 'No',
      jbRequired: jbRequired ? 'Yes' : 'No',
      jbTerminal,
      jbGland,
      jbGlandMoc: state.glandMoc || '...',
      jbQty,
      monitoringSystem,
    };
  }, [state]);

  const generateTextSummary = useCallback(() => {
    let summary = `CUSTOMER: ${state.customer || 'N/A'}\nPROJECT: ${state.project || 'N/A'}\n\n`;
    
    summary += `1. SENSOR:\n Model: ${state.sensorModel || 'N/A'}\n Quantity: ${state.sensorQty}`;
    if (state.sensorCode && state.sensorCode !== '...') {
      summary += `\n Full Code: ${state.sensorCode}`;
    }
    summary += '\n\n';

    summary += '2. ACCESSORIES\n\n';
    summary += ` Extension Cable\n  If required: ${state.extCable ? 'Yes' : 'No'}\n`;
    if (state.extCable) {
      summary += `  Length: ${parseInt(state.extLength)}m\n`;
      summary += `  Code: FM-EXTC-SS-${state.extLength}\n`;
    }
    summary += '\n';

    summary += ` Mounting Pad\n  If required: ${state.mountPad ? 'Yes' : 'No'}\n`;
    if (state.mountPad) {
      summary += `  MOC: ${state.padMoc}\n`;
      summary += '  Code: FM-MP-001\n';
    }
    summary += '\n';

    summary += ` Mounting Stud\n  If required: ${state.mountStud ? 'Yes' : 'No'}\n`;
    if (state.mountStud) {
      summary += `  Thread: ${state.threadStd || 'N/A'}\n`;
      summary += `  Depth: ${state.threadDepth || 'N/A'} mm\n`;
      summary += `  MOC: ${state.studMoc}\n`;
      summary += '  Code: FM-MS-001\n';
    }
    summary += '\n';

    const jbRequired = state.jbMoc.trim() !== '';
    summary += ' Junction Box\n';
    if (jbRequired) {
      const terminals = Math.ceil(state.jbIn * 3 * 1.2);
      const glands = state.jbIn + state.jbOut;
      let jbQty: number | string = 0;
      if (state.jbIn > 0) {
        jbQty = Math.ceil(state.sensorQty / state.jbIn);
      } else {
        jbQty = state.sensorQty > 0 ? 'N/A (JB In is 0)' : 0;
      }
      summary += `  MOC: ${state.jbMoc}\n`;
      summary += `  Terminal: ${terminals} (calc: ${state.jbIn} * 3 * 1.2)\n`;
      summary += `  Glands: ${glands} (calc: ${state.jbIn} + ${state.jbOut})\n`;
      summary += `  Gland MOC: ${state.glandMoc || 'N/A'}\n`;
      summary += `  JB Quantity: ${jbQty}\n`;
    } else {
      summary += '  MOC: Not Required\n';
    }
    summary += '\n';

    summary += '3. MONITORING SYSTEM:\n';
    if (state.monitoringRequired && state.monitoringModel) {
      summary += `  System: ${state.monitoringModel}\n`;
      if (state.monitoringModel === 'VM 7' && Object.keys(state.vm7Config).length > 0) {
        summary += ' \n VM-7B Configuration Breakdown:\n';
        Object.entries(state.vm7Config).forEach(([label, qty]) => {
          if (qty > 0) {
            summary += `  - ${label}: ${qty}\n`;
          }
        });
      }
    } else {
      summary += '  System: Not Required\n';
    }

    return summary;
  }, [state]);

  const resetState = useCallback(() => {
    setState(initialState);
  }, []);

  return (
    <ConfiguratorContext.Provider
      value={{
        state,
        updateState,
        navigateToStep,
        validateStep1,
        getSummary,
        generateTextSummary,
        resetState,
      }}
    >
      {children}
    </ConfiguratorContext.Provider>
  );
}

export function useConfigurator() {
  const context = useContext(ConfiguratorContext);
  if (!context) {
    throw new Error('useConfigurator must be used within a ConfiguratorProvider');
  }
  return context;
}
