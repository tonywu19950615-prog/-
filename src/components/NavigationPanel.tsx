import React, { useState } from 'react';
import {
  Navigation,
  Clock,
  MapPin,
  ExternalLink,
  X,
  ShieldCheck,
  ChevronRight,
  PhoneCall,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { RouteInfo, SafetyShelter, Venue } from '../types';
import { formatDistance } from '../utils/geo';

interface NavigationPanelProps {
  route: RouteInfo;
  shelter?: SafetyShelter | null;
  venue?: Venue | null;
  onClose: () => void;
  onOpenSOS: () => void;
}

export const NavigationPanel: React.FC<NavigationPanelProps> = ({
  route,
  shelter,
  venue,
  onClose,
  onOpenSOS,
}) => {
  const [safeWalkActive, setSafeWalkActive] = useState(true);
  const [checkedSteps, setCheckedSteps] = useState<number[]>([]);

  const isShelter = route.destinationType === 'shelter';
  const isDetour = route.isDetour;
  const destinationCoords = route.coordinates[route.coordinates.length - 1];

  const handleStepToggle = (index: number) => {
    if (checkedSteps.includes(index)) {
      setCheckedSteps(checkedSteps.filter((i) => i !== index));
    } else {
      setCheckedSteps([...checkedSteps, index]);
    }
  };

  const googleMapsUrl = destinationCoords
    ? `https://www.google.com/maps/dir/?api=1&destination=${destinationCoords[0]},${destinationCoords[1]}&travelmode=walking`
    : '#';

  const isPolice = route.destinationType === 'police';
  const isHospital = route.destinationType === 'hospital';

  const getHeaderGradient = () => {
    if (isDetour) return 'bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700';
    if (isShelter) return 'bg-gradient-to-r from-emerald-600 to-teal-700';
    if (isPolice) return 'bg-gradient-to-r from-blue-700 to-indigo-800';
    if (isHospital) return 'bg-gradient-to-r from-rose-700 to-red-800';
    return 'bg-gradient-to-r from-blue-600 to-indigo-700';
  };

  const getNavTitle = () => {
    if (isDetour) return '⚠️ 安全繞路導航中';
    if (isShelter) return '安全庇護所路線導航';
    if (isPolice) return '👮 派出所安全路線導航';
    if (isHospital) return '🏥 24H急診室緊急導航';
    return '酒吧夜店路線導航';
  };

  return (
    <div className={`bg-slate-900 border-2 ${
      isDetour ? 'border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.3)]' : (
        isHospital ? 'border-rose-500/80 shadow-2xl' : (isPolice ? 'border-blue-500/80 shadow-2xl' : 'border-emerald-500/80 shadow-2xl')
      )
    } rounded-2xl text-white overflow-hidden flex flex-col max-h-[85vh] animate-slide-up`}>
      {/* Top Banner */}
      <div className={`px-4 py-3 flex items-center justify-between ${getHeaderGradient()}`}>
        <div className="flex items-center gap-2">
          {isDetour ? (
            <AlertTriangle className="w-5 h-5 text-white animate-bounce" />
          ) : (
            <Navigation className="w-5 h-5 animate-pulse text-white" />
          )}
          <div>
            <div className="text-[10px] font-bold tracking-wider text-amber-100 uppercase flex items-center gap-1">
              <span>{getNavTitle()}</span>
              {isDetour && (
                <span className="bg-amber-300 text-slate-950 px-1 rounded text-[9px] font-black">避開管制</span>
              )}
            </div>
            <h3 className="text-base font-black truncate max-w-[240px]">
              {route.destinationName}
            </h3>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-full bg-black/20 hover:bg-black/40 text-white transition cursor-pointer"
          aria-label="結束導航"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Detour Reason Banner */}
      {isDetour && (
        <div className="bg-amber-950/60 border-b border-amber-500/40 p-2.5 px-3.5 space-y-1 text-xs">
          <div className="font-bold text-amber-300 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>避開突發擁擠與交通管制路段</span>
          </div>
          <p className="text-[11px] text-amber-100/90 leading-tight">
            {route.detourReason || '已自動重新規劃安全動線，避開人潮推擠與車流管制。'}
          </p>
          {route.avoidStreets && route.avoidStreets.length > 0 && (
            <div className="text-[10px] text-red-300 font-medium pt-0.5">
              🚫 避免路段：{route.avoidStreets.join('、')}
            </div>
          )}
        </div>
      )}

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-2 bg-slate-800/90 border-b border-slate-700 p-3 text-center">
        <div className="border-r border-slate-700 flex flex-col items-center justify-center">
          <div className="flex items-center gap-1 text-emerald-400 font-bold text-xs">
            <Clock className="w-3.5 h-3.5" />
            <span>預估步行</span>
          </div>
          <div className="text-xl font-black text-white mt-0.5">
            約 {route.durationMinutes} <span className="text-xs font-normal">分鐘</span>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center gap-1 text-cyan-400 font-bold text-xs">
            <MapPin className="w-3.5 h-3.5" />
            <span>總步行距離</span>
          </div>
          <div className="text-xl font-black text-white mt-0.5">
            {formatDistance(route.distanceMeters)}
          </div>
        </div>
      </div>

      {/* Safe Walk Companion Mode Toggle */}
      <div className="p-3.5 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-slate-200">
              夜行安全守護模式
            </span>
          </div>
          <button
            onClick={() => setSafeWalkActive(!safeWalkActive)}
            className={`text-[11px] font-bold px-2 py-0.5 rounded-full transition cursor-pointer ${
              safeWalkActive
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/50'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            {safeWalkActive ? '● 守護中' : '○ 已暫停'}
          </button>
        </div>

        {safeWalkActive && (
          <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-lg p-2.5 text-[11px] text-emerald-200/90 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-emerald-300">
              <span>💡 夜間行走指引：</span>
            </div>
            <ul className="list-disc list-inside space-y-0.5 pl-1 text-[11px] text-slate-300">
              <li>請優先走大馬路人行道與監視器涵蓋熱點（避免暗巷）</li>
              <li>注意身後動態，如有人尾隨立即就近進入便利店或麻糬號</li>
              <li>隨時保持一鍵報警就緒狀態</li>
            </ul>
          </div>
        )}
      </div>

      {/* Turn-by-Turn Steps */}
      <div className="p-3.5 overflow-y-auto space-y-2 flex-1">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
          <span>路徑轉向導引</span>
          <span className="text-[10px] text-slate-500 font-normal">點擊標記已走過路段</span>
        </div>

        {route.steps.map((step, idx) => {
          const isDone = checkedSteps.includes(idx);
          return (
            <div
              key={idx}
              onClick={() => handleStepToggle(idx)}
              className={`p-2.5 rounded-xl border text-xs flex items-start gap-2.5 transition cursor-pointer ${
                isDone
                  ? 'bg-slate-900/60 border-slate-800 text-slate-500 line-through'
                  : 'bg-slate-850 hover:bg-slate-800 border-slate-700/80 text-slate-200'
              }`}
            >
              <div className="mt-0.5">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : (
                  <span className="flex items-center justify-center w-4 h-4 rounded-full bg-slate-700 text-[10px] font-bold text-slate-300">
                    {idx + 1}
                  </span>
                )}
              </div>
              <div className="flex-1 leading-relaxed">{step}</div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500 mt-0.5 shrink-0" />
            </div>
          );
        })}
      </div>

      {/* Actions Footer */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 space-y-2">
        <div className="flex gap-2">
          {/* External Google Maps Walking Directions Deep Link */}
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition border border-slate-700"
          >
            <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
            <span>開啟 Google 地圖導航</span>
          </a>

          {/* Emergency SOS quick launcher */}
          <button
            onClick={onOpenSOS}
            className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs py-2.5 px-3.5 rounded-xl flex items-center justify-center gap-1 transition shadow-lg cursor-pointer shrink-0"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>一鍵報警</span>
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full text-center text-xs text-slate-400 hover:text-slate-200 py-1 transition cursor-pointer"
        >
          結束並清除地圖導航路線
        </button>
      </div>
    </div>
  );
};
