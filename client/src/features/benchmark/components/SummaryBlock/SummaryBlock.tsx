import { useTranslation } from 'react-i18next';
import s from './SummaryBlock.module.css';
import type { BenchmarkRun, TemplateEngine, EngineMetrics } from '../../../../shared/types';

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
    const entries = (Object.entries(engines) as [TemplateEngine, EngineMetrics][]).sort(
      (a, b) => a[1].avg - b[1].avg,
    );
    if (entries.length < 2) continue;

    const [fastestName, fastestM] = entries[0];
    const [slowestName, slowestM] = entries[entries.length - 1];
    wins[fastestName] = (wins[fastestName] ?? 0) + 1;

    const ratio = fastestM.avg > 0 ? (slowestM.avg / fastestM.avg).toFixed(1) : '∞';
    points.push({
      key: 'summary.winner',
      type: 'winner',
      vars: {
        scenario,
        engine: fastestName,
        avg: fastestM.avg.toFixed(3),
        slowest: slowestName,
        ratio,
      },
    });

    for (const [engine, m] of entries) {
      const spread = m.min > 0 ? m.max / m.min : Infinity;
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

export default function SummaryBlock({ run }: { run: BenchmarkRun }) {
  const { t } = useTranslation();
  const points = analyze(run);
  if (!points.length) return null;

  return (
    <div className={s.block}>
      <h2>{t('summary.heading')}</h2>
      <ul className={s.list}>
        {points.map((p) => (
          <li
            key={`${p.key}-${p.vars.scenario ?? ''}-${p.vars.engine ?? ''}`}
            className={`${s.item} ${s[p.type]}`}
          >
            {t(p.key, p.vars)}
          </li>
        ))}
      </ul>
    </div>
  );
}
