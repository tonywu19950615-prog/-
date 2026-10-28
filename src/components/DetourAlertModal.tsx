import React, { useState } from 'react';
import {
  AlertTriangle,
  Shield,
  Compass,
  Navigation,
  ExternalLink,
  X,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Globe,
  Radio,
  Search
} from 'lucide-react';
import { TrafficEvent, SafetyShelter } from '../types';
import { TRAFFIC_EVENTS } from '../data/trafficEvents';

interface DetourAlertModalProps {
  isOpen: boolean;
  event: TrafficEvent | null;
  onClose: () => void;
  onApplyDetour: (event: TrafficEvent) => void;
  allEvents?: TrafficEvent[];
  shelters?: SafetyShelter[];
}

export const DetourAlertModal: React.FC<DetourAlertModalProps> = ({
  isOpen,
  event,
  onClose,
  onApplyDetour,
  allEvents = TRAFFIC_EVENTS,
  shelters = [],
}) => {
  const [selectedEventId, setSelectedEventId] = useState<string>(event?.id || allEvents[0]?.id || '');

  if (!isOpen) return null;

  const currentEvent = allEvents.find(e => e.id === selectedEventId) || event || allEvents[0];
  if (!currentEvent) return null;

  return (
    <div className="fixed inset-0 z-[9700] flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-slate-900 border-2 border-amber-500/80 rounded-2xl shadow-[0_0_50px_rgba(245,158,11,0.3)] text-white overflow-hidden max-h-[92vh] flex flex-col">
        {/* Urgent Alert Header */}
        <div className="bg-gradient-to-r from-amber-600 via-rose-600 to-slate-900 px-5 py-4 flex items-center justify-between border-b border-amber-500/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg font-black shrink-0 animate-bounce">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-wide text-white">
                  突發狀況安全繞路提示
                </h3>
                <span className="bg-amber-300 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded shadow">
                  Google 即時監測
                </span>
              </div>
              <p className="text-[11px] text-amber-100">
                偵測到熱區附近有大型活動人潮或交通疏導管制，建議採取安全繞道
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full bg-black/30 hover:bg-black/50 text-white transition cursor-pointer"
            aria-label="關閉"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hotspots Switcher (5 Hotspots tabs) */}
        <div className="bg-slate-950 px-3 py-2 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs">
          <span className="text-[11px] text-slate-400 shrink-0 font-medium pl-1">
            熱區切換：
          </span>
          {allEvents.map((evt) => (
            <button
              key={evt.id}
              onClick={() => setSelectedEventId(evt.id)}
              className={`px-2.5 py-1 rounded-lg font-bold shrink-0 transition flex items-center gap-1.5 cursor-pointer ${
                currentEvent.id === evt.id
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${
                evt.severity === 'high' ? 'bg-rose-500 animate-pulse' : 'bg-amber-400'
              }`}></span>
              <span>{evt.hotspotName}</span>
            </button>
          ))}
        </div>

        {/* Event Detail & Detour Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs leading-relaxed flex-1">
          {/* Incident Overview Card */}
          <div className="p-3.5 bg-slate-800/90 border border-slate-700 rounded-xl space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping"></span>
                  <span>{currentEvent.type}</span>
                </span>
                <span className="text-slate-400 text-[11px]">{currentEvent.location}</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono font-medium">
                {currentEvent.updatedAt}
              </span>
            </div>

            <h4 className="text-sm font-black text-amber-200">
              {currentEvent.title}
            </h4>

            <p className="text-slate-300 text-[11px] leading-relaxed">
              {currentEvent.description}
            </p>

            <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-700/60">
              <span>通報來源：{currentEvent.source}</span>
              <a
                href={`https://www.google.com/search?q=${encodeURIComponent(currentEvent.googleSearchQuery)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition"
              >
                <span>Google 搜尋即時路況</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Road Comparison: Avoid vs Recommended */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Avoid Roads */}
            <div className="p-3 bg-red-950/40 border border-red-500/50 rounded-xl space-y-1.5">
              <div className="font-bold text-red-300 text-xs flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-red-500 text-slate-950 text-[10px] flex items-center justify-center font-black">
                  ✕
                </span>
                <span>建議避免行經路段 (擁擠/管制)</span>
              </div>
              <ul className="space-y-1 text-slate-300 text-[11px] pl-5 list-disc">
                {currentEvent.detour.avoidStreets.map((street, idx) => (
                  <li key={idx} className="text-red-200 font-medium">
                    {street}
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommended Safe Route */}
            <div className="p-3 bg-emerald-950/40 border border-emerald-500/50 rounded-xl space-y-1.5">
              <div className="font-bold text-emerald-300 text-xs flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-emerald-500 text-slate-950 text-[10px] flex items-center justify-center font-black">
                  ✓
                </span>
                <span>推薦安全繞道路線 (照明佳/安全)</span>
              </div>
              <ul className="space-y-1 text-slate-300 text-[11px] pl-5 list-disc">
                {currentEvent.detour.recommendedStreets.map((street, idx) => (
                  <li key={idx} className="text-emerald-200 font-medium">
                    {street}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Detour Advice Summary & Step-by-Step Directions */}
          <div className="p-3.5 bg-slate-950 rounded-xl border border-amber-500/40 space-y-2">
            <div className="flex items-center justify-between">
              <div className="font-bold text-amber-300 flex items-center gap-1.5 text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>安全繞道導引方案</span>
              </div>
              <span className="text-[10px] text-amber-400 font-mono font-bold bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
                預估僅增加約 {currentEvent.detour.extraMinutes} 分鐘
              </span>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed bg-slate-900 p-2.5 rounded-lg border border-slate-800">
              {currentEvent.detour.adviceSummary}
            </p>

            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                分步安全避難步行動線：
              </span>
              <div className="space-y-1.5">
                {currentEvent.detour.stepInstructions.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-[11px] text-slate-300">
                    <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5 border border-amber-500/40">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>避開管制與衝突熱區，直達「麻糬號」守護專車</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2 px-3.5 rounded-xl transition cursor-pointer"
            >
              略過提示
            </button>

            <button
              onClick={() => {
                onApplyDetour(currentEvent);
                onClose();
              }}
              className="flex-1 sm:flex-none bg-gradient-to-r from-amber-500 via-amber-600 to-emerald-600 hover:from-amber-400 hover:to-emerald-500 text-slate-950 font-black py-2 px-4 rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.5)] flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-95"
            >
              <Compass className="w-4 h-4" />
              <span>一鍵採用安全繞路導航</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
