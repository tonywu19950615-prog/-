import { Hospital } from '../types';

/**
 * 台北市全行政區重點 24 小時急診醫療院所資料庫 (Taipei 24H Emergency Hospitals - Full City Dataset)
 * 涵蓋台北市全部 12 個行政區之國家級醫學中心、區域教學醫院、市立聯合醫院各院區與急救責任醫院。
 * 具備 24 小時夜間急診、重大創傷、酒精中毒/代謝急救、夜間外傷縫合與毒物解毒能力。
 */
export const HOSPITALS: Hospital[] = [
  // ==========================================
  // 1. 信義區
  // ==========================================
  {
    id: 'hosp-tmu',
    name: '臺北醫學大學附設醫院 (北醫)',
    district: '信義區',
    address: '台北市信義區吳興街252號',
    coordinates: [25.0275, 121.5620],
    phone: '02-2737-2181',
    emergencyRoomPhone: '02-2737-2181 轉 1119 (急診室)',
    hasEmergencyRoom24h: true,
    level: '區域醫院',
    emergencySpecialties: ['24H 急診創傷小組', '酒精急性中毒處理', '急診重症加護', '夜間外傷縫合'],
    description: '信義夜生活商圈最近的 24 小時急診醫院，配備現代化急診創傷團隊與專屬救護車通道。'
  },

  // ==========================================
  // 2. 中山區
  // ==========================================
  {
    id: 'hosp-mackay',
    name: '馬偕紀念醫院 (台北總院)',
    district: '中山區',
    address: '台北市中山區中山北路二段92號',
    coordinates: [25.0595, 121.5228],
    phone: '02-2543-3535',
    emergencyRoomPhone: '02-2543-3535 轉 2222 (24H急診掛號)',
    hasEmergencyRoom24h: true,
    level: '醫學中心',
    emergencySpecialties: ['國家級毒藥物救治中心', '重大外傷中心', '24H 心血管急救', '急性酒精戒斷照護'],
    description: '中山林森條通與錦州商圈最近的頂尖醫學中心，具備全台權威之毒藥物與急診重症救護實力。'
  },

  // ==========================================
  // 3. 大安區
  // ==========================================
  {
    id: 'hosp-cathay',
    name: '國泰綜合醫院 (總院)',
    district: '大安區',
    address: '台北市大安區仁愛路四段280號',
    coordinates: [25.0378, 121.5518],
    phone: '02-2708-2121',
    emergencyRoomPhone: '02-2708-2121 轉 3119 (急診室專線)',
    hasEmergencyRoom24h: true,
    level: '醫學中心',
    emergencySpecialties: ['24H 重症急救', '急性頭部外傷', '胸痛中心', '急診外傷處置'],
    description: '坐落於仁愛路四段，緊鄰東區茶街與安和路酒吧街，具備高效率 24 小時急診處置能力。'
  },
  {
    id: 'hosp-renai',
    name: '臺北市立聯合醫院 (仁愛院區)',
    district: '大安區',
    address: '台北市大安區仁愛路四段10號',
    coordinates: [25.0382, 121.5435],
    phone: '02-2709-3600',
    emergencyRoomPhone: '02-2709-3600 轉 1119 (24H急診)',
    hasEmergencyRoom24h: true,
    level: '聯合醫院分院',
    emergencySpecialties: ['市立急診急救中心', '急性外傷處置', '各類急性症候救護'],
    description: '近忠孝復興與大安森林公園，公立醫療體系，收費平實且醫療量能充沛。'
  },
  {
    id: 'hosp-hongen',
    name: '宏恩綜合醫院',
    district: '大安區',
    address: '台北市大安區仁愛路四段71巷1號',
    coordinates: [25.0396, 121.5492],
    phone: '02-2771-3161',
    emergencyRoomPhone: '02-2771-3161 轉 119 (急診留觀)',
    hasEmergencyRoom24h: true,
    level: '地區醫院',
    emergencySpecialties: ['東區急診責任醫院', '急性外傷處理', '夜間酒精代謝觀察'],
    description: '位於大安東區核心巷弄，提供東區夜歸民眾快速即時的外傷救治與留觀。'
  },

  // ==========================================
  // 4. 中正區
  // ==========================================
  {
    id: 'hosp-ntuh',
    name: '國立臺灣大學醫學院附設醫院 (臺大醫院總院)',
    district: '中正區',
    address: '台北市中正區中山南路7號',
    coordinates: [25.0412, 121.5185],
    phone: '02-2312-3456',
    emergencyRoomPhone: '02-2312-3456 轉 62222 (24H急診部)',
    hasEmergencyRoom24h: true,
    level: '醫學中心',
    emergencySpecialties: ['國家級創傷醫學中心', 'ECMO 葉克膜急救', '急性中毒', '多重重度創傷救治'],
    description: '台灣首屈一指的最高等級國家醫學中心，全天候 24 小時守護全台北重大突發急難。'
  },
  {
    id: 'hosp-ntuh-children',
    name: '臺大醫院兒童醫院',
    district: '中正區',
    address: '台北市中正區中山南路8號',
    coordinates: [25.0423, 121.5186],
    phone: '02-2312-3456',
    emergencyRoomPhone: '02-2312-3456 轉 71119 (小兒急診)',
    hasEmergencyRoom24h: true,
    level: '醫學中心',
    emergencySpecialties: ['24H 兒童急診專屬創傷隊', '小兒急重症醫學', '兒童意外中毒急救'],
    description: '全國最具規模之兒童專責醫學中心，提供獨立之 24 小時夜間小兒急診急救動線。'
  },
  {
    id: 'hosp-heping',
    name: '臺北市立聯合醫院 (和平院區)',
    district: '中正區',
    address: '台北市中正區中華路二段33號',
    coordinates: [25.0325, 121.5070],
    phone: '02-2388-9595',
    emergencyRoomPhone: '02-2388-9595 轉 2119 (急診室)',
    hasEmergencyRoom24h: true,
    level: '聯合醫院分院',
    emergencySpecialties: ['24H 急診醫學科', '一般外傷縫合', '內科急症', '感染防治'],
    description: '中正萬華交界處之市立綜合醫院，常態支援西門町與艋舺商圈夜間急診。'
  },
  {
    id: 'hosp-fuyou',
    name: '臺北市立聯合醫院 (和平婦幼院區-婦幼部)',
    district: '中正區',
    address: '台北市中正區福州街12號',
    coordinates: [25.0298, 121.5168],
    phone: '02-2391-6470',
    emergencyRoomPhone: '02-2391-6470 轉 1119 (婦幼急診)',
    hasEmergencyRoom24h: true,
    level: '聯合醫院分院',
    emergencySpecialties: ['婦產科24H急診', '小兒夜間急重症', '婦女夜間緊急庇護檢傷'],
    description: '台北市指標性婦幼急重症醫療中心，夜間提供專業女性及幼童專屬急救醫療照護。'
  },

  // ==========================================
  // 5. 松山區
  // ==========================================
  {
    id: 'hosp-taiwan-adventist',
    name: '臺安醫院 (Taiwan Adventist Hospital)',
    district: '松山區',
    address: '台北市松山區八德路二段424號',
    coordinates: [25.0478, 121.5463],
    phone: '02-2771-8151',
    emergencyRoomPhone: '02-2771-8151 轉 2601 (24H急診室)',
    hasEmergencyRoom24h: true,
    level: '區域醫院',
    emergencySpecialties: ['24H 急診醫學中心', '創傷急救處置', '心臟重症急救', '急性中毒留觀'],
    description: '坐落於八德路二段與敦化南路口，緊鄰台北小巨蛋與市民大道，為松山區核心 24 小時急救責任醫院。'
  },
  {
    id: 'hosp-chang-gung-taipei',
    name: '長庚醫療財團法人 台北長庚紀念醫院',
    district: '松山區',
    address: '台北市松山區敦化北路199號',
    coordinates: [25.0578, 121.5502],
    phone: '02-2713-5211',
    emergencyRoomPhone: '02-2713-5211 轉 3333 (急診服務台)',
    hasEmergencyRoom24h: true,
    level: '醫學中心',
    emergencySpecialties: ['國家級醫學中心急救', '重大創傷', '腦中風緊急處置', '急性冠心症'],
    description: '敦化北路林蔭大道旁之指標醫學中心，提供敦化、民生社區與松山機場周邊最高品質夜間急救。'
  },
  {
    id: 'hosp-tsgh-songshan',
    name: '三軍總醫院松山分院',
    district: '松山區',
    address: '台北市松山區健康路131號',
    coordinates: [25.0538, 121.5605],
    phone: '02-2764-2151',
    emergencyRoomPhone: '02-2764-2151 轉 67119 (24H急診)',
    hasEmergencyRoom24h: true,
    level: '地區醫院',
    emergencySpecialties: ['國軍急診責任醫院', '外傷重症處置', '骨科外傷縫合', '內外科急救'],
    description: '位於松山健康路，具備充沛軍陣急診醫療動能，提供饒河夜市與松山車站周遭強大急診支援。'
  },
  {
    id: 'hosp-pojen',
    name: '博仁綜合醫院',
    district: '松山區',
    address: '台北市松山區光復北路66號',
    coordinates: [25.0495, 121.5574],
    phone: '02-2578-6677',
    emergencyRoomPhone: '02-2578-6677 轉 2119 (24H急救處)',
    hasEmergencyRoom24h: true,
    level: '地區醫院',
    emergencySpecialties: ['心血管急救中心', '夜間急重症處置', '創傷止血縫合'],
    description: '近捷運南京三民站與光復商圈，提供松山區便利快速的 24 小時急症治療服務。'
  },

  // ==========================================
  // 6. 萬華區
  // ==========================================
  {
    id: 'hosp-west-garden',
    name: '西園醫療社團法人 西園醫院',
    district: '萬華區',
    address: '台北市萬華區西園路二段270號',
    coordinates: [25.0285, 121.4942],
    phone: '02-2307-8988',
    emergencyRoomPhone: '02-2307-8988 轉 2119 (24H急診室)',
    hasEmergencyRoom24h: true,
    level: '地區醫院',
    emergencySpecialties: ['萬華核心急診責任醫院', '重大外傷創傷急救', '急性心腦血管處置', '酒精急性中毒處置'],
    description: '萬華區最具規模之綜合教學醫院，永越健康園區體系，24 小時守護南萬華與艋舺夜間緊急醫療。'
  },
  {
    id: 'hosp-ntuh-beihu',
    name: '國立臺灣大學醫學院附設醫院 (北護分院)',
    district: '萬華區',
    address: '台北市萬華區康定路37號',
    coordinates: [25.0440, 121.5032],
    phone: '02-2371-7101',
    emergencyRoomPhone: '02-2371-7101 轉 6119 (急診醫療轉銜)',
    hasEmergencyRoom24h: true,
    level: '醫學中心',
    emergencySpecialties: ['臺大醫療體系連線', '急性長照急症後送', '一般外傷縫合處置'],
    description: '位於西門町與龍山寺交界處康定路上，臺大醫院分部，緊密支援西門商圈之緊急醫療網絡。'
  },

  // ==========================================
  // 7. 大同區
  // ==========================================
  {
    id: 'hosp-zhongxing',
    name: '臺北市立聯合醫院 (中興院區)',
    district: '大同區',
    address: '台北市大同區鄭州路145號',
    coordinates: [25.0498, 121.5085],
    phone: '02-2552-3234',
    emergencyRoomPhone: '02-2552-3234 轉 5119 (24H急診)',
    hasEmergencyRoom24h: true,
    level: '聯合醫院分院',
    emergencySpecialties: ['24H 急診創傷', '急性腹痛處置', '酒精過量觀測', '市民夜間重症急救'],
    description: '鄰近市民大道與大稻埕水岸，守護西區、寧夏夜市與台北車站周邊市民夜間緊急醫療需求。'
  },

  // ==========================================
  // 8. 士林區
  // ==========================================
  {
    id: 'hosp-shin-kong',
    name: '新光吳火獅紀念醫院 (新光醫院)',
    district: '士林區',
    address: '台北市士林區文昌路95號',
    coordinates: [25.0938, 121.5204],
    phone: '02-2833-2211',
    emergencyRoomPhone: '02-2833-2211 轉 2099 (24H急診中心直撥)',
    hasEmergencyRoom24h: true,
    level: '醫學中心',
    emergencySpecialties: ['重度級急救責任醫院', '國家級創傷團隊', '急性心肌梗塞 24H 導管', '毒藥物搶救'],
    description: '士林區頂尖重度級急救醫學中心，緊鄰士林夜市與基河路商圈，擁有強大之急診創傷搶救陣容。'
  },
  {
    id: 'hosp-yangming',
    name: '臺北市立聯合醫院 (陽明院區)',
    district: '士林區',
    address: '台北市士林區雨聲街105號',
    coordinates: [25.1052, 121.5312],
    phone: '02-2835-3456',
    emergencyRoomPhone: '02-2835-3456 轉 6119 (急診部)',
    hasEmergencyRoom24h: true,
    level: '聯合醫院分院',
    emergencySpecialties: ['24H 急救醫療站', '外傷處理', '夜間急重症加護', '天母外籍傷患醫療溝通'],
    description: '士林天母主要公立教學醫院，支援士林夜市、文林商圈與芝山岩周邊夜間緊急醫療轉送。'
  },

  // ==========================================
  // 9. 北投區
  // ==========================================
  {
    id: 'hosp-vgh',
    name: '臺北榮民總醫院 (臺北榮總)',
    district: '北投區',
    address: '台北市北投區石牌路二段201號',
    coordinates: [25.1205, 121.5195],
    phone: '02-2871-2121',
    emergencyRoomPhone: '02-2875-7377 (急診室直撥專線)',
    hasEmergencyRoom24h: true,
    level: '醫學中心',
    emergencySpecialties: ['全台臨床毒物諮詢中心', '國際級重大創傷中心', '心肌梗塞救護', '毒蛇咬傷/藥物中毒權威'],
    description: '全台灣規模最大之最高等級醫學中心之一，國家毒物中心所在地，重症救治經驗極其豐富。'
  },
  {
    id: 'hosp-cheng-hsin',
    name: '振興醫療財團法人 振興醫院',
    district: '北投區',
    address: '台北市北投區振興街45號',
    coordinates: [25.1165, 121.5205],
    phone: '02-2826-4400',
    emergencyRoomPhone: '02-2826-4400 轉 6119 (24H急診中心)',
    hasEmergencyRoom24h: true,
    level: '醫學中心',
    emergencySpecialties: ['重度級急救責任醫院', '心臟急救重症國際權威', '重大創傷中心', '葉克膜重症救治'],
    description: '石牌與北投心臟急診權威醫院，榮獲重度級急救責任醫院認證，24 小時守護大北投與士林交界。'
  },
  {
    id: 'hosp-tsgh-beitou',
    name: '三軍總醫院北投分院',
    district: '北投區',
    address: '台北市北投區新民路60號',
    coordinates: [25.1388, 121.5080],
    phone: '02-2895-9808',
    emergencyRoomPhone: '02-2895-9808 轉 603119 (急診留觀)',
    hasEmergencyRoom24h: true,
    level: '地區醫院',
    emergencySpecialties: ['24H 急診評估留觀', '情緒危機與急性酒精干預', '外傷縫合'],
    description: '坐落於新北投溫泉鄉，具備專業夜間身心危機處置與一般急症救護量能。'
  },

  // ==========================================
  // 10. 內湖區
  // ==========================================
  {
    id: 'hosp-tsgh',
    name: '三軍總醫院 (內湖總院)',
    district: '內湖區',
    address: '台北市內湖區成功路二段325號',
    coordinates: [25.0700, 121.5935],
    phone: '02-8792-3311',
    emergencyRoomPhone: '02-8792-3311 轉 11119 (24H急診)',
    hasEmergencyRoom24h: true,
    level: '醫學中心',
    emergencySpecialties: ['軍陣醫學創傷救治', '重大燒燙傷中心', '高壓氧急救', '急性中毒處置', '重度急救責任'],
    description: '內湖科技園區周遭最高規格之國軍國家級醫學中心，急診救護能量充沛，涵蓋東區重症後送。'
  },
  {
    id: 'hosp-kang-ning',
    name: '康寧醫療財團法人 康寧醫院',
    district: '內湖區',
    address: '台北市內湖區成功路五段420號',
    coordinates: [25.0805, 121.6085],
    phone: '02-2634-5500',
    emergencyRoomPhone: '02-2634-5500 轉 119 (24H急診)',
    hasEmergencyRoom24h: true,
    level: '地區醫院',
    emergencySpecialties: ['東內湖24H急診責任醫院', '急性外傷處置', '夜間胸腹痛留觀'],
    description: '近捷運葫洲站與大湖公園，為東內湖與東湖生活圈夜間急診醫療重點院所。'
  },

  // ==========================================
  // 11. 南港區
  // ==========================================
  {
    id: 'hosp-zhongxiao',
    name: '臺北市立聯合醫院 (忠孝院區)',
    district: '南港區',
    address: '台北市南港區同德路87號',
    coordinates: [25.0438, 121.5835],
    phone: '02-2786-1288',
    emergencyRoomPhone: '02-2786-1288 轉 8119 (24H急診)',
    hasEmergencyRoom24h: true,
    level: '聯合醫院分院',
    emergencySpecialties: ['24H 急診外傷處理', '內外科急救', '急性酒精過量觀察', '南港軟體園區急難後送'],
    description: '南港與松山交界處之重要公立後送醫院，守護東區、南港軟體園區與南港高鐵站夜間健康。'
  },

  // ==========================================
  // 12. 文山區
  // ==========================================
  {
    id: 'hosp-wanfang',
    name: '臺北市立萬芳醫院 (委託北醫經營)',
    district: '文山區',
    address: '台北市文山區興隆路三段111號',
    coordinates: [25.0002, 121.5582],
    phone: '02-2930-7930',
    emergencyRoomPhone: '02-2930-7930 轉 2119 (24H急診部)',
    hasEmergencyRoom24h: true,
    level: '醫學中心',
    emergencySpecialties: ['文山區唯一醫學中心', '重大外傷創傷隊', '急性腦中風', '急性心肌梗塞', '重度急救責任'],
    description: '文山區捷運萬芳醫院站共構之醫學中心，提供文山景美木柵地區最完整之夜間緊急救治。'
  },
  {
    id: 'hosp-jingmei',
    name: '景美醫院',
    district: '文山區',
    address: '台北市文山區羅斯福路六段280號',
    coordinates: [24.9912, 121.5410],
    phone: '02-2933-1010',
    emergencyRoomPhone: '02-2933-1010 轉 119 (急診室)',
    hasEmergencyRoom24h: true,
    level: '地區醫院',
    emergencySpecialties: ['24H 急診外科處置', '外傷止血縫合', '景美商圈夜間急診'],
    description: '鄰近景美夜市與景美捷運站，具備即時外傷縫合與夜間急診處置功能。'
  }
];
