"use client";

import { useState, useEffect } from "react";
import {
  Link2,
  User,
  Zap,
  Copy,
  Trash2,
  Clock,
  CheckCheck,
  ArrowRight,
  Sparkles,
  Shield,
  History,
  WandSparkles,
  Github,
} from "lucide-react";

interface HistoryItem {
  id: string;
  original: string;
  cleaned: string;
  timestamp: number;
}

export default function URLCleaner() {
  const githubRepoUrl = "https://github.com/a-elhaag/impactify";
  const githubIssuesUrl = `${githubRepoUrl}/issues`;
  const githubContributingUrl = `${githubRepoUrl}#readme`;

  const [url, setUrl] = useState("");
  const [contributorId, setContributorId] = useState("");
  const [cleanedUrl, setCleanedUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [copiedHistoryId, setCopiedHistoryId] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("contributorId");
    if (saved) setContributorId(saved);
    const savedHistory = localStorage.getItem("urlHistory");
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch {
        /* ignore */
      }
    }
  }, []);

  useEffect(() => {
    if (contributorId) localStorage.setItem("contributorId", contributorId);
  }, [contributorId]);

  useEffect(() => {
    localStorage.setItem("urlHistory", JSON.stringify(history));
  }, [history]);

  const cleanUrl = () => {
    if (!url.trim()) return;
    try {
      const urlObj = new URL(url);
      [
        "utm_source",
        "utm_medium",
        "utm_campaign",
        "utm_content",
        "utm_term",
        "fbclid",
        "gclid",
        "msclkid",
        "click_id",
        "gtm_source",
        "Campaign",
        "ref",
        "referrer",
        "source",
        "medium",
      ].forEach((p) => urlObj.searchParams.delete(p));

      let result = urlObj.toString();
      if (contributorId) {
        result += `${result.includes("?") ? "&" : "?"}contributor=${encodeURIComponent(contributorId)}`;
      }
      setCleanedUrl(result);

      // LRU dedup — bump existing match to top, never duplicate.
      setHistory((prev) => {
        const existingIdx = prev.findIndex((i) => i.cleaned === result);
        const entry: HistoryItem = {
          id: existingIdx !== -1 ? prev[existingIdx].id : Date.now().toString(),
          original: url,
          cleaned: result,
          timestamp: Date.now(),
        };
        const rest =
          existingIdx !== -1 ? prev.filter((_, i) => i !== existingIdx) : prev;
        return [entry, ...rest.slice(0, 9)];
      });
    } catch {
      /* invalid url */
    }
  };

  const copyToClipboard = async (text: string, historyId?: string) => {
    try {
      await navigator.clipboard.writeText(text);
      if (historyId) {
        setCopiedHistoryId(historyId);
        setTimeout(() => setCopiedHistoryId(null), 2000);
      } else {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      /* ignore */
    }
  };

  const featureCards = [
    {
      icon: <Shield size={14} />,
      title: "Cuts tracking noise",
      description:
        "Removes UTM, fbclid, gclid, msclkid, ref, and other junk params.",
    },
    {
      icon: <User size={14} />,
      title: "Keeps your contributor tag",
      description: "Adds your contributor ID only after the URL is cleaned.",
    },
    {
      icon: <History size={14} />,
      title: "Keeps recent work tidy",
      description: "Stores up to 10 unique links locally without duplicates.",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl">
      <section className="soft-panel relative overflow-hidden rounded-[2.25rem] px-6 py-7 sm:px-8 sm:py-9 lg:px-10">
        <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-white/40 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 bottom-0 h-40 w-40 rounded-full bg-[#1d86dc]/10 blur-3xl" />

        <div className="relative grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
          <div>
            <div className="soft-chip inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">
              <WandSparkles size={14} />
              Cleaner Studio
            </div>

            <div className="mt-5 flex items-center gap-4">
              <div className="soft-icon flex h-14 w-14 items-center justify-center rounded-[1.25rem] text-[var(--primary)]">
                <Zap size={24} strokeWidth={2.4} />
              </div>
              <div>
                <h1 className="text-4xl font-black tracking-[-0.05em] sm:text-5xl lg:text-6xl">
                  Impactify
                </h1>
                <p
                  className="mt-2 max-w-2xl text-sm leading-7 sm:text-base"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  Clean ugly tracking URLs, keep your contributor tag, and copy
                  a polished link without the visual mess.
                </p>
              </div>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {featureCards.map((feature) => (
                <div
                  key={feature.title}
                  className="soft-inset rounded-[1.5rem] p-4 sm:p-5"
                >
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-2xl bg-white/55 text-[var(--primary)] shadow-[inset_1px_1px_0_rgba(255,255,255,0.7)]">
                    {feature.icon}
                  </div>
                  <p className="text-sm font-bold tracking-[-0.02em]">
                    {feature.title}
                  </p>
                  <p
                    className="mt-2 text-xs leading-6"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            <div className="soft-panel-sm rounded-[1.5rem] p-4">
              <p
                className="text-xs font-semibold uppercase tracking-[0.18em]"
                style={{ color: "var(--muted-foreground)" }}
              >
                Cleaner
              </p>
              <p className="mt-3 text-2xl font-black tracking-[-0.05em]">14+</p>
              <p
                className="mt-1 text-xs leading-5"
                style={{ color: "var(--muted-foreground)" }}
              >
                common tracking parameters removed
              </p>
            </div>
            <div className="soft-panel-sm rounded-[1.5rem] p-4">
              <p
                className="text-xs font-semibold uppercase tracking-[0.18em]"
                style={{ color: "var(--muted-foreground)" }}
              >
                Storage
              </p>
              <p className="mt-3 text-2xl font-black tracking-[-0.05em]">
                Local
              </p>
              <p
                className="mt-1 text-xs leading-5"
                style={{ color: "var(--muted-foreground)" }}
              >
                contributor ID and recent links stay in your browser
              </p>
            </div>
            <div className="soft-panel-sm rounded-[1.5rem] p-4">
              <p
                className="text-xs font-semibold uppercase tracking-[0.18em]"
                style={{ color: "var(--muted-foreground)" }}
              >
                History
              </p>
              <p className="mt-3 text-2xl font-black tracking-[-0.05em]">10</p>
              <p
                className="mt-1 text-xs leading-5"
                style={{ color: "var(--muted-foreground)" }}
              >
                deduplicated links kept ready to copy
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 soft-panel rounded-[2rem] p-6 sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
          <div>
            <div className="flex items-center gap-3">
              <div className="soft-icon flex h-11 w-11 items-center justify-center rounded-[1rem] text-[var(--primary)]">
                <Link2 size={18} />
              </div>
              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-[0.18em]"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  Link Generator
                </p>
                <h2 className="mt-1 text-2xl font-black tracking-[-0.04em]">
                  Paste, clean, and ship
                </h2>
              </div>
            </div>

            <div className="mt-7 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold">URL</label>
                <div className="soft-inset relative rounded-[1.5rem] px-4 py-3">
                  <div className="absolute left-4 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-2xl bg-white/55 text-[var(--primary)] shadow-[inset_1px_1px_0_rgba(255,255,255,0.8)]">
                    <Link2 size={15} />
                  </div>
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && cleanUrl()}
                    placeholder="https://example.com?utm_source=email"
                    className="soft-input h-12 w-full bg-transparent pl-12 pr-2 text-sm sm:text-[15px]"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Contributor ID
                </label>
                <div className="soft-inset relative rounded-[1.5rem] px-4 py-3">
                  <div className="absolute left-4 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-2xl bg-white/55 text-[var(--primary)] shadow-[inset_1px_1px_0_rgba(255,255,255,0.8)]">
                    <User size={15} />
                  </div>
                  <input
                    type="text"
                    value={contributorId}
                    onChange={(e) => setContributorId(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && cleanUrl()}
                    placeholder="your-contributor-id"
                    className="soft-input h-12 w-full bg-transparent pl-12 pr-2 text-sm sm:text-[15px]"
                  />
                </div>
                <p
                  className="mt-3 flex items-center gap-2 text-xs font-medium"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  <Sparkles size={12} />
                  Saved locally so you do not need to retype it.
                </p>
              </div>

              <button
                onClick={cleanUrl}
                className="soft-button-primary flex h-14 w-full items-center justify-center gap-2 rounded-[1.5rem] text-sm font-bold sm:text-[15px]"
              >
                <Zap size={16} strokeWidth={2.3} />
                Generate Clean Link
                <ArrowRight size={16} strokeWidth={2.3} />
              </button>
            </div>
          </div>

          <div className="soft-inset rounded-[1.75rem] p-5 sm:p-6 lg:min-h-full">
            <div className="flex items-center justify-between gap-4 border-b pb-4 soft-divider">
              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-[0.18em]"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  Clean URL
                </p>
                <p className="mt-1 text-sm font-bold tracking-[-0.02em]">
                  {cleanedUrl ? "Ready to copy" : "Waiting for your link"}
                </p>
              </div>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                  cleanedUrl
                    ? "bg-emerald-500/10 text-emerald-600"
                    : "bg-slate-500/10 text-slate-500"
                }`}
              >
                <CheckCheck size={12} />
                {cleanedUrl ? "Ready" : "Idle"}
              </span>
            </div>

            {cleanedUrl ? (
              <>
                <div className="mt-4 rounded-[1.25rem] bg-white/35 px-4 py-4 shadow-[inset_1px_1px_0_rgba(255,255,255,0.7)]">
                  <p
                    className="break-all font-mono text-xs leading-7 sm:text-sm"
                    style={{ color: "var(--foreground)" }}
                  >
                    {cleanedUrl}
                  </p>
                </div>

                <button
                  onClick={() => copyToClipboard(cleanedUrl)}
                  className={`mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-[1.25rem] text-sm font-bold transition-all ${
                    copied
                      ? "bg-emerald-500 text-white shadow-[0_14px_28px_rgba(34,197,94,0.28)]"
                      : "soft-button-secondary"
                  }`}
                >
                  {copied ? <CheckCheck size={14} /> : <Copy size={14} />}
                  {copied ? "Copied" : "Copy Clean Link"}
                </button>
              </>
            ) : (
              <div className="flex min-h-[16rem] flex-col items-center justify-center text-center">
                <div className="soft-icon flex h-14 w-14 items-center justify-center rounded-[1.25rem] text-[var(--primary)]">
                  <WandSparkles size={20} />
                </div>
                <h3 className="mt-5 text-xl font-black tracking-[-0.04em]">
                  Clean link preview
                </h3>
                <p
                  className="mt-2 max-w-sm text-sm leading-7"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  Add a URL and contributor ID, then generate the final link.
                  The cleaned result will appear here.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mt-6">
        <aside className="soft-panel rounded-[2rem] p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4 border-b pb-4 soft-divider">
            <div className="flex items-center gap-3">
              <div className="soft-icon flex h-10 w-10 items-center justify-center rounded-[1rem] text-[var(--primary)]">
                <Clock size={16} />
              </div>
              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-[0.18em]"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  History
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <h2 className="text-2xl font-black tracking-[-0.04em]">
                    Recent Links
                  </h2>
                  <span
                    className="soft-chip rounded-full px-2.5 py-1 text-xs font-bold"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    {history.length}
                  </span>
                </div>
              </div>
            </div>

            {history.length > 0 && (
              <button
                onClick={() => setHistory([])}
                className="soft-button-secondary flex h-11 items-center gap-2 rounded-[1rem] px-4 text-sm font-semibold text-slate-500 hover:text-rose-500"
              >
                <Trash2 size={14} />
                Clear
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <div className="flex min-h-[26rem] flex-col items-center justify-center text-center">
              <div className="soft-icon flex h-16 w-16 items-center justify-center rounded-[1.5rem] text-[var(--primary)]">
                <History size={24} />
              </div>
              <h3 className="mt-5 text-xl font-black tracking-[-0.04em]">
                Nothing stored yet
              </h3>
              <p
                className="mt-2 max-w-xs text-sm leading-7"
                style={{ color: "var(--muted-foreground)" }}
              >
                Generate your first clean link and it will appear here in a
                stronger, easier-to-scan layout.
              </p>
            </div>
          ) : (
            <div className="history-scroll mt-5 max-h-[34rem] space-y-4 overflow-y-auto pr-1">
              {history.map((item) => (
                <article
                  key={item.id}
                  className="soft-inset rounded-[1.75rem] p-4 sm:p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p
                        className="text-[15px] font-black leading-8 tracking-[-0.03em] sm:text-base"
                        style={{ color: "var(--foreground)" }}
                      >
                        {item.cleaned}
                      </p>
                      <div
                        className="mt-4 flex items-center gap-2 text-xs font-semibold"
                        style={{ color: "var(--muted-foreground)" }}
                      >
                        <Clock size={11} />
                        {new Date(item.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-end gap-2">
                    <button
                      onClick={() => copyToClipboard(item.cleaned, item.id)}
                      className={`flex h-11 items-center gap-2 rounded-[1rem] px-4 text-sm font-bold transition-all ${
                        copiedHistoryId === item.id
                          ? "bg-emerald-500 text-white shadow-[0_12px_24px_rgba(34,197,94,0.24)]"
                          : "soft-button-secondary text-[var(--primary)]"
                      }`}
                    >
                      {copiedHistoryId === item.id ? (
                        <CheckCheck size={14} />
                      ) : (
                        <Copy size={14} />
                      )}
                      {copiedHistoryId === item.id ? "Copied" : "Copy"}
                    </button>
                    <button
                      onClick={() =>
                        setHistory((h) => h.filter((i) => i.id !== item.id))
                      }
                      className="soft-button-secondary flex h-11 w-11 items-center justify-center rounded-[1rem] text-slate-500 hover:text-rose-500"
                      aria-label="Delete history item"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </aside>
      </section>

      <div className="mt-5 flex flex-col items-center justify-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left">
        <div className="flex items-center justify-center gap-2 sm:justify-start">
          <div className="soft-icon flex h-6 w-6 items-center justify-center rounded-lg text-[var(--primary)]">
            <Zap size={11} />
          </div>
          <p
            className="text-xs font-medium"
            style={{ color: "var(--muted-foreground)" }}
          >
            <span className="font-bold" style={{ color: "var(--foreground)" }}>
              Impactify
            </span>
            {" · "}Cleaner links with local-only history
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-end">
          <a
            href={githubIssuesUrl}
            target="_blank"
            rel="noreferrer"
            className="soft-button-secondary inline-flex h-10 items-center gap-2 rounded-[1rem] px-4 text-xs font-semibold"
          >
            <Github size={14} />
            Issues
          </a>
          <a
            href={githubContributingUrl}
            target="_blank"
            rel="noreferrer"
            className="soft-button-secondary inline-flex h-10 items-center gap-2 rounded-[1rem] px-4 text-xs font-semibold"
          >
            <Github size={14} />
            Contributing
          </a>
        </div>
      </div>
    </div>
  );
}
