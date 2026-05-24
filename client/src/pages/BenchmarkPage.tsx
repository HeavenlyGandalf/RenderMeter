import { useState, useEffect } from 'react';
import { runBenchmark, fetchBenchmarkHistory } from '../api/benchmark';
import type { BenchmarkRun, TemplateEngine, Scenario } from '../types';
import { ENGINES, SCENARIOS, RUNS_OPTIONS } from '../constants';
import EngineMultiSelect from '../components/EngineMultiSelect';
import ScenarioSelector from '../components/ScenarioSelector';
import ComparisonTable from '../components/ComparisonTable';
import BarChart from '../components/BarChart';
import SummaryBlock from '../components/SummaryBlock';
import ErrorMessage from '../components/ErrorMessage';
import TemplateViewer from '../components/TemplateViewer';
import ScenarioDataViewer from '../components/ScenarioDataViewer';

export default function BenchmarkPage() {
  const [engines, setEngines] = useState<TemplateEngine[]>([...ENGINES]);
  const [scenarios, setScenarios] = useState<Scenario[]>([...SCENARIOS]);
  const [runs, setRuns] = useState(100);
  const [isRunning, setIsRunning] = useState(false);
  const [currentRun, setCurrentRun] = useState<BenchmarkRun | null>(null);
  const [history, setHistory] = useState<BenchmarkRun[]>([]);
  const [error, setError] = useState('');
  const [customData, setCustomData] = useState<object | null>(null);

  useEffect(() => {
    fetchBenchmarkHistory()
      .then(setHistory)
      .catch(() => {});
  }, []);

  async function handleRun() {
    if (engines.length === 0 || scenarios.length === 0) {
      setError('Select at least one engine and one scenario');
      return;
    }

    setIsRunning(true);
    setError('');

    try {
      const result = await runBenchmark({
        engines,
        scenarios,
        runs,
        customData: customData ?? undefined,
      });
      setCurrentRun(result);
      setHistory((prev) => [result, ...prev].slice(0, 10));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Benchmark failed');
    } finally {
      setIsRunning(false);
    }
  }

  return (
    <main className="page">

      {/* Config */}
      <div className="card controls">
        <EngineMultiSelect selected={engines} onChange={setEngines} disabled={isRunning} />
        <ScenarioSelector selected={scenarios} onChange={setScenarios} disabled={isRunning} />

        <div className="field">
          <label htmlFor="runs-select">Runs per scenario</label>
          <select
            id="runs-select"
            value={runs}
            onChange={(e) => setRuns(Number(e.target.value))}
            disabled={isRunning}
          >
            {RUNS_OPTIONS.map((n) => (
              <option key={n} value={n}>{n} runs</option>
            ))}
          </select>
        </div>

        {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}

        <button className="btn-primary" onClick={handleRun} disabled={isRunning}>
          {isRunning ? 'Running benchmark…' : 'Run All Benchmarks'}
        </button>
      </div>

      <TemplateViewer />
      <ScenarioDataViewer onCustomDataChange={setCustomData} />

      {/* Results */}
      {currentRun && (
        <>
          <div className="card">
            <h2>Results — {currentRun.runs} runs · {new Date(currentRun.createdAt).toLocaleString('ru')}</h2>
            <ComparisonTable run={currentRun} />
          </div>

          <div className="card">
            <h2>Chart — avg render time (ms)</h2>
            <BarChart run={currentRun} />
          </div>

          <div className="card">
            <SummaryBlock run={currentRun} />
          </div>
        </>
      )}

      {/* History */}
      {history.length > 0 && (
        <div className="card">
          <h2>History</h2>
          <table className="history-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Engines</th>
                <th>Scenarios</th>
                <th>Runs</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {history.map((run) => (
                <tr key={run._id}>
                  <td>{new Date(run.createdAt).toLocaleString('ru')}</td>
                  <td>{run.engines.join(', ')}</td>
                  <td>{run.scenarios.join(', ')}</td>
                  <td>{run.runs}</td>
                  <td>
                    <button className="btn-ghost" onClick={() => setCurrentRun(run)}>
                      show
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
