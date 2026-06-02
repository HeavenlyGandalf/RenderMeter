import { useTranslation } from 'react-i18next';
import s from './BarChart.module.css';
import type { BenchmarkRun, TemplateEngine } from '../../../../shared/types';
import { ENGINE_COLORS } from '../../../../shared/constants';

const W = 640,
  H = 300;
const PAD = { top: 24, right: 20, bottom: 72, left: 58 };
const CW = W - PAD.left - PAD.right;
const CH = H - PAD.top - PAD.bottom;

function r3(n: number) {
  return n < 1 ? n.toFixed(3) : n.toFixed(1);
}

export default function BarChart({ run }: { run: BenchmarkRun }) {
  const { t } = useTranslation();
  const { results, engines } = run;
  if (!results.length || !engines.length) return null;

  const allAvg = results.flatMap((r) =>
    engines.map((e) => r.engines[e as TemplateEngine]?.avg ?? 0),
  );
  const maxVal = Math.max(...allAvg) * 1.15;
  if (maxVal === 0) return null;

  const groupW = CW / results.length;
  const barW = Math.min((groupW * 0.8) / engines.length, 36);
  const groupPad = (groupW - barW * engines.length) / 2;
  const toY = (v: number) => CH - (v / maxVal) * CH;
  const ticks = Array.from({ length: 6 }, (_, i) => (maxVal * i) / 5);

  return (
    <div className={s.wrap}>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} className={s.chart}>
        <g transform={`translate(${PAD.left},${PAD.top})`}>
          {ticks.map((v, i) => (
            <g key={i}>
              <line x1={0} y1={toY(v)} x2={CW} y2={toY(v)} stroke="#232b38" strokeWidth={1} />
              <text x={-6} y={toY(v) + 4} textAnchor="end" fontSize={10} fill="#4a5568">
                {r3(v)}
              </text>
            </g>
          ))}

          {results.map((sr, si) =>
            engines.map((engine, ei) => {
              const m = sr.engines[engine as TemplateEngine];
              if (!m) return null;
              const x = si * groupW + groupPad + ei * barW;
              const bh = (m.avg / maxVal) * CH;
              const y = CH - bh;
              const color = ENGINE_COLORS[engine as TemplateEngine] ?? '#888';
              return (
                <g key={`${sr.scenario}-${engine}`}>
                  <rect x={x} y={y} width={barW - 2} height={bh} fill={color} rx={3} />
                  {bh > 16 && (
                    <text
                      x={x + (barW - 2) / 2}
                      y={y + 13}
                      textAnchor="middle"
                      fontSize={8}
                      fill="white"
                      fontWeight="600"
                    >
                      {r3(m.avg)}
                    </text>
                  )}
                </g>
              );
            }),
          )}

          <line x1={0} y1={CH} x2={CW} y2={CH} stroke="#2e3a4a" />

          {results.map((r, si) => (
            <text
              key={r.scenario}
              x={si * groupW + groupW / 2}
              y={CH + 16}
              textAnchor="middle"
              fontSize={12}
              fill="#8899aa"
              fontWeight="600"
            >
              {r.scenario}
            </text>
          ))}

          <text
            transform={`translate(-44, ${CH / 2}) rotate(-90)`}
            textAnchor="middle"
            fontSize={10}
            fill="#4a5568"
          >
            {t('chart.yAxis')}
          </text>
        </g>

        <g transform={`translate(${PAD.left}, ${H - 26})`}>
          {engines.map((engine, i) => (
            <g key={engine} transform={`translate(${i * 110}, 0)`}>
              <rect
                x={0}
                y={0}
                width={11}
                height={11}
                fill={ENGINE_COLORS[engine as TemplateEngine] ?? '#888'}
                rx={2}
              />
              <text x={15} y={9} fontSize={11} fill="#8899aa">
                {engine}
              </text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
