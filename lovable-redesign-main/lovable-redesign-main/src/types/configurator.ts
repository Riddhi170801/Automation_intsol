export interface ConfiguratorState {
  currentStep: number;
  
  // Step 1: Project & Machine Details
  engineer: string;
  email: string;
  offerNo: string;
  customer: string;
  project: string;
  ref: string;
  branch: string;
  machine: string;
  machineType: string;
  bearingType: string;
  machineSpeed: string;
  
  // Step 2: Sensor Configuration
  sensorArea: string;
  sensorType: string;
  measurementType: string;
  sensorQty: number;
  sensorModel: string;
  sensorCode: string;
  sensorMake: string;
  
  // Step 3: Accessories & Junction Box
  extCable: boolean;
  extLength: string;
  mountPad: boolean;
  padMoc: string;
  mountStud: boolean;
  threadStd: string;
  threadDepth: string;
  studMoc: string;
  jbMoc: string;
  jbIn: number;
  jbOut: number;
  glandMoc: string;
  
  // Step 4: Monitoring System
  monitoringRequired: boolean;
  monitoringType: string;
  monitoringMake: string;
  monitoringModel: string;
  vm7Config: Record<string, number>;
}

export interface NavStep {
  id: number;
  label: string;
  icon: string;
}

export interface SummaryData {
  customer: string;
  project: string;
  machine: string;
  machineType: string;
  sensorModel: string;
  sensorCode: string;
  sensorQty: number;
  extCable: string;
  mountPad: string;
  mountStud: string;
  jbRequired: string;
  jbTerminal: string | number;
  jbGland: string | number;
  jbGlandMoc: string;
  jbQty: string | number;
  monitoringSystem: string;
}

export interface GeneratorConfig {
  prefix: string;
  fieldsHTML: string;
  updateDependentOptions: () => void;
  generateCode: () => void;
  setupEventListeners: () => void;
}
