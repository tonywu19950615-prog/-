import React, { useState } from 'react';
import {
  X,
  MapPin,
  Clock,
  Phone,
  Shield,
  ShieldCheck,
  Zap,
  Navigation,
  Sparkles,
  Award,
  AlertCircle,
  AlertTriangle,
  ExternalLink,
  Users,
  QrCode,
  Camera,
  Radio,
  CheckCircle2,
  Activity,
  Eye
} from 'lucide-react';
import { SafetyShelter, Venue } from '../types';
import { formatDistance, getDistanceMeters } from '../utils/geo';
import { PoliceTrendChart } from './PoliceTrendChart';

interface DetailModalProps {
  shelter: SafetyShelter | null;
  venue: Venue | null;
  userLocation: [number, number];
  onClose: () => void;
  onNavigateToShelter: (shelter: SafetyShelter) => void;
  onNavigateToVenue: (venue: Venue) => void;
  onOpenQREntry: (shelter: SafetyShelter) => void;
  allShelters: SafetyShelter[];
}

export const DetailModal: React.FC<DetailModalProps> = ({
  shelter,
  venue,
  userLocation,
  onClose,
  onNavigateToShelter,
  onNavigateToVenue,
  onOpenQREntry,
  allShelters,
}) => {
  const [isSimulatingAlert, setIsSimulatingAlert] = useState(false);
  const [simulationLog, setSimulationLog] = useState<{
    step: number;
    title: string;
    detail: string;
    time: string;
  } | null>(null);

  if (!shelter && !venue) return null;

  // Render Tour Bus Safe Shelter ("麻糬號")
  if (shelter) {
    const dist = getDistanceMeters(userLocation, shelter.coordinates);
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${shelter.coordinates[0]},${shelter.coordinates[1]}&travelmode=walking`;
    const capacity = shelter.capacity || 30;
    const currentOccupancy = shelter.currentOccupancy || 10;
    const availableSeats = Math.max(0, capacity - currentOccupancy);
    const occupancyPercent = Math.round((currentOccupancy / capacity) * 100);

    const handleSimulateAiAlert = () => {
      setIsSimulatingAlert(true);
      setSimulationLog({
        step: 1,
        title: '【AI 視覺異常辨識中】',
        detail: '車外 360° 環景鏡頭偵測到車身旁有可疑徘徊與疑似尾隨拉扯動態...',
        time: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      });

      setTimeout(() => {
        setSimulationLog({
          step: 2,
          title: `【5G 警訊毫秒級發送至 ${shelter.securityMonitoring.nearestPoliceStation.name}】`,
          detail: `自動加密封包（含車內外畫面經緯度與專車號 ${shelter.vehiclePlate}）已送達轄區勤務中心！`,
          time: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        });
      }, 1400);

      setTimeout(() => {
        setSimulationLog({
          step: 3,
          title: `【派出所已受理派遣】線上巡邏警網即刻趕赴！`,
          detail: `${shelter.securityMonitoring.nearestPoliceStation.name} 指揮中心已確認，車內駐點警員同步接獲警戒指令，現場安全確保中。`,
          time: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        });
        setIsSimulatingAlert(false);
      }, 3000);
    };

    return (
      <div className="fixed inset-0 z-[9000] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
        <div className="relative w-full max-w-xl bg-slate-900 border-2 border-emerald-500 rounded-2xl shadow-2xl text-white overflow-hidden max-h-[92vh] flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 p-5 text-white">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="bg-white text-emerald-800 text-xs font-black px-2.5 py-1 rounded-full shadow flex items-center gap-1.5">
                  <span className="text-sm">🚌</span> 夜間安全庇護遊覽車
                </span>
                <span className="bg-amber-400 text-slate-950 text-xs font-black px-2 py-0.5 rounded shadow">
                  {shelter.vehiclePlate}
                </span>
                <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-400/50 text-[11px] font-black px-2 py-0.5 rounded-full">
                  容納 30 人
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-full bg-black/20 hover:bg-black/40 text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h2 className="text-2xl font-black tracking-wide text-white mb-1">
              {shelter.name}
            </h2>
            <p className="text-xs text-emerald-100 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {shelter.locationDescription}
            </p>
          </div>

          {/* Body */}
          <div className="p-5 overflow-y-auto space-y-4">
            {/* 1. Night Safety Advisory Banner */}
            <div className="bg-gradient-to-r from-amber-950/80 to-amber-900/60 border-2 border-amber-500/80 rounded-xl p-3.5 space-y-1.5 shadow-lg">
              <div className="flex items-center gap-2 text-amber-300 font-black text-xs">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 animate-bounce" />
                <span>【該熱區夜間安全建議提示】</span>
              </div>
              <p className="text-xs text-amber-100 leading-relaxed font-medium pl-6">
                {shelter.safetyAdvisory}
              </p>
            </div>

            {/* 2. D3 Police Incident Heat Trend Chart */}
            <PoliceTrendChart data={shelter.policeHeatTrend} shelterName={shelter.name} />

            {/* 3. Capacity & Real-Time Seat Availability (每個庇護車輛容納人數為 30 人) */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-emerald-500/60 rounded-xl p-4 space-y-2.5 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                    <Users className="w-4 h-4" />
                  </span>
                  <div>
                    <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                      <span>專車額定容納人數</span>
                      <span className="text-emerald-400 font-mono text-sm font-black">30 人</span>
                    </h4>
                    <p className="text-[11px] text-slate-400">符合大型安全遊覽車標準防護規格與寬敞躺椅配席</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-black text-emerald-300">
                    在席 {currentOccupancy} / 30 人
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    （尚餘 <strong className="text-amber-300">{availableSeats}</strong> 席舒適空位）
                  </span>
                </div>
              </div>

              {/* Capacity Progress Bar */}
              <div className="space-y-1">
                <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden p-0.5 border border-slate-700">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      occupancyPercent > 80
                        ? 'bg-gradient-to-r from-amber-500 to-red-500'
                        : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                    }`}
                    style={{ width: `${occupancyPercent}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>0 人 (空車)</span>
                  <span>承載率 {occupancyPercent}%（舒適充裕）</span>
                  <span>上限 30 人滿載</span>
                </div>
              </div>
            </div>

            {/* 4. Front, Interior, and Exterior Surveillance & AI Monitoring with Instant Police Dispatch */}
            <div className="bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-900 border-2 border-indigo-500/60 rounded-xl p-4 space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                  <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-indigo-400" />
                    <span>車前・車內・車外監視設備 & AI 即時監測</span>
                  </h4>
                </div>
                <span className="bg-indigo-500/20 text-indigo-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-500/40">
                  24H AI 警戒連動中
                </span>
              </div>

              {/* 3-Direction Camera System */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div className="bg-slate-800/90 p-2.5 rounded-lg border border-slate-700 space-y-1">
                  <div className="flex items-center gap-1.5 text-indigo-300 font-bold text-[11px]">
                    <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
                    <span>📷 車前監控</span>
                  </div>
                  <p className="text-[10px] text-slate-300 leading-tight">
                    4K 星光夜視廣角鏡頭，全時監測前方道路車流與人行散場動態。
                  </p>
                </div>
                <div className="bg-slate-800/90 p-2.5 rounded-lg border border-slate-700 space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-300 font-bold text-[11px]">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>📷 車內座艙</span>
                  </div>
                  <p className="text-[10px] text-slate-300 leading-tight">
                    360° AI 防騷擾護衛鏡頭，主動識別肢體衝突、推擠或異常呼救。
                  </p>
                </div>
                <div className="bg-slate-800/90 p-2.5 rounded-lg border border-slate-700 space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-300 font-bold text-[11px]">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                    <span>📷 車外環景</span>
                  </div>
                  <p className="text-[10px] text-slate-300 leading-tight">
                    360° 鷹眼反尾隨鏡頭，智慧辨識車身周邊徘徊、跟蹤與武器威脅。
                  </p>
                </div>
              </div>

              {/* Instant Police Dispatch Notice & Connected Police Station */}
              <div className="bg-indigo-950/40 border border-indigo-500/40 rounded-xl p-3 space-y-2 text-xs">
                <div className="flex items-start gap-2">
                  <Radio className="w-4 h-4 text-rose-400 shrink-0 mt-0.5 animate-pulse" />
                  <div>
                    <span className="font-bold text-rose-300 block mb-0.5">
                      【可疑狀況立即通報機制】
                    </span>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      若系統監測到任何可疑狀況（推擠衝突、尾隨徘徊、強行闖入或呼救手勢），<strong>AI 立即自動發送加密警訊與即時影像通知鄰近派出所</strong>，值勤警員與巡邏警網即刻趕抵現場！
                    </p>
                  </div>
                </div>

                {/* Nearest Police Station Box */}
                <div className="bg-black/30 rounded-lg p-2.5 border border-indigo-500/20 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400 block text-[10px]">即時連動轄區派出所</span>
                    <span className="font-black text-white text-xs">
                      {shelter.securityMonitoring.nearestPoliceStation.name}
                    </span>
                    <span className="text-slate-400 block text-[10px]">
                      地址：{shelter.securityMonitoring.nearestPoliceStation.address}（距離約 {shelter.securityMonitoring.nearestPoliceStation.distanceMeters} 公尺）
                    </span>
                  </div>
                  <div className="text-right sm:text-right shrink-0">
                    <span className="inline-block bg-emerald-500/20 text-emerald-300 text-[10px] font-mono px-2 py-0.5 rounded border border-emerald-500/30 mb-1">
                      ● {shelter.securityMonitoring.nearestPoliceStation.signalStatus}
                    </span>
                    <a
                      href={`tel:${shelter.securityMonitoring.nearestPoliceStation.phone.replace(/-/g, '')}`}
                      className="block text-indigo-300 font-bold underline hover:text-white"
                    >
                      直通專線：{shelter.securityMonitoring.nearestPoliceStation.phone}
                    </a>
                  </div>
                </div>

                {/* Interactive Simulation Button */}
                <div className="pt-1">
                  <button
                    onClick={handleSimulateAiAlert}
                    disabled={isSimulatingAlert}
                    className="w-full bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-indigo-400/50 text-indigo-200 font-bold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer disabled:opacity-50"
                  >
                    <Activity className={`w-3.5 h-3.5 text-rose-400 ${isSimulatingAlert ? 'animate-spin' : ''}`} />
                    <span>
                      {isSimulatingAlert ? '警政連動通報模擬中...' : '🚨 點擊模擬測試：AI 偵測可疑狀況即時通報派出所'}
                    </span>
                  </button>

                  {/* Simulation Feedback Card */}
                  {simulationLog && (
                    <div className="mt-2 p-2.5 bg-slate-950 border border-rose-500/60 rounded-lg text-xs space-y-1 animate-fade-in">
                      <div className="flex items-center justify-between text-rose-300 font-black text-[11px]">
                        <span>{simulationLog.title}</span>
                        <span className="font-mono text-[10px] text-slate-400">{simulationLog.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        {simulationLog.detail}
                      </p>
                      {simulationLog.step === 3 && (
                        <div className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 pt-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>派出所與現場駐點警力已完成即時應變防護聯動</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Status Pill */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                <span className="text-slate-400 block mb-0.5">車輛型式</span>
                <span className="font-bold text-slate-200">{shelter.vehicleType}</span>
              </div>
              <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                <span className="text-slate-400 block mb-0.5">距離目前位置</span>
                <span className="font-bold text-emerald-400">{formatDistance(dist)}</span>
              </div>
            </div>

            {/* Operating hours & hotline */}
            <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-3 text-xs space-y-1.5 text-slate-200">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  <strong>專車開放時間：</strong>
                  <span className="text-yellow-300 font-bold">{shelter.operatingHours}</span>
                  <span className="text-[11px] text-slate-400 ml-1">（須掃描 QR Code 開門入內）</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  <strong>車上值勤電話：</strong>
                  <a
                    href={`tel:${shelter.dutyHotline.replace(/-/g, '')}`}
                    className="text-emerald-300 font-bold underline ml-1"
                  >
                    {shelter.dutyHotline}
                  </a>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  <strong>常駐人員：</strong>
                  {shelter.stationedPersonnel.join('、')}
                </span>
              </div>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                麻糬號免費夜間安全支援項目
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {shelter.services.map((svc, i) => (
                  <div
                    key={i}
                    className="p-2.5 bg-slate-800/80 rounded-xl border border-slate-700/80 text-xs"
                  >
                    <div className="font-bold text-emerald-300 mb-0.5 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      {svc.title}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {svc.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Facilities Equipment */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                車載專業防護與救護設施
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {shelter.facilities.map((fac, idx) => (
                  <span
                    key={idx}
                    className="bg-slate-800 text-slate-300 text-xs px-2.5 py-1 rounded-lg border border-slate-700/80"
                  >
                    ✓ {fac}
                  </span>
                ))}
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed bg-slate-950/50 p-3 rounded-xl border border-slate-800">
              {shelter.description}
            </p>
          </div>

          {/* Action buttons */}
          <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-wrap sm:flex-nowrap gap-2.5">
            {/* QR Code Entrance Unlock Trigger Button */}
            <button
              onClick={() => {
                onClose();
                onOpenQREntry(shelter);
              }}
              className="w-full sm:flex-1 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20 transition cursor-pointer"
            >
              <QrCode className="w-4 h-4" />
              <span>掃描車門 QRcode 登記入內</span>
            </button>

            {/* Route Navigation Button */}
            <button
              onClick={() => {
                onClose();
                onNavigateToShelter(shelter);
              }}
              className="w-full sm:flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-lg transition cursor-pointer"
            >
              <Navigation className="w-4 h-4" />
              <span>路線導航至麻糬號</span>
            </button>

            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 p-2.5 rounded-xl border border-slate-700 flex items-center justify-center transition"
              title="以 Google 地圖開啟"
            >
              <ExternalLink className="w-5 h-5 text-blue-400" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Render Bar or Nightclub
  if (venue) {
    const dist = getDistanceMeters(userLocation, venue.coordinates);
    const isNightclub = venue.type === 'nightclub';
    const nearestShelterObj = allShelters.find((s) => s.id === venue.nearestShelterId) || allShelters[0];
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${venue.coordinates[0]},${venue.coordinates[1]}&travelmode=walking`;

    return (
      <div className="fixed inset-0 z-[9000] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
        <div className="relative w-full max-w-xl bg-slate-900 border-2 border-slate-700 rounded-2xl shadow-2xl text-white overflow-hidden max-h-[90vh] flex flex-col">
          {/* Header */}
          <div
            className={`p-5 text-white ${
              isNightclub
                ? 'bg-gradient-to-r from-purple-700 to-pink-700'
                : 'bg-gradient-to-r from-amber-700 to-orange-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="bg-black/30 backdrop-blur-md text-white text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 border border-white/20">
                {isNightclub ? '🪩 台北登記夜店' : '🍸 台北合規酒吧'}
              </span>
              <button
                onClick={onClose}
                className="p-1 rounded-full bg-black/20 hover:bg-black/40 text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-baseline gap-2">
              <h2 className="text-2xl font-black tracking-wide text-white">
                {venue.name}
              </h2>
              <span className="text-xs text-white/80">{venue.district}</span>
            </div>
            <p className="text-xs text-white/90 flex items-center gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5" />
              {venue.address}
            </p>
          </div>

          {/* Body */}
          <div className="p-5 overflow-y-auto space-y-4">
            {/* Key Metrics */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700">
                <span className="text-slate-400 block mb-0.5">安全評分</span>
                <span className="font-black text-amber-400 text-sm">★ {venue.safetyRating} / 5</span>
              </div>
              <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700">
                <span className="text-slate-400 block mb-0.5">專職保全安檢</span>
                <span className="font-bold text-emerald-400 text-xs">
                  {venue.hasSecurity ? '配備金屬/駐場保全' : '合規店員巡查'}
                </span>
              </div>
              <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700">
                <span className="text-slate-400 block mb-0.5">距離目前位置</span>
                <span className="font-bold text-cyan-400 text-sm">{formatDistance(dist)}</span>
              </div>
            </div>

            {/* Legal Registration License */}
            <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-3 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <Award className="w-4 h-4" />
                <span>台北市政府合法登記在案商家</span>
              </div>
              <div className="text-slate-300 font-mono text-[11px]">
                {venue.licenseNumber}
              </div>
              <div className="text-[11px] text-slate-400">
                已通過台北市建管、消防定期公共安全申報與消保檢驗合格。
              </div>
            </div>

            {/* Hours & Contact */}
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-3 text-xs space-y-1.5 text-slate-300">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                <span>
                  <strong>營業時間：</strong>
                  {venue.businessHours}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span>
                  <strong>預約與客服電話：</strong>
                  <a
                    href={`tel:${venue.phone.replace(/[^0-9]/g, '')}`}
                    className="text-blue-400 underline font-semibold ml-1"
                  >
                    {venue.phone}
                  </a>
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-slate-800">
              {venue.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {venue.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-slate-800 text-slate-300 text-xs px-2.5 py-1 rounded-lg border border-slate-700"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Nearest Mochi Shelter Callout */}
            {nearestShelterObj && (
              <div className="bg-emerald-950/50 border-2 border-emerald-500/60 rounded-xl p-3 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                    <span>🚌</span> 本店最近安全守護站：
                  </span>
                  <span className="text-[11px] text-emerald-400 font-semibold">
                    散場安心避護
                  </span>
                </div>
                <div className="text-sm font-black text-white">
                  {nearestShelterObj.name}
                </div>
                <p className="text-xs text-slate-300">
                  {nearestShelterObj.locationDescription}
                </p>
                <button
                  onClick={() => {
                    onClose();
                    onNavigateToShelter(nearestShelterObj);
                  }}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer shadow"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>導航至此守護站（麻糬號）</span>
                </button>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="p-4 bg-slate-950 border-t border-slate-800 flex gap-2.5">
            <button
              onClick={() => {
                onClose();
                onNavigateToVenue(venue);
              }}
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-black text-sm py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg transition cursor-pointer"
            >
              <Navigation className="w-4 h-4" />
              <span>路線導航至 {venue.name}</span>
            </button>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 p-2.5 rounded-xl border border-slate-700 flex items-center justify-center transition"
              title="以 Google 地圖開啟"
            >
              <ExternalLink className="w-5 h-5 text-blue-400" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
