export type VenueType = 'bar' | 'nightclub';

export interface Venue {
  id: string;
  name: string;
  nameEn: string;
  type: VenueType;
  district:
    | '信義區'
    | '大安區'
    | '中山區'
    | '萬華區'
    | '中正區'
    | '大同區'
    | '松山區'
    | '士林區'
    | '北投區'
    | '內湖區'
    | '南港區'
    | '文山區';
  address: string;
  coordinates: [number, number]; // [lat, lng]
  phone: string;
  businessHours: string;
  description: string;
  licenseNumber: string; // 台北市商業登記/特種營業核可證號
  tags: string[];
  priceRange: '$' | '$$' | '$$$' | '$$$$';
  safetyRating: number; // 1-5
  hasSecurity: boolean; // 有專職安檢/保全人員
  nearestShelterId: string; // 關聯最近的治安熱區遊覽車庇護所
}

export interface PoliceHeatPoint {
  hour: string; // e.g. "22:00", "00:00", "02:00", "04:00", "06:00", "08:00"
  heat: number; // 0 - 100 報案熱度指數
  reports: number; // 近期平均報案通報件數
  patrols: number; // 員警巡守班次
  level: '低度' | '常態' | '偏高' | '高峰警戒';
}

export interface SafetyShelter {
  id: string;
  name: string;
  nameEn: string;
  district: string;
  locationDescription: string;
  coordinates: [number, number]; // [lat, lng]
  vehicleType: '大型豪華遊覽改裝守護專車' | '雙層夜安巡邏多功能巴士' | '守護者夜巡旗艦專車';
  vehiclePlate: string;
  operatingHours: string; // 22:00 至 08:00
  capacity: number; // 每個庇護車輛容納人數為 30 人
  currentOccupancy: number; // 目前車內在席人數 (0-30)
  securityMonitoring: {
    equipment: string[]; // 車前、車內、車外監視設備
    aiSurveillance: string; // AI 即時監測說明
    incidentAutoDispatch: string; // 遇可疑狀況立即發送訊號通知鄰近派出所
    nearestPoliceStation: {
      name: string;
      phone: string;
      address: string;
      distanceMeters: number;
      signalStatus: string;
    };
  };
  dutyHotline: string;
  safetyAdvisory: string; // 該區域夜間安全建議提示
  policeHeatTrend: PoliceHeatPoint[]; // D3 警政單位報案熱度趨勢資料
  qrCodeId: string; // 車身專屬 QR Code 編號
  services: {
    title: string;
    description: string;
    icon: string;
  }[];
  stationedPersonnel: string[];
  alertLevel: '常態夜巡守護' | '加強治安戒備' | '週末人潮防護';
  facilities: string[];
  description: string;
}

export interface DetourRoute {
  avoidStreets: string[];
  recommendedStreets: string[];
  adviceSummary: string;
  stepInstructions: string[];
  detourWaypoints: [number, number][];
  extraMinutes: number;
}

export interface TrafficEvent {
  id: string;
  shelterId: string; // Linked hotspot shelter, e.g. 'shelter-xinyi', 'shelter-ximen'
  hotspotName: string; // e.g. '信義廣場熱區', '西門町熱區', '花博公園熱區'
  title: string;
  type: '大型活動' | '交通管制' | '道路施工' | '人潮疏導' | '路檢封路';
  severity: 'high' | 'medium' | 'info';
  location: string;
  affectedRoads: string[];
  description: string;
  detour: DetourRoute;
  source: string; // e.g. "臺北市政府交通局 / 警察局交大 即時路況通報"
  googleSearchQuery: string;
  updatedAt: string;
  coordinates: [number, number]; // Incident center [lat, lng]
  radiusMeters: number; // Approximate affected zone radius
  isActive: boolean;
}

export interface RouteInfo {
  destinationName: string;
  destinationType: 'shelter' | 'venue' | 'police' | 'hospital';
  distanceMeters: number;
  durationMinutes: number;
  coordinates: [number, number][];
  steps: string[];
  isDetour?: boolean;
  detourReason?: string;
  avoidStreets?: string[];
}

export interface ShelterBoardingPass {
  id: string;
  shelterId: string;
  shelterName: string;
  vehiclePlate: string;
  passengerName: string;
  passengerPhone: string;
  purpose: string;
  companionCount: number;
  entryTimestamp: string;
  seatAssigned: string;
  status: 'valid' | 'checked-out';
}

export type RiskLevel = 'extreme' | 'high' | 'medium';

export interface CrimeIncidentPoint {
  id: string;
  name: string;
  district: string;
  coordinates: [number, number]; // [lat, lng]
  intensity: number; // 0.1 to 1.0
  radiusMeters: number; // 影響半徑
  riskLevel: RiskLevel;
  riskTitle: string; // e.g. '極高風險紅色熱區'
  annualIncidentCount: number; // 歷史年度 110 報案統計數
  mainIncidentTypes: {
    type: string;
    percentage: number;
    description: string;
  }[];
  peakHours: string; // e.g. '01:30 - 04:30'
  policePrecinct: {
    station: string;
    phone: string;
    patrolFrequency: string;
  };
  recommendedShelterId: string;
  safetyAdvice: string;
}

export interface PoliceStation {
  id: string;
  name: string;
  precinct: string; // e.g. '信義分局'
  district: string;
  address: string;
  coordinates: [number, number]; // [lat, lng]
  phone: string;
  dutyHotline: string; // 110 or direct
  patrolAreas: string[];
  is24h: boolean;
  notes: string;
  nearestShelterId?: string;
}

export interface Hospital {
  id: string;
  name: string;
  district: string;
  address: string;
  coordinates: [number, number]; // [lat, lng]
  phone: string;
  emergencyRoomPhone: string;
  hasEmergencyRoom24h: boolean;
  level: '醫學中心' | '區域醫院' | '聯合醫院分院' | '地區醫院';
  emergencySpecialties: string[]; // e.g. ['創傷重症中心', '毒物急救', '急性心血管', '酒精外傷急救']
  description: string;
}



