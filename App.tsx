import { useState, useMemo, useRef, useEffect } from 'react';
import Graph3D from './components/Graph3D';
import AIChatbot from './components/AIChatbot';
import { ProfileCardsRow } from './components/ProfileCards';
import CareerMobility from './components/CareerMobility';
import SentimentEvolutionChart from './components/SentimentEvolutionChart';
import TopicChips from './components/TopicChips';
import { INITIAL_DATA, LAST_UPDATED } from './constants';
import { GraphData, GraphLink, GraphNode, SentimentScores } from './types';
import { analyzeSentiment } from './services/geminiService';
import { X as XIcon, ChevronLeft, ChevronRight, Menu, Search, HelpCircle } from 'lucide-react';

export default function App() {
  const [data] = useState<GraphData>(INITIAL_DATA);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
  const [isLegendOpen, setIsLegendOpen] = useState(true);
  const [showMethodology, setShowMethodology] = useState(false);

  // Selection State
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Sentiment Analysis State
  const [sentimentScores, setSentimentScores] = useState<SentimentScores | null>(null);
  const [sentimentLoading, setSentimentLoading] = useState(false);
  const sentimentCache = useRef<Map<string, SentimentScores>>(new Map());

  // Refs for scrolling
  const listContainerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  // Handle responsive layout
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Auto-close sidebar on mobile, auto-open on desktop
      if (mobile && isSidebarOpen && window.innerWidth < 768) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Only show individual categories — exclude company and media
  const INDIVIDUAL_GROUPS = new Set(['founder', 'researcher', 'investor']);

  // 1. Calculate Statistics & Sort Nodes by Followers (or connections as fallback)
  const sortedNodes = useMemo(() => {
    const counts = new Map<string, number>();

    data.links.forEach(link => {
        const s = typeof link.source === 'object' ? (link.source as any).id : link.source;
        const t = typeof link.target === 'object' ? (link.target as any).id : link.target;
        counts.set(s, (counts.get(s) || 0) + 1);
        counts.set(t, (counts.get(t) || 0) + 1);
    });

    return [...data.nodes]
      .filter(node => INDIVIDUAL_GROUPS.has(node.group))
      .map(node => ({
        ...node,
        val: counts.get(node.id) || 0
      })).sort((a, b) => (b.followers || b.val || 0) - (a.followers || a.val || 0));

  }, [data]);

  // Create a map of node ID to original rank (1-based)
  const nodeRankMap = useMemo(() => {
    const map = new Map<string, number>();
    sortedNodes.forEach((node, idx) => {
      map.set(node.id, idx + 1);
    });
    return map;
  }, [sortedNodes]);

  // Filter nodes based on search query and selected category
  const filteredNodes = useMemo(() => {
    let nodes = sortedNodes;

    if (selectedCategory) {
      nodes = nodes.filter(node => node.group === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      nodes = nodes.filter(node => {
        const name = (node.name || '').toLowerCase();
        const handle = (node.handle || '').toLowerCase();
        const role = (node.role || '').toLowerCase();
        const associated = (node.associated || '').toLowerCase();
        const bio = (node.bio || '').toLowerCase();
        const bioTags = ((node as any).bioTags || []).join(' ').toLowerCase();

        return name.includes(query) ||
               handle.includes(query) ||
               role.includes(query) ||
               associated.includes(query) ||
               bio.includes(query) ||
               bioTags.includes(query);
      });
    }

    return nodes;
  }, [sortedNodes, searchQuery, selectedCategory]);

  // Build filtered graph data — always exclude company/media, optionally filter by category
  const filteredGraphData = useMemo(() => {
    const baseNodes = data.nodes.filter(n => INDIVIDUAL_GROUPS.has(n.group));
    const baseNodeIds = new Set(baseNodes.map(n => n.id));

    const filteredNodeIds = selectedCategory
      ? new Set(baseNodes.filter(n => n.group === selectedCategory).map(n => n.id))
      : baseNodeIds;

    return {
      nodes: baseNodes.filter(n => filteredNodeIds.has(n.id)),
      links: data.links.filter(link => {
        const sId = typeof link.source === 'object' ? (link.source as any).id : link.source;
        const tId = typeof link.target === 'object' ? (link.target as any).id : link.target;
        return filteredNodeIds.has(sId) && filteredNodeIds.has(tId);
      }),
    };
  }, [data, selectedCategory]);

  // Scroll to selected node in the sidebar
  useEffect(() => {
    if (selectedNode && itemRefs.current.has(selectedNode.id)) {
      const element = itemRefs.current.get(selectedNode.id);
      element?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [selectedNode]);

  // Fetch sentiment when a node is selected
  useEffect(() => {
    if (!selectedNode) {
      setSentimentScores(null);
      return;
    }
    const cached = sentimentCache.current.get(selectedNode.id);
    if (cached) {
      setSentimentScores(cached);
      return;
    }
    setSentimentScores(null);
    setSentimentLoading(true);
    analyzeSentiment(selectedNode).then(scores => {
      setSentimentLoading(false);
      if (scores) {
        sentimentCache.current.set(selectedNode.id, scores);
        setSentimentScores(scores);
      }
    });
  }, [selectedNode?.id]);

  // Per-node connection counts used in the X snapshot card (Network links stat).
  const connectionCountMap = useMemo(() => {
    const map = new Map<string, number>();
    data.links.forEach((link: GraphLink) => {
      const s = typeof link.source === 'object' ? (link.source as any).id : link.source;
      const t = typeof link.target === 'object' ? (link.target as any).id : link.target;
      map.set(s, (map.get(s) || 0) + 1);
      map.set(t, (map.get(t) || 0) + 1);
    });
    return map;
  }, [data]);

  // Sentiment bar for a single dimension
  const SentimentBar = ({ label, value, leftLabel, rightLabel }: {
    label: string; value: number; leftLabel: string; rightLabel: string;
  }) => {
    const pct = ((value + 1) / 2) * 100;
    return (
      <div className="mb-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium text-slate-300">{label}</span>
        </div>
        <div className="relative h-1.5 bg-slate-700/60 rounded-full">
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-indigo-400 shadow-[0_0_6px_rgba(129,140,248,0.8)] transition-all duration-500"
            style={{ left: `${pct}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-slate-500">{leftLabel}</span>
          <span className="text-[10px] text-slate-500">{rightLabel}</span>
        </div>
      </div>
    );
  };

  const handleNodeClick = (node: GraphNode) => {
    if (selectedNode?.id === node.id) {
      setSelectedNode(null);
      return;
    }
    setSelectedNode(node);
    // Auto-close sidebar on mobile when selecting a node
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  const closeSelection = () => {
    setSelectedNode(null);
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(prev => prev === category ? null : category);
    setSelectedNode(null);
  };

  return (
    <div className="w-full h-screen relative overflow-hidden bg-[#0B0C15] text-white font-sans">
      
      {/* 3D Graph Layer */}
      <Graph3D
        data={filteredGraphData}
        onNodeClick={handleNodeClick}
        onClearSelection={closeSelection}
        selectedNode={selectedNode}
        keepOrphans={!!selectedCategory}
      />

      {/* LEFT SIDEBAR - RANKED LIST */}
      <div
        className={`absolute top-0 left-0 h-full bg-[#05060A]/80 backdrop-blur-xl border-r border-white/10 z-30 transition-all duration-300 ease-in-out flex flex-col ${isMobile ? (isSidebarOpen ? 'w-72 translate-x-0' : 'w-72 -translate-x-72') : (isSidebarOpen ? 'w-80 translate-x-0' : 'w-80 -translate-x-80')}`}
      >
        <div className="px-4 py-3 border-b border-white/10 bg-[#05060A]/50">
            <h1 className="text-xl font-display font-bold text-white tracking-tight">Top AI Influencers on X</h1>
            <p className="text-xs text-slate-400 mt-0.5">Data last updated: {LAST_UPDATED}</p>
        </div>

        {/* Search Bar */}
        <div className="p-3 border-b border-white/10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, handle, or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <XIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Scrollable List */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 custom-scrollbar">
            {filteredNodes.map((node, idx) => {
                const isSelected = selectedNode?.id === node.id;
                return (
                    <button
                        key={node.id}
                        ref={(el) => {
                            if (el) itemRefs.current.set(node.id, el);
                            else itemRefs.current.delete(node.id);
                        }}
                        onClick={() => handleNodeClick(node)}
                        className={`w-full text-left p-3 rounded-xl mb-1 flex items-center gap-3 transition-all duration-200 border ${isSelected ? 'bg-indigo-600/20 border-indigo-500/50 shadow-lg shadow-indigo-900/20' : 'hover:bg-white/5 border-transparent'}`}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${isSelected ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                           {nodeRankMap.get(node.id)}
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="flex items-baseline gap-1.5 truncate">
                                <span className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                                    {node.name}
                                </span>
                                {node.handle && (
                                    <span className="text-xs text-slate-500 font-mono truncate">
                                        @{node.handle}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center justify-between gap-2 mt-0.5">
                                <span className="text-xs text-slate-500 truncate flex-1">
                                    {node.role
                                      ? `${node.role}${node.associated && node.associated !== node.name ? ` @ ${node.associated}` : ''}`
                                      : '\u00A0'}
                                </span>
                                <span className="text-[10px] text-slate-600 whitespace-nowrap shrink-0">
                                    {node.followers
                                      ? node.followers >= 1000000
                                        ? `${(node.followers / 1000000).toFixed(1)}M`
                                        : `${Math.round(node.followers / 1000)}K`
                                      : `${node.val} conn.`}
                                </span>
                            </div>
                        </div>
                    </button>
                )
            })}
        </div>

        {/* Creator Profile */}
        <div className="border-t border-white/10 bg-[#05060A]/50 px-4 py-3 text-center">
          <span className="text-xs text-slate-500">Created by WoW</span>
        </div>
      </div>

      {/* Sidebar Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={`absolute top-6 z-40 p-2 bg-slate-800/80 text-white border border-white/10 rounded-r-lg hover:bg-slate-700 transition-all duration-300 ${isMobile ? (isSidebarOpen ? 'left-72' : 'left-0') : (isSidebarOpen ? 'left-80' : 'left-0')}`}
      >
        {isSidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
      </button>


      {/* FLOATING DETAILS CARD (Replacing Right Sidebar) */}
      {selectedNode && (
        <div className={`fixed z-50 animate-in fade-in duration-300 pointer-events-none flex flex-col gap-2.5 overflow-y-auto details-panel-scroll ${isMobile ? 'bottom-20 left-4 right-4 max-h-[calc(100vh-160px)]' : `top-6 right-6 w-[580px] max-w-[calc(100vw-48px)] max-h-[calc(100vh-48px)] slide-in-from-right-10`}`}>

                {/* Row 1 — X snapshot + LinkedIn snapshot side-by-side */}
                <ProfileCardsRow
                    node={selectedNode}
                    connectionCount={connectionCountMap.get(selectedNode.id) || 0}
                    onClose={closeSelection}
                />

                {/* Row 2 — Career Mobility timeline */}
                <CareerMobility personId={selectedNode.id} />

                {/* Row 3 — AI Sentiment (Gemini) + Sentiment Evolution chart */}
                <div className="bg-[#090A10]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl pointer-events-auto p-3.5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-white">AI Sentiment</h3>
                      <span className="text-[9px] font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 rounded-full">Gemini</span>
                    </div>
                    {sentimentLoading && (
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    )}
                  </div>

                  {sentimentLoading && !sentimentScores && (
                    <p className="text-xs text-slate-500 italic">Analyzing profile…</p>
                  )}

                  {sentimentScores && (
                    <>
                      {/* AI Trends badge */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs text-slate-400">AI Trends Outlook:</span>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          sentimentScores.trends === 'optimistic'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : sentimentScores.trends === 'pessimistic'
                            ? 'bg-red-500/20 text-red-300'
                            : 'bg-slate-500/20 text-slate-300'
                        }`}>
                          {sentimentScores.trends.charAt(0).toUpperCase() + sentimentScores.trends.slice(1)}
                        </span>
                      </div>

                      <SentimentBar
                        label="Regulation"
                        value={sentimentScores.regulation}
                        leftLabel="Against"
                        rightLabel="Pro"
                      />
                      <SentimentBar
                        label="AI Usage"
                        value={sentimentScores.usage}
                        leftLabel="Restrictive"
                        rightLabel="Enthusiastic"
                      />
                      <SentimentBar
                        label="Trust vs. Risk"
                        value={sentimentScores.trust}
                        leftLabel="High Risk"
                        rightLabel="High Trust"
                      />
                      <SentimentBar
                        label="AI Agents"
                        value={sentimentScores.agent}
                        leftLabel="Skeptical"
                        rightLabel="Bullish"
                      />
                      <p className="text-[10px] text-slate-600 mt-2 italic">Inferred from bio & focus areas via Gemini</p>
                    </>
                  )}

                  {!sentimentLoading && !sentimentScores && (
                    <p className="text-xs text-slate-500 italic">No API key configured for sentiment analysis.</p>
                  )}

                  {/* Sentiment evolution across career (static curated data) */}
                  <SentimentEvolutionChart personId={selectedNode.id} />
                </div>

                {/* Row 4 — AI Topics chips */}
                <TopicChips topics={selectedNode.bioTags} />

        </div>
      )}

      {/* Legend */}
      <div className={`absolute z-20 bg-[#0B0C15]/80 backdrop-blur-md border border-white/10 rounded-xl transition-all duration-300 ease-in-out ${isMobile ? 'top-4 right-4' : 'bottom-24 right-6'} ${isLegendOpen ? 'p-4' : 'p-2'}`}>
        <button
          onClick={() => setIsLegendOpen(!isLegendOpen)}
          className="flex items-center gap-2 w-full text-left"
        >
          <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">Legend</div>
          <ChevronRight className={`w-3 h-3 text-slate-400 transition-transform duration-300 ${isLegendOpen ? 'rotate-90' : ''}`} />
        </button>
        <div className={`flex flex-col gap-1 overflow-hidden transition-all duration-300 ease-in-out ${isLegendOpen ? 'mt-3 max-h-60 opacity-100' : 'max-h-0 opacity-0'}`}>
          {[
            { key: 'founder', color: '#A3D4FF', label: 'Founder / Builder' },
            { key: 'researcher', color: '#E0B3FF', label: 'Researcher / Academia' },
            { key: 'investor', color: '#B3FFB3', label: 'Investor' },
          ].map(cat => (
            <button
              key={cat.key}
              onClick={() => handleCategoryClick(cat.key)}
              className={`flex items-center gap-2 px-2 py-1 rounded-md transition-all duration-200 text-left ${selectedCategory === cat.key ? 'bg-white/10 ring-1 ring-white/20' : 'hover:bg-white/5'} ${selectedCategory && selectedCategory !== cat.key ? 'opacity-40' : 'opacity-100'}`}
            >
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color, boxShadow: `0 0 8px ${cat.color}` }} />
              <span className="text-xs text-slate-300">{cat.label}</span>
            </button>
          ))}
          {selectedCategory && (
            <button
              onClick={() => { setSelectedCategory(null); setSelectedNode(null); }}
              className="text-[10px] text-indigo-400 hover:text-indigo-300 transition-colors mt-1 px-2"
            >
              Clear filter
            </button>
          )}
          <div className="border-t border-white/10 my-2" />
          <button
            onClick={() => setShowMethodology(true)}
            className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Methodology</span>
          </button>
        </div>
      </div>

      {/* Methodology Modal */}
      {showMethodology && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowMethodology(false)}
          />

          {/* Modal */}
          <div className="relative bg-[#0B0C15] border border-white/10 rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto custom-scrollbar">
            {/* Header */}
            <div className="sticky top-0 bg-[#0B0C15] border-b border-white/10 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Methodology</h2>
              <button
                onClick={() => setShowMethodology(false)}
                className="p-1.5 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="px-5 py-3 space-y-2.5">
              <div>
                <h3 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1">Discovery & Selection</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Starting from <span className="text-white font-medium">seed accounts</span> (OpenAI, Anthropic, DeepMind, top researchers), we crawl who they follow to find AI voices. If multiple trusted sources follow someone, they matter. The shortlist is then scored by:
                </p>
                <div className="bg-slate-800/50 border border-white/10 rounded-md px-2.5 py-1.5 font-mono text-xs text-white mt-1.5 mb-1">
                  Score = log<sub>10</sub>(followers) x seed_connections
                </div>
                <p className="text-xs text-slate-400">
                  Log scale prevents mega-accounts from dominating. Minimum 1K followers, AI keywords in bio, blocklist for general media.
                </p>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1">Graph & Connections</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  The default view shows all connections. <span className="text-white font-medium">Click a node</span> to see who they follow. Node sizes reflect followers. Filter by category using the legend.
                </p>
              </div>

              <div className="pt-2 border-t border-white/10">
                <p className="text-xs text-slate-400">
                  This methodology may not be perfect. Have ideas?{' '}
                  <a
                    href="https://x.com/Jenny_the_Bunny"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:text-indigo-300"
                  >
                    Hit me up on X
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
        .details-panel-scroll { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.12) transparent; }
        .details-panel-scroll::-webkit-scrollbar { width: 4px; }
        .details-panel-scroll::-webkit-scrollbar-track { background: transparent; }
        .details-panel-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 4px; }
        @keyframes moveRight {
          0% { left: -6px; }
          100% { left: calc(100% + 6px); }
        }
      `}</style>

      {/* In-app AI assistant (Gemini-powered) */}
      <AIChatbot />
    </div>
  );
}