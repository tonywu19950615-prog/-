import React, { useState } from 'react';
import {
  ShieldAlert,
  Search,
  MapPin,
  Sparkles,
  Layers,
  Compass,
  Bus,
  BookOpen,
  Settings,
  Menu,
  X,
  PhoneCall,
  Info,
  Flame
} from 'lucide-react';
import { SafetyShelter } from '../types';

interface NavbarProps {
  shelters: SafetyShelter[];
  selectedDistrict: string;
  onChangeDistrict: (dist: string) => void;
  showShelters: boolean;
  onToggleShelters: () => void;
  showBars: boolean;
  onToggleBars: () => void;
  showNightclubs: boolean;
  onToggleNightclubs: () => void;
  showCrimeHeatmap?: boolean;
  onToggleCrimeHeatmap?: () => void;
  crimeHotspotsCount?: number;
  showPolice?: boolean;
  onTogglePolice?: () => void;
  policeCount?: number;
  showHospitals?: boolean;
  onToggleHospitals?: () => void;
  hospitalCount?: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenSOS: () => void;
  onOpenGuide: () => void;
  onOpenTrafficMonitor?: () => void;
  onSelectShelter: (shelter: SafetyShelter) => void;
  barCount?: number;
  clubCount?: number;
  onNavigateToNearestShelter: () => void;
  onSelectAllLayers?: () => void;
  onResetDefaultLayers?: () => void;
}

const DISTRICTS = [
  '全部',
  '信義區',
  '大安區',
  '中山區',
  '萬華區',
  '中正區',
  '松山區',
  '大同區',
  '士林區',
  '北投區',
  '內湖區',
  '南港區',
  '文山區'
];

export const Navbar: React.FC<NavbarProps> = ({
  shelters,
  selectedDistrict,
  onChangeDistrict,
  showShelters,
  onToggleShelters,
  showBars,
  onToggleBars,
  showNightclubs,
  onToggleNightclubs,
  showCrimeHeatmap = false,
  onToggleCrimeHeatmap,
  crimeHotspotsCount = 17,
  showPolice = false,
  onTogglePolice,
  policeCount = 77,
  showHospitals = false,
  onToggleHospitals,
  hospitalCount = 26,
  onSelectAllLayers,
  onResetDefaultLayers,
  barCount,
  clubCount,
  searchQuery,
  onSearchChange,
  onOpenSOS,
  onOpenGuide,
  onOpenTrafficMonitor,
  onSelectShelter,
  onNavigateToNearestShelter,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <header className="bg-slate-950/95 backdrop-blur-md border-b border-slate-800 text-white sticky top-0 z-40 shadow-xl">
      {/* Primary Brand & SOS Action Header */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Logo & Headline */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <Bus className="w-5 h-5 text-slate-950 font-black" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-black tracking-wide text-white">
                台北夜安・酒吧夜店地圖
              </h1>
              <span className="bg-emerald-500 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded-full shadow">
                麻糬號守護中
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">
              治安熱區遊覽車庇護所 ｜ 一鍵報警 ｜ 路線導航
            </p>
          </div>
        </div>

        {/* Search Input (Desktop) */}
        <div className="relative flex-1 max-w-xs hidden md:block">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="搜尋酒吧、夜店或麻糬號站點..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
          />
        </div>

        {/* Action Group: SOS One-Click Alert, Nearest Shelter & Safety Guide / Settings Menu */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Night Safety Guide Button (Direct access) */}
          <button
            onClick={onOpenGuide}
            className="flex items-center gap-1.5 bg-emerald-950/70 hover:bg-emerald-900 text-emerald-300 hover:text-white text-xs font-bold py-2 px-2.5 sm:px-3 rounded-xl border border-emerald-500/50 transition cursor-pointer shadow-sm"
            title="開啟台北市夜間安全錦囊、防身技巧與緊急電話清單"
          >
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span className="hidden xs:inline">夜間安全錦囊</span>
            <span className="xs:hidden">錦囊</span>
          </button>

          <button
            onClick={onNavigateToNearestShelter}
            className="hidden sm:flex items-center gap-1.5 bg-emerald-700/80 hover:bg-emerald-600 text-white text-xs font-bold py-2 px-3 rounded-xl border border-emerald-500/50 transition cursor-pointer shadow-md"
            title="自動計算最近的麻糬號庇護所並開啟導航"
          >
            <Compass className="w-4 h-4 text-emerald-300" />
            <span>最近麻糬號</span>
          </button>

          {/* Prominent SOS Button (一鍵報警) */}
          <button
            onClick={onOpenSOS}
            className="group relative flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs sm:text-sm py-2 px-3 sm:px-4 rounded-xl shadow-[0_0_20px_rgba(239,68,68,0.5)] active:scale-95 transition cursor-pointer"
          >
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-400"></span>
            </span>
            <ShieldAlert className="w-4 h-4 text-white animate-pulse" />
            <span>一鍵報警</span>
          </button>

          {/* Settings / Menu Button */}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition cursor-pointer"
              title="App 設定與選單"
              aria-label="App 設定與選單"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Dropdown Menu Modal/Popover */}
            {isMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-2.5 z-50 animate-fade-in text-xs space-y-1">
                <div className="px-2.5 py-1.5 border-b border-slate-800 flex items-center justify-between">
                  <span className="font-bold text-white text-xs flex items-center gap-1.5">
                    <Settings className="w-3.5 h-3.5 text-slate-400" />
                    <span>App 功能選單與設定</span>
                  </span>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="text-slate-400 hover:text-white p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="py-1 space-y-1">
                  {/* Item: Night Safety Guide */}
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onOpenGuide();
                    }}
                    className="w-full text-left p-2.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 flex items-start gap-2.5 transition cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-white flex items-center gap-1">
                        <span>夜間安全錦囊</span>
                        <span className="bg-emerald-500 text-slate-950 text-[9px] font-black px-1 rounded">推薦</span>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-tight mt-0.5">
                        整合防身建議、緊急聯絡清單與 Google Search 即時更新
                      </p>
                    </div>
                  </button>

                  {/* Item: Traffic & Event Monitor */}
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      if (onOpenTrafficMonitor) onOpenTrafficMonitor();
                    }}
                    className="w-full text-left p-2 rounded-xl hover:bg-amber-950/40 border border-amber-500/30 text-amber-300 flex items-start gap-2.5 transition cursor-pointer"
                  >
                    <span className="text-sm shrink-0 mt-0.5">⚠️</span>
                    <div>
                      <div className="font-bold text-amber-200 flex items-center gap-1">
                        <span>即時活動與路況監測</span>
                        <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-1 rounded">Google即時</span>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-tight mt-0.5">
                        監測台北大型活動與交通管制，自動觸發安全繞路提示
                      </p>
                    </div>
                  </button>

                  {/* Item: Nearest Mochi Bus */}
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onNavigateToNearestShelter();
                    }}
                    className="w-full text-left p-2 rounded-xl hover:bg-slate-800 text-slate-300 flex items-center gap-2.5 transition cursor-pointer"
                  >
                    <Compass className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <div className="font-bold text-slate-200">導航至最近「麻糬號」</div>
                      <div className="text-[10px] text-slate-400">自動定位並規劃最佳安全步行動線</div>
                    </div>
                  </button>

                  {/* Item: Emergency SOS */}
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onOpenSOS();
                    }}
                    className="w-full text-left p-2 rounded-xl hover:bg-red-950/40 border border-red-500/20 text-red-300 flex items-center gap-2.5 transition cursor-pointer"
                  >
                    <PhoneCall className="w-4 h-4 text-red-400 shrink-0" />
                    <div>
                      <div className="font-bold text-red-200">一鍵緊急通報與求援</div>
                      <div className="text-[10px] text-red-300/80">直撥 110、防狼高分貝警笛與爆閃燈</div>
                    </div>
                  </button>
                </div>

                <div className="pt-2 border-t border-slate-800 px-2 text-[10px] text-slate-400 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span>「麻糬號」開放時間：</span>
                    <span className="font-mono font-bold text-amber-400">22:00 - 08:00</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>台北市愛心商店走廊：</span>
                    <span className="text-emerald-400 font-bold">141 條全區守護</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="px-4 pb-2 md:hidden">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="搜尋酒吧、夜店或麻糬號站點..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Designated Hotspot Quick Jump Bar (西門町中華成都、林森公園、花博公園、瑠公公園、信義廣場) */}
      <div className="bg-slate-900/90 border-t border-slate-800/80 px-4 py-2 overflow-x-auto scrollbar-none flex items-center gap-2">
        <div className="text-[11px] font-bold text-emerald-400 flex items-center gap-1 shrink-0 pr-1">
          <span className="text-xs">🚌</span>
          <span>熱區「麻糬號」庇護所：</span>
        </div>

        {shelters.map((shelter) => {
          // Extract short label (e.g. 西門町中華成都、林森公園、花博公園、瑠公公園、信義廣場)
          const shortName = shelter.name.replace('麻糬號（', '').replace('）', '');
          return (
            <button
              key={shelter.id}
              onClick={() => onSelectShelter(shelter)}
              className="shrink-0 bg-slate-800 hover:bg-emerald-950/80 hover:border-emerald-500 text-slate-200 hover:text-emerald-300 border border-slate-700/80 text-xs px-2.5 py-1 rounded-full transition flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-bold text-emerald-300">麻糬號</span>
              <span className="text-[11px] text-slate-300">({shortName})</span>
            </button>
          );
        })}
      </div>

      {/* Layer Filter Toggles & District Selector */}
      <div className="bg-slate-950 px-4 py-2 border-t border-slate-850 flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Markers Toggles */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={onToggleShelters}
            className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 transition cursor-pointer border ${
              showShelters
                ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/60'
                : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
          >
            <span>🚌</span>
            <span>麻糬號庇護車 (5)</span>
          </button>

          <button
            onClick={onToggleNightclubs}
            className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 transition cursor-pointer border ${
              showNightclubs
                ? 'bg-purple-600/20 text-purple-300 border-purple-500/60'
                : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
          >
            <span>🪩</span>
            <span>台北夜店 {clubCount !== undefined ? `(${clubCount})` : ''}</span>
          </button>

          <button
            onClick={onToggleBars}
            className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 transition cursor-pointer border ${
              showBars
                ? 'bg-amber-600/20 text-amber-300 border-amber-500/60'
                : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
          >
            <span>🍸</span>
            <span>合規酒吧 {barCount !== undefined ? `(${barCount})` : ''}</span>
          </button>

          {onToggleCrimeHeatmap && (
            <button
              onClick={onToggleCrimeHeatmap}
              className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 transition cursor-pointer border ${
                showCrimeHeatmap
                  ? 'bg-rose-600/25 text-rose-300 border-rose-500/80 shadow-sm shadow-rose-950'
                  : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-300'
              }`}
              title="切換顯示由歷史報案數據生成的台北夜間治安熱區密度熱圖"
            >
              <Flame className={`w-3.5 h-3.5 ${showCrimeHeatmap ? 'text-rose-400 fill-rose-500 animate-pulse' : 'text-slate-500'}`} />
              <span>治安熱區 ({crimeHotspotsCount})</span>
            </button>
          )}

          {onTogglePolice && (
            <button
              onClick={onTogglePolice}
              className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 transition cursor-pointer border ${
                showPolice
                  ? 'bg-blue-600/25 text-blue-300 border-blue-500/80 shadow-sm shadow-blue-950'
                  : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-300'
              }`}
              title="切換顯示台北市各區 24H 值勤派出所"
            >
              <span>👮</span>
              <span>派出所 {policeCount !== undefined ? `(${policeCount})` : ''}</span>
            </button>
          )}

          {onToggleHospitals && (
            <button
              onClick={onToggleHospitals}
              className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 transition cursor-pointer border ${
                showHospitals
                  ? 'bg-red-600/25 text-red-300 border-red-500/80 shadow-sm shadow-red-950'
                  : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-300'
              }`}
              title="切換顯示台北市 24H 急診責任醫院"
            >
              <span>🏥</span>
              <span>急診醫院 {hospitalCount !== undefined ? `(${hospitalCount})` : ''}</span>
            </button>
          )}

          {/* Quick preset actions */}
          <div className="flex items-center gap-1 border-l border-slate-800 pl-1.5 ml-0.5 shrink-0">
            {onResetDefaultLayers && (
              <button
                onClick={onResetDefaultLayers}
                className="px-2 py-1 rounded-md text-[11px] font-medium text-slate-400 hover:text-emerald-300 hover:bg-slate-900 border border-transparent hover:border-slate-800 transition cursor-pointer"
                title="恢復預設乾淨視圖（僅保留麻糬號庇護專車）"
              >
                重設預設
              </button>
            )}
            {onSelectAllLayers && (
              <button
                onClick={onSelectAllLayers}
                className="px-2 py-1 rounded-md text-[11px] font-medium text-slate-400 hover:text-cyan-300 hover:bg-slate-900 border border-transparent hover:border-slate-800 transition cursor-pointer"
                title="一鍵開啟全部資訊圖層"
              >
                顯示全部
              </button>
            )}
          </div>
        </div>

        {/* District Filter */}
        <div className="flex items-center gap-1 overflow-x-auto">
          <span className="text-[11px] text-slate-400 shrink-0">地區：</span>
          {DISTRICTS.map((dist) => (
            <button
              key={dist}
              onClick={() => onChangeDistrict(dist)}
              className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition cursor-pointer ${
                selectedDistrict === dist
                  ? 'bg-slate-700 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {dist}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
