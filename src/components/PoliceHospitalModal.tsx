import React from 'react';
import {
  Shield,
  Building2,
  PhoneCall,
  Navigation,
  Clock,
  MapPin,
  X,
  AlertCircle,
  HeartPulse,
  Crosshair
} from 'lucide-react';
import { PoliceStation, Hospital } from '../types';

interface PoliceHospitalModalProps {
  policeStation: PoliceStation | null;
  hospital: Hospital | null;
  onClose: () => void;
  onNavigateToPolice: (police: PoliceStation) => void;
  onNavigateToHospital: (hospital: Hospital) => void;
}

export const PoliceHospitalModal: React.FC<PoliceHospitalModalProps> = ({
  policeStation,
  hospital,
  onClose,
  onNavigateToPolice,
  onNavigateToHospital,
}) => {
  if (!policeStation && !hospital) return null;

  const isPolice = !!policeStation;
  const item = policeStation || hospital;

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div
          className={`relative p-5 border-b border-slate-800 ${
            isPolice
              ? 'bg-gradient-to-r from-blue-950/80 via-slate-900 to-indigo-950/50'
              : 'bg-gradient-to-r from-rose-950/80 via-slate-900 to-red-950/50'
          }`}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black border tracking-wide uppercase shadow-sm ${
                isPolice
                  ? 'bg-blue-900/60 text-blue-300 border-blue-500/50'
                  : 'bg-rose-900/60 text-rose-300 border-rose-500/50'
              }`}
            >
              {isPolice ? (
                <>
                  <Shield className="w-3.5 h-3.5 text-blue-400" />
                  臺北市政府警察局 派出所
                </>
              ) : (
                <>
                  <HeartPulse className="w-3.5 h-3.5 text-rose-400" />
                  24H 急診醫療責任醫院
                </>
              )}
            </span>

            <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/40">
              24小時全天候值勤
            </span>
          </div>

          <h3 className="text-xl font-black text-white leading-tight">
            {item.name}
          </h3>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{item.address}</span>
          </p>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-sm custom-scrollbar">
          {/* Quick Contact Box */}
          <div className="grid grid-cols-2 gap-2.5">
            <a
              href={`tel:${isPolice ? (item as PoliceStation).phone : (item as Hospital).phone}`}
              className="flex flex-col p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 transition group cursor-pointer"
            >
              <div className="text-[11px] text-slate-400 flex items-center gap-1">
                <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                <span>值勤電話</span>
              </div>
              <div className="text-sm font-black text-white mt-1 group-hover:text-emerald-300 transition">
                {isPolice ? (item as PoliceStation).phone : (item as Hospital).phone}
              </div>
            </a>

            {isPolice ? (
              <a
                href="tel:110"
                className="flex flex-col p-3 rounded-xl bg-rose-950/40 hover:bg-rose-950/60 border border-rose-500/40 transition group cursor-pointer"
              >
                <div className="text-[11px] text-rose-300 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                  <span>報案專線</span>
                </div>
                <div className="text-sm font-black text-rose-200 mt-1">
                  直撥 110 (免費)
                </div>
              </a>
            ) : (
              <a
                href={`tel:${(item as Hospital).emergencyRoomPhone.split(' ')[0]}`}
                className="flex flex-col p-3 rounded-xl bg-rose-950/40 hover:bg-rose-950/60 border border-rose-500/40 transition group cursor-pointer"
              >
                <div className="text-[11px] text-rose-300 flex items-center gap-1">
                  <HeartPulse className="w-3.5 h-3.5 text-rose-400" />
                  <span>急診掛號專線</span>
                </div>
                <div className="text-xs font-black text-rose-200 mt-1 truncate">
                  {(item as Hospital).emergencyRoomPhone}
                </div>
              </a>
            )}
          </div>

          {/* Police Station Details */}
          {isPolice && (
            <>
              <div className="bg-slate-800/60 rounded-xl p-3.5 border border-slate-700/50 space-y-2">
                <div className="text-xs font-bold text-slate-300">重點夜巡守備範圍：</div>
                <div className="flex flex-wrap gap-1.5">
                  {(item as PoliceStation).patrolAreas.map((area, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.8 bg-blue-950/60 text-blue-300 border border-blue-500/30 rounded-lg text-xs"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-slate-800/40 rounded-xl p-3 border border-slate-700/40 text-xs text-slate-300 leading-relaxed">
                <span className="font-bold text-white">轄區守護指引：</span>
                {(item as PoliceStation).notes}
              </div>
            </>
          )}

          {/* Hospital Details */}
          {!isPolice && (
            <>
              <div className="bg-slate-800/60 rounded-xl p-3.5 border border-slate-700/50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-slate-300">急診醫療等級：</div>
                  <span className="px-2 py-0.5 rounded text-xs font-black bg-rose-500/20 text-rose-300 border border-rose-500/40">
                    {(item as Hospital).level}
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-300 mt-2">夜間急救專門處置：</div>
                <div className="flex flex-wrap gap-1.5">
                  {(item as Hospital).emergencySpecialties.map((spec, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.8 bg-rose-950/60 text-rose-200 border border-rose-500/30 rounded-lg text-xs"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-slate-800/40 rounded-xl p-3 border border-slate-700/40 text-xs text-slate-300 leading-relaxed">
                <span className="font-bold text-white">院所介紹：</span>
                {(item as Hospital).description}
              </div>
            </>
          )}
        </div>

        {/* Footer Navigation Action */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            返回
          </button>

          <button
            onClick={() => {
              if (isPolice) {
                onNavigateToPolice(item as PoliceStation);
              } else {
                onNavigateToHospital(item as Hospital);
              }
              onClose();
            }}
            className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-black shadow-lg transition cursor-pointer ${
              isPolice
                ? 'bg-blue-600 hover:bg-blue-500 text-white'
                : 'bg-rose-600 hover:bg-rose-500 text-white'
            }`}
          >
            <Navigation className="w-4 h-4 fill-current" />
            <span>{isPolice ? '導航前往派出所' : '導航前往急診室'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
