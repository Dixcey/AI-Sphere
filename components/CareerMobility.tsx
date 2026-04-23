import React from 'react';
import { Briefcase } from 'lucide-react';
import { careerHistory } from '../data/profileExtras';

interface CareerMobilityProps {
  personId: string;
}

/**
 * Horizontal career timeline (oldest → newest), visually matching the
 * "Career Mobility" block in `preview.html`.
 */
export default function CareerMobility({ personId }: CareerMobilityProps) {
  const history = careerHistory[personId];

  return (
    <div className="bg-[#090A10]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl px-3.5 py-3 pointer-events-auto">
      <div className="flex items-center gap-2 mb-2.5">
        <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
        <h3 className="text-xs font-semibold text-white">Career Mobility</h3>
      </div>

      {!history || history.length === 0 ? (
        <p className="text-[11px] text-slate-600 italic">No career data available.</p>
      ) : (
        <div className="flex items-start gap-0 overflow-x-auto career-timeline-scroll pb-0.5">
          {/* careerHistory is stored newest→oldest; reverse so the timeline reads left-to-right */}
          {[...history].reverse().map((step, i, arr) => {
            const isLast = i === arr.length - 1;
            return (
              <div key={`${step.y}-${step.c}-${i}`} className="flex flex-col items-center relative" style={{ flex: 1, minWidth: 90 }}>
                <div className="flex items-center w-full mb-1.5">
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: '#6366f1', boxShadow: '0 0 6px rgba(99,102,241,0.6)' }}
                  />
                  {isLast ? (
                    <div className="flex-1 flex items-center">
                      <div className="flex-1 h-px" style={{ background: 'rgba(99,102,241,0.6)' }} />
                      <div
                        style={{
                          width: 0,
                          height: 0,
                          borderTop: '4px solid transparent',
                          borderBottom: '4px solid transparent',
                          borderLeft: '6px solid rgba(99,102,241,0.8)',
                        }}
                      />
                    </div>
                  ) : (
                    <div className="flex-1 h-px" style={{ background: 'rgba(99,102,241,0.3)' }} />
                  )}
                </div>
                <div className="text-center px-1 w-full">
                  <div className="text-[9px] text-indigo-400 font-mono mb-0.5">{step.y}</div>
                  <div className="text-[11px] font-semibold text-white leading-tight mb-0.5">{step.c}</div>
                  <div className="text-[9px] text-slate-400 leading-tight">{step.r}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        .career-timeline-scroll { scrollbar-width: none; }
        .career-timeline-scroll::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
