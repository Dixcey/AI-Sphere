import React, { useMemo } from 'react';
import { BadgeCheck, Building2, MapPin, X as XIcon } from 'lucide-react';
import { GraphNode } from '../types';
import { linkedinExtras, linkedinSlugFromUrl, linkedinUrls } from '../data/profileExtras';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const GROUP_BANNERS: Record<string, string> = {
  founder:    'linear-gradient(135deg, rgba(30, 64, 175, .55), rgba(15, 15, 40, .6))',
  researcher: 'linear-gradient(135deg, rgba(88, 28, 135, .55), rgba(15, 15, 40, .6))',
  investor:   'linear-gradient(135deg, rgba(6, 78, 59, .55), rgba(15, 15, 40, .6))',
};

const GROUP_BADGE_CLASS: Record<string, string> = {
  founder:    'bg-[#A3D4FF]/15 text-[#A3D4FF]',
  researcher: 'bg-[#E0B3FF]/15 text-[#E0B3FF]',
  investor:   'bg-[#B3FFB3]/15 text-[#B3FFB3]',
  company:    'bg-slate-500/15 text-slate-300',
  media:      'bg-slate-500/15 text-slate-300',
};

function formatFollowers(n?: number): string {
  if (!n) return '0';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${Math.round(n / 1_000)}K`;
  return `${n}`;
}

function twitterAvatar(handle?: string, name?: string): string {
  if (handle) return `https://unavatar.io/twitter/${handle}`;
  const fallbackName = encodeURIComponent(name || 'AI');
  return `https://ui-avatars.com/api/?name=${fallbackName}&background=1e293b&color=cbd5e1&size=128`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Inline SVG icons (use the same glyphs as preview.html so the card visuals
// stay consistent with the static preview)
// ─────────────────────────────────────────────────────────────────────────────

function XLogo({ className = 'w-3.5 h-3.5', fill = 'white' }: { className?: string; fill?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill={fill}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.912-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInLogo({ className = 'w-3.5 h-3.5', fill = '#0A66C2' }: { className?: string; fill?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill={fill}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function CloseIcon({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute top-2 right-2 p-1 bg-black/40 hover:bg-black/60 rounded-full text-white/70 hover:text-white transition-colors z-20"
      aria-label="Close details"
    >
      <XIcon className="w-3.5 h-3.5" />
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// X (Twitter) profile snapshot
// ─────────────────────────────────────────────────────────────────────────────

interface XProfileCardProps {
  node: GraphNode;
  connectionCount: number;
  onClose: () => void;
  /** Whether to render the close button on this card (used when LinkedIn card is hidden) */
  showClose: boolean;
}

export function XProfileCard({ node, connectionCount, onClose, showClose }: XProfileCardProps) {
  const bannerStyle = { background: GROUP_BANNERS[node.group] || GROUP_BANNERS.founder };
  const badgeClass = GROUP_BADGE_CLASS[node.group] || 'bg-slate-500/15 text-slate-300';

  return (
    <div className="bg-[#090A10]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl pointer-events-auto overflow-hidden h-full flex flex-col">
      {/* Banner */}
      <div className="h-12 relative flex-shrink-0" style={bannerStyle}>
        <div className="absolute inset-0 bg-gradient-to-t from-[#090A10]/80 to-transparent" />
        <div className="absolute top-2 left-3 flex items-center">
          <XLogo className="w-3.5 h-3.5 flex-shrink-0 relative z-10" />
        </div>
        {showClose && <CloseIcon onClick={onClose} />}
      </div>

      {/* Body */}
      <div className="px-3 pb-3 flex flex-col flex-1">
        {/* Name info on left, avatar on right (overflows banner with -mt-6) */}
        <div className="flex justify-between items-start">
          <div className="mt-2 mb-1.5 flex-1 min-w-0">
            <h2 className="text-sm font-bold text-white leading-tight mb-0 truncate flex items-center gap-1">
              {node.name}
              {node.verified === 'gold' && <BadgeCheck className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20 flex-shrink-0" />}
              {node.verified === 'blue' && <BadgeCheck className="w-3.5 h-3.5 text-blue-400 fill-blue-400/20 flex-shrink-0" />}
            </h2>
            {node.handle && <div className="text-slate-500 text-[10px] mb-1 truncate">@{node.handle}</div>}
            {(node.group || node.role) && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${badgeClass}`}>
                  {node.group.charAt(0).toUpperCase() + node.group.slice(1)}
                </span>
                {node.role && (
                  <span className="text-[10px] text-slate-400 truncate max-w-[160px]">
                    {node.role}
                    {node.associated && node.associated !== node.name ? ` · ${node.associated}` : ''}
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="relative -mt-6 mb-1.5 ml-2 flex-shrink-0">
            <img
              src={twitterAvatar(node.handle, node.name)}
              alt={node.name}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(node.name)}&background=1e293b&color=cbd5e1&size=128`;
              }}
              className="w-12 h-12 rounded-full border-[3px] border-[#090A10] object-cover bg-slate-800 shadow-lg"
            />
          </div>
        </div>

        {/* Bio */}
        {node.bio && (
          <p className="text-[10px] text-slate-300 leading-relaxed mb-2 line-clamp-3">{node.bio}</p>
        )}

        {/* Stats */}
        <div className="flex gap-3 pt-1 border-t border-white/5 mb-2">
          <div className="text-center">
            <div className="font-bold text-white text-xs">{formatFollowers(node.followers)}</div>
            <div className="text-slate-600 text-[9px]">Followers</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-white text-xs">{connectionCount}</div>
            <div className="text-slate-600 text-[9px]">Network links</div>
          </div>
        </div>

        {/* Follow on X button — pinned to card bottom so both cards align */}
        <div className="mt-auto pt-1">
          {node.handle && (
            <a
              href={`https://x.com/${node.handle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-white/90 text-black font-semibold text-[10px] rounded-full transition-all"
            >
              <XLogo className="w-2.5 h-2.5" fill="currentColor" />
              Follow on X
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LinkedIn profile snapshot
// ─────────────────────────────────────────────────────────────────────────────

interface LinkedInProfileCardProps {
  node: GraphNode;
  onClose: () => void;
}

export function LinkedInProfileCard({ node, onClose }: LinkedInProfileCardProps) {
  const liUrl = linkedinUrls[node.id] ?? null;
  const extras = linkedinExtras[node.id];

  const avatarSrc = useMemo(() => {
    const slug = linkedinSlugFromUrl(liUrl);
    const initialsFallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(node.name)}&background=0a3d6b&color=5aaaf0&size=128`;
    const twitterFallback = node.handle
      ? `https://unavatar.io/twitter/${node.handle}?fallback=${encodeURIComponent(initialsFallback)}`
      : initialsFallback;
    return slug
      ? `https://unavatar.io/linkedin/${slug}?fallback=${encodeURIComponent(twitterFallback)}`
      : twitterFallback;
  }, [liUrl, node.handle, node.name]);

  if (!liUrl) return null;

  return (
    <div className="bg-[#090A10]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl pointer-events-auto overflow-hidden h-full flex flex-col">
      {/* Banner */}
      <div
        className="h-12 relative flex-shrink-0"
        style={{ background: 'linear-gradient(135deg, rgba(10,102,194,0.35), rgba(10,10,25,0.6))' }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#090A10]/80 to-transparent" />
        <div className="absolute top-2 left-3 flex items-center">
          <LinkedInLogo className="w-3.5 h-3.5 flex-shrink-0 relative z-10" />
        </div>
        <CloseIcon onClick={onClose} />
      </div>

      {/* Body */}
      <div className="px-3 pb-3 flex flex-col flex-1">
        <div className="flex justify-between items-start">
          <div className="mt-2 mb-1.5 flex-1 min-w-0">
            <div className="text-sm font-bold text-white leading-tight mb-0 truncate">{node.name}</div>
            {node.role && <div className="text-[10px] text-slate-400 mb-0.5 truncate">{node.role}</div>}
            {node.associated && (
              <div className="flex items-center gap-1 text-[10px] text-slate-500 mb-1.5">
                <Building2 className="w-2.5 h-2.5 flex-shrink-0" />
                <span className="truncate">{node.associated}</span>
              </div>
            )}
          </div>
          <div className="relative -mt-6 mb-1.5 ml-2 flex-shrink-0">
            <img
              src={avatarSrc}
              alt={node.name}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(node.name)}&background=0a3d6b&color=5aaaf0&size=128`;
              }}
              className="w-12 h-12 rounded-full border-[3px] border-[#090A10] object-cover bg-slate-800 shadow-lg"
            />
          </div>
        </div>

        {/* Bio */}
        {node.bio && (
          <p className="text-[10px] text-slate-300 leading-relaxed mb-2 line-clamp-3">{node.bio}</p>
        )}

        {/* Stats */}
        <div className="flex gap-3 pt-1 border-t border-white/5 mb-2">
          <div className="text-center">
            <div className="font-bold text-white text-xs">{extras?.connections ?? '500+'}</div>
            <div className="text-slate-600 text-[9px]">Connections</div>
          </div>
          <div className="text-center flex items-center gap-1">
            <MapPin className="w-2.5 h-2.5 text-slate-600" />
            <div>
              <div className="font-bold text-white text-xs truncate max-w-[110px]">{extras?.location ?? '—'}</div>
              <div className="text-slate-600 text-[9px]">Location</div>
            </div>
          </div>
        </div>

        {/* View on LinkedIn button — pinned to card bottom so both cards align */}
        <div className="mt-auto pt-1">
          <a
            href={liUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#0A66C2]/20 hover:bg-[#0A66C2]/30 border border-[#0A66C2]/40 text-[#5AAAF0] font-semibold text-[10px] rounded-full transition-all"
          >
            <LinkedInLogo className="w-2.5 h-2.5" fill="currentColor" />
            View on LinkedIn
          </a>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Combined top row: X snapshot + LinkedIn snapshot (mirrors preview.html row 1)
// ─────────────────────────────────────────────────────────────────────────────

interface ProfileCardsRowProps {
  node: GraphNode;
  connectionCount: number;
  onClose: () => void;
}

export function ProfileCardsRow({ node, connectionCount, onClose }: ProfileCardsRowProps) {
  const hasLinkedIn = !!linkedinUrls[node.id];
  return (
    <div className="flex flex-col sm:flex-row gap-2.5 items-stretch">
      <div className="flex-1 min-w-0 flex">
        <div className="flex-1 min-w-0">
          <XProfileCard
            node={node}
            connectionCount={connectionCount}
            onClose={onClose}
            showClose={!hasLinkedIn}
          />
        </div>
      </div>
      {hasLinkedIn && (
        <div className="flex-1 min-w-0 flex">
          <div className="flex-1 min-w-0">
            <LinkedInProfileCard node={node} onClose={onClose} />
          </div>
        </div>
      )}
    </div>
  );
}
