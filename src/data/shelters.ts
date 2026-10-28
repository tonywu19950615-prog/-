import { SafetyShelter } from '../types';

export const SHELTERS: SafetyShelter[] = [
  {
    id: 'shelter-ximen',
    name: '麻糬號（西門町中華成都站）',
    nameEn: 'Mochi Bus - Ximending Hub',
    district: '萬華區',
    locationDescription: '中華路一段與成都路口（捷運西門站 6 號出口前徒步區守護停靠站）',
    coordinates: [25.0425, 121.5078],
    vehicleType: '大型豪華遊覽改裝守護專車',
    vehiclePlate: 'MOCHI-01',
    operatingHours: '每日 22:00 - 翌日 08:00',
    capacity: 30, // 每個庇護車輛容納人數為 30 人
    currentOccupancy: 11, // 目前車內 11 人 / 額定 30 人 (尚餘 19 席)
    securityMonitoring: {
      equipment: [
        '車前 4K 星光夜視道路與散場人流廣角鏡頭',
        '車內座艙防騷擾/肢體衝突 360° AI 智慧監測鏡頭',
        '車外 360° 環景防尾隨與異常徘徊偵測鏡頭',
      ],
      aiSurveillance: '車前、車內、車外三向 24 小時 AI 視覺演算法即時偵測（主動辨識肢體衝突、武器威脅、異常聚集、尾隨徘徊或求救手勢）',
      incidentAutoDispatch: '若系統辨識可疑狀況，毫秒級自動發送加密警訊與現場畫面至鄰近派出所，通報警力即刻趕赴現場！',
      nearestPoliceStation: {
        name: '萬華分局 漢中街派出所',
        phone: '02-2371-4110',
        address: '台北市萬華區漢中街 135 號',
        distanceMeters: 180,
        signalStatus: '5G 專網即時連線正常・毫秒級自動警報連動中',
      },
    },
    dutyHotline: '02-2370-1110',
    qrCodeId: 'MOCHI-XIMEN-2208',
    safetyAdvisory: '此區為西門町夜間治安熱區，人流量較大，散場與街頭聚集頻率高，建議保持結伴同行，避免單獨步入暗巷。',
    policeHeatTrend: [
      { hour: '22:00', heat: 32, reports: 4, patrols: 2, level: '常態' },
      { hour: '23:00', heat: 48, reports: 6, patrols: 3, level: '常態' },
      { hour: '00:00', heat: 65, reports: 9, patrols: 4, level: '偏高' },
      { hour: '01:00', heat: 78, reports: 12, patrols: 5, level: '偏高' },
      { hour: '02:00', heat: 92, reports: 16, patrols: 6, level: '高峰警戒' },
      { hour: '03:00', heat: 88, reports: 15, patrols: 6, level: '高峰警戒' },
      { hour: '04:00', heat: 60, reports: 8, patrols: 4, level: '偏高' },
      { hour: '05:00', heat: 35, reports: 3, patrols: 3, level: '常態' },
      { hour: '06:00', heat: 18, reports: 1, patrols: 2, level: '低度' },
      { hour: '07:00', heat: 12, reports: 1, patrols: 2, level: '低度' },
      { hour: '08:00', heat: 8, reports: 0, patrols: 1, level: '低度' }
    ],
    stationedPersonnel: ['執勤警員 2 名', '緊急救護EMT人員 1 名', '夜安青年關懷志工 2 名'],
    alertLevel: '加強治安戒備',
    facilities: [
      '額定容納人數：30 人（座席動態舒適管理）',
      '車前、車內、車外三向 4K 夜視監控設備',
      'AI 異常監測自動通知轄區派出所',
      '智能 QR Code 感應開門門禁',
      '暖心休息沙發隔艙',
      '溫熱電解質飲水機與解酒薑茶',
      '多規格手機極速快充站',
      '高隱私反騷擾暫歇空間',
      '生理食鹽水、急救包與 AED 去顫器',
      '婦女夜歸安全代叫計程車登記處'
    ],
    services: [
      {
        title: '治安避難與防騷擾保護',
        description: '遭遇尾隨、言語騷擾或不明人士威脅時，可立即登車尋求警力保護與隔離。',
        icon: 'ShieldCheck'
      },
      {
        title: '酒醉不適與生理暫歇',
        description: '提供防嘔吐清潔袋、溫開水、保暖毯及專業急救人員基礎生命徵象評估。',
        icon: 'HeartPulse'
      },
      {
        title: '安全乘車登記與護送',
        description: '協助呼叫公營優良合作計程車，記錄車號並由員警目送上車，確保安全返家。',
        icon: 'Car'
      },
      {
        title: 'AI 監測即時通報派出所',
        description: '車前、車內、車外 AI 感測可疑行為，零時差發送警訊連動轄區漢中街派出所。',
        icon: 'Zap'
      }
    ],
    description: '「麻糬號」進駐西門町熱門徒步區交口，每車額定容納 30 人。開放時間為 22:00 至 08:00，車外設有專屬 QR Code，掃描登錄後車門自動開啟。車前、車內、車外均配置監視設備及 AI 監測，若發生可疑狀況立即發送訊號通知鄰近漢中街派出所。'
  },
  {
    id: 'shelter-linsen',
    name: '麻糬號（林森公園條通站）',
    nameEn: 'Mochi Bus - Linsen Park Hub',
    district: '中山區',
    locationDescription: '林森北路與南京東路一段口（林森公園南側安全庇護停靠區，鄰近九條通商圈）',
    coordinates: [25.0531, 121.5273],
    vehicleType: '大型豪華遊覽改裝守護專車',
    vehiclePlate: 'MOCHI-02',
    operatingHours: '每日 22:00 - 翌日 08:00',
    capacity: 30, // 每個庇護車輛容納人數為 30 人
    currentOccupancy: 14, // 目前車內 14 人 / 額定 30 人 (尚餘 16 席)
    securityMonitoring: {
      equipment: [
        '車前 4K 星光夜視道路與散場人流廣角鏡頭',
        '車內座艙防騷擾/肢體衝突 360° AI 智慧監測鏡頭',
        '車外 360° 環景防尾隨與異常徘徊偵測鏡頭',
      ],
      aiSurveillance: '車前、車內、車外三向 24 小時 AI 視覺演算法即時偵測（主動辨識肢體衝突、武器威脅、異常聚集、尾隨徘徊或求救手勢）',
      incidentAutoDispatch: '若系統辨識可疑狀況，毫秒級自動發送加密警訊與現場畫面至鄰近派出所，通報警力即刻趕赴現場！',
      nearestPoliceStation: {
        name: '中山分局 中山一派出所',
        phone: '02-2541-6110',
        address: '台北市中山區中山北路一段 110 號',
        distanceMeters: 240,
        signalStatus: '5G 專網即時連線正常・毫秒級自動警報連動中',
      },
    },
    dutyHotline: '02-2541-1110',
    qrCodeId: 'MOCHI-LINSEN-2208',
    safetyAdvisory: '此區為條通日式居酒酒吧聚落，深夜醉酒糾紛與跌倒通報較密集，建議保持結伴同行，注意隨身財物防竊防搶。',
    policeHeatTrend: [
      { hour: '22:00', heat: 38, reports: 5, patrols: 2, level: '常態' },
      { hour: '23:00', heat: 55, reports: 8, patrols: 3, level: '偏高' },
      { hour: '00:00', heat: 72, reports: 11, patrols: 4, level: '偏高' },
      { hour: '01:00', heat: 85, reports: 14, patrols: 5, level: '高峰警戒' },
      { hour: '02:00', heat: 94, reports: 17, patrols: 6, level: '高峰警戒' },
      { hour: '03:00', heat: 90, reports: 15, patrols: 6, level: '高峰警戒' },
      { hour: '04:00', heat: 68, reports: 10, patrols: 4, level: '偏高' },
      { hour: '05:00', heat: 42, reports: 4, patrols: 3, level: '常態' },
      { hour: '06:00', heat: 20, reports: 2, patrols: 2, level: '低度' },
      { hour: '07:00', heat: 15, reports: 1, patrols: 2, level: '低度' },
      { hour: '08:00', heat: 10, reports: 0, patrols: 1, level: '低度' }
    ],
    stationedPersonnel: ['中山分局巡邏警員 2 名', '隨車醫護急救員 1 名', '多語系守護志工（英/日/中）'],
    alertLevel: '常態夜巡守護',
    facilities: [
      '額定容納人數：30 人（座席動態舒適管理）',
      '車前、車內、車外三向 4K 夜視監控設備',
      'AI 異常監測自動通知轄區派出所',
      '智能 QR Code 感應開門門禁',
      '獨立醒酒靜養躺椅',
      '防跌倒保護護欄與軟墊',
      '多語系翻譯與求助專線（日語/英語）',
      '手機應急充電寶免費借用',
      'AED 與外傷清創急救醫療箱',
      '台北市政府特約代叫車服務'
    ],
    services: [
      {
        title: '條通商圈夜行安檢避難',
        description: '針對中山條通夜店與日式酒吧商圈，隨時提供誤入糾紛或醉酒防護。',
        icon: 'ShieldAlert'
      },
      {
        title: '外語緊急求助支援',
        description: '提供日本籍與外籍遊客夜間就醫、遺失物協尋或報警溝通翻譯。',
        icon: 'Globe'
      },
      {
        title: '安心代駕與叫車登記',
        description: '提供酒後安心代駕核對，杜絕白牌車與詐欺風險。',
        icon: 'Key'
      },
      {
        title: 'AI 監測即時通報派出所',
        description: '全車內外監視設備連動 AI 分析，異常狀況直通中山一派出所警網。',
        icon: 'Coffee'
      }
    ],
    description: '「麻糬號」常駐於林森公園旁，守護繁華條通居酒屋與酒吧聚落，額定容納 30 人。每日 22:00 至 08:00 開放，掃描車外 QRcode 完成安全登記即可開啟車門。車前、車內、車外皆有監視設備及 AI 監測，遇可疑狀況即時通報中山一派出所。'
  },
  {
    id: 'shelter-expo',
    name: '麻糬號（花博公園圓山站）',
    nameEn: 'Mochi Bus - Expo Park Yuanshan Hub',
    district: '中山區',
    locationDescription: '圓山花博公園入口人行廣場（玉門街近 MAJI 集食行樂酒吧街與捷運圓山站 1 號出口）',
    coordinates: [25.0706, 121.5204],
    vehicleType: '雙層夜安巡邏多功能巴士',
    vehiclePlate: 'MOCHI-03',
    operatingHours: '每日 22:00 - 翌日 08:00',
    capacity: 30, // 每個庇護車輛容納人數為 30 人
    currentOccupancy: 8, // 目前車內 8 人 / 額定 30 人 (尚餘 22 席)
    securityMonitoring: {
      equipment: [
        '車前 4K 星光夜視道路與散場人流廣角鏡頭',
        '車內座艙防騷擾/肢體衝突 360° AI 智慧監測鏡頭',
        '車外 360° 環景防尾隨與異常徘徊偵測鏡頭',
      ],
      aiSurveillance: '車前、車內、車外三向 24 小時 AI 視覺演算法即時偵測（主動辨識肢體衝突、武器威脅、異常聚集、尾隨徘徊或求救手勢）',
      incidentAutoDispatch: '若系統辨識可疑狀況，毫秒級自動發送加密警訊與現場畫面至鄰近派出所，通報警力即刻趕赴現場！',
      nearestPoliceStation: {
        name: '大同分局 圓山派出所',
        phone: '02-2591-6110',
        address: '台北市大同區酒泉街 96 號',
        distanceMeters: 290,
        signalStatus: '5G 專網即時連線正常・毫秒級自動警報連動中',
      },
    },
    dutyHotline: '02-2591-1110',
    qrCodeId: 'MOCHI-EXPO-2208',
    safetyAdvisory: '此區為圓山露天市集與音樂活動散場核心，夜間人潮瞬間暴增，建議保持結伴同行並留意防推擠。',
    policeHeatTrend: [
      { hour: '22:00', heat: 25, reports: 3, patrols: 2, level: '低度' },
      { hour: '23:00', heat: 42, reports: 5, patrols: 3, level: '常態' },
      { hour: '00:00', heat: 60, reports: 8, patrols: 4, level: '偏高' },
      { hour: '01:00', heat: 75, reports: 11, patrols: 5, level: '偏高' },
      { hour: '02:00', heat: 88, reports: 14, patrols: 6, level: '高峰警戒' },
      { hour: '03:00', heat: 82, reports: 13, patrols: 5, level: '高峰警戒' },
      { hour: '04:00', heat: 52, reports: 7, patrols: 4, level: '偏高' },
      { hour: '05:00', heat: 28, reports: 3, patrols: 2, level: '常態' },
      { hour: '06:00', heat: 15, reports: 1, patrols: 2, level: '低度' },
      { hour: '07:00', heat: 12, reports: 1, patrols: 1, level: '低度' },
      { hour: '08:00', heat: 6, reports: 0, patrols: 1, level: '低度' }
    ],
    stationedPersonnel: ['捷運警察與轄區派出所員警 2 名', '緊急救護技術員 1 名', '學生/青年輔導志工 2 名'],
    alertLevel: '週末人潮防護',
    facilities: [
      '額定容納人數：30 人（座席動態舒適管理）',
      '車前、車內、車外三向 4K 夜視監控設備',
      'AI 異常監測自動通知轄區派出所',
      '智能 QR Code 感應開門門禁',
      '開放式安全休憩觀景二樓座艙',
      '大容量行動充電站',
      '防走失通訊與廣播尋人台',
      '抗噪防暈休憩座',
      '全套緊急止血包紮箱與氧氣瓶',
      '深夜散場安全專車指引'
    ],
    services: [
      {
        title: '派對散場人流安全疏導',
        description: '於 Triangle、Flow、THE COURT 等露天酒吧散場高峰期，維持周遭治安與指引捷運夜行公車。',
        icon: 'Users'
      },
      {
        title: '聽覺與生理疲倦調適',
        description: '車內設有降噪放鬆專區，舒緩高分貝電音派對後的暈眩或脫水不適。',
        icon: 'Headphones'
      },
      {
        title: 'AI 監測即時通報派出所',
        description: '車前、車內、車外 AI 監控連線圓山派出所，遇推擠騷擾立即發送警訊。',
        icon: 'Radio'
      },
      {
        title: '緊急搭車護送連線',
        description: '協助夜歸女性及青年安全轉乘深夜幹線公車或驗證安全計程車。',
        icon: 'Bus'
      }
    ],
    description: '「麻糬號」雙層守護巴士佇立於花博綠意園區旁，容納人數為 30 人，每日 22:00 開啟至翌日 08:00。散場民眾可透過手機掃描車門 QR Code 登錄安全開啟車門。車輛前、內、外配備監視設備及 AI 監測，若發生可疑狀況立即通報大同分局圓山派出所。'
  },
  {
    id: 'shelter-liugong',
    name: '麻糬號（瑠公公園東區站）',
    nameEn: 'Mochi Bus - Liugong Park East Hub',
    district: '大安區',
    locationDescription: '忠孝東路四段瑠公公園步道旁（頂好名店城正後方，近捷運忠孝復興站東區酒吧巷）',
    coordinates: [25.0421, 121.5458],
    vehicleType: '大型豪華遊覽改裝守護專車',
    vehiclePlate: 'MOCHI-04',
    operatingHours: '每日 22:00 - 翌日 08:00',
    capacity: 30, // 每個庇護車輛容納人數為 30 人
    currentOccupancy: 9, // 目前車內 9 人 / 額定 30 人 (尚餘 21 席)
    securityMonitoring: {
      equipment: [
        '車前 4K 星光夜視道路與散場人流廣角鏡頭',
        '車內座艙防騷擾/肢體衝突 360° AI 智慧監測鏡頭',
        '車外 360° 環景防尾隨與異常徘徊偵測鏡頭',
      ],
      aiSurveillance: '車前、車內、車外三向 24 小時 AI 視覺演算法即時偵測（主動辨識肢體衝突、武器威脅、異常聚集、尾隨徘徊或求救手勢）',
      incidentAutoDispatch: '若系統辨識可疑狀況，毫秒級自動發送加密警訊與現場畫面至鄰近派出所，通報警力即刻趕赴現場！',
      nearestPoliceStation: {
        name: '大安分局 敦化南路派出所',
        phone: '02-2771-6110',
        address: '台北市大安區忠孝東路四段 231-1 號',
        distanceMeters: 210,
        signalStatus: '5G 專網即時連線正常・毫秒級自動警報連動中',
      },
    },
    dutyHotline: '02-2771-1110',
    qrCodeId: 'MOCHI-LIUGONG-2208',
    safetyAdvisory: '此區為東區餐酒館林立之夜間治安熱區，深夜候車客群眾多，建議保持結伴同行，夜歸女性可善加利用麻糬號護送服務。',
    policeHeatTrend: [
      { hour: '22:00', heat: 30, reports: 4, patrols: 2, level: '常態' },
      { hour: '23:00', heat: 46, reports: 6, patrols: 3, level: '常態' },
      { hour: '00:00', heat: 64, reports: 9, patrols: 4, level: '偏高' },
      { hour: '01:00', heat: 80, reports: 12, patrols: 5, level: '偏高' },
      { hour: '02:00', heat: 86, reports: 13, patrols: 5, level: '高峰警戒' },
      { hour: '03:00', heat: 84, reports: 12, patrols: 5, level: '高峰警戒' },
      { hour: '04:00', heat: 56, reports: 7, patrols: 3, level: '偏高' },
      { hour: '05:00', heat: 32, reports: 3, patrols: 2, level: '常態' },
      { hour: '06:00', heat: 16, reports: 1, patrols: 2, level: '低度' },
      { hour: '07:00', heat: 10, reports: 1, patrols: 1, level: '低度' },
      { hour: '08:00', heat: 5, reports: 0, patrols: 1, level: '低度' }
    ],
    stationedPersonnel: ['大安分局巡邏警力 2 名', '專業醫護急救志工 1 名', '安心乘車服務專員 1 名'],
    alertLevel: '加強治安戒備',
    facilities: [
      '額定容納人數：30 人（座席動態舒適管理）',
      '車前、車內、車外三向 4K 夜視監控設備',
      'AI 異常監測自動通知轄區派出所',
      '智能 QR Code 感應開門門禁',
      '高隱私安心庇護座艙',
      '智能快充與行動電源租借歸還站',
      '低血糖補充糖包與電解水',
      '防狼警報哨與個人防身指引手冊',
      '急救清創醫藥箱與體溫血壓監測',
      '大安東區深夜安全步行地圖索取'
    ],
    services: [
      {
        title: '東區巷弄醉酒防搶防跌',
        description: '針對敦化/復興眾多 Bistro 與餐酒館散場客人，定點巡視防止倒臥街頭或被撿屍。',
        icon: 'Eye'
      },
      {
        title: '反跟蹤安全庇護',
        description: '如察覺遭可疑人士跟蹤，可直接走入「麻糬號」內由專員阻絕並聯絡警方。',
        icon: 'UserCheck'
      },
      {
        title: '同行友人協尋與連線',
        description: '協助酒醉離散、遺失隨身物品的民眾調閱路口監視器或代聯絡同行夥伴。',
        icon: 'Smartphone'
      },
      {
        title: 'AI 監測即時通報派出所',
        description: '車前、車內、車外 360 度 AI 影像監測，異常狀況即時連線敦化南路派出所。',
        icon: 'Navigation'
      }
    ],
    description: '坐落於大安東區核心商圈瑠公公園旁，「麻糬號」每車容納 30 人，於每日 22:00 開啟至翌日 08:00。民眾使用 app 掃描車門 QR Code 完成資訊填寫後車門自動開啟。車前車內車外均設有監視設備及 AI 監測，若有可疑狀況立即通報敦化南路派出所。'
  },
  {
    id: 'shelter-xinyi',
    name: '麻糬號（信義廣場旗艦站）',
    nameEn: 'Mochi Bus - Xinyi Plaza Flagship Hub',
    district: '信義區',
    locationDescription: '信義廣場旁（松智路與信義路五段交叉口，台北 101 與 ATT 4 FUN 夜店散場核心熱區）',
    coordinates: [25.0336, 121.5668],
    vehicleType: '守護者夜巡旗艦專車',
    vehiclePlate: 'MOCHI-05',
    operatingHours: '每日 22:00 - 翌日 08:00',
    capacity: 30, // 每個庇護車輛容納人數為 30 人
    currentOccupancy: 12, // 目前車內 12 人 / 額定 30 人 (尚餘 18 席)
    securityMonitoring: {
      equipment: [
        '車前 4K 星光夜視道路與散場人流廣角鏡頭',
        '車內座艙防騷擾/肢體衝突 360° AI 智慧監測鏡頭',
        '車外 360° 環景防尾隨與異常徘徊偵測鏡頭',
      ],
      aiSurveillance: '車前、車內、車外三向 24 小時 AI 視覺演算法即時偵測（主動辨識肢體衝突、武器威脅、異常聚集、尾隨徘徊或求救手勢）',
      incidentAutoDispatch: '若系統辨識可疑狀況，毫秒級自動發送加密警訊與現場畫面至鄰近派出所，通報警力即刻趕赴現場！',
      nearestPoliceStation: {
        name: '信義分局 三張犁派出所',
        phone: '02-2723-6110',
        address: '台北市信義區信義路五段 17 號',
        distanceMeters: 250,
        signalStatus: '5G 專網即時連線正常・毫秒級自動警報連動中',
      },
    },
    dutyHotline: '02-2723-1110',
    qrCodeId: 'MOCHI-XINYI-2208',
    safetyAdvisory: '此區為全台北夜店最密集之核心治安熱區，深夜 02:00 至 04:30 散場人流量極大且警政通報熱度達高峰，嚴防酒後口角鬥毆，強烈建議務必保持結伴同行！',
    policeHeatTrend: [
      { hour: '22:00', heat: 35, reports: 4, patrols: 2, level: '常態' },
      { hour: '23:00', heat: 52, reports: 7, patrols: 3, level: '偏高' },
      { hour: '00:00', heat: 70, reports: 11, patrols: 4, level: '偏高' },
      { hour: '01:00', heat: 86, reports: 15, patrols: 6, level: '高峰警戒' },
      { hour: '02:00', heat: 98, reports: 22, patrols: 8, level: '高峰警戒' },
      { hour: '03:00', heat: 96, reports: 20, patrols: 8, level: '高峰警戒' },
      { hour: '04:00', heat: 82, reports: 14, patrols: 6, level: '高峰警戒' },
      { hour: '05:00', heat: 50, reports: 6, patrols: 4, level: '常態' },
      { hour: '06:00', heat: 24, reports: 2, patrols: 2, level: '低度' },
      { hour: '07:00', heat: 14, reports: 1, patrols: 2, level: '低度' },
      { hour: '08:00', heat: 8, reports: 0, patrols: 1, level: '低度' }
    ],
    stationedPersonnel: ['信義分局防暴特勤/巡邏警力 3 名', '專職高級救護員 EMT-P 1 名', '夜行安全社工 2 名'],
    alertLevel: '週末人潮防護',
    facilities: [
      '額定容納人數：30 人（座席動態舒適管理）',
      '車前、車內、車外三向 4K 夜視監控設備',
      'AI 異常監測自動通知轄區派出所',
      '智能 QR Code 感應開門門禁',
      '旗艦級雙排舒壓護頸航空座椅',
      '急救加護等級醫療急救設備含高濃度氧氣',
      '全系列 65W 超高速多孔快充充電柱',
      '女性專屬獨立密閉安全庇護休眠間',
      '防糾紛即時現場 360 度 8K 鷹眼攝錄鏡頭',
      '安全代叫車專屬上下客緩衝專用道'
    ],
    services: [
      {
        title: '超高人流夜店防暴防推擠',
        description: '緊鄰 ATT 4 FUN、Wave、AI 等大型夜店，重兵部署防制酒後鬥毆與爭執。',
        icon: 'ShieldAlert'
      },
      {
        title: '重度脫水與酒精不適急救',
        description: '配有專用醫療檢測儀器，即時排除酒精中毒急性風險，必要時直通北醫急診。',
        icon: 'Activity'
      },
      {
        title: 'AI 監測即時通報派出所',
        description: '車前、車內、車外 AI 監控連線三張犁派出所，遇推擠騷擾立即發送警訊。',
        icon: 'HeartHandshake'
      },
      {
        title: '旗艦級深夜安全轉運導引',
        description: '指引通宵夜行公車、捷運首班車時間，並提供防醉倒定時提醒鬧鐘服務。',
        icon: 'Compass'
      }
    ],
    description: '「麻糬號」信義旗艦站是台北夜生活治安熱區的心臟樞紐，坐落於信義夜店城散場必經要道，額定容納人數為 30 人。開放時間為每日 22:00 至翌日 08:00，車載智慧門禁系統須由使用者以 App 掃描專屬 QR Code 輸入基本資訊後開門解鎖。車前、車內、車外均配置監視設備及 AI 監測，若發生可疑狀況立即發送訊號通知鄰近三張犁派出所。'
  }
];
