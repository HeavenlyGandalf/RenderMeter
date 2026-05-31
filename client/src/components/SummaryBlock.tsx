import { useTranslation } from 'react-i18next';
import type { BenchmarkRun, TemplateEngine, EngineMetrics } from '../types';

interface Props {
  run: BenchmarkRun;
}

type SummaryType = 'winner' | 'info' | 'warn';

interface Point {
  key: string;
  type: SummaryType;
  vars: Record<string, string | number>;
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
      key: 'summary.winner',
      type: 'winner',
      vars: {
        scenario,
        engine: fastestName,
        avg: fastestM.avg.toFixed(3),
        slowest: slowestName,
        ratio: ratio.toFixed(1),
      },
    });

    for (const [engine, m] of entries) {
      const spread = m.max / m.min;
      if (spread > 5) {
        points.push({
          key: 'summary.variance',
          type: 'warn',
          vars: {
            engine,
            scenario,
            min: m.min.toFixed(3),
            max: m.max.toFixed(3),
            spread: spread.toFixed(1),
          },
        });
      }
    }
  }

  const sorted = (Object.entries(wins) as [TemplateEngine, number][]).sort((a, b) => b[1] - a[1]);
  if (sorted.length > 0 && run.results.length > 1) {
    const [winner, count] = sorted[0];
    points.push({
      key: 'summary.overall',
      type: 'info',
      vars: { winner, count, total: run.results.length },
    });
  }

  return points;
}

export default function SummaryBlock({ run }: Props) {
  const { t } = useTranslation();
  const points = analyze(run);
  if (!points.length) return null;

  return (
    <div className="summary-block">
      <h2>{t('summary.heading')}</h2>
      <ul className="summary-list">
        {points.map((p, i) => (
          <li key={i} className={`summary-item summary-${p.type}`}>
            {t(p.key, p.vars)}
          </li>
        ))}
      </ul>
    </div>
  );
}
