import { TrafficEvent } from '../types';

export const TRAFFIC_EVENTS: TrafficEvent[] = [
  {
    id: 'event-xinyi-party',
    shelterId: 'shelter-xinyi',
    hotspotName: '信義廣場熱區',
    title: '信義計畫區夜間派對人潮湧入與松壽路/松智路交通疏導管制',
    type: '大型活動',
    severity: 'high',
    location: '信義區松壽路、市府路、松智路交叉路口周邊（ATT 4 FUN / 台北101世貿前）',
    affectedRoads: ['松壽路', '松智路', '市府路', '松廉路'],
    description: '因信義夜店區週末人潮高密度聚集與大型派對散場，警方實施松壽路彈性車流人流管制，周邊路段極易推擠壅塞。',
    radiusMeters: 450,
    coordinates: [25.0356, 121.5660],
    source: '臺北市政府交通局 / 信義分局 週末夜間疏導通報',
    googleSearchQuery: '台北市 信義區 松壽路 松智路 交通管制 大型活動 即時路況',
    updatedAt: '即時監測中 (15分鐘前更新)',
    isActive: true,
    detour: {
      avoidStreets: ['松壽路（威秀ATT段）', '松智路北段', '市府路交叉口'],
      recommendedStreets: ['信義路五段南側步道', '松仁路', '基隆路一段人行道'],
      adviceSummary: '此區為夜間人流高峰，請避開松壽路與松智路主街推擠，改由信義路五段寬敞步道繞行直達麻糬號信義旗艦站。',
      stepInstructions: [
        '避開松壽路威秀中庭擁擠人潮，改朝東走向松仁路',
        '沿松仁路安全照明步道向南步行至信義路五段',
        '右轉沿信義路五段寬敞人行步道西行約 150 公尺',
        '抵達【麻糬號（信義廣場旗艦站）】（近台北101/世貿站4號出口前公園綠地）'
      ],
      extraMinutes: 3,
      detourWaypoints: [
        [25.0360, 121.5680], // 松仁路口
        [25.0338, 121.5678], // 信義路五段與松仁路口
        [25.0340, 121.5668], // 信義廣場南緣
        [25.0345, 121.5668], // 麻糬號（信義廣場站）
      ]
    }
  },
  {
    id: 'event-ximen-crowd',
    shelterId: 'shelter-ximen',
    hotspotName: '西門町熱區',
    title: '西門町徒步區夜間集會擴大管制與中華路成都路口車流回堵',
    type: '交通管制',
    severity: 'high',
    location: '萬華區中華路一段與成都路口、西寧南路徒步區',
    affectedRoads: ['中華路一段南向車道', '成都路（中華路至西寧南路段）', '漢中街徒步區'],
    description: '西門町商圈人潮回堵，中華路成都路口目前實施行人號誌分流管制，路口聚集人流龐大，易有肢體碰撞衝突風險。',
    radiusMeters: 380,
    coordinates: [25.0423, 121.5075],
    source: '臺北市政府警察局萬華分局 / 交通管制工程處',
    googleSearchQuery: '台北市 西門町 中華路 成都路 交通管制 徒步區',
    updatedAt: '即時監測中 (10分鐘前更新)',
    isActive: true,
    detour: {
      avoidStreets: ['成都路27巷', '捷運6號出口正前方中華路擁擠區'],
      recommendedStreets: ['漢口街二段', '延平南路', '中華路一段東側寬廣人行道'],
      adviceSummary: '中華路成都路口正前方人潮堵塞，建議往北改走漢口街二段人行道，再沿中華路東側明亮步道進入麻糬號專車。',
      stepInstructions: [
        '自西門町核心避開成都路窄巷，轉往漢口街二段方向',
        '沿漢口街明亮商圈步道東行至中華路一段交叉口',
        '利用中華路一段東側寬敞人行地下道或安全斑馬線南行',
        '安全抵達【麻糬號（西門町中華成都站）】駐警庇護專車'
      ],
      extraMinutes: 4,
      detourWaypoints: [
        [25.0442, 121.5085], // 漢口街中華路口
        [25.0435, 121.5082], // 中華路東側步道
        [25.0425, 121.5078], // 麻糬號（西門町站）
      ]
    }
  },
  {
    id: 'event-expopark-music',
    shelterId: 'shelter-expopark',
    hotspotName: '花博公園熱區',
    title: '花博公園MAJI集食行樂夜間音樂市集與玉門街動線分流',
    type: '大型活動',
    severity: 'medium',
    location: '中山區玉門街1號 花博公園圓山園區與捷運圓山站出口',
    affectedRoads: ['玉門街', '庫倫街東段', '圓山捷運站1號出口前廣場'],
    description: '花博公園 MAJI 市集與夜間戶外音樂派對正值散場高峰，玉門街臨停車流與聚集人潮較多，公運處實施人潮分流。',
    radiusMeters: 400,
    coordinates: [25.0700, 121.5215],
    source: '臺北市會展產業發展基金會 / 中山分局圓山所',
    googleSearchQuery: '花博公園 MAJI 音樂派對 交通管制 圓山站',
    updatedAt: '即時監測中 (25分鐘前更新)',
    isActive: true,
    detour: {
      avoidStreets: ['玉門街計程車排班壅塞路段', '爭艷館南側狹道'],
      recommendedStreets: ['酒泉街北側人行道', '承德路三段天橋動線'],
      adviceSummary: '玉門街口車潮與散場醉客較密集，建議自酒泉街綠意步道或捷運高架下方寬敞路徑行進至麻糬號。',
      stepInstructions: [
        '避開玉門街入口排班計程車壅塞區，朝酒泉街方向前進',
        '行經圓山捷運站高架橋下寬敞明亮廊道',
        '沿爭艷館西側廣場通道直行 80 公尺',
        '抵達【麻糬號（花博公園圓山站）】（近爭艷館與長廊廣場中段）'
      ],
      extraMinutes: 2,
      detourWaypoints: [
        [25.0715, 121.5205], // 酒泉街口
        [25.0710, 121.5212], // 圓山站高架廊道
        [25.0705, 121.5218], // 麻糬號（花博圓山站）
      ]
    }
  },
  {
    id: 'event-linsen-inspection',
    shelterId: 'shelter-linsen',
    hotspotName: '林森公園熱區',
    title: '林森北路條通商圈路檢與南京東路深夜車流管制',
    type: '路檢封路',
    severity: 'medium',
    location: '中山區林森北路與南京東路一段交叉口周邊',
    affectedRoads: ['林森北路（長安東路至南京東路）', '七條通、八條通巷弄'],
    description: '警方於林森北路主要路口執行擴大臨檢與酒測路檢防制酒駕勤務，部分巷弄轉角臨停密集且人流複雜。',
    radiusMeters: 350,
    coordinates: [25.0520, 121.5255],
    source: '臺北市政府警察局中山分局 夜間治安路檢快報',
    googleSearchQuery: '林森北路 條通 中山分局 臨檢 交通管制',
    updatedAt: '即時監測中 (18分鐘前更新)',
    isActive: true,
    detour: {
      avoidStreets: ['林森北路狹窄暗巷', '條通深處酒客密集聚集區'],
      recommendedStreets: ['新生北路高架橋下公園步道', '南京東路一段寬廣大道'],
      adviceSummary: '條通深處暗巷醉客與路檢車輛較多，建議改由南京東路一段寬敞大馬路或新生北路綠帶抵達林森公園麻糬號。',
      stepInstructions: [
        '儘早脫離林森北路巷弄，走向南京東路一段主要幹道',
        '沿南京東路一段北側大馬路人行道東行',
        '轉入林森公園外圍綠蔭照明步道',
        '抵達【麻糬號（林森公園站）】（近林森公園南京東路側專用安全避難停靠點）'
      ],
      extraMinutes: 3,
      detourWaypoints: [
        [25.0525, 121.5270], // 新生北路口
        [25.0520, 121.5265], // 林森公園北緣
        [25.0515, 121.5262], // 麻糬號（林森公園站）
      ]
    }
  },
  {
    id: 'event-liugong-construction',
    shelterId: 'shelter-liugong',
    hotspotName: '瑠公公園熱區',
    title: '東區地下管線深夜緊急搶修工程與大安路一段局部縮減車道',
    type: '道路施工',
    severity: 'info',
    location: '大安區大安路一段與忠孝東路四段巷口',
    affectedRoads: ['大安路一段北向外側車道', '忠孝東路四段49巷'],
    description: '大安路一段局部施工機具佔用路面，且週末深夜酒吧聚集人潮外溢，行經請注意工區警示與地磚凹凸。',
    radiusMeters: 300,
    coordinates: [25.0425, 121.5450],
    source: '臺北市政府工務局 / 大安分局',
    googleSearchQuery: '大安區 大安路一段 忠孝東路 施工 管制 瑠公公園',
    updatedAt: '即時監測中 (40分鐘前更新)',
    isActive: true,
    detour: {
      avoidStreets: ['大安路一段49巷施工路段', 'SOGO後方窄巷'],
      recommendedStreets: ['市民大道四段人行道', '忠孝東路四段大道'],
      adviceSummary: '大安路一段巷口施工路面受限，建議沿市民大道或忠孝東路四段寬敞大道由瑠公公園東側安全步入。',
      stepInstructions: [
        '避開大安路施工路段圍籬，往市民大道四段方向前行',
        '經由市民大道寬敞步道南轉大安路寬闊路口',
        '直行進入瑠公公園中央綠廊',
        '抵達【麻糬號（瑠公公園站）】（SOGO忠孝館後方花園廣場旁）'
      ],
      extraMinutes: 2,
      detourWaypoints: [
        [25.0440, 121.5455], // 市民大道大安路口
        [25.0432, 121.5457], // 瑠公公園北側步道
        [25.0428, 121.5458], // 麻糬號（瑠公公園站）
      ]
    }
  }
];

export function getTrafficEventsForHotspot(hotspotOrShelterId: string): TrafficEvent[] {
  return TRAFFIC_EVENTS.filter(
    e => e.shelterId === hotspotOrShelterId || e.hotspotName.includes(hotspotOrShelterId)
  );
}

export function getActiveTrafficEvent(shelterId: string): TrafficEvent | undefined {
  return TRAFFIC_EVENTS.find(e => e.shelterId === shelterId && e.isActive);
}
