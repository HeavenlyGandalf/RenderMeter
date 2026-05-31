import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { TemplateEngine, Scenario } from '../../shared/types';
import { ENGINES, SCENARIOS, RUNS_OPTIONS } from '../../shared/constants';
import { useBenchmarkRun, useBenchmarkHistory } from './api';
import EngineMultiSelect from './components/EngineMultiSelect/EngineMultiSelect';
import ScenarioSelector from './components/ScenarioSelector/ScenarioSelector';
import ComparisonTable from './components/ComparisonTable/ComparisonTable';
import BarChart from './components/BarChart/BarChart';
import SummaryBlock from './components/SummaryBlock/SummaryBlock';
import TemplateViewer from './components/TemplateViewer/TemplateViewer';
import ScenarioDataViewer from './components/ScenarioDataViewer/ScenarioDataViewer';
import ErrorMessage from '../../shared/components/ErrorMessage/ErrorMessage';
import { formatDateTime } from '../../shared/lib/datetime';

export default function BenchmarkPage() {
  const { t, i18n } = useTranslation();
  const [engines, setEngines] = useState<TemplateEngine[]>([...ENGINES]);
  const [scenarios, setScenarios] = useState<Scenario[]>([...SCENARIOS]);
  const [runs, setRuns] = useState(100);
  const [customData, setCustomData] = useState<object | null>(null);
  const [activeRunId, setActiveRunId] = useState<string | null>(null);

  const { data: history = [] } = useBenchmarkHistory();
  const { mutate: runBenchmark, isPending, error: mutationError, reset } = useBenchmarkRun();

  const currentRun = activeRunId
    ? history.find((r) => r._id === activeRunId) ?? history[0]
    : history[0];

  function handleRun() {
    if (engines.length === 0 || scenarios.length === 0) return;
    reset();
    runBenchmark(
      { engines, scenarios, runs, customData: customData ?? undefined },
      { onSuccess: (run) => setActiveRunId(run._id) },
    );
  }

  const errorMsg = mutationError instanceof Error ? mutationError.message : null;

  return (
    <main className="page">
      <div className="page-header">
        <div className="page-title">{t('benchmark.title')}</div>
        <div className="page-subtitle">
          {t('benchmark.subtitle')}{' — '}
          <Link to="/docs" style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: 'inherit' }}>
            {t('docs.title')} →
          </Link>
        </div>
      </div>

      <div className="card controls">
        <div className="card--header">
          <EngineMultiSelect selected={engines} onChange={setEngines} disabled={isPending} />
          <ScenarioSelector selected={scenarios} onChange={setScenarios} disabled={isPending} />
        </div>

        <div className="field">
          <label htmlFor="runs-select">{t('benchmark.runsPerScenario')}</label>
          <select
            id="runs-select"
            value={runs}
            onChange={(e) => setRuns(Number(e.target.value))}
            disabled={isPending}
          >
            {RUNS_OPTIONS.map((n) => (
              <option key={n} value={n}>{t('benchmark.runsOption', { count: n })}</option>
            ))}
          </select>
        </div>

        {errorMsg && <ErrorMessage message={errorMsg} onDismiss={reset} />}

        <button className="btn-primary" onClick={handleRun} disabled={isPending || engines.length === 0 || scenarios.length === 0}>
          {isPending ? t('benchmark.running') : t('benchmark.runAll')}
        </button>
      </div>

      <TemplateViewer />
      <ScenarioDataViewer onCustomDataChange={setCustomData} />

      {currentRun && (
        <>
          <div className="card">
            <h2>{t('benchmark.resultsHeading', {
              runs: currentRun.runs,
              date: formatDateTime(currentRun.createdAt, i18n.language),
            })}</h2>
            <ComparisonTable run={currentRun} />
          </div>

          <div className="card">
            <h2>{t('benchmark.chartHeading')}</h2>
            <BarChart run={currentRun} />
          </div>

          <div className="card">
            <SummaryBlock run={currentRun} />
          </div>
        </>
      )}

      {history.length > 0 && (
        <div className="card">
          <h2>{t('benchmark.history')}</h2>
          <table className="history-table">
            <thead>
              <tr>
                <th>{t('benchmark.historyDate')}</th>
                <th>{t('benchmark.historyEngines')}</th>
                <th>{t('benchmark.historyScenarios')}</th>
                <th>{t('benchmark.historyRuns')}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {history.map((run) => (
                <tr key={run._id} className={run._id === currentRun?._id ? 'row-active' : ''}>
                  <td>{formatDateTime(run.createdAt, i18n.language)}</td>
                  <td>{run.engines.join(', ')}</td>
                  <td>{run.scenarios.join(', ')}</td>
                  <td>{run.runs}</td>
                  <td>
                    <button className="btn-ghost" onClick={() => setActiveRunId(run._id)}>
                      {t('benchmark.show')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
