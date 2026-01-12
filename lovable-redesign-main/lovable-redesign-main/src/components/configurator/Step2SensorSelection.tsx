import { useConfigurator } from '@/contexts/ConfiguratorContext';
import { StepNavigation } from './StepNavigation';
import { motion } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';

// Sensor model options based on area/type/measurement combination
const getSensorModels = (area: string, type: string, measurement: string): string[] => {
  if (area === 'Safe' && type === 'Non-Contact' && measurement === 'Eddy Current') {
    return [
      'FL-202F08 [Linear Range: 2 mm, Tip Dia.: 8mm]',
      'FL-143F27 [Linear Range: 13.5 mm, Tip Dia.: 27mm]',
      'FL-202F05 [Linear Range: 2 mm, Tip Dia.: 5mm]',
      'FL-202F08R [Linear Range: 2 mm, Tip Dia.: 8mm, Reverse Mount]',
      'FL-263F55 [Linear Range: 26 mm, Tip Dia.: 55mm]',
      'FL-143F28 [Linear Range: 13.5 mm, Tip Dia.: 27mm]',
      'FL-602F18 [Linear Range: 6 mm, Tip Dia.: 18mm]',
      'FL-263F50 [Linear Range: 26 mm, Tip Dia.: 50mm]',
      'FL-302F10 [Linear Range: 3 mm, Tip Dia.: 10mm]',
      'FL-302F10R [Linear Range: 3 mm, Tip Dia.: 10mm, R]',
      'FL-452F11 [Linear Range: 4.5 mm, Tip Dia.: 11mm]',
    ];
  }
  if (area === 'Safe' && type === 'Non-Contact' && measurement === 'Loop Powered Eddy Current') {
    return ['WL-142K05'];
  }
  if (area === 'Safe' && type === 'Contact' && measurement === 'Velocity') {
    return ['Forbes Marshall: FM-VEL-004B', 'Shinkawa: CV-86'];
  }
  if (area === 'Safe' && type === 'Contact' && measurement === 'Acceleration') {
    return ['Forbes Marshall: FM-ACCL-100', 'Shinkawa: CB-101'];
  }
  if (area === 'Safe' && type === 'Contact' && measurement === 'Loop Powered') {
    return ['Shinkawa: CBT', 'Forbes Marshall: FM-LPS'];
  }
  if (area === 'Hazardous' && type === 'Contact' && measurement === 'Velocity') {
    return ['Shinkawa: CV-86/EX'];
  }
  if (area === 'Hazardous' && type === 'Contact' && measurement === 'Acceleration') {
    return ['Shinkawa: CA-302', 'CA-72'];
  }
  if (area === 'Hazardous' && type === 'Contact' && measurement === 'Loop Powered') {
    return ['Monitran', 'Wilcoxon'];
  }
  if (area === 'Hazardous' && type === 'Non-Contact' && measurement === 'Eddy Current') {
    return [
      'FL-202F08/E50 [Linear Range: 2 mm, Tip Dia.: 8mm]',
      'FL-143F27/E50 [Linear Range: 13.5 mm, Tip Dia.: 27mm]',
      'FL-202F05/E50 [Linear Range: 2 mm, Tip Dia.: 5mm]',
      'FL-202F08R/E50 [Linear Range: 2 mm, Tip Dia.: 8mm, R]',
      'FL-263F55/E50 [Linear Range: 26 mm, Tip Dia.: 55mm]',
      'FL-143F28/E50 [Linear Range: 13.5 mm, Tip Dia.: 27mm]',
      'FL-602F18/E50 [Linear Range: 6 mm, Tip Dia.: 18mm]',
      'FL-263F50/E50 [Linear Range: 26 mm, Tip Dia.: 50mm]',
      'FL-302F10/E50 [Linear Range: 3 mm, Tip Dia.: 10mm]',
      'FL-302F10R/E50 [Linear Range: 3 mm, Tip Dia.: 10mm, Reverse Mount]',
      'FL-452F11/E50 [Linear Range: 4.5 mm, Tip Dia.: 11mm]',
    ];
  }
  if (area === 'Hazardous' && type === 'Non-Contact' && measurement === 'Loop Powered Eddy Current') {
    return ['WL-142K05/NB1'];
  }
  return [];
};

const getMeasurementOptions = (area: string, type: string): string[] => {
  if (type === 'Contact') {
    return ['Acceleration', 'Velocity', 'Loop Powered'];
  }
  if (type === 'Non-Contact') {
    return ['Eddy Current', 'Loop Powered Eddy Current'];
  }
  return [];
};

interface CodeGeneratorConfig {
  armor?: string;
  threadSize?: string;
  unthreadedLength?: string;
  caseLength?: string;
  cableLength?: string;
  cableType?: string;
  range?: string;
  measurement?: string;
  sensitivity?: string;
  extraOptions?: string;
  mountingThreads?: string;
  safety?: string;
}

export function Step2SensorSelection() {
  const { state, updateState } = useConfigurator();
  const [localConfig, setLocalConfig] = useState<CodeGeneratorConfig>({
    armor: 'L',
    threadSize: 'M2',
    unthreadedLength: '00',
    caseLength: '02',
    cableLength: '05',
    cableType: '1',
    range: '10',
    measurement: 'P',
    sensitivity: '010',
    extraOptions: '0',
    mountingThreads: '01',
    safety: '0',
  });

  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [measurementOptions, setMeasurementOptions] = useState<string[]>([]);

  const handleAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const area = e.target.value;
    updateState({
      sensorArea: area,
      sensorType: '',
      measurementType: '',
      sensorModel: '',
      sensorCode: '...',
    });
    setMeasurementOptions([]);
    setAvailableModels([]);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const type = e.target.value;
    updateState({
      sensorType: type,
      measurementType: '',
      sensorModel: '',
      sensorCode: '...',
    });
    setMeasurementOptions(getMeasurementOptions(state.sensorArea, type));
    setAvailableModels([]);
  };

  const handleMeasurementChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const measurement = e.target.value;
    updateState({
      measurementType: measurement,
      sensorModel: '',
      sensorCode: '...',
    });
    setAvailableModels(getSensorModels(state.sensorArea, state.sensorType, measurement));
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const model = e.target.value;
    updateState({ sensorModel: model });
    // Reset local config when model changes
    setLocalConfig({
      armor: 'L',
      threadSize: 'M2',
      unthreadedLength: '00',
      caseLength: '02',
      cableLength: '05',
      cableType: '1',
      range: '10',
      measurement: 'P',
      sensitivity: '010',
      extraOptions: '0',
      mountingThreads: '01',
      safety: '0',
    });
  };

  // Generate sensor code based on model and config
  const generateCode = useCallback(() => {
    const model = state.sensorModel;
    if (!model) return '...';

    // FL series sensors
    if (model.startsWith('FL-202F08') && !model.includes('R')) {
      const parts = ['FL-202F08', localConfig.armor, localConfig.threadSize, localConfig.unthreadedLength, localConfig.caseLength, localConfig.cableLength];
      if (model.includes('/E50')) parts.push('/E50');
      return parts.join('-');
    }

    if (model.includes('FL-143F27')) {
      const parts = ['FL-143F27', localConfig.armor, localConfig.threadSize === 'M1' ? 'M1' : 'U1', localConfig.unthreadedLength, localConfig.caseLength, localConfig.cableLength];
      if (model.includes('/E50')) parts.push('/E50');
      return parts.join('-');
    }

    if (model.includes('FL-202F05')) {
      const parts = ['FL-202F05', localConfig.armor, localConfig.threadSize === 'M1' ? 'M1' : 'U1', localConfig.unthreadedLength, localConfig.caseLength, localConfig.cableLength];
      if (model.includes('/E50')) parts.push('/E50');
      return parts.join('-');
    }

    if (model.includes('FL-202F08R')) {
      const parts = ['FL-202F08R', localConfig.threadSize, localConfig.unthreadedLength, localConfig.caseLength, localConfig.cableLength];
      if (model.includes('/E50')) parts.push('/E50');
      return parts.join('-');
    }

    if (model.includes('FL-263F55')) {
      const parts = ['FL-263F55', localConfig.armor, 'M1', '00', '00', localConfig.cableLength];
      if (model.includes('/E50')) parts.push('/E50');
      return parts.join('-');
    }

    if (model.includes('FL-143F28')) {
      const parts = ['FL-143F28', localConfig.armor, 'M1', '00', '00', localConfig.cableLength];
      if (model.includes('/E50')) parts.push('/E50');
      return parts.join('-');
    }

    if (model.includes('FL-602F18')) {
      const parts = ['FL-602F18', localConfig.armor, localConfig.threadSize === 'M1' ? 'M1' : 'U1', localConfig.unthreadedLength, localConfig.caseLength, localConfig.cableLength];
      if (model.includes('/E50')) parts.push('/E50');
      return parts.join('-');
    }

    if (model.includes('FL-263F50')) {
      const parts = ['FL-263F50', localConfig.armor, localConfig.threadSize === 'M1' ? 'M1' : 'U1', '00', localConfig.caseLength, localConfig.cableLength];
      if (model.includes('/E50')) parts.push('/E50');
      return parts.join('-');
    }

    if (model.includes('FL-302F10') && !model.includes('R')) {
      const parts = ['FL-302F10', localConfig.armor, localConfig.threadSize === 'M1' ? 'M1' : 'U1', localConfig.unthreadedLength, localConfig.caseLength, localConfig.cableLength];
      if (model.includes('/E50')) parts.push('/E50');
      return parts.join('-');
    }

    if (model.includes('FL-302F10R')) {
      const parts = ['FL-302F10R', localConfig.threadSize, localConfig.unthreadedLength, localConfig.caseLength, localConfig.cableLength];
      if (model.includes('/E50')) parts.push('/E50');
      return parts.join('-');
    }

    if (model.includes('FL-452F11')) {
      const parts = ['FL-452F11', localConfig.armor, localConfig.threadSize === 'M1' ? 'M1' : 'U1', localConfig.unthreadedLength, localConfig.caseLength, localConfig.cableLength];
      if (model.includes('/E50')) parts.push('/E50');
      return parts.join('-');
    }

    // WL series
    if (model.startsWith('WL-142K05')) {
      const parts = ['WL-142K05', localConfig.armor, localConfig.threadSize, localConfig.unthreadedLength, localConfig.caseLength, localConfig.cableLength];
      if (model.includes('/NB1')) {
        parts[0] = 'WL-142K05/NB1';
      }
      return parts.join('-');
    }

    // Contact sensors
    if (model.includes('FM-VEL-004B')) {
      return `FM-VEL-004B-1${localConfig.cableType}1`;
    }

    if (model === 'Shinkawa: CV-86') {
      return `CV-86${localConfig.cableType}`;
    }

    if (model.includes('FM-ACCL-100')) {
      return `FM-ACCL-100-1${localConfig.cableType}1`;
    }

    if (model.includes('CB-101')) {
      return `CB-101-${localConfig.extraOptions}-${localConfig.sensitivity}-50-${localConfig.mountingThreads}`;
    }

    if (model === 'Shinkawa: CBT') {
      return `CBT-${localConfig.range?.padStart(3, '0')}-${localConfig.measurement}-50`;
    }

    if (model === 'Forbes Marshall: FM-LPS') {
      return `FM-LPS-${localConfig.range?.padStart(2, '0')}-${localConfig.measurement}`;
    }

    if (model.includes('CV-86/EX')) {
      return `CV-86-${localConfig.cableType}/EX-${localConfig.safety}`;
    }

    if (model.includes('CA-302')) {
      return `CA-302-00${localConfig.armor}/EX-${localConfig.safety}`;
    }

    if (model === 'CA-72') {
      return `CA-72-${localConfig.cableType}`;
    }

    if (model === 'Monitran') {
      return `MTN/2285${localConfig.mountingThreads === 'IC' ? 'IC' : 'ICQ'}-${localConfig.range}`;
    }

    if (model === 'Wilcoxon') {
      return `PC420V${localConfig.measurement}-${localConfig.range}-IS`;
    }

    return model;
  }, [state.sensorModel, localConfig]);

  // Update code when config changes
  useEffect(() => {
    const code = generateCode();
    updateState({ sensorCode: code });
  }, [generateCode, updateState]);

  const handleConfigChange = (field: keyof CodeGeneratorConfig) => (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    setLocalConfig(prev => ({ ...prev, [field]: e.target.value }));
  };

  const renderCodeGenerator = () => {
    const model = state.sensorModel;
    if (!model) return null;

    // FL series with armor, thread, lengths
    if (model.startsWith('FL-') && !model.includes('R')) {
      return (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-6 p-4 bg-secondary/50 rounded-lg space-y-4"
        >
          <div className="code-badge text-lg text-center w-full justify-center mb-4">
            {state.sensorCode}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Armor</label>
              <select value={localConfig.armor} onChange={handleConfigChange('armor')} className="select-field">
                <option value="L">Without Armor</option>
                <option value="A">With Armor (No Fluoro)</option>
                <option value="T">With Armor (Fluoro)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Thread Size</label>
              <select value={localConfig.threadSize} onChange={handleConfigChange('threadSize')} className="select-field">
                <option value="M1">Metric (M1)</option>
                <option value="M2">Metric (M2)</option>
                <option value="U1">UNF (U1)</option>
                <option value="U2">UNF (U2)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Unthreaded Length</label>
              <select value={localConfig.unthreadedLength} onChange={handleConfigChange('unthreadedLength')} className="select-field">
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={i.toString().padStart(2, '0')}>{i * 10} mm</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Case Length</label>
              <select value={localConfig.caseLength} onChange={handleConfigChange('caseLength')} className="select-field">
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i + 2} value={(i + 2).toString().padStart(2, '0')}>{(i + 2) * 10} mm</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Cable Length</label>
              <select value={localConfig.cableLength} onChange={handleConfigChange('cableLength')} className="select-field">
                <option value="05">0.5m</option>
                <option value="10">1.0m</option>
                <option value="50">5.0m</option>
                <option value="90">9.0m</option>
              </select>
            </div>
          </div>
        </motion.div>
      );
    }

    // WL series
    if (model.startsWith('WL-')) {
      return (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-6 p-4 bg-secondary/50 rounded-lg space-y-4"
        >
          <div className="code-badge text-lg text-center w-full justify-center mb-4">
            {state.sensorCode}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Armor</label>
              <select value={localConfig.armor} onChange={handleConfigChange('armor')} className="select-field">
                <option value="L">Without Armor</option>
                <option value="A">With Armor (No Fluoro)</option>
                <option value="T">With Armor (Fluoro)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Thread Size</label>
              <select value={localConfig.threadSize} onChange={handleConfigChange('threadSize')} className="select-field">
                <option value="M1">M8X1</option>
                <option value="M2">M10X1</option>
                <option value="U1">1/4-28 UNF-2A</option>
                <option value="U2">3/8-24 UNF-2A</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Cable Length</label>
              <select value={localConfig.cableLength} onChange={handleConfigChange('cableLength')} className="select-field">
                <option value="1">0.5m</option>
                <option value="2">1.0m</option>
                <option value="3">5.0m</option>
                <option value="4">7.0m</option>
                <option value="5">9.0m</option>
              </select>
            </div>
          </div>
        </motion.div>
      );
    }

    // Simple cable type selection
    if (model.includes('FM-VEL-004B') || model.includes('FM-ACCL-100') || model === 'Shinkawa: CV-86' || model === 'CA-72') {
      return (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-6 p-4 bg-secondary/50 rounded-lg space-y-4"
        >
          <div className="code-badge text-lg text-center w-full justify-center mb-4">
            {state.sensorCode}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Cable Type</label>
            <select value={localConfig.cableType} onChange={handleConfigChange('cableType')} className="select-field">
              <option value="1">Connector / 2 pin connector</option>
              <option value="2">5m integral cable / With integral cable</option>
              <option value="3">10m integral cable</option>
            </select>
          </div>
        </motion.div>
      );
    }

    // CB-101 specific
    if (model.includes('CB-101')) {
      return (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-6 p-4 bg-secondary/50 rounded-lg space-y-4"
        >
          <div className="code-badge text-lg text-center w-full justify-center mb-4">
            {state.sensorCode}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Extra Options</label>
              <select value={localConfig.extraOptions} onChange={handleConfigChange('extraOptions')} className="select-field">
                <option value="0">Standard (None)</option>
                <option value="F">Filtered</option>
                <option value="T">Temperature Output</option>
                <option value="Y">5% Tolerance</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Sensitivity</label>
              <select value={localConfig.sensitivity} onChange={handleConfigChange('sensitivity')} className="select-field">
                <option value="010">10mV/g (±800g)</option>
                <option value="030">30mV/g (±250g)</option>
                <option value="050">50mV/g (±160g)</option>
                <option value="100">100mV/g (±80g)</option>
                <option value="250">250mV/g (±32g)</option>
                <option value="500">500mV/g (±16g)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Mounting Threads</label>
              <select value={localConfig.mountingThreads} onChange={handleConfigChange('mountingThreads')} className="select-field">
                <option value="01">¼-28" UNF Female</option>
                <option value="02">¼-28" UNF Male</option>
                <option value="05">Quick Fit Female</option>
                <option value="06">M6 x 1mm Male</option>
                <option value="08">M8 x 1.25mm Male</option>
                <option value="10">M10 x 1.5mm Male</option>
              </select>
            </div>
          </div>
        </motion.div>
      );
    }

    // Loop Powered (Shinkawa CBT / Forbes Marshall FM-LPS)
    if (model === 'Shinkawa: CBT' || model === 'Forbes Marshall: FM-LPS') {
      const ranges = model.includes('Shinkawa') ? [10, 20, 25, 50, 100] : [10, 15, 20, 25, 30, 40, 50];
      return (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-6 p-4 bg-secondary/50 rounded-lg space-y-4"
        >
          <div className="code-badge text-lg text-center w-full justify-center mb-4">
            {state.sensorCode}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Range (mm/sec)</label>
              <select value={localConfig.range} onChange={handleConfigChange('range')} className="select-field">
                {ranges.map(r => (
                  <option key={r} value={r.toString()}>0-{r} mm/sec</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Unit</label>
              <select value={localConfig.measurement} onChange={handleConfigChange('measurement')} className="select-field">
                <option value="P">Peak</option>
                <option value="R">RMS</option>
              </select>
            </div>
          </div>
        </motion.div>
      );
    }

    // Hazardous Loop Powered
    if (model === 'Monitran' || model === 'Wilcoxon') {
      if (model === 'Monitran') {
        return (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-6 p-4 bg-secondary/50 rounded-lg space-y-4"
          >
            <div className="code-badge text-lg text-center w-full justify-center mb-4">
              {state.sensorCode}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Mounting</label>
                <select value={localConfig.mountingThreads} onChange={handleConfigChange('mountingThreads')} className="select-field">
                  <option value="IC">1/4" UNF Female</option>
                  <option value="ICQ">Q/F Female</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Velocity (mm/s rms)</label>
                <select value={localConfig.range} onChange={handleConfigChange('range')} className="select-field">
                  <option value="10">0-10</option>
                  <option value="20">0-20</option>
                  <option value="25">0-25</option>
                  <option value="50">0-50</option>
                  <option value="100">0-100</option>
                </select>
              </div>
            </div>
          </motion.div>
        );
      }
      return (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-6 p-4 bg-secondary/50 rounded-lg space-y-4"
        >
          <div className="code-badge text-lg text-center w-full justify-center mb-4">
            {state.sensorCode}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Output Type</label>
              <select value={localConfig.measurement} onChange={handleConfigChange('measurement')} className="select-field">
                <option value="R">RMS (R)</option>
                <option value="P">Peak (P)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Full Scale</label>
              <select value={localConfig.range} onChange={handleConfigChange('range')} className="select-field">
                <option value="05">0.5 ips (12.8 mm/sec)</option>
                <option value="10">1.0 ips (25.4 mm/sec)</option>
                <option value="20">2.0 ips (50.8 mm/sec)</option>
                <option value="30">3.0 ips (76.2 mm/sec)</option>
              </select>
            </div>
          </div>
        </motion.div>
      );
    }

    // CA-302 / CV-86/EX with safety options
    if (model.includes('CA-302') || model.includes('CV-86/EX')) {
      return (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-6 p-4 bg-secondary/50 rounded-lg space-y-4"
        >
          <div className="code-badge text-lg text-center w-full justify-center mb-4">
            {state.sensorCode}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {model.includes('CA-302') && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Armor</label>
                <select value={localConfig.armor} onChange={handleConfigChange('armor')} className="select-field">
                  <option value="0">Without</option>
                  <option value="1">With</option>
                </select>
              </div>
            )}
            {model.includes('CV-86/EX') && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Cable Type</label>
                <select value={localConfig.cableType} onChange={handleConfigChange('cableType')} className="select-field">
                  <option value="1">Connector Type</option>
                  <option value="2">With Integral cable</option>
                </select>
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Safety</label>
              <select value={localConfig.safety} onChange={handleConfigChange('safety')} className="select-field">
                <option value="0">TIIS EX ia II B T3 X</option>
                <option value="1">TIIS EX ia II B T4 X</option>
                <option value="2">TIIS EX ia II C T3 X</option>
                <option value="7">NEPSI EX ia II B T4 X</option>
                <option value="8">KTL EX ia II C T4</option>
              </select>
            </div>
          </div>
        </motion.div>
      );
    }

    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="form-card">
        <h3 className="form-card-header">Sensor Configuration</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Sensor Area</label>
            <select
              value={state.sensorArea}
              onChange={handleAreaChange}
              className="select-field"
            >
              <option value="">-- Select Area --</option>
              <option value="Safe">Safe</option>
              <option value="Hazardous">Hazardous</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Sensor Type</label>
            <select
              value={state.sensorType}
              onChange={handleTypeChange}
              className="select-field"
              disabled={!state.sensorArea}
            >
              <option value="">-- Select --</option>
              <option value="Contact">Contact</option>
              <option value="Non-Contact">Non-Contact</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Quantity</label>
            <input
              type="number"
              value={state.sensorQty}
              onChange={(e) => updateState({ sensorQty: parseInt(e.target.value) || 1 })}
              className="input-field"
              min={1}
            />
          </div>
        </div>

        {measurementOptions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-6"
          >
            <div className="form-card bg-secondary/30 border-0">
              <h4 className="text-lg font-medium mb-4">Measurement Type</h4>
              <div className="space-y-2">
                <select
                  value={state.measurementType}
                  onChange={handleMeasurementChange}
                  className="select-field"
                >
                  <option value="">-- Select --</option>
                  {measurementOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        )}

        {availableModels.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-6"
          >
            <div className="form-card bg-secondary/30 border-0">
              <h4 className="text-lg font-medium mb-4">Select Sensor Model</h4>
              <div className="space-y-2">
                <select
                  value={state.sensorModel}
                  onChange={handleModelChange}
                  className="select-field"
                >
                  <option value="">-- Choose a Model --</option>
                  {availableModels.map(model => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </select>
              </div>

              {renderCodeGenerator()}
            </div>
          </motion.div>
        )}

        <StepNavigation />
      </div>
    </motion.div>
  );
}
