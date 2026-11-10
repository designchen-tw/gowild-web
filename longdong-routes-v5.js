/* Long Dong recommended routes and sub-sector data. */
(() => {
  const root = document.querySelector('[data-ld-detail]');
  if (!root || root.dataset.routesReady) return;
  const routeSource = root.querySelector('[data-ld-route-source]');
  const triggers = [...root.querySelectorAll('[data-subsector-trigger]')];
  if (!routeSource || triggers.length !== 9) return;

  // Edit the route rows here. Sector order follows the map cards.
  const sectors = [
    {zh: "校門口", en: "School Gate", routes: [
      {source: "longdong/92w6b2", subsector: "人面岩", zh: "V槽", en: "V-Groove", grade: "5.10b", captionZh: "校門口 · 人面岩 · 運動攀登 · 8 bolts + anchor", captionEn: "School Gate · Disco Buttress · Sport · 8 bolts + anchor"},
      {source: "longdong/nceecg", subsector: "人面岩", zh: "無名小卒", en: "Nowhere Man", grade: "5.12a", captionZh: "校門口 · 人面岩 · 運動攀登 · 9 bolts + anchor", captionEn: "School Gate · Disco Buttress · Sport · 9 bolts + anchor"},
      {source: "longdong/nf9tsv", subsector: "人面岩", zh: "水虎魚", en: "Piranha", grade: "5.11c", captionZh: "校門口 · 人面岩 · 運動攀登 · 10 bolts + anchor", captionEn: "School Gate · Disco Buttress · Sport · 10 bolts + anchor"},
      {source: "longdong/bec7mg", subsector: "人面岩", zh: "Disco大裂隙", en: "Disco Fistcrack", grade: "5.10a", captionZh: "校門口 · 人面岩 · 傳統攀登", captionEn: "School Gate · Disco Buttress · Trad"},
      {source: "longdong/6bkwbs", subsector: "校門口", zh: "輪迴", en: "Reincarnation", grade: "5.11c", captionZh: "校門口 · 運動攀登 · 3 bolts + anchor", captionEn: "School Gate · Sport · 3 bolts + anchor"},
      {source: "longdong/57q6c4", subsector: "校門口", zh: "Oh No!", en: "Oh No!", grade: "5.11c", captionZh: "校門口 · 運動攀登 · 6 bolts + anchor", captionEn: "School Gate · Sport · 6 bolts + anchor"},
      {source: "longdong/ay42j5", subsector: "校門口", zh: "Oh!", en: "Oh!", grade: "5.8", captionZh: "校門口 · 運動攀登 · 8 bolts + anchor", captionEn: "School Gate · Sport · 8 bolts + anchor"},
      {source: "longdong/4h9qrg", subsector: "校門口", zh: "阿彌陀佛", en: "Stepover", grade: "5.10b", captionZh: "校門口 · 運動攀登 · 8 bolts + anchor", captionEn: "School Gate · Sport · 8 bolts + anchor"},
      {source: "longdong/nrkn3m", subsector: "門簷", zh: "擠不擠由你", en: "Choose Your Size", grade: "5.8", captionZh: "校門口 · 門簷 · 傳統攀登", captionEn: "School Gate · Apprentice Rock · Trad"},
    ]},
    {zh: "鐘塔", en: "Clock Tower", routes: [
      {source: "longdong/ctse76", subsector: "訓導處", zh: "訓導主任", en: "Blind Reach", grade: "5.11d", captionZh: "鐘塔 · 訓導處 · 傳統攀登", captionEn: "Clock Tower · Discipline Area · Trad"},
      {source: "longdong/q4e55t", subsector: "訓導處", zh: "非暴力抵抗", en: "Civil Disobedience", grade: "5.9", captionZh: "鐘塔 · 訓導處 · 傳統攀登", captionEn: "Clock Tower · Discipline Area · Trad"},
      {source: "longdong/ffwwrm", subsector: "訓導處", zh: "觀護人", en: "Probation Officer", grade: "5.10b", captionZh: "鐘塔 · 訓導處 · 傳統攀登", captionEn: "Clock Tower · Discipline Area · Trad"},
      {source: "longdong/vwhakz", subsector: "鐘塔", zh: "剃刀邊緣", en: "One Way Ticket", grade: "5.10c", captionZh: "鐘塔 · 傳統攀登", captionEn: "Clock Tower · Trad"},
      {source: "longdong/gshh2m", subsector: "鐘塔", zh: "斜線", en: "Diagonal", grade: "5.10d", captionZh: "鐘塔 · 傳統攀登", captionEn: "Clock Tower · Trad"},
      {source: "longdong/9bvhke", subsector: "總統頭像山", zh: "橢圓辦公室", en: "Oval Office", grade: "5.11a", captionZh: "鐘塔 · 總統頭像山 · 傳統攀登", captionEn: "Clock Tower · Four Presidents · Trad"},
      {source: "longdong/maw78n", subsector: "短巷", zh: "蔚藍的誘惑", en: "Crystal Blue Temptation", grade: "5.8", captionZh: "鐘塔 · 短巷 · 深水抱石", captionEn: "Clock Tower · Short Lane · Deep-water soloing"},
    ]},
    {zh: "長巷", en: "Long Lane", routes: [
      {source: "longdong/y8kp9j", subsector: "佈告欄", zh: "宇宙邊緣", en: "Edge of the Universe", grade: "5.10d", captionZh: "長巷 · 佈告欄 · 傳統攀登", captionEn: "Long Lane · Bulletin Board · Trad"},
      {source: "longdong/s8z9e4", subsector: "佈告欄", zh: "黑洞", en: "Black Hole", grade: "5.11d", captionZh: "長巷 · 佈告欄 · 傳統攀登", captionEn: "Long Lane · Bulletin Board · Trad"},
      {source: "longdong/as6qw8", subsector: "佈告欄", zh: "倒走天梯", en: "Sky Ladder", grade: "5.10b", captionZh: "長巷 · 佈告欄 · 運動攀登 · 9 bolts + anchor", captionEn: "Long Lane · Bulletin Board · Sport · 9 bolts + anchor"},
      {source: "longdong/6h36pz", subsector: "佈告欄", zh: "發想", en: "Plausible", grade: "5.10b", captionZh: "長巷 · 佈告欄 · 運動攀登 · 9 bolts + anchor", captionEn: "Long Lane · Bulletin Board · Sport · 9 bolts + anchor"},
      {source: "longdong/4kfv2n", subsector: "佈告欄", zh: "金門斜板", en: "Golden Gate Slab", grade: "5.8", captionZh: "長巷 · 佈告欄 · 運動攀登 · 4 bolts + anchor", captionEn: "Long Lane · Bulletin Board · Sport · 4 bolts + anchor"},
      {source: "longdong/ebzsy6", subsector: "長巷", zh: "天勾", en: "Skyhook", grade: "5.11a", captionZh: "長巷 · 運動攀登 · 4 bolts + anchor", captionEn: "Long Lane · Sport · 4 bolts + anchor"},
      {source: "longdong/x3djc5", subsector: "長巷", zh: "凹洞懸岩", en: "Pocket Overhang", grade: "5.10a", captionZh: "長巷 · 運動攀登 · 7 bolts + anchor", captionEn: "Long Lane · Sport · 7 bolts + anchor"},
      {source: "longdong/hbqcmf", subsector: "長巷", zh: "杯弓蛇影", en: "Fear Only Fear Itself", grade: "5.11+", captionZh: "長巷 · 運動攀登 · 5 bolts + anchor", captionEn: "Long Lane · Sport · 5 bolts + anchor"},
      {source: "longdong/zms6ag", subsector: "獨木橋畔", zh: "十字裂隙", en: "Cross", grade: "5.9", captionZh: "長巷 · 獨木橋畔 · 傳統攀登", captionEn: "Long Lane · Wooden Bridge · Trad"},
      {source: "longdong/6vfuxh", subsector: "獨木橋畔", zh: "弒龍者", en: "Dragonslayer", grade: "5.9", captionZh: "長巷 · 獨木橋畔 · 傳統攀登", captionEn: "Long Lane · Wooden Bridge · Trad"},
      {source: "longdong/5mfdep", subsector: "獨木橋畔", zh: "白龍夢", en: "Dream of White Dragons", grade: "5.9", captionZh: "長巷 · 獨木橋畔 · 傳統攀登", captionEn: "Long Lane · Wooden Bridge · Trad"},
    ]},
    {zh: "音樂廳", en: "Music Hall", routes: [
      {source: "longdong/d7xdgx", subsector: "正面", zh: "大鼓", en: "Big Drum", grade: "5.11b", captionZh: "音樂廳 · 正面 · 運動攀登 · 8 bolts + anchor", captionEn: "Music Hall · Main Face · Sport · 8 bolts + anchor"},
      {source: "longdong/jw4spg", subsector: "正面", zh: "豎琴", en: "Fingercrack", grade: "5.11c", captionZh: "音樂廳 · 正面 · 運動攀登 · 8 bolts + anchor", captionEn: "Music Hall · Main Face · Sport · 8 bolts + anchor"},
      {source: "longdong/napnzf", subsector: "正面", zh: "Fucking Fall", en: "Fucking Fall", grade: "5.11a", captionZh: "音樂廳 · 正面 · 運動攀登 · 7 bolts + anchor", captionEn: "Music Hall · Main Face · Sport · 7 bolts + anchor"},
      {source: "longdong/n5wr77", subsector: "北面", zh: "結婚路線", en: "Wedding Route", grade: "5.7", captionZh: "音樂廳 · 北面 · 傳統攀登", captionEn: "Music Hall · North Face · Trad"},
      {source: "longdong/rtpfqe", subsector: "北面", zh: "小三角", en: "Small Triangle", grade: "5.9+", captionZh: "音樂廳 · 北面 · 傳統攀登", captionEn: "Music Hall · North Face · Trad"},
      {source: "longdong/z2tegg", subsector: "包廂", zh: "包廂內角", en: "Balcony Dihedral", grade: "5.10a", captionZh: "音樂廳 · 包廂 · 傳統攀登 · 2Pitch", captionEn: "Music Hall · Balcony · Trad · 2Pitch"},
      {source: "longdong/3fbrqz", subsector: "鯨魚頭", zh: "白鯨記", en: "Moby Dick", grade: "5.10a", captionZh: "音樂廳 · 鯨魚頭 · 傳統攀登", captionEn: "Music Hall · Whale’s Head · Trad"},
      {source: "longdong/wysr88", subsector: "鯨魚頭", zh: "星巴克", en: "Starbuck", grade: "5.10+", captionZh: "音樂廳 · 鯨魚頭 · 傳統攀登", captionEn: "Music Hall · Whale’s Head · Trad"},
      {source: "longdong/z62yhv", subsector: "鯨魚頭", zh: "亞哈船長", en: "Captain Ahab", grade: "5.11+", captionZh: "音樂廳 · 鯨魚頭 · 傳統攀登", captionEn: "Music Hall · Whale’s Head · Trad"},
    ]},
    {zh: "大禮堂", en: "Grand Auditorium", routes: [
      {source: "longdong/dct4zy", subsector: "西面", zh: "自由裂隙", en: "Freedom Crack", grade: "5.9", captionZh: "大禮堂 · 西面 · 傳統攀登 · 2Pitch", captionEn: "Grand Auditorium · West Wall · Trad · 2Pitch"},
      {source: "longdong/h7fnue", subsector: "西面", zh: "大懸岩", en: "The Great Roof", grade: "5.13b", captionZh: "大禮堂 · 西面 · 傳統攀登 · 2Pitch", captionEn: "Grand Auditorium · West Wall · Trad · 2Pitch"},
      {source: "longdong/zf47a8", subsector: "西面", zh: "十", en: "Ten", grade: "5.9+", captionZh: "大禮堂 · 西面 · 傳統攀登", captionEn: "Grand Auditorium · West Wall · Trad"},
      {source: "longdong/drdkqj", subsector: "龍柱", zh: "龍路", en: "Via del Drago", grade: "5.10+", captionZh: "大禮堂 · 龍柱 · 傳統攀登 · 2Pitch", captionEn: "Grand Auditorium · Dragon Point Buttress · Trad · 2Pitch"},
    ]},
    {zh: "第一洞", en: "First Cave", routes: [
      {source: "longdong/jrefpj", subsector: "龍脊背面下半部", zh: "騙人的岩角", en: "Deceiving Arête", grade: "5.11a", captionZh: "第一洞 · 龍脊背面下半部 · 運動攀登 · 6 bolts + anchor", captionEn: "First Cave · Lower Dragon Ridge · Sport · 6 bolts + anchor"},
      {source: "longdong/y8g6e6", subsector: "龍脊背面下半部", zh: "福利社", en: "Commissary Crack", grade: "5.10", captionZh: "第一洞 · 龍脊背面下半部 · 傳統攀登 · 2Pitch", captionEn: "First Cave · Lower Dragon Ridge · Trad · 2Pitch"},
      {source: "longdong/zrhbb5", subsector: "龍脊背面下半部", zh: "Sorry Erica", en: "Sorry Erica", grade: "5.10a", captionZh: "第一洞 · 龍脊背面下半部 · 運動攀登 · 7 bolts + anchor", captionEn: "First Cave · Lower Dragon Ridge · Sport · 7 bolts + anchor"},
    ]},
    {zh: "第二洞", en: "Second Cave", routes: [
      {source: "longdong/gnn4mh", subsector: "後院", zh: "無尾熊", en: "Koala", grade: "5.10d", captionZh: "第二洞 · 後院 · 傳統攀登", captionEn: "Second Cave · Back Porch · Trad"},
      {source: "longdong/2umpm9", subsector: "陽光面", zh: "向陽懸岩", en: "Sunshine Overhang", grade: "5.9", captionZh: "第二洞 · 陽光面 · 傳統攀登", captionEn: "Second Cave · Sunshine Wall · Trad"},
      {source: "longdong/aggdmw", subsector: "入口裂隙", zh: "榔頭時刻", en: "Hammer Time", grade: "5.10a", captionZh: "第二洞 · 入口裂隙 · 傳統攀登 · PG", captionEn: "Second Cave · Entrance Cracks · Trad · PG"},
      {source: "longdong/hn63q8", subsector: "入口裂隙", zh: "中將湯", en: "Zhong Jiang Soup", grade: "5.11c", captionZh: "第二洞 · 入口裂隙 · 運動攀登 · 14 bolts + anchor", captionEn: "Second Cave · Entrance Cracks · Sport · 14 bolts + anchor"},
      {source: "longdong/9c6yv9", subsector: "入口裂隙", zh: "右衛門", en: "Uemon", grade: "5.9", captionZh: "第二洞 · 入口裂隙 · 傳統攀登", captionEn: "Second Cave · Entrance Cracks · Trad"},
    ]},
    {zh: "黃金谷", en: "Golden Valley", routes: [
      {source: "longdong/gxpjt5", subsector: "貓屋", zh: "殺人狂", en: "Psycho Killer", grade: "5.11d", captionZh: "黃金谷 · 貓屋 · 傳統攀登", captionEn: "Golden Valley · The Cathouse · Trad"},
      {source: "longdong/gsrxkm", subsector: "貓屋", zh: "匏瓜抓狂", en: "BA Insanity", grade: "5.10a", captionZh: "黃金谷 · 貓屋 · 傳統攀登", captionEn: "Golden Valley · The Cathouse · Trad"},
      {source: "longdong/6sdj7z", subsector: "貓屋", zh: "語言學家", en: "Cunning Linguist", grade: "5.10c", captionZh: "黃金谷 · 貓屋 · 傳統攀登", captionEn: "Golden Valley · The Cathouse · Trad"},
      {source: "longdong/9vwgud", subsector: "伸展台", zh: "貓戰", en: "Catfight", grade: "5.10c", captionZh: "黃金谷 · 伸展台 · 傳統攀登 · PG", captionEn: "Golden Valley · Catwalk · Trad · PG"},
      {source: "longdong/wyn6bu", subsector: "浪之外", zh: "華西街", en: "Snake Alley", grade: "5.10b", captionZh: "黃金谷 · 浪之外 · 傳統攀登 · 2Pitch", captionEn: "Golden Valley · Euro Wall · Trad · 2Pitch"},
      {source: "longdong/sm6ph4", subsector: "黃金岩", zh: "黃金浴", en: "Golden Shower", grade: "5.9", captionZh: "黃金谷 · 黃金岩 · 傳統攀登", captionEn: "Golden Valley · Gold Wall · Trad"},
      {source: "longdong/6ssmhx", subsector: "黃金岩", zh: "珍珠項鍊", en: "PearlNecklace", grade: "5.10a", captionZh: "黃金谷 · 黃金岩 · 傳統攀登", captionEn: "Golden Valley · Gold Wall · Trad"},
      {source: "longdong/58745w", subsector: "黑岩", zh: "白臉", en: "White-Faced Man", grade: "5.11b", captionZh: "黃金谷 · 黑岩 · 運動攀登 · 7 bolts + anchor", captionEn: "Golden Valley · Black Wall · Sport · 7 bolts + anchor"},
      {source: "longdong/4gw25p", subsector: "黑岩", zh: "黑臉", en: "Black-Faced Man", grade: "5.12a", captionZh: "黃金谷 · 黑岩 · 運動攀登 · 8 bolts + anchor", captionEn: "Golden Valley · Black Wall · Sport · 8 bolts + anchor"},
      {source: "longdong/t84dek", subsector: "黑岩", zh: "黑魔法巫婆", en: "Black Magic Woman", grade: "5.10b", captionZh: "黃金谷 · 黑岩 · 傳統攀登", captionEn: "Golden Valley · Black Wall · Trad"},
      {source: "longdong/xwcdvj", subsector: "傳奇岩", zh: "名不虛傳", en: "The Real Legend", grade: "5.13a", captionZh: "黃金谷 · 傳奇岩 · 運動攀登 · 13 bolts + anchor", captionEn: "Golden Valley · Legend Wall · Sport · 13 bolts + anchor"},
      {source: "longdong/unbhx9", subsector: "傳奇岩", zh: "黃金傳奇", en: "Golden Legend", grade: "5.13d", captionZh: "黃金谷 · 傳奇岩 · 運動攀登 · 15 bolts + anchor", captionEn: "Golden Valley · Legend Wall · Sport · 15 bolts + anchor"},
      {source: "longdong/9hu944", subsector: "傳奇岩", zh: "無名氏", en: "Mr. Anonymous", grade: "5.11d", captionZh: "黃金谷 · 傳奇岩 · 運動攀登 · 12 bolts + anchor", captionEn: "Golden Valley · Legend Wall · Sport · 12 bolts + anchor"},
      {source: "longdong/uweyd7", subsector: "傳奇岩", zh: "不方便", en: "Inconvenient", grade: "5.11a", captionZh: "黃金谷 · 傳奇岩 · 運動攀登 · 7 bolts + anchor", captionEn: "Golden Valley · Legend Wall · Sport · 7 bolts + anchor"},
      {source: "longdong/u3dxdb", subsector: "傳奇岩", zh: "非常不方便", en: "Very Inconvenient", grade: "5.12a", captionZh: "黃金谷 · 傳奇岩 · 運動攀登 · 11 bolts + anchor", captionEn: "Golden Valley · Legend Wall · Sport · 11 bolts + anchor"},
      {source: "longdong/b6nhd6", subsector: "比基尼洞穴", zh: "細帶比基尼", en: "String Bikini", grade: "5.11a", captionZh: "黃金谷 · 比基尼洞穴 · 傳統攀登", captionEn: "Golden Valley · Bikini Cave · Trad"},
      {source: "longdong/pthe3h", subsector: "龍船岩", zh: "黃粱一夢", en: "Aus der Traum", grade: "5.10b", captionZh: "黃金谷 · 龍船岩 · 運動攀登 · 10 bolts + anchor", captionEn: "Golden Valley · Dragon Boat Wall · Sport · 10 bolts + anchor"},
      {source: "longdong/fhnqd2", subsector: "龍船岩", zh: "決不", en: "Never", grade: "5.11a", captionZh: "黃金谷 · 龍船岩 · 運動攀登 · 11 bolts + anchor", captionEn: "Golden Valley · Dragon Boat Wall · Sport · 11 bolts + anchor"},
      {source: "longdong/khuh2r", subsector: "龍船岩", zh: "團隊合作", en: "Teamwork", grade: "5.10c", captionZh: "黃金谷 · 龍船岩 · 運動攀登 · 7 bolts + anchor", captionEn: "Golden Valley · Dragon Boat Wall · Sport · 7 bolts + anchor"},
    ]},
    {zh: "後門", en: "Back Door", routes: [
      {source: "longdong/h85jpa", subsector: "地下二樓", zh: "誰騙了誰?", en: "Who Fooled Who?", grade: "5.11a", captionZh: "後門 · 地下二樓 · 運動攀登 · 12 bolts + anchor", captionEn: "Back Door · Basement · Sport · 12 bolts + anchor"},
      {source: "longdong/ttp5g6", subsector: "地下二樓", zh: "大家的福利", en: "Everybody's Welfare", grade: "5.11a", captionZh: "後門 · 地下二樓 · 運動攀登 · 9 bolts + anchor", captionEn: "Back Door · Basement · Sport · 9 bolts + anchor"},
      {source: "longdong/t357dk", subsector: "地下二樓", zh: "高檔快扣", en: "High Class Quickdraw", grade: "5.10d", captionZh: "後門 · 地下二樓 · 運動攀登 · 11 bolts + anchor", captionEn: "Back Door · Basement · Sport · 11 bolts + anchor"},
      {source: "longdong/emuu2b", subsector: "地下二樓", zh: "倩女驚魂", en: "Phantom Fright", grade: "5.10b", captionZh: "後門 · 地下二樓 · 傳統攀登", captionEn: "Back Door · Basement · Trad"},
      {source: "longdong/qn468g", subsector: "地下二樓", zh: "好人阿郎", en: "Good Guy A-Lang", grade: "5.11c", captionZh: "後門 · 地下二樓 · 運動攀登 · 11 bolts + anchor", captionEn: "Back Door · Basement · Sport · 11 bolts + anchor"},
      {source: "longdong/s97zfz", subsector: "地下二樓", zh: "赤頭", en: "Redhead", grade: "5.11a", captionZh: "後門 · 地下二樓 · 運動攀登 · 12 bolts + anchor", captionEn: "Back Door · Basement · Sport · 12 bolts + anchor"},
      {source: "longdong/e44qgd", subsector: "地下二樓", zh: "新法拉利", en: "New Ferrari", grade: "5.11c", captionZh: "後門 · 地下二樓 · 運動攀登 · 9 bolts + anchor", captionEn: "Back Door · Basement · Sport · 9 bolts + anchor"},
      {source: "longdong/pgr5vy", subsector: "美好的懸岩", zh: "遺落的視界", en: "Lost World", grade: "5.9", captionZh: "後門 · 美好的懸岩 · 傳統攀登 · 2Pitch", captionEn: "Back Door · P.O. Wall · Trad · 2Pitch"},
    ]},
  ];

  const escapeHtml = value => value.replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
  routeSource.innerHTML = sectors.map((sector, index) => {
    const id = 'ld-routes-' + String(index + 1).padStart(2, '0');
    const count = sector.routes.length;
    const rows = sector.routes.map(route => `
      <article data-ld-route data-route-source="${escapeHtml(route.source)}" data-route-subsector="${escapeHtml(route.subsector)}">
        <div>
          <h3 data-route-title><span class="ld-detail__route-pair"><span data-route-cn>${escapeHtml(route.zh)}</span><span data-route-en>${escapeHtml(route.en)}</span></span></h3>
          <p data-lang-en="${escapeHtml(route.captionEn)}">${escapeHtml(route.captionZh)}</p>
        </div>
        <strong>${escapeHtml(route.grade)}</strong>
      </article>`).join('');
    return `
      <section class="ld-route-group" id="${id}" data-route-group="${index}" data-route-count="${count}" tabindex="-1">
        <header class="ld-route-group__header"><h3 data-area-title><span class="ld-detail__area-pair"><span data-area-cn>${escapeHtml(sector.zh)}</span><span data-area-en>${escapeHtml(sector.en)}</span></span></h3></header>
        <div class="ld-detail__route-list" id="${id}-list">${rows}</div>
        ${count > 5 ? `<button type="button" class="ld-routes-toggle" data-routes-toggle aria-controls="${id}-list" aria-expanded="false"><span data-route-toggle-label>展開全部 ${count} 條</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></button>` : ''}
      </section>`;
  }).join('');
  const groups = [...routeSource.querySelectorAll('[data-route-group]')];
  const template = document.createElement('div');
  template.innerHTML = "<dialog id=\"ld-subsector-dialog\" class=\"ld-subsector-dialog\" data-subsector-dialog aria-modal=\"true\"><div class=\"ld-subsector-dialog__body\"><button type=\"button\" class=\"ld-subsector-close\" data-subsector-close aria-label=\"關閉細分區\" autofocus><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"m6 6 12 12M18 6 6 18\"/></svg></button><section data-subsector-panel=\"0\" hidden><header><span class=\"ld-subsector-number\">01</span><h3 id=\"ld-subsector-title-0\" data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>校門口</span><span data-area-en>School Gate</span></span></h3></header><hr class=\"ld-subsector-divider\"><ul class=\"ld-subsector-list\"><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>人面岩</span><span data-area-en>Disco Buttress</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>校門口</span><span data-area-en>School Gate Crag</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>門簷</span><span data-area-en>Apprentice Rock</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>騙人的牆</span><span data-area-en>Illusion Wall</span></span></span></li></ul></section><section data-subsector-panel=\"1\" hidden><header><span class=\"ld-subsector-number\">02</span><h3 id=\"ld-subsector-title-1\" data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>鐘塔</span><span data-area-en>Clock Tower</span></span></h3></header><hr class=\"ld-subsector-divider\"><ul class=\"ld-subsector-list\"><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>訓導處</span><span data-area-en>Discipline Area</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>水池畔</span><span data-area-en>Pondside Wall</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>左鐘塔</span><span data-area-en>Left Tower</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>鐘塔</span><span data-area-en>Clocktower</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>總統頭像山</span><span data-area-en>Four Presidents</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>短巷</span><span data-area-en>Short Lane</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>臨海面</span><span data-area-en>Sea Wall</span></span></span></li></ul></section><section data-subsector-panel=\"2\" hidden><header><span class=\"ld-subsector-number\">03</span><h3 id=\"ld-subsector-title-2\" data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>長巷</span><span data-area-en>Long Lane</span></span></h3></header><hr class=\"ld-subsector-divider\"><ul class=\"ld-subsector-list\"><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>佈告欄</span><span data-area-en>Bulletin Board</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>長巷</span><span data-area-en>Long Lane</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>獨木橋畔</span><span data-area-en>Wooden Bridge</span></span></span></li></ul></section><section data-subsector-panel=\"3\" hidden><header><span class=\"ld-subsector-number\">04</span><h3 id=\"ld-subsector-title-3\" data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>音樂廳</span><span data-area-en>Music Hall</span></span></h3></header><hr class=\"ld-subsector-divider\"><ul class=\"ld-subsector-list\"><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>破碎面</span><span data-area-en>Broken Faces</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>左面</span><span data-area-en>Left Face</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>正面</span><span data-area-en>Main Face</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>北面</span><span data-area-en>North Face</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>演奏台</span><span data-area-en>Recital Hall</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>包廂</span><span data-area-en>Balcony</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>鯨魚頭</span><span data-area-en>Whale’s Head</span></span></span></li></ul></section><section data-subsector-panel=\"4\" hidden><header><span class=\"ld-subsector-number\">05</span><h3 id=\"ld-subsector-title-4\" data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>大禮堂</span><span data-area-en>Grand Auditorium</span></span></h3></header><hr class=\"ld-subsector-divider\"><ul class=\"ld-subsector-list\"><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>上龍脊</span><span data-area-en>Upper Dragon Ridge</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>南側</span><span data-area-en>South Side</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>大斜板</span><span data-area-en>Great Slab</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>西面</span><span data-area-en>West Wall</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>凡登峽谷</span><span data-area-en>Verdon Wall</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>龍柱</span><span data-area-en>Dragon Point Buttress</span></span></span></li></ul></section><section data-subsector-panel=\"5\" hidden><header><span class=\"ld-subsector-number\">06</span><h3 id=\"ld-subsector-title-5\" data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>第一洞</span><span data-area-en>First Cave</span></span></h3></header><hr class=\"ld-subsector-divider\"><ul class=\"ld-subsector-list\"><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>洞外左側</span><span data-area-en>Exterior Left</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>洞之上</span><span data-area-en>Headwall</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>第一洞內 南面</span><span data-area-en>Interior South End</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>第一洞內 西面</span><span data-area-en>Interior West Wall</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>第一洞內 東北面</span><span data-area-en>Interior Northeast Wall</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>外牆</span><span data-area-en>Outer Wall</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>龍脊背面下半部</span><span data-area-en>Lower Dragon Ridge</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>龍脊背面上半部</span><span data-area-en>Yellow Wall</span></span></span></li></ul></section><section data-subsector-panel=\"6\" hidden><header><span class=\"ld-subsector-number\">07</span><h3 id=\"ld-subsector-title-6\" data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>第二洞</span><span data-area-en>Second Cave</span></span></h3></header><hr class=\"ld-subsector-divider\"><ul class=\"ld-subsector-list\"><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>後院</span><span data-area-en>Back Porch</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>陽光面</span><span data-area-en>Sunshine Wall</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>入口裂隙</span><span data-area-en>Entrance Cracks</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>雨牆</span><span data-area-en>Rain Wall</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>洞外岩壁</span><span data-area-en>Cave Rock</span></span></span></li></ul></section><section data-subsector-panel=\"7\" hidden><header><span class=\"ld-subsector-number\">08</span><h3 id=\"ld-subsector-title-7\" data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>黃金谷</span><span data-area-en>Golden Valley</span></span></h3></header><hr class=\"ld-subsector-divider\"><ul class=\"ld-subsector-list\"><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>貓屋</span><span data-area-en>The Cathouse</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>伸展台</span><span data-area-en>Catwalk</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>浪之外</span><span data-area-en>Euro Wall</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>黃金岩</span><span data-area-en>Gold Wall</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>黑岩</span><span data-area-en>Black Wall</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>傳奇岩</span><span data-area-en>Legend Wall</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>比基尼洞穴</span><span data-area-en>Bikini Cave</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>塔岩</span><span data-area-en>Tower Wall</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>龍船岩</span><span data-area-en>Dragon Boat Wall</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>失落的龍塔</span><span data-area-en>Lost Dragon Spire</span></span></span></li></ul></section><section data-subsector-panel=\"8\" hidden><header><span class=\"ld-subsector-number\">09</span><h3 id=\"ld-subsector-title-8\" data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>後門</span><span data-area-en>Back Door</span></span></h3></header><hr class=\"ld-subsector-divider\"><ul class=\"ld-subsector-list\"><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>地下一樓</span><span data-area-en>B1</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>地下室台階</span><span data-area-en>Basement Steps</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>地下二樓</span><span data-area-en>Basement</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>老人牆</span><span data-area-en>Old Man Wall</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>鱷魚岬</span><span data-area-en>Crocodile Cape</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>美好的懸岩</span><span data-area-en>P.O. Wall</span></span></span></li></ul></section></div></dialog>";
  const dialog = template.querySelector('[data-subsector-dialog]');
  root.append(dialog);
  const panels = [...dialog.querySelectorAll('[data-subsector-panel]')];
  const closeButton = dialog.querySelector('[data-subsector-close]');
  const cards = [...root.querySelectorAll('.ld-detail__sector-grid > article')];
  let trigger;
  let previousOverflow;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const states = groups.map(group => {
    const rows = [...group.querySelectorAll('[data-ld-route]')];
    // Draw once without replacement, preserving the source order of visible picks.
    const shuffled = rows.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return { group, rows, picks: new Set(shuffled.slice(0, 5)), expanded: false,
      button: group.querySelector('[data-routes-toggle]') };
  });
  const language = () => root.dataset.language === 'en' ? 'en' : 'zh';
  const renderRoutes = state => {
    const en = language() === 'en';
    state.rows.forEach(row => { row.hidden = !state.expanded && !state.picks.has(row); });
    if (state.button) {
      state.button.setAttribute('aria-expanded', String(state.expanded));
      state.button.querySelector('[data-route-toggle-label]').textContent = state.expanded
        ? (en ? 'Show five picks' : '收合至 5 條')
        : (en ? `Show all ${state.rows.length} routes` : `展開全部 ${state.rows.length} 條`);
    }
  };
  states.forEach(state => {
    state.button?.addEventListener('click', () => {
      state.expanded = !state.expanded;
      renderRoutes(state);
      if (!state.expanded) state.group.scrollIntoView({block:'start', behavior:reduced.matches?'auto':'smooth'});
    });
    renderRoutes(state);
  });
  const updateLanguage = () => {
    states.forEach(renderRoutes);
    closeButton.setAttribute('aria-label', language() === 'en' ? 'Close sub-sectors' : '關閉細分區');
    triggers.forEach((button, index) => {
      const name = cards[index].querySelector(language() === 'en' ? '[data-area-en]' : '[data-area-cn]').textContent.trim();
      button.setAttribute('aria-label', language() === 'en' ? `Show ${name} sub-sectors` : `展開${name}細分區`);
    });
  };
  triggers.forEach((button, index) => button.addEventListener('click', event => {
    event.stopPropagation();
    panels.forEach((panel, i) => { panel.hidden = i !== index; });
    dialog.setAttribute('aria-labelledby', `ld-subsector-title-${index}`);
    trigger = button;
    triggers.forEach(item => item.setAttribute('aria-expanded', String(item === button)));
    if (!dialog.open) {
      previousOverflow = document.documentElement.style.overflow;
      dialog.showModal();
      document.documentElement.style.overflow = 'hidden';
    }
  }));
  closeButton.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.documentElement.style.overflow = previousOverflow || '';
    triggers.forEach(button => button.setAttribute('aria-expanded', 'false'));
    trigger?.focus({preventScroll:true});
  });
  document.addEventListener('ld-language-change', updateLanguage);
  updateLanguage();
  root.dataset.routesReady = 'true';
})();
