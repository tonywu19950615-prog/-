import { CrimeIncidentPoint } from '../types';

/**
 * 台北夜間治安熱區密度熱圖資料庫 (Nighttime Crime & Incident Density Dataset)
 * 依據臺北市政府警察局 110 報案歷史資料庫、酒後滋事、深夜聚眾打架、搶搭糾紛、竊盜騷擾等案發密度加權生成。
 */
export const CRIME_HOTSPOTS: CrimeIncidentPoint[] = [
  // ==========================================
  // 1. 中山區 (林森條通、錦州街核心) - 最高警戒
  // ==========================================
  {
    id: 'crime-linsen-tiaotong',
    name: '林森北路六至八條通高密度治安熱區',
    district: '中山區',
    coordinates: [25.0505, 121.5258],
    intensity: 0.98,
    radiusMeters: 320,
    riskLevel: 'extreme',
    riskTitle: '極高風險 (紅色極熱區)',
    annualIncidentCount: 428,
    mainIncidentTypes: [
      { type: '酒後肢體衝突與口角', percentage: 48, description: '飲酒過量導致店內及街頭推擠糾紛' },
      { type: '深夜計程車搶搭叫車爭執', percentage: 24, description: '凌晨散場時段排班車潮與醉酒乘客爭吵' },
      { type: '深夜醉倒路邊財物遭竊', percentage: 16, description: '路倒不省人事遭宵小洗劫錢包手機' },
      { type: '暗巷尾隨騷擾', percentage: 12, description: '女性夜歸於照明死角遭不當搭訕' }
    ],
    peakHours: '01:00 - 05:00',
    policePrecinct: {
      station: '中山分局 中山一派出所',
      phone: '02-2541-2144',
      patrolFrequency: '每 20 分鐘定點巡守 & 機車巡邏'
    },
    recommendedShelterId: 'shelter-linsen',
    safetyAdvice: '散場請結伴同行，避免穿梭未裝設監視器之狹窄暗巷；若遇醉漢糾纏，請迅速進入新生高架旁「麻糬號」庇護車尋求支援。'
  },
  {
    id: 'crime-jinzhou-st',
    name: '錦州街與民生東路一段酒店餐酒熱點',
    district: '中山區',
    coordinates: [25.0592, 121.5253],
    intensity: 0.91,
    radiusMeters: 240,
    riskLevel: 'high',
    riskTitle: '高風險警戒區 (橙紅)',
    annualIncidentCount: 285,
    mainIncidentTypes: [
      { type: '聚眾喧嘩與酒後糾紛', percentage: 42, description: '餐飲散場包廂酒客街頭口角' },
      { type: '酒後失控砸物', percentage: 28, description: '酒後情緒激動毀損路邊設施' },
      { type: '噪音妨害安寧', percentage: 30, description: '深夜超跑油門與路旁大聲叫囂' }
    ],
    peakHours: '01:30 - 04:30',
    policePrecinct: {
      station: '中山分局 中山二派出所',
      phone: '02-2541-3142',
      patrolFrequency: '每 30 分鐘定時巡邏'
    },
    recommendedShelterId: 'shelter-linsen',
    safetyAdvice: '深夜叫車請至大馬路明亮處等候，切勿於暗巷內逗留等車。'
  },

  // ==========================================
  // 2. 信義區 (松壽路夜店街、松仁路排隊廊道)
  // ==========================================
  {
    id: 'crime-xinyi-songshou',
    name: '信義松壽路夜店街核心散場人潮帶',
    district: '信義區',
    coordinates: [25.0357, 121.5665],
    intensity: 0.95,
    radiusMeters: 270,
    riskLevel: 'extreme',
    riskTitle: '極高風險 (紅色極熱區)',
    annualIncidentCount: 368,
    mainIncidentTypes: [
      { type: '夜店散場酒醉推擠衝突', percentage: 46, description: 'ATT 4 FUN、Neo19 與威秀徒步區人潮碰撞推擠' },
      { type: '酒後鬥毆滋事', percentage: 22, description: '舞池包廂嫌隙延伸至戶外徒步區' },
      { type: '排隊計程車搭乘糾紛', percentage: 18, description: '松壽路沿線叫車排隊插隊引發口角' },
      { type: '拾獲遺失物與財物被扒', percentage: 14, description: '隨身包包手機於擁擠人潮中遭扒竊' }
    ],
    peakHours: '02:00 - 04:45',
    policePrecinct: {
      station: '信義分局 三張犁派出所',
      phone: '02-2720-4100',
      patrolFrequency: '深夜重兵常駐 & 快速反應打擊部隊'
    },
    recommendedShelterId: 'shelter-xinyi',
    safetyAdvice: '夜店散場時松壽路人潮極度混雜，請緊跟同行友人；松智路口常駐有「麻糬號」巡防遊覽車，車內配有防暴安檢與專用安全坐席。'
  },
  {
    id: 'crime-xinyi-songren',
    name: '松仁路與寒舍艾美周邊豪車廊道',
    district: '信義區',
    coordinates: [25.0366, 121.5684],
    intensity: 0.82,
    radiusMeters: 190,
    riskLevel: 'high',
    riskTitle: '高風險警戒區 (橙紅)',
    annualIncidentCount: 194,
    mainIncidentTypes: [
      { type: '超跑噪音與酒後挑釁', percentage: 40, description: '豪車排隊引發的炫耀口角與挑釁' },
      { type: '併排違停爭執', percentage: 35, description: '散場接送車輛堵塞馬路爆發肢體推擠' },
      { type: '酒後失態糾紛', percentage: 25, description: '夜店門口VIP散場騷動' }
    ],
    peakHours: '02:30 - 05:00',
    policePrecinct: {
      station: '信義分局 三張犁派出所',
      phone: '02-2720-4100',
      patrolFrequency: '巡邏車定期駐點驅離違停'
    },
    recommendedShelterId: 'shelter-xinyi',
    safetyAdvice: '避免於車道側拍攝爭執畫面以免遭受波及。'
  },

  // ==========================================
  // 3. 大安區 (東區茶街、敦化南路巷弄)
  // ==========================================
  {
    id: 'crime-daan-teastreet',
    name: '忠孝東路四段東區茶街與敦南巷弄',
    district: '大安區',
    coordinates: [25.0435, 121.5492],
    intensity: 0.89,
    radiusMeters: 260,
    riskLevel: 'high',
    riskTitle: '高風險警戒區 (橙紅)',
    annualIncidentCount: 274,
    mainIncidentTypes: [
      { type: '青少年群聚與眼神互瞄爭端', percentage: 44, description: '茶街外圍桌位與巷弄聚眾口角' },
      { type: '巷道醉酒咆哮擾鄰', percentage: 28, description: '深夜酒吧散場於住宅區巷弄大聲喧嘩' },
      { type: '落單夜歸搭訕騷擾', percentage: 28, description: '單身女性穿過181巷被尾隨' }
    ],
    peakHours: '00:30 - 04:00',
    policePrecinct: {
      station: '大安分局 敦化南路派出所',
      phone: '02-2771-3323',
      patrolFrequency: '巷弄機車巡邏 & 步巡'
    },
    recommendedShelterId: 'shelter-liugong',
    safetyAdvice: '行經東區巷弄請走有路燈騎樓，避免單獨戴降噪耳機行走；瑠公公園旁有「麻糬號」遊覽庇護車常駐。'
  },
  {
    id: 'crime-daan-shimin',
    name: '市民大道四段與延吉街居酒餐酒熱區',
    district: '大安區',
    coordinates: [25.0448, 121.5540],
    intensity: 0.80,
    radiusMeters: 220,
    riskLevel: 'high',
    riskTitle: '高風險警戒區 (橙紅)',
    annualIncidentCount: 215,
    mainIncidentTypes: [
      { type: '熱炒串燒酒後大聲吵架', percentage: 50, description: '多杯生啤後席間意見不合爆發肢體衝突' },
      { type: '併排攔車推擠', percentage: 30, description: '市民大道橋下攔車爭搶' },
      { type: '酒醉跌倒受傷', percentage: 20, description: '酒意上頭未踩穩人行道落差' }
    ],
    peakHours: '23:30 - 03:00',
    policePrecinct: {
      station: '大安分局 安和路派出所',
      phone: '02-2707-1644',
      patrolFrequency: '市民大道全線警車密集巡邏'
    },
    recommendedShelterId: 'shelter-liugong',
    safetyAdvice: '市民大道車速快，叫車請於路內避車彎等待，勿站在快車道攔車。'
  },
  {
    id: 'crime-daan-anhe',
    name: '安和路二段夜間酒吧散場帶',
    district: '大安區',
    coordinates: [25.0315, 121.5518],
    intensity: 0.72,
    radiusMeters: 200,
    riskLevel: 'medium',
    riskTitle: '中度關注區 (黃色)',
    annualIncidentCount: 142,
    mainIncidentTypes: [
      { type: '住宅區酒客音量騷擾', percentage: 55, description: '門口抽煙交談音量過大遭住戶檢舉' },
      { type: '計程車關門聲口角', percentage: 25, description: '深夜關門重響與酒客大聲招呼' },
      { type: '財物遺落於沙發椅', percentage: 20, description: '隨身貴重物品遺忘' }
    ],
    peakHours: '01:00 - 03:30',
    policePrecinct: {
      station: '大安分局 安和路派出所',
      phone: '02-2707-1644',
      patrolFrequency: '定期定點巡簽'
    },
    recommendedShelterId: 'shelter-liugong',
    safetyAdvice: '散場音量請放低，叫車請確認車牌號碼再上車。'
  },

  // ==========================================
  // 4. 萬華區 (西門町徒步區、廣州街周邊)
  // ==========================================
  {
    id: 'crime-wanhua-ximen',
    name: '西門町昆明街與漢中街徒步區交會處',
    district: '萬華區',
    coordinates: [25.0438, 121.5065],
    intensity: 0.92,
    radiusMeters: 280,
    riskLevel: 'extreme',
    riskTitle: '極高風險 (紅色極熱區)',
    annualIncidentCount: 310,
    mainIncidentTypes: [
      { type: '強迫推銷與搭訕糾紛', percentage: 38, description: '假問卷強行拉住落單路人與遊客' },
      { type: '深夜醉酒鬥毆', percentage: 32, description: 'KTV與酒吧散場後走廊至街頭衝突' },
      { type: '扒竊與順手牽羊', percentage: 20, description: '利用人擠人時機扒走後背包財物' },
      { type: '遊蕩人口騷擾', percentage: 10, description: '深夜向行人強行索討零錢' }
    ],
    peakHours: '23:00 - 04:00',
    policePrecinct: {
      station: '萬華分局 西門町派出所',
      phone: '02-2381-0177',
      patrolFrequency: '步行雙人機動巡邏 & 監視器覆蓋監控'
    },
    recommendedShelterId: 'shelter-ximen',
    safetyAdvice: '遇到陌生人強塞愛心筆或搭訕請直接拒絕不停留；西門紅樓外側「麻糬號」守護車隨時提供庇護防暴。'
  },
  {
    id: 'crime-wanhua-guangzhou',
    name: '廣州街與華西街觀光夜市暗巷周邊',
    district: '萬華區',
    coordinates: [25.0372, 121.4998],
    intensity: 0.86,
    radiusMeters: 250,
    riskLevel: 'high',
    riskTitle: '高風險警戒區 (橙紅)',
    annualIncidentCount: 246,
    mainIncidentTypes: [
      { type: '複雜人口飲酒爭端', percentage: 52, description: '老牌阿公店與熱炒酒肆酒後肢體拉扯' },
      { type: '暗巷拉客口角', percentage: 28, description: '暗巷違法攬客引發糾紛' },
      { type: '隨身現金被盜', percentage: 20, description: '夜深無防備遭偷竊' }
    ],
    peakHours: '22:00 - 02:30',
    policePrecinct: {
      station: '萬華分局 龍山派出所',
      phone: '02-2306-1447',
      patrolFrequency: '每 20 分鐘重點路檢盤查'
    },
    recommendedShelterId: 'shelter-ximen',
    safetyAdvice: '夜間請避免行經無人看顧之冷僻窄巷，隨身貴重物品緊貼胸前。'
  },

  // ==========================================
  // 5. 中正區 (公館汀州路、台北車站周邊)
  // ==========================================
  {
    id: 'crime-zhongzheng-gongguan',
    name: '公館汀州路三段大學生夜聚商圈',
    district: '中正區',
    coordinates: [25.0135, 121.5342],
    intensity: 0.74,
    radiusMeters: 210,
    riskLevel: 'medium',
    riskTitle: '中度關注區 (黃色)',
    annualIncidentCount: 168,
    mainIncidentTypes: [
      { type: '社團夜衝宵夜口角爭執', percentage: 45, description: '年輕族群聚會情緒高昂推擠' },
      { type: '停放機車單車失竊', percentage: 35, description: '深夜未上大鎖單車遭騎走' },
      { type: '水源校區暗處尾隨騷擾', percentage: 20, description: '地下道出入口照明暗角搭訕' }
    ],
    peakHours: '00:00 - 03:00',
    policePrecinct: {
      station: '中正第二分局 思源街派出所',
      phone: '02-2365-3882',
      patrolFrequency: '校園周邊警網定時巡守'
    },
    recommendedShelterId: 'shelter-liugong',
    safetyAdvice: '夜歸請沿羅斯福路明亮幹道行走，勿走昏暗防汛道路或河濱公園暗道。'
  },

  // ==========================================
  // 6. 大同區 (大稻埕碼頭貨櫃市集水岸)
  // ==========================================
  {
    id: 'crime-datong-dadaocheng',
    name: '大稻埕碼頭水岸貨櫃市集散場河濱',
    district: '大同區',
    coordinates: [25.0560, 121.5078],
    intensity: 0.71,
    radiusMeters: 230,
    riskLevel: 'medium',
    riskTitle: '中度關注區 (黃色)',
    annualIncidentCount: 138,
    mainIncidentTypes: [
      { type: '水岸醉酒失足落水風險', percentage: 40, description: '飲酒後靠近無欄杆水岸階梯' },
      { type: '水門散場叫車擁擠口角', percentage: 38, description: '五號水門進出口狹窄引發車流回堵爭執' },
      { type: '河濱昏暗死角拉扯', percentage: 22, description: '深夜散步遭不明人士搭話騷擾' }
    ],
    peakHours: '23:00 - 02:00',
    policePrecinct: {
      station: '大同分局 延平派出所',
      phone: '02-2559-0010',
      patrolFrequency: '水門口設置警示哨點'
    },
    recommendedShelterId: 'shelter-ximen',
    safetyAdvice: '離場請遵照水門指示標誌，切勿酒後於淡水河畔階梯嘻鬧防範溺水。'
  },

  // ==========================================
  // 7. 士林區 (士林夜市文林路與基河路)
  // ==========================================
  {
    id: 'crime-shilin-nightmarket',
    name: '士林文林路與基河路夜市酒吧廊道',
    district: '士林區',
    coordinates: [25.0882, 121.5255],
    intensity: 0.77,
    radiusMeters: 220,
    riskLevel: 'medium',
    riskTitle: '中度關注區 (黃色)',
    annualIncidentCount: 172,
    mainIncidentTypes: [
      { type: '觀光客與酒客口角爭端', percentage: 42, description: '狹窄巷道推車擦撞引發爭執' },
      { type: '皮夾手機扒竊', percentage: 35, description: '排隊買宵夜時分神被偷' },
      { type: '計程車收費爭議', percentage: 23, description: '夜市外圍不跳表或喊價爭拗' }
    ],
    peakHours: '23:30 - 02:30',
    policePrecinct: {
      station: '士林分局 文林派出所',
      phone: '02-2881-2400',
      patrolFrequency: '劍潭站與夜市各出口警力巡邏'
    },
    recommendedShelterId: 'shelter-expo',
    safetyAdvice: '夜市散場搭車請使用合法叫車 App 或捷運站旁正式排班點。'
  },

  // ==========================================
  // 8. 松山區 (市民大道四段與八德路三段)
  // ==========================================
  {
    id: 'crime-songshan-civic',
    name: '松山區市民大道與延吉街交會口熱炒酒吧群',
    district: '松山區',
    coordinates: [25.0452, 121.5528],
    intensity: 0.81,
    radiusMeters: 210,
    riskLevel: 'high',
    riskTitle: '高風險警戒區 (橙紅)',
    annualIncidentCount: 195,
    mainIncidentTypes: [
      { type: '酒客路邊嘔吐與推擠', percentage: 48, description: '酒精作用下戶外桌位大聲喧鬧挑釁' },
      { type: '攔車口角爭奪', percentage: 32, description: '多組酒客搶同一輛空車' },
      { type: '酒後駕駛違規阻道', percentage: 20, description: '臨停開車門不慎肇事' }
    ],
    peakHours: '00:00 - 03:30',
    policePrecinct: {
      station: '松山分局 中崙派出所',
      phone: '02-2577-6333',
      patrolFrequency: '市民大道沿線警車密集機巡'
    },
    recommendedShelterId: 'shelter-liugong',
    safetyAdvice: '見他人起爭執請勿聚集圍觀，迅速往瑠公公園或大馬路避難。'
  },

  // ==========================================
  // 9. 內湖區 (港墘路與科技園區周邊)
  // ==========================================
  {
    id: 'crime-neihu-gangqian',
    name: '內湖路一段與港墘路捷運下班小酌商圈',
    district: '內湖區',
    coordinates: [25.0805, 121.5742],
    intensity: 0.60,
    radiusMeters: 180,
    riskLevel: 'medium',
    riskTitle: '中度關注區 (黃色)',
    annualIncidentCount: 96,
    mainIncidentTypes: [
      { type: '科技園區下班聚餐酒後爭端', percentage: 50, description: '酒酣耳熱情緒激昂口角' },
      { type: '深夜道路無人落單疑慮', percentage: 32, description: '辦公大樓打烊後周邊照明偏弱' },
      { type: '共享單車失竊爭議', percentage: 18, description: '忘記還車或被誤騎' }
    ],
    peakHours: '22:30 - 01:30',
    policePrecinct: {
      station: '內湖分局 港墘派出所',
      phone: '02-2797-2244',
      patrolFrequency: '園區主幹道定期巡邏'
    },
    recommendedShelterId: 'shelter-expo',
    safetyAdvice: '科技園區深夜行人稀少，夜歸請盡量搭乘計程車直達家門。'
  },

  // ==========================================
  // 10. 北投區 (光明路新北投溫泉商圈)
  // ==========================================
  {
    id: 'crime-beitou-guangming',
    name: '北投光明路與溫泉路坡道夜間幽暗區',
    district: '北投區',
    coordinates: [25.1370, 121.5045],
    intensity: 0.58,
    radiusMeters: 190,
    riskLevel: 'medium',
    riskTitle: '中度關注區 (黃色)',
    annualIncidentCount: 82,
    mainIncidentTypes: [
      { type: '山坡路段燈光昏暗行車爭議', percentage: 45, description: '路幅狹窄彎道酒客步行險象環生' },
      { type: '夜宿旅客酒後失足滑倒', percentage: 35, description: '石階青苔與硫磺溫泉區濕滑受傷' },
      { type: '深夜噪音妨害溫泉飯店安寧', percentage: 20, description: '居酒屋戶外大聲唱歌' }
    ],
    peakHours: '23:00 - 02:00',
    policePrecinct: {
      station: '北投分局 光明派出所',
      phone: '02-2891-2444',
      patrolFrequency: '巡邏車定期巡視溫泉區主要道路'
    },
    recommendedShelterId: 'shelter-expo',
    safetyAdvice: '山區步道夜間光線昏暗，請攜帶手電筒並注意腳下石階防滑。'
  },

  // ==========================================
  // 11. 南港區 (南港軟體園區與經貿二路)
  // ==========================================
  {
    id: 'crime-nangang-software',
    name: '南港經貿二路與軟體園區周邊夜間空曠帶',
    district: '南港區',
    coordinates: [25.0585, 121.6160],
    intensity: 0.55,
    radiusMeters: 170,
    riskLevel: 'medium',
    riskTitle: '中度關注區 (黃色)',
    annualIncidentCount: 74,
    mainIncidentTypes: [
      { type: '深夜街道空曠落單風險', percentage: 52, description: '深夜少有行人，單身夜歸防範被尾隨' },
      { type: '展覽會館周遭違停口角', percentage: 30, description: '下班餐敘臨時停車擋道' },
      { type: '遺失筆電與公事包', percentage: 18, description: '酒後遺忘於餐酒館座椅' }
    ],
    peakHours: '22:00 - 01:00',
    policePrecinct: {
      station: '南港分局 南港派出所',
      phone: '02-2783-2244',
      patrolFrequency: '定點巡邏與監視哨'
    },
    recommendedShelterId: 'shelter-xinyi',
    safetyAdvice: '空曠園區夜歸請選擇有保全守衛之捷運出入口出入。'
  },

  // ==========================================
  // 12. 文山區 (景美夜市與景文街)
  // ==========================================
  {
    id: 'crime-wenshan-jingmei',
    name: '景美夜市與景文街夜間小酌熱點',
    district: '文山區',
    coordinates: [25.0885, 121.5410],
    intensity: 0.62,
    radiusMeters: 190,
    riskLevel: 'medium',
    riskTitle: '中度關注區 (黃色)',
    annualIncidentCount: 112,
    mainIncidentTypes: [
      { type: '巷道宵夜飲酒喧嘩', percentage: 48, description: '夜市收攤後少數酒客大聲爭吵' },
      { type: '捷運末班車後無人街道', percentage: 32, description: '缺乏警力常駐之巷弄落單警戒' },
      { type: '隨身物品遺落', percentage: 20, description: '攤位或小酒館遺忘皮包' }
    ],
    peakHours: '23:30 - 02:00',
    policePrecinct: {
      station: '文山第二分局 景美派出所',
      phone: '02-2931-2244',
      patrolFrequency: '定期步巡與警車巡邏'
    },
    recommendedShelterId: 'shelter-liugong',
    safetyAdvice: '夜市收攤後照明逐步熄滅，請儘速行至景文街主幹道搭車。'
  }
];

/**
 * 輔助函式：判斷給定路徑是否行經治安高風險熱區
 */
export function checkRouteHighRiskHotspots(
  routeCoordinates: [number, number][],
  hotspots: CrimeIncidentPoint[],
  thresholdMeters: number = 180
): CrimeIncidentPoint[] {
  if (!routeCoordinates || routeCoordinates.length === 0) return [];

  const dangerousHotspots: CrimeIncidentPoint[] = [];

  for (const hotspot of hotspots) {
    const isNearby = routeCoordinates.some((coord) => {
      // Simple haversine approximation for fast calculation
      const latDiff = (coord[0] - hotspot.coordinates[0]) * 111000;
      const lngDiff = (coord[1] - hotspot.coordinates[1]) * 111000 * Math.cos((coord[0] * Math.PI) / 180);
      const dist = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
      return dist <= (hotspot.radiusMeters + thresholdMeters);
    });

    if (isNearby) {
      dangerousHotspots.push(hotspot);
    }
  }

  return dangerousHotspots;
}
