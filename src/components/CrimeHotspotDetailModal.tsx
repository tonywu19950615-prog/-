import React from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Clock,
  PhoneCall,
  Navigation,
  Compass,
  X,
  Bus,
  Flame,
  Info,
  CheckCircle2
} from 'lucide-react';
import { CrimeIncidentPoint, SafetyShelter } from '../types';

interface CrimeHotspotDetailModalProps {
  hotspot: CrimeIncidentPoint | null;
  onClose: () => void;
  shelters: SafetyShelter[];
  onNavigateToShelter: (shelter: SafetyShelter) => void;
}

export const CrimeHotspotDetailModal: React.FC<CrimeHotspotDetailModalProps> = ({
  hotspot,
  onClose,
  shelters,
  onNavigateToShelter,
}) => {
  if (!hotspot) return null;

  const linkedShelter = shelters.find((s) => s.id === hotspot.recommendedShelterId) || shelters[0];

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'extreme':
        return {
          bg: 'bg-rose-500/20 text-rose-300 border-rose-500/50',
          dot: 'bg-rose-500 animate-pulse',
          label: '極高風險紅色極熱區'
        };
      case 'high':
        return {
          bg: 'bg-amber-500/20 text-amber-300 border-amber-500/50',
          dot: 'bg-amber-500 animate-pulse',
          label: '高風險警戒區 (橙紅)'
        };
      default:
        return {
          bg: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50',
          dot: 'bg-yellow-500',
          label: '中度關注區 (黃色)'
        };
    }
  };

  const badge = getRiskBadge(hotspot.riskLevel);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="relative p-5 border-b border-slate-800 bg-gradient-to-r from-rose-950/60 via-slate-900 to-amber-950/40">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black border tracking-wide uppercase shadow-sm bg-rose-900/40 text-rose-300 border-rose-500/40">
              <Flame className="w-3.5 h-3.5 text-rose-400 fill-rose-500" />
              台北夜間治安歷史熱點剖析
            </span>
            <span className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${badge.bg}`}>
              <span className={`w-2 h-2 rounded-full ${badge.dot}`}></span>
              {badge.label}
            </span>
          </div>

          <h3 className="text-xl font-black text-white leading-tight">
            {hotspot.name}
          </h3>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
            <span>轄區行政區：{hotspot.district}</span>
            <span>•</span>
            <span>熱度加權指數：{(hotspot.intensity * 100).toFixed(0)} / 100</span>
          </p>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-5 text-sm custom-scrollbar">
          {/* Key Metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
              <div className="text-[11px] text-slate-400">年度110通報件數</div>
              <div className="text-xl font-black text-rose-400 mt-0.5">
                {hotspot.annualIncidentCount} <span className="text-xs font-normal text-slate-400">件/年</span>
              </div>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
              <div className="text-[11px] text-slate-400">好發尖峰時段</div>
              <div className="text-sm font-black text-amber-300 mt-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{hotspot.peakHours}</span>
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1 bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
              <div className="text-[11px] text-slate-400">熱區影響半徑</div>
              <div className="text-lg font-black text-sky-400 mt-0.5">
                約 {hotspot.radiusMeters} <span className="text-xs font-normal text-slate-400">公尺</span>
              </div>
            </div>
          </div>

          {/* Historical Incident Types Breakdown */}
          <div className="bg-slate-850/80 border border-slate-700/60 rounded-xl p-4">
            <h4 className="text-xs font-black text-slate-200 mb-3 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                歷史夜間報案類型分佈統計
              </span>
              <span className="text-[10px] text-slate-400">臺北市警察局報案資料加權</span>
            </h4>

            <div className="space-y-3">
              {hotspot.mainIncidentTypes.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-200">{item.type}</span>
                    <span className="font-mono font-black text-rose-300">{item.percentage}%</span>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-amber-500 to-rose-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Safety Advisory Banner */}
          <div className="bg-amber-950/30 border border-amber-600/40 rounded-xl p-3.5 flex gap-3 text-amber-200 text-xs">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-amber-300 mb-1">警方防範與夜歸安全指引</div>
              <p className="text-amber-200/90 leading-relaxed">
                {hotspot.safetyAdvice}
              </p>
            </div>
          </div>

          {/* Police Precinct & Patrol */}
          <div className="bg-slate-800/80 rounded-xl p-3.5 border border-slate-700/60 flex items-center justify-between">
            <div>
              <div className="text-[11px] text-slate-400">轄區警政單位</div>
              <div className="text-sm font-bold text-white mt-0.5">{hotspot.policePrecinct.station}</div>
              <div className="text-[11px] text-emerald-400 mt-0.5 font-medium">
                🛡️ {hotspot.policePrecinct.patrolFrequency}
              </div>
            </div>
            <a
              href={`tel:${hotspot.policePrecinct.phone}`}
              className="flex items-center gap-1.5 px-3 py-2 bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 border border-blue-500/40 rounded-xl font-bold text-xs transition shrink-0"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              直撥派出所
            </a>
          </div>

          {/* Linked Mochi Shelter Recommendation */}
          {linkedShelter && (
            <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-4 flex items-center justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-600 text-slate-950 font-black shrink-0 mt-0.5">
                  <Bus className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-emerald-300">守護避難據點</span>
                    <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-1.5 py-0.2 rounded border border-emerald-500/30">
                      30人庇護車
                    </span>
                  </div>
                  <div className="text-sm font-bold text-white mt-0.5">{linkedShelter.name}</div>
                  <div className="text-[11px] text-slate-400 line-clamp-1">{linkedShelter.locationDescription}</div>
                </div>
              </div>

              <button
                onClick={() => {
                  onNavigateToShelter(linkedShelter);
                  onClose();
                }}
                className="flex items-center gap-1 px-3 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition cursor-pointer shrink-0"
              >
                <Navigation className="w-3.5 h-3.5 fill-current" />
                避難導航
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
          >
            關閉檢視
          </button>
        </div>
      </div>
    </div>
  );
};
