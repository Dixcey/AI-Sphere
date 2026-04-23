import React from 'react';
import { Tag } from 'lucide-react';

interface TopicChipsProps {
  topics?: string[];
}

/**
 * Renders the influencer's `bioTags` as pill chips, matching the
 * "AI Topics They Follow" section in `preview.html`.
 */
export default function TopicChips({ topics }: TopicChipsProps) {
  if (!topics || topics.length === 0) return null;
  return (
    <div className="bg-[#090A10]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl px-3.5 py-3 pointer-events-auto">
      <div className="flex items-center gap-2 mb-2">
        <Tag className="w-3.5 h-3.5 text-indigo-400" />
        <h3 className="text-xs font-semibold text-white">AI Topics They Follow</h3>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {topics.map(t => (
          <span
            key={t}
            className="text-[11px] px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-medium"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
