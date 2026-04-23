import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { GoogleGenAI, Chat } from "@google/genai";

/* ------------------------------------------------------------------ */
/*  1. APP CONTEXT – Tailored for AI Sphere.                           */
/* ------------------------------------------------------------------ */
const BOT_NAME = "Tauhid D. Luffy";

const APP_CONTEXT = `
You are "${BOT_NAME}", a friendly, concise in-app assistant embedded
inside the AI Sphere web app. Your job is to help users understand and
use AI Sphere. Always stay on-topic; if a user asks something unrelated,
politely redirect them back to the app. If someone asks your name, say
it is ${BOT_NAME}.

=== ABOUT THE APP ===
Name: AI Sphere
One-line pitch: An interactive 3D map of the top AI influencers on X
(Twitter) — explore who they are, what they do, and how they're
connected.
Live site: https://x.mitbunny.ai
Target users: Anyone trying to navigate the AI community on X —
newcomers who want to figure out which accounts to follow, and
existing users who want to visualize the AI ecosystem.

=== CORE EXPERIENCE ===
AI Sphere renders a 3D force-directed graph (powered by Three.js +
react-force-graph-3d) of a curated shortlist of the most influential AI
voices on X (~50 people by default). Nodes are people (founders,
researchers, investors) and links are "follows" relationships between
them. Node size reflects follower count.

=== UI LAYOUT ===
- 3D graph fills the background — drag to rotate, scroll to zoom,
  click a node to select it.
- Left sidebar: ranked list of influencers (sorted by followers) with a
  search box. Toggle open/closed with the menu button on the left edge.
- Right (floating) card: appears when a node is selected, shows the
  X-style profile (avatar, bio, follower counts) plus an AI Sentiment
  Analysis card with four dimensions (Regulation, AI Usage, Trust vs.
  Risk, AI Agents) and an overall AI Trends outlook
  (optimistic / pessimistic / neutral), inferred via Gemini from the
  person's bio and focus areas.
- Legend (bottom-right on desktop, top-right on mobile): filter by
  category — Founder / Builder (blue), Researcher / Academia (purple),
  Investor (green). Click a category to filter; click again to clear.
- Methodology modal: accessible from the Legend. Explains how the
  shortlist was selected (seed accounts, follow-graph crawl,
  Score = log10(followers) x seed_connections, min 1K followers, AI
  keywords in bio).
- Creator card: at the bottom of the left sidebar — shows Jenny
  (@Jenny_the_Bunny), the creator of the project.

=== KEY WORKFLOWS ===
1. Find an influencer:
   - Type a name, handle, role, or focus area in the sidebar search box.
   - Or scroll the ranked list and click the person.
2. See how someone connects to others:
   - Click their node in the 3D graph; connected follows are
     highlighted. Click empty space to clear the selection.
3. Filter by role:
   - Open the Legend and click Founder, Researcher, or Investor.
4. Check someone's AI stance:
   - Select a node; the Sentiment Analysis card loads four inferred
     dimensions plus an overall outlook.
5. Follow someone on X:
   - Use the "Follow" button on the profile card; it opens their X page.

=== COMMON QUESTIONS ===
Q: What do node sizes and colors mean?
A: Size ≈ follower count. Color = category: blue Founder / Builder,
purple Researcher / Academia, green Investor.

Q: Where does the data come from?
A: A Node.js + RapidAPI (X/Twitter) pipeline seeded from major AI labs
and researchers, scored by log10(followers) × seed_connections, with an
AI-keyword filter.

Q: Is AI Sphere free?
A: Yes — it's an open project by Jenny (@Jenny_the_Bunny on X).

Q: How is sentiment inferred?
A: Google's Gemini model reads the person's role, bio, and focus tags
and returns four -1..+1 scores plus an outlook label. It's an
inference, not a direct quote.

Q: How do I contact the creator?
A: DM @Jenny_the_Bunny on X, or click "Hit me up on X" in the
Methodology modal.

=== STYLE & TONE ===
- Friendly, clear, and brief (2–4 short sentences by default).
- Use bullet points for step-by-step instructions.
- If you don't know something, say so and point the user to the
  Methodology modal or @Jenny_the_Bunny on X.
- Never invent features that aren't listed above.
`.trim();

/* ------------------------------------------------------------------ */
/*  2. API KEY – AI Sphere's vite.config.ts exposes GEMINI_API_KEY as  */
/*  both process.env.API_KEY and process.env.GEMINI_API_KEY.           */
/* ------------------------------------------------------------------ */
const API_KEY: string =
  (typeof process !== "undefined" &&
    process.env &&
    (process.env.API_KEY || process.env.GEMINI_API_KEY)) ||
  "";

const MODEL_NAME = "gemini-2.5-flash";

const BOT_AVATAR = "/chatbot-logo.png";

type ChatMessage = {
  role: "user" | "model";
  content: string;
};

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "model",
      content: `Hi, I'm ${BOT_NAME} — your guide to AI Sphere. Ask me how to find an influencer, what the colors mean, or how the sentiment analysis works.`,
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatSessionRef = useRef<Chat | null>(null);

  const getChatSession = (): Chat => {
    if (chatSessionRef.current) return chatSessionRef.current;
    if (!API_KEY) {
      throw new Error(
        "Missing Gemini API key. Set GEMINI_API_KEY in .env.local."
      );
    }
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    chatSessionRef.current = ai.chats.create({
      model: MODEL_NAME,
      config: {
        systemInstruction: APP_CONTEXT,
        temperature: 0.4,
        maxOutputTokens: 512,
      },
    });
    return chatSessionRef.current;
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus();
  }, [isOpen]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    setError("");
    setMessages((m) => [...m, { role: "user", content: text }]);
    setInput("");
    setIsLoading(true);

    try {
      const chat = getChatSession();
      const result = await chat.sendMessage({ message: text });
      const reply = result.text ?? "";
      setMessages((m) => [...m, { role: "model", content: reply }]);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Something went wrong.");
      setMessages((m) => [
        ...m,
        {
          role: "model",
          content:
            "Sorry — I ran into an error reaching the AI service. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Action Button — bottom-right, sits directly below the
          Legend sector on desktop. */}
      <button
        type="button"
        aria-label={isOpen ? "Close chat" : "Open chat"}
        onClick={() => setIsOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 shadow-lg shadow-indigo-500/30 transition hover:scale-105 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300"
      >
        {isOpen ? (
          <span className="text-2xl text-white">×</span>
        ) : (
          <span className="block h-9 w-9 overflow-hidden rounded-full bg-[#b6dba1]">
            <img
              src={BOT_AVATAR}
              alt="Chatbot"
              draggable={false}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
              className="h-full w-full scale-[1.04] object-cover object-center"
            />
          </span>
        )}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          aria-hidden="true"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Chat window */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="AI assistant"
          className="fixed bottom-24 right-6 z-50 flex h-[32rem] w-[22rem] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0B0C15] text-white shadow-2xl sm:w-96"
        >
          {/* Header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 overflow-hidden rounded-full bg-[#b6dba1] ring-2 ring-white/60">
                <img
                  src={BOT_AVATAR}
                  alt="Chatbot"
                  draggable={false}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display =
                      "none";
                  }}
                  className="h-full w-full scale-[1.04] object-cover object-center"
                />
              </div>
              <div>
                <p className="text-sm font-semibold leading-none">{BOT_NAME}</p>
                <p className="text-[11px] opacity-80">Powered by Gemini</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              className="rounded-full p-1 text-white/80 transition hover:bg-white/20 hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 space-y-3 overflow-y-auto bg-[#05060A] px-4 py-4"
          >
            {messages.map((msg, i) => (
              <MessageBubble key={i} role={msg.role} content={msg.content} />
            ))}
            {isLoading && <TypingIndicator />}
          </div>

          {error && (
            <div className="bg-red-950/60 px-4 py-1 text-[11px] text-red-300">
              {error}
            </div>
          )}

          {/* Input */}
          <div className="border-t border-white/10 bg-[#0B0C15] p-3">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about AI Sphere…"
                className="max-h-28 flex-1 resize-none rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500/60 focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
              >
                Send
              </button>
            </div>
            <p className="mt-1 text-[10px] text-slate-500">
              Press Enter to send · Shift+Enter for newline
            </p>
          </div>
        </div>
      )}
    </>
  );
}

function MessageBubble({ role, content }: { role: "user" | "model"; content: string }) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={[
          "max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2 text-sm shadow-sm",
          isUser
            ? "rounded-br-sm bg-indigo-600 text-white"
            : "rounded-bl-sm border border-white/10 bg-slate-900/70 text-slate-100",
        ].join(" ")}
      >
        {content}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm border border-white/10 bg-slate-900/70 px-3 py-2 shadow-sm">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-400 [animation-delay:-0.3s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-400 [animation-delay:-0.15s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-400" />
      </div>
    </div>
  );
}
