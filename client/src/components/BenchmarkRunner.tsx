import { useTranslation } from 'react-i18next';

interface Props {
  isRunning: boolean;
  executionTimeMs: number | null;
  onRun: () => void;
}

export default function BenchmarkRunner({ isRunning, executionTimeMs, onRun }: Props) {
  const { t } = useTranslation();

  return (
    <div className="runner">
      <button className="btn-primary" onClick={onRun} disabled={isRunning}>
        {isRunning ? t('runner.running') : t('runner.run')}
      </button>

      {executionTimeMs !== null && (
        <span className="time-badge">⏱ {executionTimeMs.toFixed(3)} ms</span>
      )}
    </div>
  );
}
