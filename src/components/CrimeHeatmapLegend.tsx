import React, { useState } from 'react';
import { Flame, ShieldAlert, ChevronDown, ChevronUp, Eye, EyeOff, Sliders, Info } from 'lucide-react';
import { CrimeIncidentPoint } from '../types';

interface CrimeHeatmapLegendProps {
  showHeatmap: boolean;
  onToggleHeatmap: () => void;
  opacity: number;
  onChangeOpacity: (val: number) => void;
  hotspots: CrimeIncidentPoint[];
  onSelectHotspot: (hotspot: CrimeIncidentPoint) => void;
}

export const CrimeHeatmapLegend: React.FC<CrimeHeatmapLegendProps> = ({
  showHeatmap,
  onToggleHeatmap,
  opacity,
  onChangeOpacity,
  hotspots,
  onSelectHotspot,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="absolute bottom-6 left-4 z-20 max-w-[280px] sm:max-w-[320px] bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl shadow-2xl text-slate-100 overflow-hidden text-xs transition-all duration-300">
      {/* Header bar / Main Toggle */}
      <div className="p-2.5 flex items-center justify-between gap-2 border-b border-slate-800">
        <button
          onClick={onToggleHeatmap}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-black text-xs transition cursor-pointer shadow-sm border ${
            showHeatmap
              ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white border-rose-400 shadow-rose-900/40'
              : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
          }`}
          title="切換顯示台北夜間治安歷史熱點密度熱圖"
        >
          <Flame className={`w-4 h-4 ${showHeatmap ? 'text-amber-200 fill-amber-300 animate-pulse' : 'text-slate-500'}`} />
          <span>治安熱區熱圖</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${showHeatmap ? 'bg-black/30 text-white' : 'bg-slate-700 text-slate-400'}`}>
            {showHeatmap ? '開啟中' : '關閉'}
          </span>
        </button>

        {showHeatmap && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
            title={isExpanded ? '收合圖例面板' : '展開圖例與透明度調整'}
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Expanded details */}
      {showHeatmap && (
        <div className={`p-3 space-y-2.5 ${isExpanded ? 'block' : 'hidden sm:block'}`}>
          {/* Subtitle & source */}
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>歷史 110 案發密度加權 ({hotspots.length} 處熱區)</span>
            <span className="text-[10px] text-amber-400/90 font-mono">22:00-06:00</span>
          </div>

          {/* Color Scale Gradient Bar */}
          <div className="space-y-1">
            <div className="h-2.5 w-full rounded-full bg-gradient-to-r from-emerald-500 via-amber-400 via-rose-500 to-purple-600 shadow-inner"></div>
            <div className="flex justify-between text-[10px] text-slate-400 font-medium px-0.5">
              <span>低密度常態</span>
              <span className="text-amber-300">中度警戒</span>
              <span className="text-rose-400 font-bold">極高風險熱區</span>
            </div>
          </div>

          {/* Opacity Control */}
          <div className="bg-slate-800/60 p-2 rounded-xl flex items-center justify-between gap-2 border border-slate-700/40">
            <span className="text-[11px] text-slate-300 flex items-center gap-1">
              <Sliders className="w-3 h-3 text-slate-400" />
              熱圖透明度
            </span>
            <div className="flex items-center gap-1.5 flex-1 max-w-[120px]">
              <input
                type="range"
                min="0.3"
                max="1.0"
                step="0.05"
                value={opacity}
                onChange={(e) => onChangeOpacity(parseFloat(e.target.value))}
                className="w-full accent-rose-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] font-mono text-slate-300 w-7 text-right">
                {Math.round(opacity * 100)}%
              </span>
            </div>
          </div>

          {/* Quick list of critical hotspots */}
          {isExpanded && (
            <div className="pt-1 border-t border-slate-800 space-y-1.5 max-h-36 overflow-y-auto custom-scrollbar">
              <div className="text-[10px] font-bold text-slate-400">點擊聚焦高風險聚落：</div>
              {hotspots.slice(0, 6).map((h) => (
                <button
                  key={h.id}
                  onClick={() => onSelectHotspot(h)}
                  className="w-full text-left p-1.5 rounded-lg bg-slate-850 hover:bg-slate-800 transition flex items-center justify-between gap-1 border border-slate-750/50"
                >
                  <span className="text-[11px] text-slate-200 truncate">{h.name}</span>
                  <span
                    className={`text-[9px] px-1 py-0.2 rounded font-bold shrink-0 ${
                      h.riskLevel === 'extreme'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {h.annualIncidentCount}件
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
