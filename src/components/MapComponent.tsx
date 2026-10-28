import React, { useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import { SafetyShelter, Venue, RouteInfo, TrafficEvent, CrimeIncidentPoint, PoliceStation, Hospital } from '../types';
import { CRIME_HOTSPOTS, checkRouteHighRiskHotspots } from '../data/crimeHeatmap';
import { POLICE_STATIONS } from '../data/policeStations';
import { HOSPITALS } from '../data/hospitals';
import { CrimeHeatmapLegend } from './CrimeHeatmapLegend';
import { ShieldAlert, Flame, AlertTriangle, Shield, HeartPulse } from 'lucide-react';

interface MapComponentProps {
  shelters: SafetyShelter[];
  venues: Venue[];
  userLocation: [number, number];
  selectedShelter: SafetyShelter | null;
  selectedVenue: Venue | null;
  selectedPolice?: PoliceStation | null;
  selectedHospital?: Hospital | null;
  activeRoute: RouteInfo | null;
  onSelectShelter: (shelter: SafetyShelter) => void;
  onSelectVenue: (venue: Venue) => void;
  onSelectPolice?: (police: PoliceStation) => void;
  onSelectHospital?: (hospital: Hospital) => void;
  onStartRouteToShelter: (shelter: SafetyShelter) => void;
  onStartRouteToVenue: (venue: Venue) => void;
  onStartRouteToPolice?: (police: PoliceStation) => void;
  onStartRouteToHospital?: (hospital: Hospital) => void;
  onOpenQREntry: (shelter: SafetyShelter) => void;
  showShelters: boolean;
  showBars: boolean;
  showNightclubs: boolean;
  showPolice?: boolean;
  showHospitals?: boolean;
  selectedDistrict: string;
  trafficEvents?: TrafficEvent[];
  onOpenTrafficEvent?: (event: TrafficEvent) => void;
  showCrimeHeatmap?: boolean;
  onToggleCrimeHeatmap?: () => void;
  crimeHotspots?: CrimeIncidentPoint[];
  onSelectCrimeHotspot?: (hotspot: CrimeIncidentPoint) => void;
  policeStations?: PoliceStation[];
  hospitals?: Hospital[];
}

export const MapComponent: React.FC<MapComponentProps> = ({
  shelters,
  venues,
  userLocation,
  selectedShelter,
  selectedVenue,
  selectedPolice,
  selectedHospital,
  activeRoute,
  onSelectShelter,
  onSelectVenue,
  onSelectPolice,
  onSelectHospital,
  onStartRouteToShelter,
  onStartRouteToVenue,
  onStartRouteToPolice,
  onStartRouteToHospital,
  onOpenQREntry,
  showShelters,
  showBars,
  showNightclubs,
  showPolice = false,
  showHospitals = false,
  selectedDistrict,
  trafficEvents = [],
  onOpenTrafficEvent,
  showCrimeHeatmap = false,
  onToggleCrimeHeatmap,
  crimeHotspots = CRIME_HOTSPOTS,
  onSelectCrimeHotspot,
  policeStations = POLICE_STATIONS,
  hospitals = HOSPITALS,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const trafficEventsLayerRef = useRef<L.LayerGroup | null>(null);
  const crimeHeatmapLayerRef = useRef<L.LayerGroup | null>(null);
  const policeLayerRef = useRef<L.LayerGroup | null>(null);
  const hospitalsLayerRef = useRef<L.LayerGroup | null>(null);
  const routeLayerRef = useRef<L.Polyline | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const [mapTheme, setMapTheme] = useState<'osm' | 'dark' | 'voyager'>('osm');
  const [heatmapOpacity, setHeatmapOpacity] = useState<number>(0.85);

  // Fix default icon issues in Leaflet bundlers
  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Center on central Taipei (around Daan / Zhongshan / Xinyi)
    const map = L.map(mapContainerRef.current, {
      center: [25.0425, 121.5400],
      zoom: 13,
      zoomControl: false,
    });

    // Primary OpenStreetMap standard tiles
    const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
      subdomains: ['a', 'b', 'c'],
    });
    tileLayer.addTo(map);
    tileLayerRef.current = tileLayer;

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    crimeHeatmapLayerRef.current = L.layerGroup().addTo(map);
    policeLayerRef.current = L.layerGroup().addTo(map);
    hospitalsLayerRef.current = L.layerGroup().addTo(map);
    markersLayerRef.current = L.layerGroup().addTo(map);
    trafficEventsLayerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    // Force map to adapt to container size multiple times to prevent blank/grey tiles
    const resizeHandler = () => {
      if (map) {
        map.invalidateSize();
      }
    };

    window.addEventListener('resize', resizeHandler);

    const t1 = setTimeout(resizeHandler, 50);
    const t2 = setTimeout(resizeHandler, 250);
    const t3 = setTimeout(resizeHandler, 600);
    const t4 = setTimeout(resizeHandler, 1200);

    let resizeObserver: ResizeObserver | null = null;
    if (mapContainerRef.current && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        resizeHandler();
      });
      resizeObserver.observe(mapContainerRef.current);
    }

    return () => {
      window.removeEventListener('resize', resizeHandler);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update tile layer on theme change
  useEffect(() => {
    if (!mapRef.current) return;

    if (tileLayerRef.current) {
      mapRef.current.removeLayer(tileLayerRef.current);
      tileLayerRef.current = null;
    }

    const configs: Record<'osm' | 'dark' | 'voyager', { url: string; subdomains: string[]; attribution: string }> = {
      osm: {
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        subdomains: ['a', 'b', 'c'],
        attribution: '&copy; OpenStreetMap',
      },
      dark: {
        url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        subdomains: ['a', 'b', 'c', 'd'],
        attribution: '&copy; CARTO &copy; OSM',
      },
      voyager: {
        url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        subdomains: ['a', 'b', 'c', 'd'],
        attribution: '&copy; CARTO &copy; OSM',
      },
    };

    const cfg = configs[mapTheme];
    const newLayer = L.tileLayer(cfg.url, {
      attribution: cfg.attribution,
      maxZoom: 19,
      subdomains: cfg.subdomains,
    }).addTo(mapRef.current);

    tileLayerRef.current = newLayer;
    mapRef.current.invalidateSize();
  }, [mapTheme]);

  // Update user marker
  useEffect(() => {
    if (!mapRef.current) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng(userLocation);
    } else {
      const userIcon = L.divIcon({
        className: 'user-location-marker',
        html: `
          <div class="relative flex items-center justify-center w-8 h-8">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-4 w-4 bg-blue-600 border-2 border-white shadow-lg"></span>
            <div class="absolute -bottom-5 whitespace-nowrap bg-blue-900/90 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow border border-blue-400/50">我的位置</div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      userMarkerRef.current = L.marker(userLocation, {
        icon: userIcon,
        zIndexOffset: 1000,
      }).addTo(mapRef.current);
    }
  }, [userLocation]);

  // Update markers on data or filter change
  useEffect(() => {
    if (!mapRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    // 1. Render "麻糬號" Tour Bus Safety Shelters (游覽車圖案標示)
    if (showShelters) {
      shelters.forEach((shelter) => {
        if (selectedDistrict !== '全部' && shelter.district !== selectedDistrict) {
          return;
        }

        const isSelected = selectedShelter?.id === shelter.id;

        // Custom Tour Bus Marker with animated pulsing beacon
        const shelterIcon = L.divIcon({
          className: 'custom-shelter-marker',
          html: `
            <div class="group relative cursor-pointer transform transition-transform duration-200 hover:scale-115 ${isSelected ? 'scale-120' : ''}">
              <!-- Pulsing Green Radar Halo for High Night Visibility -->
              <div class="absolute -inset-2 bg-emerald-500/30 rounded-full blur-sm animate-pulse"></div>
              
              <!-- Tour Bus Badge Container -->
              <div class="relative flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white px-2.5 py-1.5 rounded-full shadow-2xl border-2 ${isSelected ? 'border-amber-300 ring-4 ring-emerald-400/40' : 'border-emerald-200/90'}">
                <!-- Tour Bus SVG Icon -->
                <div class="bg-white text-emerald-700 p-1 rounded-full shadow">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M8 6v6"/>
                    <path d="M15 6v6"/>
                    <path d="M2 12h19.6"/>
                    <path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.6-.1-1.1-.3-1.6L20 8H4l-1.7 4.4c-.2.5-.3 1-.3 1.6 0 .4.1.8.2 1.2.3 1.1.8 2.8.8 2.8h3"/>
                    <circle cx="7" cy="18" r="2"/>
                    <path d="M9 18h5"/>
                    <circle cx="16" cy="18" r="2"/>
                  </svg>
                </div>
                <div class="flex flex-col pr-1">
                  <span class="text-xs font-black tracking-wider leading-none text-white drop-shadow">麻糬號</span>
                  <span class="text-[9px] text-emerald-100 font-medium leading-tight">安全庇護車</span>
                </div>
              </div>

              <!-- Pin Pointer Triangle -->
              <div class="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[7px] border-t-emerald-700 mx-auto -mt-0.5"></div>
            </div>
          `,
          iconSize: [110, 42],
          iconAnchor: [55, 38],
        });

        const marker = L.marker(shelter.coordinates, {
          icon: shelterIcon,
          zIndexOffset: 800,
        });

        // Popup with Quick Actions
        const popupContent = document.createElement('div');
        popupContent.className = 'p-3 min-w-[240px] text-slate-800';
        popupContent.innerHTML = `
          <div class="flex items-center gap-2 mb-1.5">
            <span class="bg-emerald-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              🚌 遊覽車安全庇護所
            </span>
            <span class="bg-amber-100 text-amber-800 text-[10px] font-semibold px-1.5 py-0.5 rounded border border-amber-300">
              ${shelter.vehiclePlate}
            </span>
          </div>
          <h3 class="text-base font-black text-slate-900 leading-tight mb-1">${shelter.name}</h3>
          <p class="text-xs text-slate-600 mb-2 leading-relaxed">${shelter.locationDescription}</p>
          <div class="bg-amber-50 border border-amber-300 rounded p-1.5 mb-2 text-[10px] text-amber-900 leading-normal">
            <strong>⚠️ 安全提示：</strong>${shelter.safetyAdvisory}
          </div>
          <div class="bg-emerald-50 border border-emerald-200 rounded p-1.5 mb-2.5 text-[11px] text-emerald-800 space-y-0.5">
            <div>⏰ <strong>開放時段：</strong>${shelter.operatingHours}</div>
            <div>📱 <strong>車門門禁：</strong>須於開放時段掃描 QRcode 輸入資料開啟</div>
            <div>📞 <strong>專線：</strong>${shelter.dutyHotline}</div>
          </div>
          <div class="flex flex-col gap-1.5">
            <button id="btn-shelter-qr-${shelter.id}" class="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black py-1.5 px-2.5 rounded shadow transition cursor-pointer flex items-center justify-center gap-1">
              <span>📱 掃描車門 QRcode 登記入內</span>
            </button>
            <div class="flex gap-1.5">
              <button id="btn-shelter-detail-${shelter.id}" class="flex-1 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold py-1.5 px-2 rounded shadow transition cursor-pointer">
                治安趨勢圖與詳情
              </button>
              <button id="btn-shelter-nav-${shelter.id}" class="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-1.5 px-3 rounded shadow flex items-center justify-center gap-1 transition cursor-pointer">
                <span>導航</span> ➔
              </button>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent, { maxWidth: 300, offset: [0, -25] });

        marker.on('popupopen', () => {
          const qrBtn = document.getElementById(`btn-shelter-qr-${shelter.id}`);
          const detailBtn = document.getElementById(`btn-shelter-detail-${shelter.id}`);
          const navBtn = document.getElementById(`btn-shelter-nav-${shelter.id}`);

          if (qrBtn) {
            qrBtn.onclick = (e) => {
              e.stopPropagation();
              onOpenQREntry(shelter);
            };
          }
          if (detailBtn) {
            detailBtn.onclick = (e) => {
              e.stopPropagation();
              onSelectShelter(shelter);
            };
          }
          if (navBtn) {
            navBtn.onclick = (e) => {
              e.stopPropagation();
              onStartRouteToShelter(shelter);
            };
          }
        });

        marker.on('click', () => {
          onSelectShelter(shelter);
        });

        markersLayerRef.current?.addLayer(marker);
      });
    }

    // 2. Render Bars and Nightclubs
    venues.forEach((venue) => {
      if (selectedDistrict !== '全部' && venue.district !== selectedDistrict) {
        return;
      }

      if (venue.type === 'bar' && !showBars) return;
      if (venue.type === 'nightclub' && !showNightclubs) return;

      const isNightclub = venue.type === 'nightclub';
      const isSelected = selectedVenue?.id === venue.id;

      const venueIcon = L.divIcon({
        className: 'custom-venue-marker',
        html: `
          <div class="group relative cursor-pointer transform transition-transform duration-200 hover:scale-120 ${isSelected ? 'scale-125' : ''}">
            <div class="flex items-center gap-1 ${
              isNightclub
                ? 'bg-gradient-to-r from-purple-700 to-pink-600 border-purple-300'
                : 'bg-gradient-to-r from-amber-600 to-yellow-600 border-amber-300'
            } text-white px-2 py-1 rounded-full shadow-lg border-2">
              <span class="text-xs">
                ${isNightclub ? '🪩' : '🍸'}
              </span>
              <span class="text-[11px] font-bold max-w-[90px] truncate">${venue.name}</span>
            </div>
            <div class="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] ${
              isNightclub ? 'border-t-purple-700' : 'border-t-amber-600'
            } mx-auto -mt-0.5"></div>
          </div>
        `,
        iconSize: [110, 32],
        iconAnchor: [55, 30],
      });

      const marker = L.marker(venue.coordinates, {
        icon: venueIcon,
        zIndexOffset: isSelected ? 700 : 500,
      });

      const popupContent = document.createElement('div');
      popupContent.className = 'p-3 min-w-[230px] text-slate-800';
      popupContent.innerHTML = `
        <div class="flex items-center justify-between mb-1">
          <span class="${
            isNightclub ? 'bg-purple-100 text-purple-800' : 'bg-amber-100 text-amber-800'
          } text-[10px] font-bold px-1.5 py-0.5 rounded">
            ${isNightclub ? '🪩 台北登記夜店' : '🍸 台北合規酒吧'}
          </span>
          <span class="text-xs text-amber-500 font-bold">★ ${venue.safetyRating}</span>
        </div>
        <h3 class="text-base font-bold text-slate-900 leading-tight mb-1">${venue.name}</h3>
        <p class="text-xs text-slate-500 mb-1.5">${venue.address}</p>
        <p class="text-[11px] text-slate-600 line-clamp-2 mb-2 leading-relaxed">${venue.description}</p>
        <div class="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 mb-2">
          🛡️ 最近守護庇護：麻糬號 (${venue.district})
        </div>
        <div class="flex gap-2">
          <button id="btn-venue-detail-${venue.id}" class="flex-1 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold py-1.5 px-2 rounded shadow transition cursor-pointer">
            查閱資訊
          </button>
          <button id="btn-venue-nav-${venue.id}" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-1.5 px-2 rounded shadow flex items-center justify-center gap-1 transition cursor-pointer">
            <span>前往導航</span> ➔
          </button>
        </div>
      `;

      marker.bindPopup(popupContent, { maxWidth: 280, offset: [0, -20] });

      marker.on('popupopen', () => {
        const detailBtn = document.getElementById(`btn-venue-detail-${venue.id}`);
        const navBtn = document.getElementById(`btn-venue-nav-${venue.id}`);

        if (detailBtn) {
          detailBtn.onclick = (e) => {
            e.stopPropagation();
            onSelectVenue(venue);
          };
        }
        if (navBtn) {
          navBtn.onclick = (e) => {
            e.stopPropagation();
            onStartRouteToVenue(venue);
          };
        }
      });

      marker.on('click', () => {
        onSelectVenue(venue);
      });

      markersLayerRef.current?.addLayer(marker);
    });
  }, [
    shelters,
    venues,
    showShelters,
    showBars,
    showNightclubs,
    selectedDistrict,
    selectedShelter,
    selectedVenue,
    onSelectShelter,
    onSelectVenue,
    onStartRouteToShelter,
    onStartRouteToVenue,
  ]);

  // Handle Traffic Events & Hazard Perimeter Rendering
  useEffect(() => {
    if (!mapRef.current || !trafficEventsLayerRef.current) return;
    trafficEventsLayerRef.current.clearLayers();

    trafficEvents.forEach((evt) => {
      if (!evt.isActive) return;

      // Circle representing affected congestion / crowd radius
      const circle = L.circle(evt.coordinates, {
        radius: evt.radiusMeters,
        color: evt.severity === 'high' ? '#ef4444' : '#f59e0b',
        weight: 2,
        dashArray: '5, 8',
        fillColor: evt.severity === 'high' ? '#f87171' : '#fbbf24',
        fillOpacity: 0.16,
      });

      // Hazard Caution Marker
      const hazardIcon = L.divIcon({
        className: 'custom-hazard-marker',
        html: `
          <div class="group relative cursor-pointer transform transition-transform duration-200 hover:scale-125">
            <div class="flex items-center gap-1 ${
              evt.severity === 'high'
                ? 'bg-gradient-to-r from-red-600 to-rose-600 border-red-300'
                : 'bg-gradient-to-r from-amber-600 to-orange-600 border-amber-300'
            } text-white px-2 py-0.5 rounded-full shadow-lg border-2 text-[10px] font-black">
              <span class="animate-bounce">⚠️</span>
              <span class="max-w-[70px] truncate">${evt.type}</span>
            </div>
            <div class="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] ${
              evt.severity === 'high' ? 'border-t-red-600' : 'border-t-amber-600'
            } mx-auto -mt-0.5"></div>
          </div>
        `,
        iconSize: [90, 26],
        iconAnchor: [45, 24],
      });

      const marker = L.marker(evt.coordinates, {
        icon: hazardIcon,
        zIndexOffset: 650,
      });

      const popupContent = document.createElement('div');
      popupContent.className = 'p-3 min-w-[240px] text-slate-800 text-xs';
      popupContent.innerHTML = `
        <div class="flex items-center justify-between mb-1">
          <span class="bg-amber-100 text-amber-900 text-[10px] font-black px-1.5 py-0.5 rounded">
            ⚠️ ${evt.type}疏導管制
          </span>
          <span class="text-[10px] text-slate-500 font-mono">${evt.updatedAt}</span>
        </div>
        <h4 class="font-bold text-slate-900 leading-tight mb-1">${evt.title}</h4>
        <p class="text-[11px] text-slate-600 mb-1.5">${evt.description}</p>
        <div class="text-[10px] text-red-700 bg-red-50 p-1 rounded border border-red-200 mb-1.5">
          🚫 避開：${evt.detour.avoidStreets.join('、')}
        </div>
        <div class="text-[10px] text-emerald-800 bg-emerald-50 p-1 rounded border border-emerald-200 mb-2">
          ✓ 推薦繞行：${evt.detour.recommendedStreets.join('、')}
        </div>
        <button id="btn-detour-open-${evt.id}" class="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black text-xs py-1.5 rounded shadow transition cursor-pointer">
          查看安全繞路指引 ➔
        </button>
      `;

      marker.bindPopup(popupContent, { maxWidth: 280, offset: [0, -15] });

      marker.on('popupopen', () => {
        const detourBtn = document.getElementById(`btn-detour-open-${evt.id}`);
        if (detourBtn && onOpenTrafficEvent) {
          detourBtn.onclick = (e) => {
            e.stopPropagation();
            onOpenTrafficEvent(evt);
          };
        }
      });

      marker.on('click', () => {
        if (onOpenTrafficEvent) {
          onOpenTrafficEvent(evt);
        }
      });

      circle.addTo(trafficEventsLayerRef.current!);
      marker.addTo(trafficEventsLayerRef.current!);
    });
  }, [trafficEvents, onOpenTrafficEvent]);

  // Handle Active Route Rendering
  useEffect(() => {
    if (!mapRef.current) return;

    if (routeLayerRef.current) {
      mapRef.current.removeLayer(routeLayerRef.current);
      routeLayerRef.current = null;
    }

    if (activeRoute && activeRoute.coordinates.length > 0) {
      const isShelter = activeRoute.destinationType === 'shelter';
      const isDetour = activeRoute.isDetour;
      const isPolice = activeRoute.destinationType === 'police';
      const isHospital = activeRoute.destinationType === 'hospital';

      let routeColor = '#3b82f6';
      if (isDetour) routeColor = '#f59e0b';
      else if (isShelter) routeColor = '#10b981';
      else if (isPolice) routeColor = '#2563eb';
      else if (isHospital) routeColor = '#e11d48';

      const polyline = L.polyline(activeRoute.coordinates, {
        color: routeColor,
        weight: isDetour ? 7 : 6,
        opacity: 0.95,
        lineCap: 'round',
        lineJoin: 'round',
        dashArray: isDetour ? '8, 8' : (isShelter ? '1, 10' : undefined),
      }).addTo(mapRef.current);

      routeLayerRef.current = polyline;

      // Fit bounds to show entire route with padding
      mapRef.current.fitBounds(polyline.getBounds(), {
        padding: [60, 60],
        maxZoom: 16,
      });
    }
  }, [activeRoute]);

  // Handle flying to selected venue, shelter, police, or hospital
  useEffect(() => {
    if (!mapRef.current) return;
    if (selectedShelter) {
      mapRef.current.flyTo(selectedShelter.coordinates, 16, { duration: 1.2 });
    } else if (selectedVenue) {
      mapRef.current.flyTo(selectedVenue.coordinates, 16, { duration: 1.2 });
    } else if (selectedPolice) {
      mapRef.current.flyTo(selectedPolice.coordinates, 16, { duration: 1.2 });
    } else if (selectedHospital) {
      mapRef.current.flyTo(selectedHospital.coordinates, 16, { duration: 1.2 });
    }
  }, [selectedShelter, selectedVenue, selectedPolice, selectedHospital]);

  // Render Police Stations (派出所)
  useEffect(() => {
    if (!mapRef.current || !policeLayerRef.current) return;
    policeLayerRef.current.clearLayers();

    if (!showPolice) return;

    policeStations.forEach((police) => {
      if (selectedDistrict !== '全部' && police.district !== selectedDistrict) {
        return;
      }

      const isSelected = selectedPolice?.id === police.id;

      const policeIcon = L.divIcon({
        className: 'custom-police-marker',
        html: `
          <div class="group relative cursor-pointer transform transition-transform duration-200 hover:scale-120 ${isSelected ? 'scale-125' : ''}">
            <div class="flex items-center gap-1.5 bg-gradient-to-r from-blue-700 to-indigo-800 text-white px-2.5 py-1 rounded-full shadow-xl border-2 ${
              isSelected ? 'border-amber-300 ring-4 ring-blue-400/50' : 'border-blue-300'
            }">
              <div class="bg-white text-blue-800 p-0.5 rounded-full shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <div class="flex flex-col pr-0.5">
                <span class="text-[11px] font-black leading-none">${police.name.replace('信義分局 ', '').replace('中山分局 ', '').replace('大安分局 ', '').replace('萬華分局 ', '').replace('中正第一分局 ', '').replace('中正第二分局 ', '').replace('松山分局 ', '').replace('士林分局 ', '').replace('大同分局 ', '').replace('內湖分局 ', '').replace('北投分局 ', '').replace('南港分局 ', '').replace('文山第二分局 ', '')}</span>
                <span class="text-[8px] text-blue-200 font-bold leading-tight">派出所 24H</span>
              </div>
            </div>
            <div class="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-indigo-800 mx-auto -mt-0.5"></div>
          </div>
        `,
        iconSize: [95, 30],
        iconAnchor: [47, 28],
      });

      const marker = L.marker(police.coordinates, {
        icon: policeIcon,
        zIndexOffset: 720,
      });

      const popupContent = document.createElement('div');
      popupContent.className = 'p-3 min-w-[220px] text-slate-800';
      popupContent.innerHTML = `
        <div class="flex items-center gap-1.5 font-black text-blue-900 text-sm mb-1">
          <span>👮</span>
          <span>${police.name}</span>
        </div>
        <div class="text-xs text-slate-600 mb-1 flex items-center gap-1">
          <span>📍</span>
          <span>${police.address}</span>
        </div>
        <div class="text-xs text-blue-700 font-bold mb-2">
          📞 值勤電話：${police.phone}
        </div>
        <div class="grid grid-cols-2 gap-1.5">
          <a href="tel:${police.phone}" class="px-2 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded text-center block">
            📞 撥打所內
          </a>
          <button id="btn-nav-police-${police.id}" class="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded text-center cursor-pointer">
            🧭 步行導航
          </button>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-nav-police-${police.id}`);
        if (btn) {
          btn.onclick = () => {
            onStartRouteToPolice?.(police);
            marker.closePopup();
          };
        }
      });

      marker.on('click', () => {
        onSelectPolice?.(police);
      });

      marker.addTo(policeLayerRef.current!);
    });
  }, [policeStations, showPolice, selectedDistrict, selectedPolice, onSelectPolice, onStartRouteToPolice]);

  // Render Emergency Hospitals (24H 急診醫院)
  useEffect(() => {
    if (!mapRef.current || !hospitalsLayerRef.current) return;
    hospitalsLayerRef.current.clearLayers();

    if (!showHospitals) return;

    hospitals.forEach((hosp) => {
      if (selectedDistrict !== '全部' && hosp.district !== selectedDistrict) {
        return;
      }

      const isSelected = selectedHospital?.id === hosp.id;

      const hospIcon = L.divIcon({
        className: 'custom-hospital-marker',
        html: `
          <div class="group relative cursor-pointer transform transition-transform duration-200 hover:scale-120 ${isSelected ? 'scale-125' : ''}">
            <div class="flex items-center gap-1.5 bg-gradient-to-r from-rose-700 to-red-800 text-white px-2.5 py-1 rounded-full shadow-xl border-2 ${
              isSelected ? 'border-amber-300 ring-4 ring-rose-400/50' : 'border-rose-200'
            }">
              <div class="bg-white text-rose-700 p-0.5 rounded-full shadow-sm font-black">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6v12"/><path d="M6 12h12"/></svg>
              </div>
              <div class="flex flex-col pr-0.5">
                <span class="text-[11px] font-black leading-none">${hosp.name.split(' (')[0].replace('國立臺灣大學醫學院附設醫院', '臺大醫院').replace('臺北市立聯合醫院', '北市聯醫')}</span>
                <span class="text-[8px] text-rose-200 font-bold leading-tight">24H 急診</span>
              </div>
            </div>
            <div class="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-red-800 mx-auto -mt-0.5"></div>
          </div>
        `,
        iconSize: [100, 30],
        iconAnchor: [50, 28],
      });

      const marker = L.marker(hosp.coordinates, {
        icon: hospIcon,
        zIndexOffset: 710,
      });

      const popupContent = document.createElement('div');
      popupContent.className = 'p-3 min-w-[220px] text-slate-800';
      popupContent.innerHTML = `
        <div class="flex items-center gap-1.5 font-black text-rose-900 text-sm mb-1">
          <span>🏥</span>
          <span>${hosp.name}</span>
        </div>
        <div class="text-xs text-slate-600 mb-1 flex items-center gap-1">
          <span>📍</span>
          <span>${hosp.address}</span>
        </div>
        <div class="text-xs text-rose-700 font-bold mb-2">
          🚑 急診電話：${hosp.emergencyRoomPhone}
        </div>
        <div class="grid grid-cols-2 gap-1.5">
          <a href="tel:${hosp.emergencyRoomPhone.split(' ')[0]}" class="px-2 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded text-center block">
            📞 撥打急診
          </a>
          <button id="btn-nav-hosp-${hosp.id}" class="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded text-center cursor-pointer">
            🧭 急診導航
          </button>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-nav-hosp-${hosp.id}`);
        if (btn) {
          btn.onclick = () => {
            onStartRouteToHospital?.(hosp);
            marker.closePopup();
          };
        }
      });

      marker.on('click', () => {
        onSelectHospital?.(hosp);
      });

      marker.addTo(hospitalsLayerRef.current!);
    });
  }, [hospitals, showHospitals, selectedDistrict, selectedHospital, onSelectHospital, onStartRouteToHospital]);

  // Handle auto-fitting bounds when user switches district
  useEffect(() => {
    if (!mapRef.current || selectedDistrict === '全部') return;
    const districtVenues = venues.filter((v) => v.district === selectedDistrict);
    if (districtVenues.length > 0) {
      const bounds = L.latLngBounds(districtVenues.map((v) => v.coordinates));
      mapRef.current.fitBounds(bounds, { padding: [60, 60], maxZoom: 15 });
    }
  }, [selectedDistrict, venues]);

  // Render Nighttime Crime Hotspot Density Heatmap
  useEffect(() => {
    if (!mapRef.current || !crimeHeatmapLayerRef.current) return;

    crimeHeatmapLayerRef.current.clearLayers();

    if (!showCrimeHeatmap) return;

    crimeHotspots.forEach((hotspot) => {
      if (selectedDistrict !== '全部' && hotspot.district !== selectedDistrict) {
        return;
      }

      const isExtreme = hotspot.riskLevel === 'extreme';
      const isHigh = hotspot.riskLevel === 'high';

      // 1. Outer dispersion gradient halo (wide boundary)
      const outerCircle = L.circle(hotspot.coordinates, {
        radius: hotspot.radiusMeters,
        stroke: false,
        fill: true,
        fillColor: isExtreme ? '#e11d48' : (isHigh ? '#f97316' : '#eab308'),
        fillOpacity: 0.16 * heatmapOpacity,
      });

      // 2. Mid-density core zone
      const midCircle = L.circle(hotspot.coordinates, {
        radius: hotspot.radiusMeters * 0.62,
        stroke: true,
        weight: 1.2,
        color: isExtreme ? '#f43f5e' : (isHigh ? '#fb923c' : '#facc15'),
        opacity: 0.45 * heatmapOpacity,
        fill: true,
        fillColor: isExtreme ? '#be123c' : (isHigh ? '#ea580c' : '#ca8a04'),
        fillOpacity: 0.32 * heatmapOpacity,
      });

      // 3. Dense epicenter core
      const coreCircle = L.circle(hotspot.coordinates, {
        radius: hotspot.radiusMeters * 0.28,
        stroke: true,
        weight: 1.8,
        color: isExtreme ? '#881337' : (isHigh ? '#9a3412' : '#854d0e'),
        opacity: 0.7 * heatmapOpacity,
        fill: true,
        fillColor: isExtreme ? '#9f1239' : (isHigh ? '#c2410c' : '#a16207'),
        fillOpacity: 0.58 * heatmapOpacity,
      });

      // 4. Center interactive pulsing flame badge with intensity score
      const badgeIcon = L.divIcon({
        className: 'crime-hotspot-marker',
        html: `
          <div class="group relative cursor-pointer transform transition-transform duration-200 hover:scale-125">
            <span class="absolute -inset-1.5 rounded-full ${isExtreme ? 'bg-rose-500/50' : 'bg-amber-500/50'} animate-ping opacity-75"></span>
            <div class="relative flex items-center gap-1 bg-slate-950/95 text-white px-2 py-0.5 rounded-full border-2 ${
              isExtreme
                ? 'border-rose-500 shadow-rose-900/60 ring-2 ring-rose-500/30'
                : 'border-amber-500 shadow-amber-900/60 ring-2 ring-amber-500/30'
            } shadow-xl text-[10px] font-black tracking-tighter">
              <span class="text-xs">🔥</span>
              <span class="font-mono ${isExtreme ? 'text-rose-300' : 'text-amber-300'}">${Math.round(hotspot.intensity * 100)}</span>
            </div>
            <!-- Tooltip pointer -->
            <div class="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] ${isExtreme ? 'border-t-rose-600' : 'border-t-amber-600'} mx-auto -mt-0.5"></div>
          </div>
        `,
        iconSize: [52, 28],
        iconAnchor: [26, 26],
      });

      const badgeMarker = L.marker(hotspot.coordinates, {
        icon: badgeIcon,
        zIndexOffset: 750,
      });

      badgeMarker.on('click', () => {
        if (onSelectCrimeHotspot) {
          onSelectCrimeHotspot(hotspot);
        }
      });

      outerCircle.addTo(crimeHeatmapLayerRef.current!);
      midCircle.addTo(crimeHeatmapLayerRef.current!);
      coreCircle.addTo(crimeHeatmapLayerRef.current!);
      badgeMarker.addTo(crimeHeatmapLayerRef.current!);
    });
  }, [showCrimeHeatmap, heatmapOpacity, crimeHotspots, selectedDistrict, onSelectCrimeHotspot]);

  // Compute if active route intersects with high-risk crime hotspots
  const highRiskRouteHotspots = useMemo(() => {
    if (!activeRoute || !activeRoute.coordinates.length || !showCrimeHeatmap) return [];
    return checkRouteHighRiskHotspots(activeRoute.coordinates, crimeHotspots, 160);
  }, [activeRoute, showCrimeHeatmap, crimeHotspots]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-slate-900">
      <div
        ref={mapContainerRef}
        id="taipei-map-canvas"
        className="w-full h-full absolute inset-0 z-0"
        style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />

      {/* Route Crossing High-Risk Crime Hotspot HUD Banner */}
      {highRiskRouteHotspots.length > 0 && (
        <div className="absolute top-14 left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 sm:w-[480px] z-30 bg-rose-950/95 border-2 border-rose-500/90 rounded-2xl p-3.5 shadow-2xl backdrop-blur-md text-white animate-fadeIn">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-rose-600 rounded-xl text-white shrink-0 mt-0.5 shadow-lg shadow-rose-900/60 animate-pulse">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-black text-rose-300">⚠️ 導航路徑行經治安高密度警戒區</span>
                <span className="bg-rose-500/30 text-rose-200 text-[10px] px-2 py-0.5 rounded-full font-bold border border-rose-500/40">
                  {highRiskRouteHotspots[0].name}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                歷史年度通報 <span className="text-rose-300 font-bold">{highRiskRouteHotspots[0].annualIncidentCount} 件</span>（尖峰好發時段：<span className="text-amber-300 font-bold">{highRiskRouteHotspots[0].peakHours}</span>）。請保持警惕，或優先前往「麻糬號」庇護車避難！
              </p>
              <div className="flex items-center gap-3 mt-2.5">
                <button
                  onClick={() => onSelectCrimeHotspot?.(highRiskRouteHotspots[0])}
                  className="px-2.5 py-1 bg-rose-700 hover:bg-rose-600 text-white text-[11px] font-bold rounded-lg transition cursor-pointer shadow"
                >
                  查看該區案發分析
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Heatmap Legend and Opacity Controls */}
      <CrimeHeatmapLegend
        showHeatmap={showCrimeHeatmap}
        onToggleHeatmap={onToggleCrimeHeatmap || (() => {})}
        opacity={heatmapOpacity}
        onChangeOpacity={setHeatmapOpacity}
        hotspots={crimeHotspots}
        onSelectHotspot={(hotspot) => {
          if (mapRef.current) {
            mapRef.current.flyTo(hotspot.coordinates, 16, { duration: 1.2 });
          }
          onSelectCrimeHotspot?.(hotspot);
        }}
      />

      {/* Map Tile Style Switcher */}
      <div className="absolute top-3 right-3 z-20 flex items-center bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl p-1 shadow-lg text-[11px] gap-1">
        <button
          onClick={() => setMapTheme('osm')}
          className={`px-2 py-1 rounded-lg font-bold transition cursor-pointer ${
            mapTheme === 'osm'
              ? 'bg-emerald-600 text-white shadow'
              : 'text-slate-400 hover:text-white'
          }`}
          title="OpenStreetMap 標準街道圖（最穩定）"
        >
          標準街道
        </button>
        <button
          onClick={() => setMapTheme('dark')}
          className={`px-2 py-1 rounded-lg font-bold transition cursor-pointer ${
            mapTheme === 'dark'
              ? 'bg-purple-600 text-white shadow'
              : 'text-slate-400 hover:text-white'
          }`}
          title="夜間深色模式"
        >
          深色夜巡
        </button>
        <button
          onClick={() => setMapTheme('voyager')}
          className={`px-2 py-1 rounded-lg font-bold transition cursor-pointer ${
            mapTheme === 'voyager'
              ? 'bg-blue-600 text-white shadow'
              : 'text-slate-400 hover:text-white'
          }`}
          title="彩色底圖"
        >
          彩色底圖
        </button>
      </div>
    </div>
  );
};
