import type { BenchmarkRun, TemplateEngine, EngineMetrics } from '../types';

interface Props {
  run: BenchmarkRun;
}

interface Point {
  label: string;
  type: 'winner' | 'info' | 'warn';
}

function analyze(run: BenchmarkRun): Point[] {
  const points: Point[] = [];
  const wins: Partial<Record<TemplateEngine, number>> = {};

  for (const { scenario, engines } of run.results) {
    const entries = (Object.entries(engines) as [TemplateEngine, EngineMetrics][])
      .sort((a, b) => a[1].avg - b[1].avg);

    if (entries.length < 2) continue;

    const [fastestName, fastestM] = entries[0];
    const [slowestName, slowestM] = entries[entries.length - 1];
    const ratio = slowestM.avg / fastestM.avg;

    wins[fastestName] = (wins[fastestName] ?? 0) + 1;

    points.push({
      label: `${scenario}: ${fastestName} fastest at ${fastestM.avg.toFixed(3)} ms avg — ${slowestName} is ×${ratio.toFixed(1)} slower`,
      type: 'winner',
    });

    // Warn if spread is very high (max/min ratio > 5)
    for (const [engine, m] of entries) {
      const spread = m.max / m.min;
      if (spread > 5) {
        points.push({
          label: `${engine} in ${scenario}: high variance (min ${m.min.toFixed(3)} ms → max ${m.max.toFixed(3)} ms, ×${spread.toFixed(1)} spread) — consider more warm-up or fewer background tasks`,
          type: 'warn',
        });
      }
    }
  }

  // Overall winner
  const sorted = (Object.entries(wins) as [TemplateEngine, number][]).sort((a, b) => b[1] - a[1]);
  if (sorted.length > 0 && run.results.length > 1) {
    const [winner, count] = sorted[0];
    points.push({
      label: `Overall: ${winner} wins ${count}/${run.results.length} scenarios`,
      type: 'info',
    });
  }

  return points;
}

export default function SummaryBlock({ run }: Props) {
  const points = analyze(run);
  if (!points.length) return null;

  return (
    <div className="summary-block">
      <h2>Summary</h2>
      <ul className="summary-list">
        {points.map((p, i) => (
          <li key={i} className={`summary-item summary-${p.type}`}>
            {p.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
