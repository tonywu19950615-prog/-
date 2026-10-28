import React, { useState } from 'react';
import {
  QrCode,
  CheckCircle2,
  Lock,
  Unlock,
  AlertTriangle,
  X,
  User,
  Phone,
  HelpCircle,
  Users,
  Clock,
  Sparkles,
  ShieldCheck,
  Zap,
  Coffee,
  Camera,
  Radio,
  Eye
} from 'lucide-react';
import { SafetyShelter, ShelterBoardingPass } from '../types';
import { playDoorOpenSound, isShelterOperatingHours } from '../utils/doorSound';

interface ShelterEntryModalProps {
  isOpen: boolean;
  shelter: SafetyShelter | null;
  onClose: () => void;
  onCheckInComplete: (pass: ShelterBoardingPass) => void;
}

export const ShelterEntryModal: React.FC<ShelterEntryModalProps> = ({
  isOpen,
  shelter,
  onClose,
  onCheckInComplete,
}) => {
  // Step: 'scan' | 'form' | 'opening' | 'success'
  const [step, setStep] = useState<'scan' | 'form' | 'opening' | 'success'>('scan');

  // Time simulation toggle for testing daytime
  const [simulateOpenHours, setSimulateOpenHours] = useState(false);

  // Form states
  const [passengerName, setPassengerName] = useState('');
  const [passengerPhone, setPassengerPhone] = useState('');
  const [purpose, setPurpose] = useState('醉酒不適與醒酒休憩');
  const [companionCount, setCompanionCount] = useState(1);
  const [formError, setFormError] = useState('');

  // Generated Boarding Pass
  const [createdPass, setCreatedPass] = useState<ShelterBoardingPass | null>(null);

  if (!isOpen || !shelter) return null;

  const realHoursOpen = isShelterOperatingHours();
  const isOpenNow = realHoursOpen || simulateOpenHours;

  const handleScanSuccess = () => {
    if (!isOpenNow) {
      return;
    }
    setStep('form');
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passengerName.trim()) {
      setFormError('請輸入姓名或稱呼');
      return;
    }
    if (!passengerPhone.trim()) {
      setFormError('請輸入聯絡手機號碼（緊急安全聯繫使用）');
      return;
    }

    setFormError('');
    setStep('opening');

    // Play pneumatic door sound & open animation
    playDoorOpenSound();

    setTimeout(() => {
      const randomSeat = `${Math.floor(Math.random() * 8) + 1}${['A', 'B'][Math.floor(Math.random() * 2)]}`;
      const pass: ShelterBoardingPass = {
        id: `PASS-${Date.now().toString().slice(-6)}`,
        shelterId: shelter.id,
        shelterName: shelter.name,
        vehiclePlate: shelter.vehiclePlate,
        passengerName,
        passengerPhone,
        purpose,
        companionCount,
        entryTimestamp: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }),
        seatAssigned: `舒壓躺椅 ${randomSeat} 號`,
        status: 'valid',
      };
      setCreatedPass(pass);
      setStep('success');
      onCheckInComplete(pass);
    }, 2200);
  };

  const handleReset = () => {
    setStep('scan');
    setPassengerName('');
    setPassengerPhone('');
    setCreatedPass(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9500] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border-2 border-emerald-500 rounded-2xl shadow-[0_0_50px_rgba(16,185,129,0.3)] text-white overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🚌</span>
            <div>
              <h3 className="text-base font-black tracking-wide text-white">
                麻糬號車門智慧開門門禁
              </h3>
              <p className="text-[10px] text-emerald-100">{shelter.name}</p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="p-1 rounded-full bg-black/20 hover:bg-black/40 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Operating Hours Banner */}
        <div className="bg-slate-950 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-300">
              開放時段：<strong className="text-white">22:00 至 08:00</strong>
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span
              className={`text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 ${
                isOpenNow
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isOpenNow ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`}></span>
              {isOpenNow ? '開放服務中' : '未到開放時間'}
            </span>
          </div>
        </div>

        {/* Simulation Notice Bar if daytime */}
        {!realHoursOpen && (
          <div className="bg-slate-850 px-4 py-1.5 border-b border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>目前為日間時段（22:00前）</span>
            <button
              onClick={() => setSimulateOpenHours(!simulateOpenHours)}
              className="text-[10px] text-cyan-400 hover:text-cyan-300 font-bold underline cursor-pointer"
            >
              {simulateOpenHours ? '切換為真實時間' : '開啟測試模式（模擬22:00-08:00）'}
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* STEP 1: SCAN QR CODE */}
          {step === 'scan' && (
            <div className="space-y-3.5 text-center">
              {/* Capacity & AI Surveillance Status Banner */}
              <div className="bg-slate-950/80 border border-emerald-500/40 rounded-xl p-2.5 text-left text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-black text-emerald-400 flex items-center gap-1.5 text-[11px]">
                    <Users className="w-3.5 h-3.5" />
                    <span>車輛額定容納：30 人</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-300">
                    目前在席：<strong className="text-emerald-300">{shelter.currentOccupancy}</strong> / 30 人（尚餘 {Math.max(0, 30 - shelter.currentOccupancy)} 席）
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-indigo-300 bg-indigo-950/40 p-1.5 rounded border border-indigo-500/30">
                  <Camera className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>車前・車內・車外監視設備 & AI 監測運作中，遇可疑狀況即時通報鄰近派出所</span>
                </div>
              </div>

              <div>
                <h4 className="text-base font-bold text-slate-100">
                  請掃描車門 QR Code 開啟車門
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  請將手機鏡頭對準「麻糬號」車門感應區之專屬條碼
                </p>
              </div>

              {/* Viewfinder Scanner Mock */}
              <div className="relative mx-auto w-52 h-52 rounded-2xl border-2 border-emerald-500/80 bg-slate-950 flex flex-col items-center justify-center p-4 overflow-hidden shadow-inner group">
                {/* Laser animation */}
                <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_10px_#10b981] animate-bounce" />

                <QrCode className="w-20 h-20 text-emerald-400/90 mb-2" />
                <span className="font-mono text-xs font-black text-emerald-300 bg-slate-900 px-2 py-0.5 rounded border border-emerald-500/40">
                  {shelter.qrCodeId}
                </span>
                <span className="text-[10px] text-slate-500 mt-1">車牌：{shelter.vehiclePlate}</span>
              </div>

              {!isOpenNow ? (
                /* Locked outside hours */
                <div className="bg-rose-950/40 border border-rose-500/50 rounded-xl p-3 text-left space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-300">
                    <Lock className="w-4 h-4" />
                    <span>門禁鎖定中：未在開放時段</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    「麻糬號」夜間安全庇護專車固定於 <strong>22:00 至翌日 08:00</strong> 開放。
                    若現場遇緊急危害，請立即按壓車身紅色緊急對講機或直接一鍵撥打 110。
                  </p>
                  <div className="pt-1">
                    <button
                      onClick={() => setSimulateOpenHours(true)}
                      className="w-full bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold py-1.5 rounded transition cursor-pointer"
                    >
                      💡 點此啟用「夜間時段測試模式」體驗開門流程
                    </button>
                  </div>
                </div>
              ) : (
                /* Ready to Scan */
                <div className="space-y-2">
                  <button
                    onClick={handleScanSuccess}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition cursor-pointer active:scale-98"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>感應掃描 QR Code 並前往登記</span>
                  </button>
                  <p className="text-[11px] text-slate-400">
                    完成登記送出後，氣壓車門將自動解除鎖定開啟
                  </p>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: PASSENGER ENTRY FORM */}
          {step === 'form' && (
            <form onSubmit={handleSubmitForm} className="space-y-3.5">
              <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-bold text-emerald-300">QR Code 驗證成功</span>
                    <div className="text-slate-300 text-[11px]">站點：{shelter.name}（{shelter.vehiclePlate}）</div>
                  </div>
                </div>
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300 border border-slate-700">
                  額定 30 人
                </span>
              </div>

              {/* Real-time AI Surveillance Reminder in Form */}
              <div className="bg-indigo-950/30 border border-indigo-500/30 rounded-lg p-2 text-[10px] text-indigo-200 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-rose-400 shrink-0 animate-pulse" />
                <span>專車前、內、外 360° AI 影像監測保護中；若遇可疑狀況即時通報鄰近派出所。</span>
              </div>

              {formError && (
                <div className="bg-red-950/60 border border-red-500 text-red-200 text-xs p-2 rounded-lg flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Name */}
              <div className="space-y-1 text-xs">
                <label className="font-bold text-slate-300 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                  <span>旅客姓名或稱呼：</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="例如：陳小姐、林先生"
                  value={passengerName}
                  onChange={(e) => setPassengerName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Phone */}
              <div className="space-y-1 text-xs">
                <label className="font-bold text-slate-300 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>緊急聯絡手機號碼：</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="例如：0912-345-678"
                  value={passengerPhone}
                  onChange={(e) => setPassengerPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Purpose */}
              <div className="space-y-1 text-xs">
                <label className="font-bold text-slate-300 flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>本次入內休息主要目的：</span>
                </label>
                <select
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="醉酒不適與醒酒休憩">醉酒不適與醒酒休憩</option>
                  <option value="遭遇尾隨或可疑騷擾暫避">遭遇尾隨或可疑騷擾暫避</option>
                  <option value="手機電量不足緊急充電">手機電量不足緊急充電</option>
                  <option value="等候首班捷運/安全計程車">等候首班捷運 / 安全計程車</option>
                  <option value="身體不適與外傷簡單急救">身體不適與外傷簡單急救</option>
                </select>
              </div>

              {/* Companions */}
              <div className="space-y-1 text-xs">
                <label className="font-bold text-slate-300 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-emerald-400" />
                  <span>隨行同伴人數（含本人）：</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setCompanionCount(num)}
                      className={`py-1.5 rounded-lg border text-xs font-bold transition cursor-pointer ${
                        companionCount === num
                          ? 'bg-emerald-600 text-white border-emerald-400 shadow'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {num === 3 ? '3人以上' : `${num} 人`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition cursor-pointer active:scale-98"
                >
                  <Unlock className="w-4 h-4" />
                  <span>確認送出 ➔ 開啟麻糬號車門</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: DOOR OPENING ANIMATION */}
          {step === 'opening' && (
            <div className="py-8 text-center space-y-4 animate-pulse">
              <div className="relative mx-auto w-24 h-24 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-4xl shadow-[0_0_30px_rgba(16,185,129,0.5)]">
                <Unlock className="w-12 h-12 text-emerald-400 animate-bounce" />
              </div>
              <div>
                <h4 className="text-lg font-black text-white">
                  車門解鎖中...
                </h4>
                <p className="text-xs text-emerald-300 mt-1">
                  氣壓門釋放閥作動中，請稍候步入車廂
                </p>
              </div>
            </div>
          )}

          {/* STEP 4: BOARDING PASS SUCCESS */}
          {step === 'success' && createdPass && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-4 text-white shadow-xl space-y-3">
                <div className="flex items-center justify-between border-b border-emerald-500/50 pb-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200">
                      麻糬號即時電子登車通行證
                    </span>
                    <h4 className="text-lg font-black text-white">{shelter.name}</h4>
                  </div>
                  <div className="text-right">
                    <span className="bg-white text-emerald-900 font-mono font-black text-xs px-2 py-0.5 rounded shadow">
                      {createdPass.id}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-emerald-200 text-[10px] block">旅客姓名</span>
                    <span className="font-bold">{createdPass.passengerName}</span>
                  </div>
                  <div>
                    <span className="text-emerald-200 text-[10px] block">安排座席</span>
                    <span className="font-bold text-yellow-300">{createdPass.seatAssigned}</span>
                  </div>
                  <div>
                    <span className="text-emerald-200 text-[10px] block">登入時間</span>
                    <span className="font-mono">{createdPass.entryTimestamp}</span>
                  </div>
                  <div>
                    <span className="text-emerald-200 text-[10px] block">同伴人數</span>
                    <span>{createdPass.companionCount} 位</span>
                  </div>
                </div>

                <div className="bg-black/20 rounded-xl p-2.5 text-[11px] space-y-1">
                  <div className="flex items-center justify-between text-emerald-200 font-bold border-b border-emerald-500/30 pb-1">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      <span>車輛額定容納：30 人（座席安全管理中）</span>
                    </span>
                    <span className="text-[10px] bg-emerald-950/60 px-1.5 py-0.5 rounded text-emerald-300 font-mono">
                      在席 {shelter.currentOccupancy} / 30
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-indigo-200">
                    <Camera className="w-3.5 h-3.5 text-indigo-300 shrink-0" />
                    <span>車前內外監視設備 & AI 監測，即時連線{shelter.securityMonitoring.nearestPoliceStation.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-200 font-bold">
                    <Coffee className="w-3.5 h-3.5" />
                    <span>車內免費提供：熱電解質薑茶、暖暖包、65W極速快充</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-200">
                    <Zap className="w-3.5 h-3.5" />
                    <span>車載免費 Wi-Fi：<strong>MochiSafe-Free</strong> (密碼免填)</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-slate-300 space-y-1">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>車門已解鎖開啟，請由前門階梯進入</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  車內執勤警員與緊急救護員將為您引導座位。如需代叫計程車或酒後護送，可向車頭值勤專員登記。
                </p>
              </div>

              <button
                onClick={handleReset}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs py-2.5 rounded-xl transition cursor-pointer"
              >
                完成並返回地圖
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
