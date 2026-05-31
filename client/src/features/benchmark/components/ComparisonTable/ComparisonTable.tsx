import { useTranslation } from 'react-i18next';
import s from './ComparisonTable.module.css';
import type { BenchmarkRun, TemplateEngine, EngineMetrics } from '../../../../shared/types';
import { ENGINE_COLORS } from '../../../../shared/constants';
import ThTooltip from '../../../../shared/components/ThTooltip/ThTooltip';

function fastest(engines: Partial<Record<TemplateEngine, EngineMetrics>>): string {
  const entries = Object.entries(engines) as [TemplateEngine, EngineMetrics][];
  return entries.reduce((a, b) => ((a[1].avg ?? Infinity) < (b[1].avg ?? Infinity) ? a : b))[0];
}

export default function ComparisonTable({ run }: { run: BenchmarkRun }) {
  const { t } = useTranslation();

  return (
    <div className={s.wrap}>
      {run.results.map(({ scenario, engines }) => {
        const fastestEngine = fastest(engines);
        return (
          <div key={scenario} className={s.section}>
            <h3 className={s.title}>
              <span className="scenario-badge">{scenario}</span>
              <span className={s.winner}>{t('comparison.fastest', { engine: fastestEngine })}</span>
            </h3>
            <table className="results-table">
              <thead>
                <tr>
                  <ThTooltip label={t('comparison.colEngine')} tip={t('comparison.colEngTip')} />
                  <ThTooltip label={t('comparison.colAvg')} tip={t('comparison.colAvgTip')} />
                  <ThTooltip label={t('comparison.colMedian')} tip={t('comparison.colMedianTip')} />
                  <ThTooltip label={t('comparison.colMin')} tip={t('comparison.colMinTip')} />
                  <ThTooltip label={t('comparison.colMax')} tip={t('comparison.colMaxTip')} />
                  <ThTooltip label={t('comparison.colCompile')} tip={t('comparison.colCompileTip')} />
                  <ThTooltip label={t('comparison.colVsFastest')} tip={t('comparison.colVsFastestTip')} />
                </tr>
              </thead>
              <tbody>
                {(Object.entries(engines) as [TemplateEngine, EngineMetrics][])
                  .sort((a, b) => a[1].avg - b[1].avg)
                  .map(([engine, m]) => {
                    const fastestAvg = engines[fastestEngine as TemplateEngine]?.avg;
                    const ratio = fastestAvg ? (m.avg ?? 0) / fastestAvg : null;
                    return (
                      <tr key={engine} className={engine === fastestEngine ? 'fastest' : ''}>
                        <td>
                          <span className="engine-dot" style={{ background: ENGINE_COLORS[engine] }} />
                          {engine}
                        </td>
                        <td><strong>{m.avg?.toFixed(3) ?? '—'}</strong></td>
                        <td>{m.median?.toFixed(3) ?? '—'}</td>
                        <td>{m.min?.toFixed(3) ?? '—'}</td>
                        <td>{m.max?.toFixed(3) ?? '—'}</td>
                        <td>{m.compileMs?.toFixed(3) ?? '—'}</td>
                        <td>{engine === fastestEngine || ratio === null ? '—' : `×${ratio.toFixed(2)}`}</td>
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
