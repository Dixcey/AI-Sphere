import React from 'react';
import { LineChart } from 'lucide-react';
import { careerHistory, sentimentEvolution } from '../data/profileExtras';

interface SentimentEvolutionChartProps {
  personId: string;
}

const DIMS = [
  { key: 'reg' as const, label: 'Regulation', color: '#60A5FA' },
  { key: 'use' as const, label: 'Usage',      color: '#34D399' },
  { key: 'tru' as const, label: 'Trust',      color: '#FB923C' },
  { key: 'age' as const, label: 'Agents',     color: '#C084FC' },
];

/**
 * Multi-line SVG chart plotting inferred sentiment across the subject's
 * career. Visually matches the `renderSentimentEvolution` output in
 * `preview.html`.
 */
export default function SentimentEvolutionChart({ personId }: SentimentEvolutionChartProps) {
  const evoData = sentimentEvolution[personId];
  const careerData = careerHistory[personId];

  const isAvailable = !!(evoData && evoData.length >= 2 && careerData && careerData.length >= 2);

  return (
    <div className="mt-3 pt-3 border-t border-white/10">
      <div className="flex items-center gap-1.5 mb-2">
        <LineChart className="w-3 h-3 text-indigo-400 flex-shrink-0" />
        <span className="text-[10px] font-semibold text-slate-300">
          Sentiment Evolution Across Career
        </span>
      </div>

      {!isAvailable ? (
        <p className="text-[11px] text-slate-600 italic py-1">
          {careerData && careerData.length > 0
            ? 'Single career stage — no evolution to show.'
            : 'No evolution data available for this profile.'}
        </p>
      ) : (
        <Chart evoData={evoData!} careerData={careerData!} />
      )}
    </div>
  );
}

function Chart({
  evoData,
  careerData,
}: {
  evoData: typeof sentimentEvolution[string];
  careerData: typeof careerHistory[string];
}) {
  // Both arrays are stored newest→oldest; reverse so the chart reads
  // oldest-on-left.
  const stages = [...evoData].reverse();
  const career = [...careerData].reverse();

  const W = 480;
  const H = 120;
  const PAD = { top: 10, right: 14, bottom: 32, left: 46 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;
  const n = stages.length;
  const xStep = n > 1 ? chartW / (n - 1) : 0;

  const yScale = (v: number) => PAD.top + chartH * (1 - (v + 1) / 2);
  const xScale = (i: number) => PAD.left + i * xStep;

  const yTicks: Array<{ v: number; label: string }> = [
    { v: 1,  label: 'Positive' },
    { v: 0,  label: 'Neutral' },
    { v: -1, label: 'Negative' },
  ];

  return (
    <>
      {/* Legend */}
      <div className="mb-1.5 flex flex-wrap">
        {DIMS.map(d => (
          <span
            key={d.key}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 3, marginRight: 8 }}
          >
            <svg width="12" height="4" aria-hidden>
              <line x1="0" y1="2" x2="12" y2="2" stroke={d.color} strokeWidth="1.5" />
            </svg>
            <span style={{ fontSize: 9, color: 'rgba(203,213,225,0.85)' }}>{d.label}</span>
          </span>
        ))}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
        {/* Gridlines + y labels */}
        {yTicks.map(({ v, label }) => {
          const y = yScale(v);
          const isZero = v === 0;
          return (
            <g key={label}>
              <line
                x1={PAD.left}
                y1={y}
                x2={W - PAD.right}
                y2={y}
                stroke={isZero ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.06)'}
                strokeWidth={isZero ? 1 : 0.5}
                strokeDasharray={isZero ? undefined : '3,3'}
              />
              <text
                x={PAD.left - 4}
                y={y + 3}
                textAnchor="end"
                fontSize="7.5"
                fill={isZero ? 'rgba(203,213,225,0.7)' : 'rgba(148,163,184,0.5)'}
                fontFamily="Inter, sans-serif"
              >
                {label}
              </text>
            </g>
          );
        })}
        {[-0.5, 0.5].map(v => (
          <line
            key={v}
            x1={PAD.left}
            y1={yScale(v)}
            x2={W - PAD.right}
            y2={yScale(v)}
            stroke="rgba(255,255,255,0.04)"
            strokeWidth={0.5}
            strokeDasharray="2,4"
          />
        ))}

        {/* Polylines + points */}
        {DIMS.map(d => {
          const pts = stages.map((s, i) => `${xScale(i)},${yScale(s[d.key])}`).join(' ');
          return (
            <g key={d.key}>
              <polyline
                points={pts}
                fill="none"
                stroke={d.color}
                strokeWidth={1.5}
                strokeLinejoin="round"
                opacity={0.85}
              />
              {stages.map((s, i) => (
                <circle
                  key={i}
                  cx={xScale(i)}
                  cy={yScale(s[d.key])}
                  r={2.5}
                  fill={d.color}
                  opacity={0.9}
                />
              ))}
            </g>
          );
        })}

        {/* X-axis labels (company name, truncated) */}
        {career.map((step, i) => {
          const labelRaw = step.c || '';
          const label = labelRaw.length > 10 ? `${labelRaw.slice(0, 9)}…` : labelRaw;
          const anchor = i === 0 ? 'start' : i === n - 1 ? 'end' : 'middle';
          return (
            <text
              key={`${i}-${labelRaw}`}
              x={xScale(i)}
              y={H - 4}
              textAnchor={anchor}
              fontSize="7.5"
              fill="rgba(148,163,184,0.8)"
              fontFamily="Inter, sans-serif"
            >
              {label}
            </text>
          );
        })}
      </svg>
    </>
  );
}
