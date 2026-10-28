/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { MapComponent } from './components/MapComponent';
import { EmergencyModal } from './components/EmergencyModal';
import { NavigationPanel } from './components/NavigationPanel';
import { DetailModal } from './components/DetailModal';
import { VenuesListDrawer } from './components/VenuesListDrawer';
import { ShelterEntryModal } from './components/ShelterEntryModal';
import { SafetyGuideModal } from './components/SafetyGuideModal';
import { DetourAlertModal } from './components/DetourAlertModal';
import { TrafficMonitorBanner } from './components/TrafficMonitorBanner';
import { SHELTERS } from './data/shelters';
import { VENUES } from './data/venues';
import { TRAFFIC_EVENTS, getActiveTrafficEvent } from './data/trafficEvents';
import { CRIME_HOTSPOTS } from './data/crimeHeatmap';
import { POLICE_STATIONS } from './data/policeStations';
import { HOSPITALS } from './data/hospitals';
import { CrimeHotspotDetailModal } from './components/CrimeHotspotDetailModal';
import { PoliceHospitalModal } from './components/PoliceHospitalModal';
import { SafetyShelter, Venue, RouteInfo, ShelterBoardingPass, TrafficEvent, CrimeIncidentPoint, PoliceStation, Hospital } from './types';
import {
  findNearestShelter,
  getDistanceMeters,
  getEstimatedWalkTimeMinutes,
  generateWalkingRoute,
  formatDistance,
} from './utils/geo';
import {
  PhoneCall,
  Compass,
  Crosshair,
  Shield,
  AlertTriangle,
  Bus,
  Sparkles,
} from 'lucide-react';

// Default initial location: Taipei Daan/Zhongxiao intersection
const DEFAULT_LOCATION: [number, number] = [25.0420, 121.5435];

export default function App() {
  const [userLocation, setUserLocation] = useState<[number, number]>(DEFAULT_LOCATION);
  const [locationStatus, setLocationStatus] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  
  // Selection states
  const [selectedShelter, setSelectedShelter] = useState<SafetyShelter | null>(null);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  
  // Navigation active route
  const [activeRoute, setActiveRoute] = useState<RouteInfo | null>(null);
  
  // Emergency Modal
  const [isSOSOpen, setIsSOSOpen] = useState(false);

  // Safety Guide Modal
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Traffic & Safe Detour states
  const [trafficEvents, setTrafficEvents] = useState<TrafficEvent[]>(TRAFFIC_EVENTS);
  const [detourEvent, setDetourEvent] = useState<TrafficEvent | null>(null);
  const [isDetourModalOpen, setIsDetourModalOpen] = useState(false);
  const [isTrafficRefreshing, setIsTrafficRefreshing] = useState(false);
  const [hasShownInitialAlert, setHasShownInitialAlert] = useState(false);

  // QR Entry and Boarding Pass states
  const [qrEntryShelter, setQrEntryShelter] = useState<SafetyShelter | null>(null);
  const [activeBoardingPass, setActiveBoardingPass] = useState<ShelterBoardingPass | null>(null);
  
  // Filtering & Layer toggles - 預設不全部類別都顯示，僅預設顯示核心「麻糬號」安全庇護專車
  const [showShelters, setShowShelters] = useState(true);
  const [showBars, setShowBars] = useState(false);
  const [showNightclubs, setShowNightclubs] = useState(false);
  const [showCrimeHeatmap, setShowCrimeHeatmap] = useState(false);
  const [showPolice, setShowPolice] = useState(false);
  const [showHospitals, setShowHospitals] = useState(false);
  const [selectedCrimeHotspot, setSelectedCrimeHotspot] = useState<CrimeIncidentPoint | null>(null);
  const [selectedPolice, setSelectedPolice] = useState<PoliceStation | null>(null);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSelectAllLayers = () => {
    setShowShelters(true);
    setShowBars(true);
    setShowNightclubs(true);
    setShowCrimeHeatmap(true);
    setShowPolice(true);
    setShowHospitals(true);
  };

  const handleResetDefaultLayers = () => {
    setShowShelters(true);
    setShowBars(false);
    setShowNightclubs(false);
    setShowCrimeHeatmap(false);
    setShowPolice(false);
    setShowHospitals(false);
  };

  // Auto request location on load
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation([pos.coords.latitude, pos.coords.longitude]);
          setLocationStatus('granted');
        },
        (err) => {
          console.log('Using default Taipei nightlife center coordinates', err);
          setLocationStatus('denied');
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    }
  }, []);

  // Compute nearest shelter
  const nearestShelterData = useMemo(() => {
    return findNearestShelter(userLocation, SHELTERS);
  }, [userLocation]);

  // Filter venues by search & district
  const filteredVenues = useMemo(() => {
    return VENUES.filter((venue) => {
      if (selectedDistrict !== '全部' && venue.district !== selectedDistrict) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = venue.name.toLowerCase().includes(q);
        const matchDistrict = venue.district.toLowerCase().includes(q);
        const matchAddress = venue.address.toLowerCase().includes(q);
        const matchTags = venue.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchName && !matchDistrict && !matchAddress && !matchTags) {
          return false;
        }
      }
      return true;
    });
  }, [selectedDistrict, searchQuery]);

  // Handlers for Navigation
  const handleStartRouteToShelter = (shelter: SafetyShelter) => {
    const dist = getDistanceMeters(userLocation, shelter.coordinates);
    const duration = getEstimatedWalkTimeMinutes(dist);
    const path = generateWalkingRoute(userLocation, shelter.coordinates);

    const steps = [
      `從目前定位出發，保持警覺，沿寬敞照明路段行進`,
      `朝【${shelter.name}】方向步行約 ${formatDistance(dist)}（預計 ${duration} 分鐘）`,
      `途經 ${shelter.locationDescription}，注意車流並走人行道`,
      `抵達【${shelter.name}】（遊覽車牌：${shelter.vehiclePlate}），尋求駐點員警與救護人員支援`,
    ];

    setActiveRoute({
      destinationName: shelter.name,
      destinationType: 'shelter',
      distanceMeters: dist,
      durationMinutes: duration,
      coordinates: path,
      steps,
    });

    setSelectedShelter(shelter);
    setSelectedVenue(null);
  };

  const handleStartRouteToVenue = (venue: Venue) => {
    const dist = getDistanceMeters(userLocation, venue.coordinates);
    const duration = getEstimatedWalkTimeMinutes(dist);
    const path = generateWalkingRoute(userLocation, venue.coordinates);

    const steps = [
      `從目前位置出發，沿大馬路安全動線步行`,
      `朝 ${venue.district} ${venue.name} 前進（約 ${formatDistance(dist)}）`,
      `抵達 ${venue.address}，入內請配合安檢並注意飲酒安全`,
      `若需安全協助，附近有治安熱區遊覽車庇護所【麻糬號】隨時提供支援`,
    ];

    setActiveRoute({
      destinationName: venue.name,
      destinationType: 'venue',
      distanceMeters: dist,
      durationMinutes: duration,
      coordinates: path,
      steps,
    });

    setSelectedVenue(venue);
    setSelectedShelter(null);
    setSelectedPolice(null);
    setSelectedHospital(null);
  };

  const handleStartRouteToPolice = (police: PoliceStation) => {
    const dist = getDistanceMeters(userLocation, police.coordinates);
    const duration = getEstimatedWalkTimeMinutes(dist);
    const path = generateWalkingRoute(userLocation, police.coordinates);

    setActiveRoute({
      destinationName: police.name,
      destinationType: 'police',
      distanceMeters: dist,
      durationMinutes: duration,
      coordinates: path,
      steps: [
        `從目前位置出發，沿著照明良好道路快步前往`,
        `朝【${police.name}】前進（約 ${formatDistance(dist)}，步行約 ${duration} 分鐘）`,
        `值勤地址：${police.address}，電話：${police.phone}`,
        `進入派出所向 24 小時值勤員警尋求庇護與安全協助`
      ],
    });

    setSelectedPolice(police);
    setSelectedHospital(null);
    setSelectedShelter(null);
    setSelectedVenue(null);
  };

  const handleStartRouteToHospital = (hospital: Hospital) => {
    const dist = getDistanceMeters(userLocation, hospital.coordinates);
    const duration = Math.max(3, Math.round(dist / 350));
    const path = generateWalkingRoute(userLocation, hospital.coordinates);

    setActiveRoute({
      destinationName: hospital.name,
      destinationType: 'hospital',
      distanceMeters: dist,
      durationMinutes: duration,
      coordinates: path,
      steps: [
        `從目前位置出發，前往【${hospital.name}】24小時急診中心`,
        `急診專線：${hospital.emergencyRoomPhone}，預估路程 ${formatDistance(dist)}`,
        `抵達醫院急診部入口（${hospital.address}），辦理緊急醫療處置`
      ],
    });

    setSelectedHospital(hospital);
    setSelectedPolice(null);
    setSelectedShelter(null);
    setSelectedVenue(null);
  };

  // Auto alert on startup after brief delay for high-impact event
  useEffect(() => {
    if (!hasShownInitialAlert) {
      const timer = setTimeout(() => {
        const topEvent = trafficEvents.find(e => e.severity === 'high');
        if (topEvent) {
          setDetourEvent(topEvent);
          setIsDetourModalOpen(true);
          setHasShownInitialAlert(true);
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [hasShownInitialAlert, trafficEvents]);

  // When shelter is selected, check if active incident exists nearby and trigger detour prompt
  useEffect(() => {
    if (selectedShelter) {
      const activeEvt = getActiveTrafficEvent(selectedShelter.id);
      if (activeEvt) {
        setDetourEvent(activeEvt);
        setIsDetourModalOpen(true);
      }
    }
  }, [selectedShelter]);

  // Handler for Applying Detour Navigation
  const handleApplyDetour = (event: TrafficEvent) => {
    const targetShelter = SHELTERS.find(s => s.id === event.shelterId) || nearestShelterData.shelter;
    const dist = getDistanceMeters(userLocation, targetShelter.coordinates);
    const baseDuration = getEstimatedWalkTimeMinutes(dist);
    const duration = baseDuration + event.detour.extraMinutes;

    // Build detour path: userLocation -> detour waypoints -> shelter coordinates
    const detourPath: [number, number][] = [
      userLocation,
      ...event.detour.detourWaypoints
    ];

    setActiveRoute({
      destinationName: `${targetShelter.name}（安全繞道）`,
      destinationType: 'shelter',
      distanceMeters: Math.round(dist * 1.15),
      durationMinutes: duration,
      coordinates: detourPath,
      steps: event.detour.stepInstructions,
      isDetour: true,
      detourReason: event.detour.adviceSummary,
      avoidStreets: event.detour.avoidStreets,
    });

    setSelectedShelter(targetShelter);
    setSelectedVenue(null);
    setIsDetourModalOpen(false);
  };

  // Google Search refresh simulation
  const handleRefreshTraffic = () => {
    setIsTrafficRefreshing(true);
    setTimeout(() => {
      setIsTrafficRefreshing(false);
      const now = new Date();
      const updatedStr = `即時更新於 ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      setTrafficEvents(prev => prev.map(e => ({ ...e, updatedAt: updatedStr })));
    }, 800);
  };

  // Quick action: Navigate directly to nearest shelter
  const handleNavigateToNearestShelter = () => {
    handleStartRouteToShelter(nearestShelterData.shelter);
  };

  // Re-center on current user GPS
  const handleLocateMe = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newCoords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
          setUserLocation(newCoords);
          setLocationStatus('granted');
        },
        () => {
          alert('請於瀏覽器設定中允許讀取 GPS 定位權限');
        },
        { enableHighAccuracy: true }
      );
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Top Navbar with Filters & 5 Hotspots */}
      <Navbar
        shelters={SHELTERS}
        selectedDistrict={selectedDistrict}
        onChangeDistrict={setSelectedDistrict}
        showShelters={showShelters}
        onToggleShelters={() => setShowShelters(!showShelters)}
        showBars={showBars}
        onToggleBars={() => setShowBars(!showBars)}
        showNightclubs={showNightclubs}
        onToggleNightclubs={() => setShowNightclubs(!showNightclubs)}
        showCrimeHeatmap={showCrimeHeatmap}
        onToggleCrimeHeatmap={() => setShowCrimeHeatmap(!showCrimeHeatmap)}
        crimeHotspotsCount={CRIME_HOTSPOTS.length}
        showPolice={showPolice}
        onTogglePolice={() => setShowPolice(!showPolice)}
        policeCount={POLICE_STATIONS.filter((p) => selectedDistrict === '全部' || p.district === selectedDistrict).length}
        showHospitals={showHospitals}
        onToggleHospitals={() => setShowHospitals(!showHospitals)}
        hospitalCount={HOSPITALS.filter((h) => selectedDistrict === '全部' || h.district === selectedDistrict).length}
        barCount={filteredVenues.filter((v) => v.type === 'bar').length}
        clubCount={filteredVenues.filter((v) => v.type === 'nightclub').length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenSOS={() => setIsSOSOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenTrafficMonitor={() => {
          setDetourEvent(trafficEvents[0]);
          setIsDetourModalOpen(true);
        }}
        onSelectShelter={(shelter) => {
          setSelectedShelter(shelter);
          setSelectedVenue(null);
          setSelectedPolice(null);
          setSelectedHospital(null);
        }}
        onNavigateToNearestShelter={handleNavigateToNearestShelter}
        onSelectAllLayers={handleSelectAllLayers}
        onResetDefaultLayers={handleResetDefaultLayers}
      />

      {/* Main Content Area (Interactive Map & Floating HUD) */}
      <div className="relative flex-1 w-full min-h-0 overflow-hidden">
        {/* Real-time Google Search Event & Traffic Monitor Banner */}
        <TrafficMonitorBanner
          events={trafficEvents}
          activeEvent={detourEvent}
          onOpenDetourModal={(evt) => {
            if (evt) setDetourEvent(evt);
            setIsDetourModalOpen(true);
          }}
          onRefreshEvents={handleRefreshTraffic}
          isRefreshing={isTrafficRefreshing}
        />

        {/* Leaflet Interactive Map */}
        <MapComponent
          shelters={SHELTERS}
          venues={filteredVenues}
          userLocation={userLocation}
          selectedShelter={selectedShelter}
          selectedVenue={selectedVenue}
          selectedPolice={selectedPolice}
          selectedHospital={selectedHospital}
          activeRoute={activeRoute}
          trafficEvents={trafficEvents}
          onOpenTrafficEvent={(evt) => {
            setDetourEvent(evt);
            setIsDetourModalOpen(true);
          }}
          onSelectShelter={(shelter) => {
            setSelectedShelter(shelter);
            setSelectedVenue(null);
            setSelectedPolice(null);
            setSelectedHospital(null);
          }}
          onSelectVenue={(venue) => {
            setSelectedVenue(venue);
            setSelectedShelter(null);
            setSelectedPolice(null);
            setSelectedHospital(null);
          }}
          onSelectPolice={(police) => {
            setSelectedPolice(police);
            setSelectedHospital(null);
            setSelectedShelter(null);
            setSelectedVenue(null);
          }}
          onSelectHospital={(hosp) => {
            setSelectedHospital(hosp);
            setSelectedPolice(null);
            setSelectedShelter(null);
            setSelectedVenue(null);
          }}
          onStartRouteToShelter={handleStartRouteToShelter}
          onStartRouteToVenue={handleStartRouteToVenue}
          onStartRouteToPolice={handleStartRouteToPolice}
          onStartRouteToHospital={handleStartRouteToHospital}
          onOpenQREntry={(shelter) => setQrEntryShelter(shelter)}
          showShelters={showShelters}
          showBars={showBars}
          showNightclubs={showNightclubs}
          showCrimeHeatmap={showCrimeHeatmap}
          onToggleCrimeHeatmap={() => setShowCrimeHeatmap(!showCrimeHeatmap)}
          showPolice={showPolice}
          showHospitals={showHospitals}
          crimeHotspots={CRIME_HOTSPOTS}
          policeStations={POLICE_STATIONS}
          hospitals={HOSPITALS}
          onSelectCrimeHotspot={(hotspot) => setSelectedCrimeHotspot(hotspot)}
          selectedDistrict={selectedDistrict}
        />

        {/* Floating Quick Action Widget: Nearest "麻糬號" Shelter HUD */}
        <div className="absolute top-3 left-3 z-30 max-w-xs sm:max-w-sm pointer-events-auto">
          <div className="bg-slate-900/90 backdrop-blur-md border border-emerald-500/60 rounded-xl p-2.5 shadow-2xl text-xs space-y-1.5 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black text-emerald-300 flex items-center gap-1.5">
                <span className="animate-pulse text-sm">🚌</span>
                <span>離您最近：{nearestShelterData.shelter.name}</span>
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-emerald-500/40">
                約 {formatDistance(nearestShelterData.distanceMeters)}
              </span>
            </div>

            <p className="text-[11px] text-slate-300 truncate">
              {nearestShelterData.shelter.locationDescription}
            </p>

            <div className="flex items-center justify-between text-[10px] text-slate-400 bg-slate-950/60 p-1.5 rounded-lg border border-slate-800">
              <span className="text-emerald-300 font-bold flex items-center gap-1">
                👥 容納 30 人（餘 {Math.max(0, 30 - nearestShelterData.shelter.currentOccupancy)} 席）
              </span>
              <span className="text-indigo-300 font-bold flex items-center gap-1">
                🛡️ AI 前內外監測 🚨 直通派出所
              </span>
            </div>

            <div className="flex gap-1.5 pt-0.5">
              <button
                onClick={() => setQrEntryShelter(nearestShelterData.shelter)}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-1 px-2 rounded-lg flex items-center justify-center gap-1 transition cursor-pointer text-[11px] shadow"
                title="掃描車門 QRcode 登記入內"
              >
                <span>📱 掃碼開門</span>
              </button>
              <button
                onClick={() => handleStartRouteToShelter(nearestShelterData.shelter)}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-1 px-2 rounded-lg flex items-center justify-center gap-1 transition cursor-pointer text-[11px] shadow"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>路線導航</span>
              </button>
              <button
                onClick={() => setSelectedShelter(nearestShelterData.shelter)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 py-1 px-2 rounded-lg transition cursor-pointer text-[11px] border border-slate-700"
              >
                詳情
              </button>
            </div>
          </div>
        </div>

        {/* Floating Map Utility Buttons (Locate GPS & Quick SOS) */}
        <div className="absolute bottom-6 right-4 z-30 flex flex-col gap-2 pointer-events-auto">
          {/* Re-locate GPS */}
          <button
            onClick={handleLocateMe}
            className="w-10 h-10 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white flex items-center justify-center shadow-lg transition cursor-pointer active:scale-95"
            title="定位我的目前位置"
          >
            <Crosshair className="w-5 h-5 text-blue-400" />
          </button>

          {/* Quick SOS Trigger Floating Button */}
          <button
            onClick={() => setIsSOSOpen(true)}
            className="w-12 h-12 rounded-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white flex items-center justify-center shadow-[0_0_25px_rgba(239,68,68,0.7)] transition cursor-pointer active:scale-95 border-2 border-red-300 animate-pulse"
            title="緊急一鍵報警 110"
          >
            <PhoneCall className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Active Route Floating Overlay Panel */}
        {activeRoute && (
          <div className="absolute bottom-4 left-4 z-30 w-[92%] sm:w-96 max-w-md pointer-events-auto">
            <NavigationPanel
              route={activeRoute}
              shelter={selectedShelter}
              venue={selectedVenue}
              onClose={() => setActiveRoute(null)}
              onOpenSOS={() => setIsSOSOpen(true)}
            />
          </div>
        )}
      </div>

      {/* Bottom Drawer for Venues, Shelters, Police, and Hospitals List */}
      <VenuesListDrawer
        venues={filteredVenues}
        shelters={SHELTERS}
        policeStations={POLICE_STATIONS.filter((p) => selectedDistrict === '全部' || p.district === selectedDistrict)}
        hospitals={HOSPITALS.filter((h) => selectedDistrict === '全部' || h.district === selectedDistrict)}
        userLocation={userLocation}
        onSelectShelter={(shelter) => {
          setSelectedShelter(shelter);
          setSelectedVenue(null);
          setSelectedPolice(null);
          setSelectedHospital(null);
        }}
        onSelectVenue={(venue) => {
          setSelectedVenue(venue);
          setSelectedShelter(null);
          setSelectedPolice(null);
          setSelectedHospital(null);
        }}
        onSelectPolice={(police) => {
          setSelectedPolice(police);
          setSelectedHospital(null);
          setSelectedShelter(null);
          setSelectedVenue(null);
        }}
        onSelectHospital={(hosp) => {
          setSelectedHospital(hosp);
          setSelectedPolice(null);
          setSelectedShelter(null);
          setSelectedVenue(null);
        }}
        onNavigateToShelter={handleStartRouteToShelter}
        onNavigateToVenue={handleStartRouteToVenue}
        onNavigateToPolice={handleStartRouteToPolice}
        onNavigateToHospital={handleStartRouteToHospital}
        onOpenQREntry={(shelter) => setQrEntryShelter(shelter)}
        selectedShelterId={selectedShelter?.id}
        selectedVenueId={selectedVenue?.id}
      />

      {/* Detail Modal for Selected Shelter or Venue */}
      {(selectedShelter || selectedVenue) && !activeRoute && (
        <DetailModal
          shelter={selectedShelter}
          venue={selectedVenue}
          userLocation={userLocation}
          onClose={() => {
            setSelectedShelter(null);
            setSelectedVenue(null);
          }}
          onNavigateToShelter={handleStartRouteToShelter}
          onNavigateToVenue={handleStartRouteToVenue}
          onOpenQREntry={(shelter) => setQrEntryShelter(shelter)}
          allShelters={SHELTERS}
        />
      )}

      {/* One-Click Emergency SOS Modal */}
      <EmergencyModal
        isOpen={isSOSOpen}
        onClose={() => setIsSOSOpen(false)}
        userLocation={userLocation}
        nearestShelter={nearestShelterData}
        onNavigateToNearestShelter={handleNavigateToNearestShelter}
      />

      {/* QR Code Entrance & Passenger Registration Modal */}
      <ShelterEntryModal
        isOpen={!!qrEntryShelter}
        shelter={qrEntryShelter}
        onClose={() => setQrEntryShelter(null)}
        onCheckInComplete={(pass) => setActiveBoardingPass(pass)}
      />

      {/* Night Safety Guidebook Modal (夜間安全錦囊) */}
      <SafetyGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        shelters={SHELTERS}
        onSelectShelter={(shelter) => {
          setSelectedShelter(shelter);
          setSelectedVenue(null);
        }}
        onOpenSOS={() => setIsSOSOpen(true)}
      />

      {/* Detour Alert & Incident Modal (突發狀況安全繞路提示) */}
      <DetourAlertModal
        isOpen={isDetourModalOpen}
        event={detourEvent}
        onClose={() => setIsDetourModalOpen(false)}
        onApplyDetour={handleApplyDetour}
        allEvents={trafficEvents}
        shelters={SHELTERS}
      />

      {/* Historical Nighttime Crime Hotspot Detail Modal */}
      {selectedCrimeHotspot && (
        <CrimeHotspotDetailModal
          hotspot={selectedCrimeHotspot}
          onClose={() => setSelectedCrimeHotspot(null)}
          shelters={SHELTERS}
          onNavigateToShelter={handleStartRouteToShelter}
        />
      )}

      {/* Police Station and Hospital Detail Modal */}
      {(selectedPolice || selectedHospital) && (
        <PoliceHospitalModal
          policeStation={selectedPolice}
          hospital={selectedHospital}
          onClose={() => {
            setSelectedPolice(null);
            setSelectedHospital(null);
          }}
          onNavigateToPolice={handleStartRouteToPolice}
          onNavigateToHospital={handleStartRouteToHospital}
        />
      )}
    </div>
  );
}
