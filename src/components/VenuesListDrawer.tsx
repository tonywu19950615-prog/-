import React, { useState } from 'react';
import {
  ListFilter,
  MapPin,
  Clock,
  Phone,
  Navigation,
  Shield,
  ChevronDown,
  ChevronUp,
  Bus,
  Search,
  HeartPulse,
  AlertCircle
} from 'lucide-react';
import { SafetyShelter, Venue, PoliceStation, Hospital } from '../types';
import { formatDistance, getDistanceMeters } from '../utils/geo';
import { POLICE_STATIONS } from '../data/policeStations';
import { HOSPITALS } from '../data/hospitals';

interface VenuesListDrawerProps {
  venues: Venue[];
  shelters: SafetyShelter[];
  userLocation: [number, number];
  policeStations?: PoliceStation[];
  hospitals?: Hospital[];
  onSelectShelter: (shelter: SafetyShelter) => void;
  onSelectVenue: (venue: Venue) => void;
  onSelectPolice?: (police: PoliceStation) => void;
  onSelectHospital?: (hospital: Hospital) => void;
  onNavigateToShelter: (shelter: SafetyShelter) => void;
  onNavigateToVenue: (venue: Venue) => void;
  onNavigateToPolice?: (police: PoliceStation) => void;
  onNavigateToHospital?: (hospital: Hospital) => void;
  onOpenQREntry?: (shelter: SafetyShelter) => void;
  selectedShelterId?: string;
  selectedVenueId?: string;
}

export const VenuesListDrawer: React.FC<VenuesListDrawerProps> = ({
  venues,
  shelters,
  userLocation,
  policeStations = POLICE_STATIONS,
  hospitals = HOSPITALS,
  onSelectShelter,
  onSelectVenue,
  onSelectPolice,
  onSelectHospital,
  onNavigateToShelter,
  onNavigateToVenue,
  onNavigateToPolice,
  onNavigateToHospital,
  onOpenQREntry,
  selectedShelterId,
  selectedVenueId,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'shelters' | 'clubs' | 'bars' | 'police' | 'hospitals'>('shelters');
  const [filterText, setFilterText] = useState('');

  // Sort shelters by distance from user
  const sortedShelters = [...shelters].sort((a, b) => {
    const da = getDistanceMeters(userLocation, a.coordinates);
    const db = getDistanceMeters(userLocation, b.coordinates);
    return da - db;
  });

  // Filter venues
  const clubs = venues.filter((v) => v.type === 'nightclub');
  const bars = venues.filter((v) => v.type === 'bar');

  const filteredShelters = sortedShelters.filter(
    (s) =>
      s.name.includes(filterText) ||
      s.district.includes(filterText) ||
      s.locationDescription.includes(filterText)
  );

  const filteredClubs = clubs.filter(
    (c) =>
      c.name.toLowerCase().includes(filterText.toLowerCase()) ||
      c.district.includes(filterText) ||
      c.address.includes(filterText)
  );

  const filteredBars = bars.filter(
    (b) =>
      b.name.toLowerCase().includes(filterText.toLowerCase()) ||
      b.district.includes(filterText) ||
      b.address.includes(filterText)
  );

  const filteredPolice = policeStations.filter(
    (p) =>
      p.name.toLowerCase().includes(filterText.toLowerCase()) ||
      p.district.includes(filterText) ||
      p.address.includes(filterText)
  );

  const filteredHospitals = hospitals.filter(
    (h) =>
      h.name.toLowerCase().includes(filterText.toLowerCase()) ||
      h.district.includes(filterText) ||
      h.address.includes(filterText)
  );

  return (
    <div className="bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-white transition-all duration-300">
      {/* Drawer Toggle Bar */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2.5 flex items-center justify-between cursor-pointer hover:bg-slate-800/80 transition select-none"
      >
        <div className="flex items-center gap-2 flex-wrap">
          <ListFilter className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-black tracking-wide text-slate-200">
            清單瀏覽：台北安全站「麻糬號」、酒吧夜店、24H派出所與急診醫院
          </span>
          <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-1.5 py-0.2 rounded-full border border-emerald-500/30">
            {shelters.length} 庇護車 ｜ {venues.length} 店家 ｜ {policeStations.length} 派出所 ｜ {hospitals.length} 醫院
          </span>
        </div>

        <div className="flex items-center gap-1 text-slate-400 text-xs shrink-0">
          <span>{isOpen ? '收起清單' : '展開完整清單'}</span>
          {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </div>
      </div>

      {/* Expanded Content */}
      {isOpen && (
        <div className="p-4 border-t border-slate-800 max-h-[380px] flex flex-col">
          {/* Sub Navigation Tabs */}
          <div className="flex items-center justify-between gap-2 mb-3 overflow-x-auto">
            <div className="flex gap-1.5 shrink-0">
              <button
                onClick={() => setActiveTab('shelters')}
                className={`text-xs font-bold px-2.5 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'shelters'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span>🚌</span>
                <span>麻糬號專車 ({shelters.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('clubs')}
                className={`text-xs font-bold px-2.5 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'clubs'
                    ? 'bg-purple-600 text-white shadow'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span>🪩</span>
                <span>夜店 ({clubs.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('bars')}
                className={`text-xs font-bold px-2.5 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'bars'
                    ? 'bg-amber-600 text-white shadow'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span>🍸</span>
                <span>酒吧 ({bars.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('police')}
                className={`text-xs font-bold px-2.5 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'police'
                    ? 'bg-blue-600 text-white shadow'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span>👮</span>
                <span>派出所 ({policeStations.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('hospitals')}
                className={`text-xs font-bold px-2.5 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'hospitals'
                    ? 'bg-rose-600 text-white shadow'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span>🏥</span>
                <span>24H急診醫院 ({hospitals.length})</span>
              </button>
            </div>

            {/* In-drawer quick filter text */}
            <div className="relative w-36 hidden sm:block shrink-0">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="過濾清單..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-7 pr-2 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* List Content */}
          <div className="overflow-y-auto space-y-2.5 flex-1 pr-1">
            {/* Shelters List */}
            {activeTab === 'shelters' &&
              filteredShelters.map((s) => {
                const dist = getDistanceMeters(userLocation, s.coordinates);
                const isSelected = selectedShelterId === s.id;

                return (
                  <div
                    key={s.id}
                    className={`p-3 rounded-xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
                      isSelected
                        ? 'bg-emerald-950/70 border-emerald-400 ring-2 ring-emerald-500/30'
                        : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700/80'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="bg-emerald-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded">
                          🚌 麻糬號
                        </span>
                        <h4 className="text-sm font-black text-white">{s.name}</h4>
                        <span className="text-[11px] text-amber-300 font-mono">
                          {s.vehiclePlate}
                        </span>
                        <span className="bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-1.5 py-0.5 rounded">
                          容納 30 人 (在席 {s.currentOccupancy}/30)
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>{s.locationDescription}</span>
                      </p>
                      <div className="text-[11px] text-slate-400 flex flex-wrap items-center gap-2">
                        <span>⏰ {s.operatingHours}</span>
                        <span>•</span>
                        <span>距您約 <strong className="text-emerald-400">{formatDistance(dist)}</strong></span>
                        <span>•</span>
                        <span className="text-[10px] text-indigo-300 bg-indigo-950/50 px-1.5 py-0.5 rounded border border-indigo-500/30">
                          🛡️ 車前內外 AI 監測 🚨 直通{s.securityMonitoring.nearestPoliceStation.name}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 flex-wrap sm:flex-nowrap">
                      {onOpenQREntry && (
                        <button
                          onClick={() => onOpenQREntry(s)}
                          className="bg-amber-500 hover:bg-amber-600 text-xs font-black text-slate-950 px-2.5 py-1.5 rounded-lg transition cursor-pointer shadow"
                          title="掃描車門 QRcode 登記入內"
                        >
                          📱 掃碼開門
                        </button>
                      )}
                      <button
                        onClick={() => onSelectShelter(s)}
                        className="bg-slate-700 hover:bg-slate-600 text-xs font-bold text-slate-200 px-2.5 py-1.5 rounded-lg transition cursor-pointer"
                      >
                        地圖定位
                      </button>
                      <button
                        onClick={() => onNavigateToShelter(s)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition cursor-pointer shadow"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>導航</span>
                      </button>
                    </div>
                  </div>
                );
              })}

            {/* Nightclubs List */}
            {activeTab === 'clubs' &&
              filteredClubs.map((club) => {
                const dist = getDistanceMeters(userLocation, club.coordinates);
                const isSelected = selectedVenueId === club.id;

                return (
                  <div
                    key={club.id}
                    className={`p-3 rounded-xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
                      isSelected
                        ? 'bg-purple-950/70 border-purple-400 ring-2 ring-purple-500/30'
                        : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700/80'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="bg-purple-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded">
                          🪩 夜店
                        </span>
                        <span className="bg-slate-700/80 text-purple-300 text-[10px] font-bold px-1.5 py-0.5 rounded border border-purple-500/30">
                          {club.district}
                        </span>
                        <h4 className="text-sm font-black text-white">{club.name}</h4>
                        <span className="text-[11px] text-amber-400 font-bold">
                          ★ {club.safetyRating}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-purple-400 shrink-0" />
                        <span>{club.address}</span>
                      </p>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2">
                        <span>🛡️ 登記：{club.licenseNumber}</span>
                        <span>•</span>
                        <span>距您約 <strong className="text-cyan-400">{formatDistance(dist)}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => onSelectVenue(club)}
                        className="bg-slate-700 hover:bg-slate-600 text-xs font-bold text-slate-200 px-3 py-1.5 rounded-lg transition cursor-pointer"
                      >
                        檢視詳情
                      </button>
                      <button
                        onClick={() => onNavigateToVenue(club)}
                        className="bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white px-3 py-1.5 rounded-lg flex items-center gap-1 transition cursor-pointer shadow"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>導航</span>
                      </button>
                    </div>
                  </div>
                );
              })}

            {/* Bars List */}
            {activeTab === 'bars' &&
              filteredBars.map((bar) => {
                const dist = getDistanceMeters(userLocation, bar.coordinates);
                const isSelected = selectedVenueId === bar.id;

                return (
                  <div
                    key={bar.id}
                    className={`p-3 rounded-xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
                      isSelected
                        ? 'bg-amber-950/70 border-amber-400 ring-2 ring-amber-500/30'
                        : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700/80'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="bg-amber-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded">
                          🍸 酒吧
                        </span>
                        <span className="bg-slate-700/80 text-amber-300 text-[10px] font-bold px-1.5 py-0.5 rounded border border-amber-500/30">
                          {bar.district}
                        </span>
                        <h4 className="text-sm font-black text-white">{bar.name}</h4>
                        <span className="text-[11px] text-amber-400 font-bold">
                          ★ {bar.safetyRating}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                        <span>{bar.address}</span>
                      </p>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2">
                        <span>📜 {bar.licenseNumber}</span>
                        <span>•</span>
                        <span>距您約 <strong className="text-amber-400">{formatDistance(dist)}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => onSelectVenue(bar)}
                        className="bg-slate-700 hover:bg-slate-600 text-xs font-bold text-slate-200 px-3 py-1.5 rounded-lg transition cursor-pointer"
                      >
                        檢視詳情
                      </button>
                      <button
                        onClick={() => onNavigateToVenue(bar)}
                        className="bg-amber-600 hover:bg-amber-500 text-xs font-bold text-white px-3 py-1.5 rounded-lg flex items-center gap-1 transition cursor-pointer shadow"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>導航</span>
                      </button>
                    </div>
                  </div>
                );
              })}

            {/* Police Stations List */}
            {activeTab === 'police' &&
              filteredPolice.map((police) => {
                const dist = getDistanceMeters(userLocation, police.coordinates);
                return (
                  <div
                    key={police.id}
                    className="p-3 rounded-xl border flex items-center justify-between gap-3 transition bg-slate-800/80 hover:bg-slate-800 border-slate-700/80"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="bg-blue-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded">
                          👮 派出所
                        </span>
                        <span className="bg-slate-700/80 text-blue-300 text-[10px] font-bold px-1.5 py-0.5 rounded border border-blue-500/30">
                          {police.district}
                        </span>
                        <h4 className="text-sm font-black text-white">{police.name}</h4>
                        <span className="bg-emerald-500/20 text-emerald-300 text-[9px] font-bold px-1.5 py-0.2 rounded">
                          24H值勤
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-blue-400 shrink-0" />
                        <span>{police.address}</span>
                      </p>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2">
                        <span>📞 {police.phone}</span>
                        <span>•</span>
                        <span>距您約 <strong className="text-blue-400">{formatDistance(dist)}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => onSelectPolice?.(police)}
                        className="bg-slate-700 hover:bg-slate-600 text-xs font-bold text-slate-200 px-3 py-1.5 rounded-lg transition cursor-pointer"
                      >
                        詳情
                      </button>
                      <button
                        onClick={() => onNavigateToPolice?.(police)}
                        className="bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white px-3 py-1.5 rounded-lg flex items-center gap-1 transition cursor-pointer shadow"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>導航</span>
                      </button>
                    </div>
                  </div>
                );
              })}

            {/* Emergency Hospitals List */}
            {activeTab === 'hospitals' &&
              filteredHospitals.map((hosp) => {
                const dist = getDistanceMeters(userLocation, hosp.coordinates);
                return (
                  <div
                    key={hosp.id}
                    className="p-3 rounded-xl border flex items-center justify-between gap-3 transition bg-slate-800/80 hover:bg-slate-800 border-slate-700/80"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="bg-rose-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded">
                          🏥 24H急診
                        </span>
                        <span className="bg-slate-700/80 text-rose-300 text-[10px] font-bold px-1.5 py-0.5 rounded border border-rose-500/30">
                          {hosp.district}
                        </span>
                        <h4 className="text-sm font-black text-white">{hosp.name}</h4>
                        <span className="bg-rose-500/20 text-rose-300 text-[9px] font-bold px-1.5 py-0.2 rounded border border-rose-500/30">
                          {hosp.level}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
                        <span>{hosp.address}</span>
                      </p>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2">
                        <span>🚑 {hosp.emergencyRoomPhone}</span>
                        <span>•</span>
                        <span>距您約 <strong className="text-rose-400">{formatDistance(dist)}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => onSelectHospital?.(hosp)}
                        className="bg-slate-700 hover:bg-slate-600 text-xs font-bold text-slate-200 px-3 py-1.5 rounded-lg transition cursor-pointer"
                      >
                        詳情
                      </button>
                      <button
                        onClick={() => onNavigateToHospital?.(hosp)}
                        className="bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white px-3 py-1.5 rounded-lg flex items-center gap-1 transition cursor-pointer shadow"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>導航</span>
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};
