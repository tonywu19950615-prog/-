import React, { useState } from 'react';
import {
  AlertTriangle,
  RefreshCw,
  Compass,
  ChevronRight,
  Globe,
  Radio,
  Clock,
  ExternalLink,
  X,
  ShieldAlert
} from 'lucide-react';
import { TrafficEvent } from '../types';

interface TrafficMonitorBannerProps {
  events: TrafficEvent[];
  activeEvent: TrafficEvent | null;
  onOpenDetourModal: (event?: TrafficEvent) => void;
  onRefreshEvents: () => void;
  isRefreshing?: boolean;
}

export const TrafficMonitorBanner: React.FC<TrafficMonitorBannerProps> = ({
  events,
  activeEvent,
  onOpenDetourModal,
  onRefreshEvents,
  isRefreshing = false,
}) => {
  const [isDismissed, setIsDismissed] = useState(false);

  const displayEvent = activeEvent || events[0];
  if (!displayEvent) return null;

  if (isDismissed) {
    return (
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
        <button
          onClick={() => setIsDismissed(false)}
          className="bg-slate-900/90 hover:bg-slate-800 text-amber-300 hover:text-white border border-amber-500/50 backdrop-blur-md px-3 py-1 rounded-full shadow-lg text-[11px] font-bold flex items-center gap-1.5 transition cursor-pointer"
        >
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          <span>Google 即時路況監測 ({events.length}起熱區管制)</span>
        </button>
      </div>
    );
  }

  return (
    <div className="absolute top-2.5 left-2 right-2 sm:left-auto sm:right-auto sm:left-1/2 sm:-translate-x-1/2 z-30 max-w-xl w-[96%] sm:w-auto pointer-events-auto animate-slide-down">
      <div className="bg-slate-900/95 backdrop-blur-md border border-amber-500/70 rounded-2xl p-2.5 sm:px-3.5 shadow-[0_0_25px_rgba(245,158,11,0.25)] text-xs text-white space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          {/* Status Badge */}
          <div className="flex items-center gap-2">
            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              <span>Google Search 即時監測</span>
            </span>
            <span className="text-[10px] text-slate-400 hidden xs:inline">
              台北大型活動與交通管制
            </span>
          </div>

          {/* Action buttons (Refresh & Close) */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={onRefreshEvents}
              disabled={isRefreshing}
              className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition cursor-pointer"
              title="重新透過 Google Search 檢索最新交通管制"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
            </button>
            <button
              onClick={() => setIsDismissed(true)}
              className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition cursor-pointer"
              title="收合監測橫幅"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Incident Summary & Detour Trigger */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-0.5">
          <div className="flex items-start gap-2 max-w-md">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="truncate">
              <div className="font-bold text-white text-xs truncate">
                【{displayEvent.hotspotName}】{displayEvent.title}
              </div>
              <p className="text-[11px] text-amber-200/90 truncate">
                避開管制：{displayEvent.detour.avoidStreets.join('、')}
              </p>
            </div>
          </div>

          <button
            onClick={() => onOpenDetourModal(displayEvent)}
            className="shrink-0 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black px-3 py-1.5 rounded-xl text-xs flex items-center justify-center gap-1 shadow-md transition cursor-pointer active:scale-95"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>查看安全繞路指引</span>
          </button>
        </div>
      </div>
    </div>
  );
};
