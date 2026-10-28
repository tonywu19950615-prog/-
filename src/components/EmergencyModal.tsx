import React, { useState, useEffect } from 'react';
import {
  PhoneCall,
  Volume2,
  VolumeX,
  ShieldAlert,
  X,
  Copy,
  Check,
  MapPin,
  AlertTriangle,
  Flame,
  LifeBuoy
} from 'lucide-react';
import { SafetyShelter } from '../types';
import { formatDistance } from '../utils/geo';
import { startPoliceSiren, stopPoliceSiren, getIsSirenPlaying } from '../utils/sirenAudio';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  userLocation: [number, number];
  nearestShelter: { shelter: SafetyShelter; distanceMeters: number };
  onNavigateToNearestShelter: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
  userLocation,
  nearestShelter,
  onNavigateToNearestShelter,
}) => {
  const [isSirenOn, setIsSirenOn] = useState(false);
  const [isStrobeOn, setIsStrobeOn] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    return () => {
      stopPoliceSiren();
    };
  }, []);

  // Sync siren state with audio engine
  const handleToggleSiren = () => {
    if (isSirenOn) {
      stopPoliceSiren();
      setIsSirenOn(false);
    } else {
      const started = startPoliceSiren();
      if (started) {
        setIsSirenOn(true);
      }
    }
  };

  const handleToggleStrobe = () => {
    setIsStrobeOn(!isStrobeOn);
  };

  const handleClose = () => {
    stopPoliceSiren();
    setIsSirenOn(false);
    setIsStrobeOn(false);
    onClose();
  };

  const emergencyMessage = `【緊急求助通知】我目前在台北市夜間熱區，需要協助！
我的GPS定位：${userLocation[0].toFixed(5)}, ${userLocation[1].toFixed(5)}
地圖連結：https://maps.google.com/?q=${userLocation[0]},${userLocation[1]}
距離最近守護站：${nearestShelter.shelter.name}（距離約 ${formatDistance(
    nearestShelter.distanceMeters
  )}）
守護車電話：${nearestShelter.shelter.dutyHotline}`;

  const handleCopyLocation = () => {
    navigator.clipboard.writeText(emergencyMessage).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      {/* Fullscreen Strobe Visual Alarm Effect when activated */}
      {isStrobeOn && (
        <div
          className="fixed inset-0 pointer-events-none z-[-1] animate-strobe opacity-90"
          style={{
            animation: 'strobe 0.2s steps(2, start) infinite',
          }}
        />
      )}

      <div className="relative w-full max-w-lg bg-slate-900 border-2 border-red-500/80 rounded-2xl shadow-[0_0_50px_rgba(239,68,68,0.4)] text-white overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-red-600 to-rose-700 px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-yellow-300 animate-bounce" />
            <div>
              <h2 className="text-lg font-black tracking-wide flex items-center gap-1.5">
                台北夜安・一鍵緊急求救報警
              </h2>
              <p className="text-[11px] text-red-100">
                Taipei Night Emergency & Safe Shelter Response
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-full bg-black/20 hover:bg-black/40 text-white transition cursor-pointer"
            aria-label="關閉"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Main Direct Emergency Hotlines */}
          <div className="grid grid-cols-2 gap-3">
            {/* 110 Police Call */}
            <a
              href="tel:110"
              className="flex flex-col items-center justify-center p-3.5 bg-gradient-to-b from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-xl shadow-lg border border-red-400 active:scale-95 transition"
            >
              <div className="bg-white/20 p-2.5 rounded-full mb-1">
                <PhoneCall className="w-7 h-7 text-white" />
              </div>
              <span className="text-xl font-black tracking-wider">撥打 110</span>
              <span className="text-[11px] text-red-100 font-medium">台北市警察局報案台</span>
            </a>

            {/* 119 Ambulance Call */}
            <a
              href="tel:119"
              className="flex flex-col items-center justify-center p-3.5 bg-gradient-to-b from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 rounded-xl shadow-lg border border-amber-400 active:scale-95 transition"
            >
              <div className="bg-white/20 p-2.5 rounded-full mb-1">
                <Flame className="w-7 h-7 text-white" />
              </div>
              <span className="text-xl font-black tracking-wider">撥打 119</span>
              <span className="text-[11px] text-amber-100 font-medium">消防緊急救護/送醫</span>
            </a>
          </div>

          {/* Secondary Specialized Hotlines */}
          <div className="grid grid-cols-2 gap-2.5 text-xs">
            {/* 113 Protection */}
            <a
              href="tel:113"
              className="flex items-center gap-2 p-2.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-lg transition"
            >
              <div className="bg-purple-900/60 p-1.5 rounded text-purple-300">
                <LifeBuoy className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-slate-100">113 婦幼保護專線</div>
                <div className="text-[10px] text-slate-400">性騷擾 / 跟蹤防範</div>
              </div>
            </a>

            {/* 0800-055-850 Safe Taxi */}
            <a
              href="tel:0800055850"
              className="flex items-center gap-2 p-2.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-lg transition"
            >
              <div className="bg-emerald-900/60 p-1.5 rounded text-emerald-300">
                <PhoneCall className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-slate-100">0800-055-850</div>
                <div className="text-[10px] text-slate-400">台北夜間安心乘車</div>
              </div>
            </a>
          </div>

          {/* High-Decibel Siren & Strobe Alarm Controls */}
          <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                現場防狼防身警報工具
              </span>
              <span className="text-[10px] text-slate-400">
                可喝退歹徒並吸引路人警察注意
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {/* Siren Alarm */}
              <button
                onClick={handleToggleSiren}
                className={`py-2 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  isSirenOn
                    ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.8)]'
                    : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                }`}
              >
                {isSirenOn ? (
                  <>
                    <VolumeX className="w-4 h-4" />
                    <span>停止高分貝警報</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4" />
                    <span>開啟高分貝警笛聲</span>
                  </>
                )}
              </button>

              {/* Strobe Light */}
              <button
                onClick={handleToggleStrobe}
                className={`py-2 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  isStrobeOn
                    ? 'bg-amber-400 hover:bg-amber-500 text-slate-900 shadow-[0_0_15px_rgba(251,191,36,0.8)]'
                    : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                }`}
              >
                <span>{isStrobeOn ? '⚡ 關閉爆閃燈光' : '⚡ 開啟爆閃求救燈'}</span>
              </button>
            </div>
          </div>

          {/* Nearest "麻糬號" Tour Bus Safe Shelter Card */}
          <div className="bg-gradient-to-r from-emerald-950/70 to-teal-950/70 border-2 border-emerald-500/70 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                <span className="text-base">🚌</span>
                最近的遊覽車庇護所：
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/40">
                距您約 {formatDistance(nearestShelter.distanceMeters)}
              </span>
            </div>

            <div className="text-base font-black text-white">
              {nearestShelter.shelter.name}
            </div>
            <p className="text-xs text-slate-300">
              {nearestShelter.shelter.locationDescription}
            </p>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => {
                  handleClose();
                  onNavigateToNearestShelter();
                }}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>立即啟動導航前往麻糬號</span>
              </button>
              <a
                href={`tel:${nearestShelter.shelter.dutyHotline.replace(/-/g, '')}`}
                className="bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/50 font-bold text-xs py-2 px-3 rounded-lg flex items-center gap-1 transition"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>值班專線</span>
              </a>
            </div>
          </div>

          {/* Location Message Copy Box */}
          <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-3">
            <div className="flex items-center justify-between mb-1.5 text-xs text-slate-300">
              <span className="font-semibold">發送求救簡訊 / 定位連結</span>
              <button
                onClick={handleCopyLocation}
                className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-bold cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">已複製求救訊息</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>複製求救文字</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-slate-400 font-mono bg-slate-950/60 p-2 rounded border border-slate-800 leading-relaxed break-all">
              GPS：{userLocation[0].toFixed(5)}, {userLocation[1].toFixed(5)} ｜ 庇護站：{nearestShelter.shelter.name}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-5 py-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>台北市政府警察局・夜間治安聯防</span>
          <button
            onClick={handleClose}
            className="text-slate-300 hover:text-white font-medium cursor-pointer"
          >
            關閉視窗
          </button>
        </div>
      </div>
    </div>
  );
};
