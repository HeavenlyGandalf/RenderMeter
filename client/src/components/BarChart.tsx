import type { BenchmarkRun, TemplateEngine } from '../types';
import { ENGINE_COLORS } from '../constants';

interface Props {
  run: BenchmarkRun;
}

const W = 640;
const H = 300;
const PAD = { top: 24, right: 20, bottom: 72, left: 58 };
const CW = W - PAD.left - PAD.right;
const CH = H - PAD.top - PAD.bottom;

function r3(n: number): string {
  return n < 1 ? n.toFixed(3) : n.toFixed(1);
}

export default function BarChart({ run }: Props) {
  const { results, engines } = run;
  if (!results.length || !engines.length) return null;

  // Максимальное значение для Y-шкалы
  const allAvg = results.flatMap((r) =>
    engines.map((e) => r.engines[e as TemplateEngine]?.avg ?? 0)
  );
  const maxVal = Math.max(...allAvg) * 1.15;
  if (maxVal === 0) return null;

  const groupW = CW / results.length;
  const barCount = engines.length;
  const barW = Math.min((groupW * 0.8) / barCount, 36);
  const groupPad = (groupW - barW * barCount) / 2;

  const toY = (v: number) => CH - (v / maxVal) * CH;

  // Y-axis ticks
  const TICKS = 5;
  const tickVals = Array.from({ length: TICKS + 1 }, (_, i) => (maxVal * i) / TICKS);

  return (
    <div className="chart-wrap">
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} className="bar-chart">
        <g transform={`translate(${PAD.left},${PAD.top})`}>

          {/* Gridlines + Y labels */}
          {tickVals.map((v, i) => {
            const y = toY(v);
            return (
              <g key={i}>
                <line x1={0} y1={y} x2={CW} y2={y} stroke="#e2e8f0" strokeWidth={1} />
                <text x={-6} y={y + 4} textAnchor="end" fontSize={10} fill="#94a3b8">
                  {r3(v)}
                </text>
              </g>
            );
          })}

          {/* Bars */}
          {results.map((scenarioResult, si) => {
            const groupX = si * groupW;
            return engines.map((engine, ei) => {
              const metrics = scenarioResult.engines[engine as TemplateEngine];
              if (!metrics) return null;

              const x = groupX + groupPad + ei * barW;
              const barH = (metrics.avg / maxVal) * CH;
              const y = CH - barH;
              const color = ENGINE_COLORS[engine as TemplateEngine] ?? '#888';

              return (
                <g key={`${scenarioResult.scenario}-${engine}`}>
                  <rect x={x} y={y} width={barW - 2} height={barH} fill={color} rx={3} />
                  {/* Value label inside bar if tall enough */}
                  {barH > 16 && (
                    <text
                      x={x + (barW - 2) / 2}
                      y={y + 13}
                      textAnchor="middle"
                      fontSize={8}
                      fill="white"
                      fontWeight="600"
                    >
                      {r3(metrics.avg)}
                    </text>
                  )}
                </g>
              );
            });
          })}

          {/* X axis line */}
          <line x1={0} y1={CH} x2={CW} y2={CH} stroke="#cbd5e1" />

          {/* Scenario labels */}
          {results.map((r, si) => (
            <text
              key={r.scenario}
              x={si * groupW + groupW / 2}
              y={CH + 16}
              textAnchor="middle"
              fontSize={12}
              fill="#475569"
              fontWeight="600"
            >
              {r.scenario}
            </text>
          ))}

          {/* Y axis label */}
          <text
            transform={`translate(-44, ${CH / 2}) rotate(-90)`}
            textAnchor="middle"
            fontSize={10}
            fill="#94a3b8"
          >
            avg render time (ms)
          </text>
        </g>

        {/* Legend */}
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
              <text x={15} y={9} fontSize={11} fill="#475569">
                {engine}
              </text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
