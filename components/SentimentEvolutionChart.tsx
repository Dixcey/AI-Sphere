import React from 'react';
import { LineChart } from 'lucide-react';
import { careerHistory, sentimentEvolution } from '../data/profileExtras';

interface SentimentEvolutionChartProps {
  personId: string;
}

type DimKey = 'reg' | 'use' | 'tru' | 'age';

interface Dim {
  key: DimKey;
  label: string;
  color: string;
  left: string;
  right: string;
}

// Keep in sync with preview.html `renderSentimentEvolution` after the
// 397a244 revert — pastel but clearly distinguishable on #090A10.
const DIMS: Dim[] = [
  { key: 'reg', label: 'Regulation', color: '#60A5FA', left: 'Against',     right: 'Pro'          },
  { key: 'use', label: 'AI Usage',   color: '#34D399', left: 'Restrictive', right: 'Enthusiastic' },
  { key: 'tru', label: 'Trust',      color: '#FB923C', left: 'High Risk',   right: 'High Trust'   },
  { key: 'age', label: 'AI Agents',  color: '#C084FC', left: 'Skeptical',   right: 'Bullish'      },
];

const THRESHOLD = 0.25;

/**
 * Before/after comparison of the subject's inferred sentiment at the single
 * career transition with the biggest total shift. Mirrors the `9cd97bd`
 * redesign in preview.html.
 *
 * Returns `null` (so the parent can hide the whole card) whenever there
 * isn't enough data or no dimension crossed `THRESHOLD` at any transition.
 */
export default function SentimentEvolutionChart({ personId }: SentimentEvolutionChartProps) {
  const evoData = sentimentEvolution[personId];
  const careerData = careerHistory[personId];

  if (!evoData || evoData.length < 2 || !careerData || careerData.length < 2) {
    return null;
  }

  const stages = [...evoData].reverse();   // oldest → newest
  const career = [...careerData].reverse();

  let bestIdx = -1;
  let bestTotal = 0;
  for (let i = 1; i < stages.length; i++) {
    const total = DIMS.reduce(
      (s, d) => s + Math.abs(stages[i][d.key] - stages[i - 1][d.key]),
      0,
    );
    if (total > bestTotal) {
      bestTotal = total;
      bestIdx = i;
    }
  }

  if (bestIdx === -1 || bestTotal < THRESHOLD) {
    return null;
  }

  const before = stages[bestIdx - 1];
  const after = stages[bestIdx];
  const fromCo = career[bestIdx - 1];
  const toCo = career[bestIdx];

  const changedDims = DIMS.filter(
    d => Math.abs(after[d.key] - before[d.key]) >= THRESHOLD,
  );

  if (changedDims.length === 0) {
    return null;
  }

  return (
    <div className="bg-[#090A10]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl pointer-events-auto p-3.5">
      <div className="flex items-center gap-2 mb-2.5">
        <LineChart className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
        <h3 className="text-xs font-semibold text-white">Sentiment Shift Across Career</h3>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 mb-2">
        <span
          className="text-[9px] font-semibold rounded px-1.5 py-0.5 border"
          style={{
            color: 'rgba(203,213,225,0.7)',
            background: 'rgba(255,255,255,0.05)',
            borderColor: 'rgba(255,255,255,0.1)',
          }}
        >
          {fromCo.c}
          {fromCo.y ? ` · ${fromCo.y}` : ''}
        </span>
        <span className="text-[10px]" style={{ color: 'rgba(99,102,241,0.7)' }}>→</span>
        <span
          className="text-[9px] font-semibold rounded px-1.5 py-0.5 border"
          style={{
            color: 'rgba(203,213,225,0.7)',
            background: 'rgba(99,102,241,0.1)',
            borderColor: 'rgba(99,102,241,0.25)',
          }}
        >
          {toCo.c}
          {toCo.y ? ` · ${toCo.y}` : ''}
        </span>
        <span className="text-[8px]" style={{ color: 'rgba(148,163,184,0.4)' }}>
          biggest shift
        </span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '68px 1fr 18px 1fr 70px',
          alignItems: 'center',
          gap: 6,
          marginBottom: 4,
          paddingBottom: 5,
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <span />
        <span style={{ fontSize: 8, color: 'rgba(100,116,139,0.7)', textAlign: 'center' }}>
          Before
        </span>
        <span />
        <span style={{ fontSize: 8, color: 'rgba(100,116,139,0.7)', textAlign: 'center' }}>
          After
        </span>
        <span />
      </div>

      {changedDims.map(d => (
        <Row key={d.key} dim={d} before={before[d.key]} after={after[d.key]} />
      ))}
    </div>
  );
}

function Row({ dim, before, after }: { dim: Dim; before: number; after: number }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '68px 1fr 18px 1fr 70px',
        alignItems: 'center',
        gap: 6,
        marginBottom: 8,
      }}
    >
      <span style={{ fontSize: 9, color: 'rgba(148,163,184,0.9)', fontWeight: 500 }}>
        {dim.label}
      </span>
      <StackedBar dim={dim} value={before} />
      <span style={{ fontSize: 11, color: 'rgba(148,163,184,0.4)', textAlign: 'center' }}>→</span>
      <StackedBar dim={dim} value={after} />
      <DeltaBadge dim={dim} before={before} after={after} />
    </div>
  );
}

function StackedBar({ dim, value }: { dim: Dim; value: number }) {
  return (
    <div>
      <MiniBar color={dim.color} value={value} />
      <div
        style={{
          fontSize: 8,
          color: 'rgba(148,163,184,0.55)',
          marginTop: 2,
          textAlign: 'center',
        }}
      >
        {valueLabel(dim, value)}
      </div>
    </div>
  );
}

function MiniBar({ color, value }: { color: string; value: number }) {
  const pct = ((value + 1) / 2) * 100;
  return (
    <div
      style={{
        position: 'relative',
        height: 4,
        background: 'rgba(255,255,255,0.08)',
        borderRadius: 9999,
        width: '100%',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: `${pct}%`,
          transform: 'translate(-50%, -50%)',
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: color,
          boxShadow: `0 0 5px ${color}88`,
        }}
      />
    </div>
  );
}

function DeltaBadge({ dim, before, after }: { dim: Dim; before: number; after: number }) {
  const delta = after - before;
  const sign = delta > 0 ? '↑' : '↓';
  const mag = Math.abs(delta);
  const intensity = mag >= 0.8 ? 'Major' : mag >= 0.5 ? 'Notable' : 'Moderate';
  return (
    <span
      style={{
        fontSize: 9,
        fontWeight: 600,
        color: dim.color,
        background: `${dim.color}18`,
        border: `1px solid ${dim.color}44`,
        borderRadius: 4,
        padding: '1px 5px',
        whiteSpace: 'nowrap',
        justifySelf: 'end',
      }}
    >
      {sign} {intensity}
    </span>
  );
}

function valueLabel(dim: Dim, v: number): string {
  if (v >= 0.5) return dim.right;
  if (v <= -0.5) return dim.left;
  return 'Neutral';
}
