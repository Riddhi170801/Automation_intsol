import { useConfigurator } from '@/contexts/ConfiguratorContext';

export function LiveSummary() {
  const { getSummary } = useConfigurator();
  const summary = getSummary();

  return (
    <div className="summary-panel sticky top-6 max-h-[calc(100vh-3rem)] overflow-y-auto scrollbar-thin">
      {/* Header */}
      <div className="p-4 bg-primary/5 border-b border-border">
        <h3 className="font-semibold text-foreground">Configuration at a Glance</h3>
      </div>

      {/* Customer & Project */}
      <div className="summary-section">
        <h4 className="summary-section-title">Project</h4>
        <div className="summary-item">
          <span className="summary-key">Customer</span>
          <span className="summary-value">{summary.customer}</span>
        </div>
        <div className="summary-item">
          <span className="summary-key">Project</span>
          <span className="summary-value">{summary.project}</span>
        </div>
      </div>

      {/* Machine */}
      <div className="summary-section">
        <h4 className="summary-section-title">Machine</h4>
        <div className="summary-item">
          <span className="summary-key">Name</span>
          <span className="summary-value">{summary.machine}</span>
        </div>
        <div className="summary-item">
          <span className="summary-key">Type</span>
          <span className="summary-value">{summary.machineType}</span>
        </div>
      </div>

      {/* Sensor */}
      <div className="summary-section">
        <h4 className="summary-section-title">Sensor</h4>
        <div className="summary-item">
          <span className="summary-key">Model</span>
          <span className="summary-value text-xs max-w-[180px] truncate" title={summary.sensorModel}>
            {summary.sensorModel}
          </span>
        </div>
        <div className="summary-item">
          <span className="summary-key">Full Code</span>
          <span className="summary-value code-display text-xs">{summary.sensorCode}</span>
        </div>
        <div className="summary-item">
          <span className="summary-key">Quantity</span>
          <span className="summary-value">{summary.sensorQty}</span>
        </div>
      </div>

      {/* Accessories */}
      <div className="summary-section">
        <h4 className="summary-section-title">Accessories</h4>
        <div className="summary-item">
          <span className="summary-key">Ext. Cable</span>
          <span className="summary-value">{summary.extCable}</span>
        </div>
        <div className="summary-item">
          <span className="summary-key">Mounting Pad</span>
          <span className="summary-value">{summary.mountPad}</span>
        </div>
        <div className="summary-item">
          <span className="summary-key">Mounting Stud</span>
          <span className="summary-value">{summary.mountStud}</span>
        </div>
      </div>

      {/* Junction Box */}
      <div className="summary-section">
        <h4 className="summary-section-title">Junction Box</h4>
        <div className="summary-item">
          <span className="summary-key">Required</span>
          <span className="summary-value">{summary.jbRequired}</span>
        </div>
        <div className="summary-item">
          <span className="summary-key">Terminal</span>
          <span className="summary-value">{summary.jbTerminal}</span>
        </div>
        <div className="summary-item">
          <span className="summary-key">Gland</span>
          <span className="summary-value">{summary.jbGland}</span>
        </div>
        <div className="summary-item">
          <span className="summary-key">Gland MOC</span>
          <span className="summary-value">{summary.jbGlandMoc}</span>
        </div>
        <div className="summary-item">
          <span className="summary-key">JB Quantity</span>
          <span className="summary-value">{summary.jbQty}</span>
        </div>
      </div>

      {/* Monitoring */}
      <div className="summary-section">
        <h4 className="summary-section-title">Monitoring</h4>
        <div className="summary-item">
          <span className="summary-key">System</span>
          <span className="summary-value">{summary.monitoringSystem}</span>
        </div>
      </div>
    </div>
  );
}
