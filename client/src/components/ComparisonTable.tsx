import type { BenchmarkRun, TemplateEngine, EngineMetrics } from '../types';
import { ENGINE_COLORS } from '../constants';

interface Props {
  run: BenchmarkRun;
}

function fastest(engines: Partial<Record<TemplateEngine, EngineMetrics>>): string {
  const entries = Object.entries(engines) as [TemplateEngine, EngineMetrics][];
  return entries.reduce((a, b) => (a[1].avg < b[1].avg ? a : b))[0];
}

export default function ComparisonTable({ run }: Props) {
  return (
    <div className="comparison-wrap">
      {run.results.map(({ scenario, engines }) => {
        const fastestEngine = fastest(engines);
        return (
          <div key={scenario} className="scenario-section">
            <h3 className="scenario-title">
              <span className="scenario-badge">{scenario}</span>
              <span className="scenario-winner">
                {fastestEngine} fastest
              </span>
            </h3>

            <table className="results-table">
              <thead>
                <tr>
                  <th>Engine</th>
                  <th>Avg (ms)</th>
                  <th>Median (ms)</th>
                  <th>Min (ms)</th>
                  <th>Max (ms)</th>
                  <th>Compile (ms)</th>
                  <th>vs fastest</th>
                </tr>
              </thead>
              <tbody>
                {(Object.entries(engines) as [TemplateEngine, EngineMetrics][])
                  .sort((a, b) => a[1].avg - b[1].avg)
                  .map(([engine, m]) => {
                    const fastestAvg = engines[fastestEngine as TemplateEngine]!.avg;
                    const ratio = m.avg / fastestAvg;
                    return (
                      <tr key={engine} className={engine === fastestEngine ? 'fastest' : ''}>
                        <td>
                          <span
                            className="engine-dot"
                            style={{ background: ENGINE_COLORS[engine] }}
                          />
                          {engine}
                        </td>
                        <td><strong>{m.avg.toFixed(3)}</strong></td>
                        <td>{m.median.toFixed(3)}</td>
                        <td>{m.min.toFixed(3)}</td>
                        <td>{m.max.toFixed(3)}</td>
                        <td>{m.compileMs.toFixed(3)}</td>
                        <td>
                          {engine === fastestEngine
                            ? '—'
                            : `×${ratio.toFixed(2)}`}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}
