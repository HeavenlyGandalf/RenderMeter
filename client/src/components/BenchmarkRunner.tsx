interface Props {
  isRunning: boolean;
  executionTimeMs: number | null;
  onRun: () => void;
}

export default function BenchmarkRunner({ isRunning, executionTimeMs, onRun }: Props) {
  return (
    <div className="runner">
      <button className="btn-primary" onClick={onRun} disabled={isRunning}>
        {isRunning ? 'Running…' : 'Run Benchmark'}
      </button>

      {executionTimeMs !== null && (
        <span className="time-badge">⏱ {executionTimeMs.toFixed(3)} ms</span>
      )}
    </div>
  );
}
