/* GO WILD /outside-of-rock · v1.0.3; page-scoped learning content and bilingual controls. */
/* Detailed learning content; rendered by the page's shared language switch. */
(() => {
  'use strict';
  const root=document.getElementById('outside-of-rock');
  if(!root) return;
  const byId=id=>root.querySelector('[id="'+id+'"]');
  const c = (zh, en) => ({ zh, en });
  const U = {
    amga: 'https://www.amga.com/programs/mountain-guide-programs',
    rock: 'https://www.amga.com/programs/mountain-guide-programs/rock-guide-program',
    alpine: 'https://www.amga.com/programs/mountain-guide-programs/alpine-guide-program',
    ski: 'https://www.amga.com/programs/mountain-guide-programs/ski-guide-program',
    cwi: 'https://www.amga.com/programs/climbing-instructor-programs/climbing-wall-instructor-program',
    spi: 'https://www.amga.com/programs/climbing-instructor-programs/single-pitch-instructor-program',
    acmg: 'https://acmg.ca/identification-and-insignia/',
    caRock: 'https://acmg.ca/rock-guide-certificate/', caAlpine: 'https://acmg.ca/alpine-guide-certificate/', caSki: 'https://acmg.ca/ski-guide-certificate/',
    cgi: 'https://acmg.ca/climbing-gym-instructor-certificate/', trci: 'https://acmg.ca/top-rope-climbing-instructor-certificate/',
    bmcSnow: 'https://thebmc.co.uk/en/ten-things-you-need-to-know-before-you-go-hill-walking-in-winter',
    bmcRope: 'https://www.thebmc.co.uk/en/climb-skills-moving-together'
  };

  const systems = [
    { region: c('加拿大', 'Canada'), code: 'CANADA',
      ski: [{ name: 'CSIA', path: c('Level 1 → 2 → 3 → 4', 'Level 1 → 2 → 3 → 4'), text: c('滑行、教學與動作分析逐步深化；高階另有模組及評量要求。', 'Develop skiing, teaching, and movement analysis, with additional modules and assessment at higher levels.'), links: [['https://www.snowpro.com/certification-path/', c('認證路徑', 'Certification path')]] }],
      board: [{ name: 'CASI / ACMS', path: 'Level 1 → 2 → 3 → 4', text: c('單板指導員體系；另有 Park 等專項。Level 3 已採模組制，需核對現行先修。', 'Snowboard instruction, with specialties such as Park. Level 3 uses a modular format; check current prerequisites.'), links: [['https://casi-acms.com/courses/level-1-instructor/', 'Level 1'], ['https://casi-acms.com/courses/level-3-instructor/', 'Level 3']] }] },
    { region: c('紐西蘭', 'New Zealand'), code: 'NEW ZEALAND',
      ski: [{ name: 'NZSIA · Ski', path: 'Level 1 → 2 → 3 → Trainer’s Certificate', text: c('雙板技術與教學路線。ISIA Stamp／Card 另有配套要求，不會只因完成某個 Level 就全部自動取得。', 'Ski technique and teaching. ISIA Stamp / Card have additional requirements; a level alone does not automatically grant every award.'), links: [['https://www.nzsia.org/ski/level-one/', 'Ski Level 1'], ['https://www.nzsia.org/downloads/', c('課程與標準', 'Programs + standards')]] }],
      board: [{ name: 'SBINZ · Snowboard', path: 'Level 1 → 2 → 3 → Trainer’s Certificate', text: c('NZSIA 旗下的單板教學分支；另有兒童與 Terrain Park 等專項。', 'NZSIA’s snowboard division, with additional children’s and terrain park awards.'), links: [['https://www.nzsia.org/snowboard/level-one/', 'Snowboard Level 1'], ['https://www.nzsia.org/downloads/', c('課程與標準', 'Programs + standards')]] }] },
    { region: c('日本', 'Japan'), code: 'JAPAN',
      ski: [
        { name: 'SIA · Ski', path: 'Level I → II → III → IV', text: c('日本專業滑雪教師協會的教師資格；需區分教師檢定與一般滑行技術檢定。', 'Professional ski-teacher qualifications. Teacher certification is distinct from recreational skiing proficiency tests.'), links: [['https://www.sia-japan.or.jp/member', c('教師資格', 'Teacher qualifications')]] },
        { name: 'SAJ · Ski', path: c('準指導員 → 指導員', 'Associate instructor → instructor'), text: c('依年度規程與所屬加盟團體辦理養成、檢定及研修。級別／技術檢定與指導員資格分開看。', 'Training, examinations, and refreshers follow annual rules and affiliated organizations. Proficiency tests and instructor credentials are separate.'), links: [['https://www.ski-japan.or.jp/education/75057/', c('指導員檢定要項', 'Instructor exam notices')], ['https://www.ski-japan.or.jp/education/', c('教育本部', 'Education updates')]] }
      ],
      board: [
        { name: 'SIA / SAJ · Snowboard', path: c('SIA：Level I–IV；SAJ：準指導員 → 指導員', 'SIA: Levels I–IV; SAJ: associate instructor → instructor'), text: c('兩個組織都有單板教學資格，須各自核對課程、會員與報考條件。', 'Both organizations offer snowboard teaching credentials; check each system’s training, membership, and entry rules.'), links: [['https://www.sia-japan.or.jp/member', 'SIA'], ['https://www.ski-japan.or.jp/education/75057/', 'SAJ']] },
        { name: 'JSBA · Snowboard', path: c('C 級 → B 級 → A 級指導員', 'C → B → A instructor'), text: c('日本單板協會的指導員路線；技能檢定、指導員與檢定員資格需分別辨識。', 'Japan Snowboarding Association instructor pathway. Distinguish proficiency, instructor, and examiner qualifications.'), links: [['https://www.jsba.jp/education/lisence_manual/', c('資格手冊', 'Qualification manual')]] }
      ] },
    { region: c('美國', 'United States'), code: 'UNITED STATES',
      ski: [{ name: 'PSIA · Alpine', path: 'Level I → II → III', text: c('結合滑行、教學與人際能力；報考流程依所屬區域確認。此處 Alpine 指雙板項目。', 'Combines skiing, teaching, and people skills. Confirm regional assessment procedures. Here, Alpine names the ski discipline.'), links: [['https://thesnowpros.org/get-certified/alpine/', c('雙板認證', 'Ski certification')]] }],
      board: [{ name: 'AASI · Snowboard', path: 'Level I → II → III', text: c('PSIA-AASI 的單板分支，評估滑行、教學與學員互動能力。', 'The snowboard branch of PSIA-AASI, assessing riding, teaching, and people skills.'), links: [['https://thesnowpros.org/get-certified/snowboard/', c('單板認證', 'Snowboard certification')]] }] }
  ];

  const skills = [
    { id: 'snow', title: c('雪地行進、冰斧確保與雪坡制動', 'Snow movement, self-belay, and self-arrest'), subtitle: 'Snow travel · Self-belay · Self-arrest',
      preparation: c('冬季裝備、基本步行體能與低溫管理。', 'Winter equipment, walking fitness, and cold management.'),
      topics: [c('雪況與滑墜後果判讀，路線、步法與冰爪運用。', 'Assess snow and fall consequences; choose routes, footwork, and crampon techniques.'), c('區分冰斧輔助行走、自我確保（self-belay）與滑墜後制動（self-arrest）。', 'Distinguish axe-supported movement, self-belay, and arrest after a slip.'), c('在合適練習地形與指導下評量雪坡制動，並理解硬雪、冰面及地形的限制。', 'Practice arrest under instruction on suitable training terrain, including its limitations on hard snow, ice, and consequential slopes.')],
      applies: c('雪地健行、Alpine、攀冰接近、滑雪登山。', 'Winter walking, alpine climbing, ice approaches, and ski mountaineering.'), links: [[U.bmcSnow, 'BMC Winter Skills'], [U.ski, 'AMGA Ski Skills']] },
    { id: 'snow-protection', title: c('雪地固定點、確保與下降', 'Snow anchors, belaying, and descending'), subtitle: 'Snow protection · Belay · Rappel',
      preparation: c('雪地個人移動、基本繩結、確保與固定點概念。', 'Personal snow movement, knots, belaying, and anchor principles.'),
      topics: [c('依雪況與地形選擇保護方式，認識雪地固定點及其適用條件。', 'Select protection for the snow and terrain, including the suitability of snow anchors.'), c('銜接分段確保、下放與繩索下降，練習轉換時的團隊管理。', 'Integrate pitched belays, lowering, and rappelling with team management during transitions.'), c('評量固定點判斷、系統檢查、撤退規劃與備案。', 'Assess anchor judgment, system checks, retreat plans, and alternatives.')],
      applies: c('陡雪坡、Alpine 與技術滑雪登山。', 'Steep snow, alpine routes, and technical ski mountaineering.'), links: [[U.ski, 'AMGA SMSM'], [U.alpine, 'AMGA Alpine']] },
    { id: 'glacier', title: c('冰河結組與冰隙救援', 'Roped glacier travel and crevasse rescue'), subtitle: 'Glacier travel · Crevasse rescue',
      preparation: c('雪地行進、繩索系統與基本固定點能力。', 'Snow movement, rope systems, and basic anchor skills.'),
      topics: [c('冰河地形、路線辨識、結組策略與繩隊溝通。', 'Glacier terrain, route finding, rope-team strategy, and communication.'), c('冰隙事件處置、負載轉移、提拉／自救與邊緣管理的實地訓練。', 'Field training in crevasse response, load transfer, hauling, self-rescue, and edge management.'), c('整合傷患照護、保暖、通訊與撤離。', 'Integrate patient care, warmth, communication, and evacuation.')],
      applies: c('冰河縱走、Alpine、冰河滑雪與滑雪登山。', 'Glacier traverses, alpine routes, glacier skiing, and ski mountaineering.'), links: [[U.alpine, 'AMGA ASGM'], [U.caAlpine, 'ACMG Alpine']] },
    { id: 'short-rope', title: c('短繩技術：Short roping', 'Short roping'), subtitle: 'Movement management · Terrain judgment',
      preparation: c('成熟的個人移動、確保、地形辨識與團隊管理；適合在嚮導技能課中系統學習。', 'Established movement, belaying, terrain judgment, and group management; best developed through integrated guide-skills training.'),
      topics: [c('重點是預防失衡、管理移動與掌握地形，而非只把繩距縮短。', 'Focus on preventing imbalance, managing movement, and judging terrain, beyond merely shortening the rope.'), c('評量繩索管理、學員觀察、步調與位置判斷，以及何時改用固定確保。', 'Assess rope handling, client observation, pacing, positioning, and when to change to anchored protection.'), c('在代表性地形中反覆練習，包含停止、撤退與轉換到 short pitching。', 'Practice in representative terrain, including stopping, retreat, and transitions to short pitching.')],
      applies: c('Alpine 岩稜、部分岩石與雪地嚮導情境，依地形與資格範圍運用。', 'Alpine ridges and selected rock or snow guiding contexts, within terrain and professional scope.'), links: [[U.rock, 'AMGA Rock'], [U.ski, 'AMGA SMSM']] },
    { id: 'short-pitch', title: c('短繩距、同步行進與保護方式選擇', 'Short pitching, moving together, and protection choices'), subtitle: 'Short pitching · Moving together · Pitched climbing',
      preparation: c('固定點、先鋒／跟攀、下降與地形辨識。', 'Anchors, lead and seconding skills, descending, and terrain recognition.'),
      topics: [c('區分短繩、短段確保、設置行進保護的同步攀登與完整分段確保。', 'Distinguish short roping, short pitches, moving together with running protection, and full pitched climbing.'), c('按滑墜後果、路線與隊員能力選擇方式，練習模式轉換。', 'Choose systems for fall consequences, terrain, and team ability; practice transitions.'), c('評量保護點、繩索路線、溝通、時間管理與撤退。', 'Assess protection, rope routing, communication, time management, and retreat.')],
      applies: c('岩稜、scrambling、Alpine rock 與混合地形。', 'Ridges, scrambling, alpine rock, and mixed terrain.'), links: [[U.bmcRope, 'BMC Moving Together'], [U.rock, 'AMGA Rock']] },
    { id: 'rock', title: c('傳統、多繩距與岩場同伴救援', 'Trad, multi-pitch, and companion rock rescue'), subtitle: 'Protection · Anchors · Transitions · Rescue',
      preparation: c('確保、繩結、單繩距攀登與裝備檢查。', 'Belaying, knots, single-pitch climbing, and equipment checks.'),
      topics: [c('保護裝備與固定點、繩隊分工、站點轉換、長路線下降。', 'Protection and anchors, team roles, belay transitions, and long-route descents.'), c('依課程學習脫離確保、負載轉移、繩索上升與同伴協助。', 'Develop belay escape, load transfer, rope ascent, and companion assistance through training.'), c('從完整單繩距系統，銜接山區複雜地形的保護選擇。', 'Connect single-pitch systems to protection choices in complex mountain terrain.')],
      applies: c('戶外岩場、多繩距、Alpine rock。', 'Outdoor crags, multi-pitch routes, and alpine rock.'), links: [[U.rock, 'AMGA Rock'], [U.caRock, 'ACMG Rock']] },
    { id: 'ice', title: c('攀冰、混合攀登與撤退', 'Ice, mixed climbing, and retreat'), subtitle: 'Ice tools · Crampons · Protection · Mixed terrain',
      preparation: c('確保、冬季裝備與低溫管理；先建立頂繩攀冰經驗。', 'Belaying, winter equipment, and cold management; build top-rope ice experience first.'),
      topics: [c('冰工具與冰爪動作、冰況及落冰危害；冰螺栓與冰上固定點。', 'Tool and crampon movement, ice conditions and falling-ice hazards, screws, and anchors.'), c('先鋒與多繩距攀冰，依目標銜接岩石／冰雪混合段。', 'Lead and multi-pitch ice, adding mixed rock, snow, and ice sections for the objective.'), c('評量保護選擇、繩索運作、撤退與冬季應變。', 'Assess protection choices, rope management, retreat, and winter response.')],
      applies: c('冰瀑、Alpine ice、混合路線。', 'Waterfall ice, alpine ice, and mixed routes.'), links: [[U.alpine, 'AMGA Alpine / Ice'], [U.caAlpine, 'ACMG Alpine / Ice']] },
    { id: 'ski', title: c('Ski touring、Splitboard 與技術轉換', 'Ski touring, splitboarding, and technical transitions'), subtitle: 'Skins · Uphill travel · Transitions · Descents',
      preparation: c('變化雪況的滑行能力、冬季基礎與雪崩入門。', 'Variable-snow riding, winter foundations, and introductory avalanche education.'),
      topics: [c('上坡裝備、貼皮、kick turn、轉換與雪地路線選擇；雙板與 splitboard 分別練習。', 'Touring equipment, skins, kick turns, transitions, and route choices; practice ski and splitboard systems separately.'), c('背包與疲勞下的下降、不同雪況控速，以及適合目標的陡坡滑行能力。', 'Descend with a pack and fatigue, control speed in variable snow, and develop steep-terrain skills appropriate to the goal.'), c('技術地形再加入冰爪冰斧、bootpack、繩索下降與冰河模組。', 'For technical terrain, add crampons, axe, bootpacking, rappelling, and glacier modules.')],
      applies: c('野外滑雪、單板登山與滑雪登山。', 'Backcountry skiing, splitboard touring, and ski mountaineering.'), links: [[U.ski, 'AMGA Ski & Splitboard'], [U.caSki, 'ACMG Ski']] },
    { id: 'field', title: c('導航、氣象、露宿與遠征後勤', 'Navigation, weather, bivouacs, and expedition logistics'), subtitle: 'Planning · Whiteout navigation · Communication · Retreat',
      preparation: c('一般行程規劃、裝備與自我照顧。', 'Basic trip planning, equipment, and personal care.'),
      topics: [c('地圖／指北針與離線導航、白化天候行進、時程與折返點。', 'Map, compass, offline navigation, whiteout travel, timing, and turn-around points.'), c('山區氣象、雪況、高度適應、低溫、露宿與緊急遮蔽。', 'Mountain weather, snow, altitude adaptation, cold, bivouacs, and emergency shelter.'), c('糧食燃料、裝備維修、通訊、救援協調、急救與撤離方案。', 'Food and fuel, repairs, communication, rescue coordination, first aid, and evacuation plans.')],
      applies: c('所有山野路線，尤其偏遠、多日與高海拔活動。', 'All mountain routes, especially remote, multi-day, and high-altitude trips.'), links: [[U.ski, 'AMGA Movement & Skills'], [U.caAlpine, 'ACMG Alpine']] }
  ];

  const guides = [
    { code: 'AMGA', region: c('美國 · American Mountain Guides Association', 'United States · American Mountain Guides Association'),
      intro: c('Rock、Alpine、Ski 三專項可各自發展；完整 American Mountain Guide／IFMGA 需完成三項及其他要求。', 'Develop Rock, Alpine, and Ski disciplines separately; the full American Mountain Guide / IFMGA award requires all three plus additional requirements.'),
      routes: [
        { id: 'amga-rock', title: 'Rock Guide', flow: 'Rock Guide Course → Advanced Rock Guide Course & Assistant Exam → Rock Guide Exam', text: c('涵蓋多繩距、技術下降、短繩、短繩距與岩場救援。SPI／CWI 是不同範圍的教學資格，不應視為一律必經的嚮導先修。', 'Multi-pitch guiding, technical descents, short roping/pitching, and rock rescue. SPI / CWI have different instructional scopes and are not universal mandatory guide prerequisites.'), url: U.rock },
        { id: 'amga-alpine', title: 'Alpine Guide', flow: 'RGC → Alpine Guide Course → Ice Instructor Course → Advanced Alpine Guide Course & Assistant Exam → Alpine Guide Exam', text: c('上列為一種路徑；另有 ASGM（Alpine Snow and Glacier Module）＋ARM（Alpine Rock Module）的模組路徑，再銜接 Ice 與進階訓練。', 'One pathway is shown above. Another uses ASGM (Alpine Snow and Glacier Module) + ARM (Alpine Rock Module), followed by Ice and advanced training.'), extra: c('各階段另有路線履歷、WFR／CPR 與相應雪崩訓練條件。ASGM／ARM 是專業嚮導模組，報名前已需具備相關攀登經驗。', 'Stages have résumé, WFR/CPR, and avalanche prerequisites. ASGM / ARM are professional guiding modules for already-experienced climbers.'), url: U.alpine },
        { id: 'amga-ski', title: 'Ski & Splitboard Guide', flow: 'Ski Guide Course → Ski Mountaineering Skills Module* → Advanced Ski Guide Course & Assistant Exam → Ski Guide Exam', text: c('SMSM 涵蓋雪地固定點、下降、短繩／短繩距、冰河與冰隙救援。*官方另列 2026 年或之前完成的指定課程替代條件，需核對自己所屬年度。', 'SMSM covers snow anchors, descents, short roping/pitching, glaciers, and crevasse rescue. *Specified courses completed in 2026 or earlier may satisfy an alternative; check your cohort.'), url: U.ski },
        { id: 'amga-ifmga', title: 'American Mountain Guide / IFMGA', flow: 'Rock ＋ Alpine ＋ Ski', text: c('三專項考試之外，還有 WFR、CPR 與 Professional Avalanche Training 2 等要求。單一專項與完整 IFMGA 應分別標示。', 'Beyond all three discipline exams, requirements include WFR, CPR, and Professional Avalanche Training 2. Distinguish a single discipline from the full IFMGA credential.'), url: U.amga }
      ] },
    { code: 'ACMG', region: c('加拿大 · Association of Canadian Mountain Guides', 'Canada · Association of Canadian Mountain Guides'),
      intro: c('以專項訓練、學徒考試、受監督實習及正式考試發展；完整 Mountain Guide 由 Alpine Guide＋Ski Guide 組成。', 'Progress through discipline training, apprentice assessment, supervised practice, and certification exams. Full Mountain Guide combines Alpine Guide + Ski Guide.'),
      routes: [
        { id: 'acmg-rock', title: 'Rock Guide', flow: 'Guide Training Rock → Apprentice Rock Guide Exam → Apprenticeship → Rock Guide Exam', text: c('技術岩石、多繩距與下降。初始訓練含動作測評；後續通常有 1–3 年受監督的業界實習。', 'Technical rock, multi-pitch guiding, and descents. Initial training includes movement screening, followed by a 1–3 year supervised apprenticeship.'), url: U.caRock },
        { id: 'acmg-alpine', title: 'Alpine Guide', flow: 'Guide Training Alpine ＋ Guide Training Ice → Apprentice Alpine Guide Exam → Apprenticeship → Alpine Guide Exam', text: c('涵蓋技術岩石、冰瀑與 Alpine。正式申請另要求 Apprentice Rock Guide 或 Rock Guide 身分、相應履歷、急救與雪崩資格。', 'Covers technical rock, waterfall ice, and alpine guiding. Applications also require Apprentice Rock Guide or Rock Guide status, the specified résumé, first aid, and avalanche qualifications.'), extra: c('入學、學徒與正式考試條件分開核對；正式 Alpine 考試另有 CAA Ops 2 與受監督帶隊經驗等要求。', 'Check entry, apprentice, and final-exam conditions separately. The final Alpine exam also requires CAA Ops 2 and supervised guiding experience.'), url: U.caAlpine },
        { id: 'acmg-ski', title: 'Ski Guide', flow: 'Guide Training Ski → Apprentice Ski Guide Exam → Apprenticeship → Ski Guide Exam', text: c('包含 Alpine Skills、機械接駁滑雪與 touring 訓練。入學需滑行測評、CAA Ops 1、AvSAR 與急救等；正式考試另要求 CAA Ops 2。', 'Includes alpine skills, mechanized skiing, and touring. Entry requires movement screening, CAA Ops 1, AvSAR, first aid, and other conditions; the final exam also requires CAA Ops 2.'), url: U.caSki },
        { id: 'acmg-ifmga', title: 'Mountain Guide / IFMGA', flow: 'Alpine Guide ＋ Ski Guide', text: c('與 AMGA 的三專項組合不同。Alpine 路線本身已銜接岩石資格要求；單獨 Rock、Alpine 或 Ski 專項不等同完整 IFMGA。', 'Differs from AMGA’s three-discipline combination. The Alpine pathway already includes rock-qualification requirements; Rock, Alpine, or Ski alone is not the full IFMGA award.'), url: U.acmg }
      ] },
    { code: 'NZMGA', region: c('紐西蘭 · New Zealand Mountain Guides Association', 'New Zealand · New Zealand Mountain Guides Association'),
      intro: c('Climbing 與 Ski 為兩條主要專項；另有 Alpine Trekking 與 Hard Ice 路徑。完整 IFMGA 結合 Climbing Guide＋Ski Guide。', 'Climbing and Ski are the two main disciplines, alongside Alpine Trekking and Hard Ice pathways. Full IFMGA combines Climbing Guide + Ski Guide.'),
      routes: [
        { id: 'nzmga-climbing', title: 'Climbing Guide', flow: 'Rock / Snow & Ice Training → Level 1 Assessment → Assistant Climbing Guide → Apprenticeship → Level 2 Assessment', text: c('涵蓋 Alpine rock、雪與冰；包含 Technical Rock Exam、岩石與雪冰嚮導訓練。取得 Assistant 身分後，在規定監督範圍內累積實習經驗。', 'Covers alpine rock, snow, and ice, with a Technical Rock Exam and rock / snow-and-ice guide training. Assistant status is followed by supervised apprenticeship.'), extra: c('需提交攀登履歷，並符合急救與相應雪崩資格等條件；各階段與年度課程安排由 NZMGA 確認。', 'Submit a climbing logbook and meet first-aid, avalanche, and other requirements. Confirm stage-specific and current course arrangements with NZMGA.'), url: 'https://nzmga.org.nz/become-a-guide/guiding-pathways/nzmga-climbing-guide-pathway/' },
        { id: 'nzmga-ski', title: 'Ski Guide', flow: 'Technical Ski Exam / Guide Training → Level 1 Assessment → Assistant Ski Guide → Apprenticeship → Level 2 Assessment', text: c('結合滑雪、雪冰與嚮導訓練，並銜接紐西蘭 Avalanche Risk Management Level 5／6。先累積個人滑雪履歷，再進入評量與實習。', 'Combines skiing, snow-and-ice skills, and guide training, with New Zealand Avalanche Risk Management Level 5 / 6. Build a personal skiing logbook before assessment and apprenticeship.'), extra: c('PHEC 或認可同等急救、雪崩課程與申請資格分別核對；不把加拿大 Ops 或 WFR 自動當作同等資格。', 'Check PHEC or accepted equivalent first aid, avalanche training, and eligibility separately. Canadian Ops and WFR are not automatically treated as equivalent.'), url: 'https://nzmga.org.nz/become-a-guide/guiding-pathways/nzmga-ski-guide-pathway/' },
        { id: 'nzmga-trekking', title: 'Alpine Trekking Guide', flow: 'Alpine Trekking Training / Assessment → Assistant → Supervised Experience → Further Assessment', text: c('以 Alpine trekking 的指定地形與帶隊範圍為主，包含相關雪地能力；與 Climbing Guide 的技術攀登範圍分開。', 'A pathway for specified alpine-trekking terrain and guiding scope, including relevant snow skills. Its scope differs from technical Climbing Guide work.'), url: 'https://nzmga.org.nz/become-a-guide/guiding-pathways/nzmga-alpine-trekking-guide-pathway/' },
        { id: 'nzmga-ice', title: 'Hard Ice Guide', flow: 'Hard Ice Training / Assessment → Hard Ice Guide', text: c('冰河下段 hard ice 區域的專項帶領與攀冰教學資格。依其地形與監督規定運作，不代表完整 Alpine／Climbing 或 IFMGA 資格。', 'A specialty for guiding and ice instruction on lower hard-ice glacier areas, within terrain and supervision guidelines. It is distinct from full Climbing or IFMGA certification.'), url: 'https://nzmga.org.nz/become-a-guide/guiding-pathways/nzmga-hard-ice-guide-pathway/' },
        { id: 'nzmga-ifmga', title: 'IFMGA Mountain Guide', flow: 'Climbing Guide ＋ Ski Guide ＋ NZMGA Ratification', text: c('通過 Climb 與 Ski 的 Level 2，符合其他履歷、時程與資格要求，經 NZMGA 技術委員會核定後取得完整 IFMGA。', 'Complete Climb and Ski Level 2, meet the remaining experience, timing, and eligibility requirements, and obtain NZMGA Technical Subcommittee ratification for full IFMGA status.'), url: 'https://nzmga.org.nz/become-a-guide/guiding-pathways/ifmga-guide-pathway/' }
      ] }
  ];

  const additionalSources = [
    ['https://nzmga.org.nz/become-a-guide/guiding-pathways/choose-a-pathway/', 'NZMGA · Guide Pathways'],
    ['https://nzmga.org.nz/become-a-guide/guiding-pathways/nzmga-climbing-guide-pathway/', 'NZMGA · Climbing Guide'],
    ['https://nzmga.org.nz/become-a-guide/guiding-pathways/nzmga-ski-guide-pathway/', 'NZMGA · Ski Guide'],
    ['https://nzmga.org.nz/become-a-guide/guiding-pathways/nzmga-alpine-trekking-guide-pathway/', 'NZMGA · Alpine Trekking'],
    ['https://nzmga.org.nz/become-a-guide/guiding-pathways/nzmga-hard-ice-guide-pathway/', 'NZMGA · Hard Ice'],
    ['https://nzmga.org.nz/become-a-guide/guiding-pathways/ifmga-guide-pathway/', 'NZMGA · IFMGA'],
    ['https://nzmga.org.nz/course-information/assessment-and-certification/', 'NZMGA · Assessment & Certification'],
    ['https://www.snowpro.com/certification-path/', 'CSIA · Ski Certification'], ['https://casi-acms.com/courses/level-1-instructor/', 'CASI · Snowboard Certification'],
    ['https://www.nzsia.org/ski/level-one/', 'NZSIA · Ski'], ['https://www.nzsia.org/snowboard/level-one/', 'SBINZ · Snowboard'],
    ['https://www.sia-japan.or.jp/member', 'Japan · SIA'], ['https://www.ski-japan.or.jp/education/75057/', 'Japan · SAJ Instructor Notices'],
    ['https://www.jsba.jp/education/lisence_manual/', 'Japan · JSBA'], ['https://thesnowpros.org/get-certified/alpine/', 'PSIA · Ski'], ['https://thesnowpros.org/get-certified/snowboard/', 'AASI · Snowboard'],
    [U.cwi, 'AMGA · Climbing Wall Instructor'], [U.spi, 'AMGA · Single Pitch Instructor'], [U.cgi, 'ACMG · Climbing Gym Instructor'], [U.trci, 'ACMG · Top Rope Climbing Instructor'],
    [U.rock, 'AMGA · Rock Guide'], [U.alpine, 'AMGA · Alpine Guide'], [U.ski, 'AMGA · Ski & Splitboard Guide'],
    [U.caRock, 'ACMG · Rock Guide'], [U.caAlpine, 'ACMG · Alpine Guide'], [U.acmg, 'ACMG · Credentials & Scope'], [U.bmcSnow, 'BMC · Winter Skills'], [U.bmcRope, 'BMC · Moving Together']
  ];

  function render(language) {
    const t = value => typeof value === 'string' ? value : value[language];
    const esc = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
    const e = value => esc(t(value));
    const links = items => `<div class="source-links">${items.map(([url, label]) => `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${e(label)} ↗</a>`).join('')}</div>`;
    const preserved = new Set([...root.querySelectorAll('[data-learning-detail][open]')].map(node => node.id));
    byId('environment-grid').innerHTML = [
      [c('受管理環境的教學', 'Teaching in managed settings'), c('雪場 Ski／Snowboard、人工岩場。重點是個人技術、教學法、動作分析、學員管理與場域規則。', 'Resort ski / snowboard teaching and artificial climbing walls. Focus on technique, teaching, analysis, student management, and site rules.')],
      [c('山野與阿式登山帶隊', 'Backcountry and alpine guiding'), c('增加地形、雪況與氣象判斷、路線規劃、繩索系統、救援與撤離；依 AMGA／ACMG／NZMGA 等專項取得資格。', 'Add terrain, snow and weather judgment, planning, rope systems, rescue, and evacuation; pursue discipline-specific qualifications such as AMGA / ACMG / NZMGA.')]
    ].map(([title, text]) => `<article><h3>${e(title)}</h3><p>${e(text)}</p></article>`).join('');

    const systemCell = items => items.map(item => `<article class="system-program"><h4>${esc(item.name)}</h4><p class="system-path">${e(item.path)}</p><p>${e(item.text)}</p>${links(item.links)}</article>`).join('');
    byId('instructor-systems').innerHTML = `<div class="systems-head" aria-hidden="true"><span>${e(c('地區', 'Region'))}</span><span>Ski · ${e(c('雙板', 'Skiing'))}</span><span>Snowboard · ${e(c('單板', 'Snowboarding'))}</span></div>${systems.map(system => `<article class="system-row"><div class="system-region"><h3>${e(system.region)}</h3><span>${system.code}</span></div><div class="system-cell"><span class="mobile-discipline">SKI · ${e(c('雙板', 'Skiing'))}</span>${systemCell(system.ski)}</div><div class="system-cell"><span class="mobile-discipline">SNOWBOARD · ${e(c('單板', 'Snowboarding'))}</span>${systemCell(system.board)}</div></article>`).join('')}`;
    byId('climbing-instructors').innerHTML = `<div class="climbing-instructor-grid"><article><h3>AMGA · USA</h3><p><strong>CWI</strong> — ${e(c('人工岩場 Top Rope／Lead 兩種標準，聚焦人工岩場教學與管理。', 'Top Rope and Lead standards for artificial climbing-wall instruction and management.'))}</p><p><strong>SPI</strong> — ${e(c('戶外單繩距教學，另需戶外與傳統攀登履歷。', 'Outdoor single-pitch instruction, with outdoor and traditional climbing résumé requirements.'))}</p>${links([[U.cwi, 'CWI'], [U.spi, 'SPI']])}</article><article><h3>ACMG · Canada</h3><p><strong>CGI 1 / 2</strong> — ${e(c('Climbing Gym Instructor：L1 以頂繩及基礎動作為主，L2 加入先鋒與進階動作；另有教學經驗要求。', 'Climbing Gym Instructor: L1 focuses on top rope and basic movement; L2 adds lead and advanced movement, with teaching-experience requirements.'))}</p><p><strong>TRCI</strong> — ${e(c('戶外已開發單繩距場域的體驗式頂繩／下降教學，依其監督與場域範圍工作。', 'Experiential top-rope and rappel instruction at developed outdoor single-pitch sites, within its supervision and terrain scope.'))}</p>${links([[U.cgi, 'CGI'], [U.trci, 'TRCI']])}</article></div>`;

    byId('technical-skills').innerHTML = skills.map(skill => `<details id="skill-${skill.id}" data-learning-detail class="technical-detail"${preserved.has(`skill-${skill.id}`) ? ' open' : ''}><summary><span><span class="skill-title">${e(skill.title)}</span><span class="skill-subtitle">${esc(skill.subtitle)}</span></span><span class="disclosure-symbol" aria-hidden="true">＋</span></summary><div class="skill-body"><div><h4>${e(c('先備能力', 'Preparation'))}</h4><p>${e(skill.preparation)}</p><h4>${e(c('適用路線', 'Relevant terrain'))}</h4><p>${e(skill.applies)}</p></div><div><h4>${e(c('課程與評量應涵蓋', 'Training and assessment should cover'))}</h4><ul>${skill.topics.map(topic=>`<li>${e(topic)}</li>`).join('')}</ul>${links(skill.links)}</div></div></details>`).join('');

    byId('guide-comparison').innerHTML = guides.map(guide => `<article class="guide-column"><header><p class="eyebrow">${e(guide.region)}</p><h3>${guide.code}</h3><p>${e(guide.intro)}</p></header>${guide.routes.map(route => `<details id="${route.id}" data-learning-detail class="guide-route"${preserved.has(route.id) ? ' open' : ''}><summary><span>${esc(route.title)}</span><span class="disclosure-symbol" aria-hidden="true">＋</span></summary><div class="guide-route-body"><p class="guide-flow">${esc(route.flow)}</p><p>${e(route.text)}</p>${route.extra ? `<p>${e(route.extra)}</p>` : ''}${links([[route.url, c('官方路徑與完整先修', 'Official pathway + prerequisites')]])}</div></details>`).join('')}</article>`).join('');
    const practiceNotes = [
      {
        title: c('滑行工具與資格範圍', 'Travel tools and certification scope'),
        paragraphs: [c('Splitboard 與雙板的要求需分開核對。專項接受的移動工具、完整 IFMGA 的滑行要求與證書名稱，以各協會現行規定為準。', 'Check splitboard and ski requirements separately. Accepted travel tools, skiing requirements for full IFMGA certification, and certificate titles follow each association’s current rules.')],
        sources: [['https://ifmga.net/professional-mountain-guide/training-and-assessment', c('IFMGA 訓練與評量', 'IFMGA training and assessment')], [U.amga, c('AMGA Ice／Multi-Pitch 等專項', 'AMGA Ice / Multi-Pitch specialties')]]
      },
      {
        title: c('認證階段與先修認可', 'Certification stages and prerequisite recognition'),
        paragraphs: [c('課程結業、通過考試、學徒身分與正式專項認證，各自代表不同階段與工作範圍。', 'Course completion, passing an exam, apprentice status, and full discipline certification represent different stages and scopes of practice.'), c('跨 AMGA／ACMG／NZMGA 申請時，先修認可由接收機構確認；指導員資格則另對照所屬體系與 ISIA 標準。', 'When applying across AMGA, ACMG, and NZMGA, the receiving organization decides prerequisite recognition. Check instructor qualifications separately against their own system and ISIA standards.')],
        sources: [[U.acmg, c('ACMG 資格與工作範圍', 'ACMG credentials and scope')], ['https://isia.ski/quality-standards/', c('ISIA 指導員標準', 'ISIA instructor standards')]]
      },
      {
        title: c('課程之間，還有經驗', 'Experience between courses'),
        paragraphs: [c('例如 ACMG Ski Guide 入學要求至少三季野外滑雪／單板經驗，以及至少 75 天在複雜地形主導或共同主導行程的經驗；另有雪崩、急救與滑行測評條件。', 'For example, ACMG Ski Guide entry requires at least three seasons of backcountry skiing or snowboarding and 75 days leading or co-leading in complex terrain, plus avalanche, first-aid, and movement-screening requirements.'), c('通過學徒考試後，還需累積 1–3 年受監督的業界實習，再銜接正式認證考試。', 'After the apprentice exam, candidates gain 1–3 years of supervised industry experience before the certification exam.')],
        sources: [[U.caSki, c('ACMG Ski Guide 完整條件', 'Full ACMG Ski Guide requirements')]]
      }
    ];
    byId('guide-practice-notes').innerHTML = practiceNotes.map(note => `<article class="practice-note"><h3>${e(note.title)}</h3><div class="practice-note-body">${note.paragraphs.map(paragraph => `<p>${e(paragraph)}</p>`).join('')}${links(note.sources)}</div></article>`).join('');
    const sourceGrid = byId('source-grid');
    const known = new Set([...sourceGrid.querySelectorAll('a')].map(node=>node.href));
    sourceGrid.insertAdjacentHTML('beforeend', additionalSources.filter(([url])=>!known.has(url)).map(([url,label])=>`<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)} ↗</a>`).join(''));
  }
  root.GWOutsideLearning = { render };
})();

(() => {
  'use strict';
  const root = document.getElementById('outside-of-rock');
  if (!root || root.dataset.outsideReady==='true') return;
  const byId=id=>root.querySelector('[id="'+id+'"]');
  const copy = (zh, en) => ({ zh, en });
  let language = 'zh';
  let selectedGoal = 'resort';
  let selectedLane = 'recreation';
  const t = value => typeof value === 'string' ? value : value[language];
  const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const e = value => escape(t(value));
  const sourceLink = (url, label) => `<a class="text-link" href="${escape(url)}" target="_blank" rel="noopener noreferrer">${e(label)} ↗</a>`;

  const goals = [
    {"id": "resort", "label": {"zh": "雪場滑雪", "en": "Resort skiing"}, "title": {"zh": "從雪場開始，建立穩定滑行與自主判斷", "en": "Start at the resort: movement and judgment"}, "description": {"zh": "以受管理雪場內的雙板或單板滑雪為起點。先建立裝備使用、控制速度與遵守場域規則的能力，再依實際程度逐步擴展滑行地形。", "en": "Begin with skiing or snowboarding within a managed resort. Learn equipment use, speed control, and site rules, then expand your terrain as your skills develop."}, "steps": [[{"zh": "裝備、環境與雪場規則", "en": "Equipment, setting, and resort rules"}, {"zh": "認識雙板／單板、雪靴與防護裝備，確認裝備合適；了解雪道標示、纜車使用、停留位置、他人優先權及求助方式。", "en": "Get familiar with skis or a snowboard, boots, and protective equipment, and check their fit. Learn trail signs, lift procedures, stopping locations, right of way, and how to get help."}], [{"zh": "跟隨滑雪指導員建立基礎", "en": "Build foundations with a ski or snowboard instructor"}, {"zh": "依程度安排教學，從平衡、控速、停止與轉彎開始；在適合能力的雪道練習，由指導員提供動作回饋。", "en": "Take instruction suited to your level, starting with balance, speed control, stopping, and turning. Practice on appropriate slopes and use instructor feedback to develop your technique."}], [{"zh": "穩定練習，再擴展地形", "en": "Practice consistently, then broaden your terrain"}, {"zh": "累積不同雪況與坡度的滑行經驗，練習選線、觀察周遭與管理疲勞；進階地形或 Park 應另安排相應教學，遵守開放與封閉規定。", "en": "Build experience across snow conditions and gradients while practicing line choice, awareness, and fatigue management. Seek specific instruction for advanced terrain or parks, and respect closures."}], [{"zh": "雪崩基礎與下一步", "en": "Avalanche fundamentals and next steps"}, {"zh": "即使主要在雪場滑行，也建議學習雪崩基礎、辨識管理邊界與封閉標示；若想走向野外滑雪，再加入正式雪崩訓練、同伴救援、導航及自行上坡能力。", "en": "Even if you mainly ride at resorts, learn avalanche fundamentals and recognize boundaries and closure signs. Before moving into the backcountry, add formal avalanche training, companion rescue, navigation, and human-powered ascent skills."}]], "foundation": [{"zh": "雪場規則與禮儀", "en": "Resort rules + etiquette"}, {"zh": "裝備與保暖", "en": "Equipment + warmth"}, {"zh": "雪崩基礎知識", "en": "Avalanche fundamentals"}, {"zh": "體能與行程安排", "en": "Fitness + trip planning"}], "note": {"zh": "這是休閒滑行的學習路徑，不需要先取得滑雪指導員證。雪場滑行能力、指導員資格與野外滑雪能力分別建立，雪道等級也不直接代表野外地形的難度或風險。", "en": "This is a recreational learning pathway; ski instructor certification is not a prerequisite. Resort riding, instructor credentials, and backcountry skills develop separately. Trail ratings do not directly describe backcountry difficulty or risk."}, "anchor": "outside-avalanche"},
    {
      id: 'backcountry', label: copy('野外滑雪', 'Backcountry skiing'), title: copy('從雪場，走向野外滑雪', 'From the resort to the backcountry'),
      description: copy('Backcountry 通常就是野外滑雪；ski touring 強調自行上坡的移動方式。先選擇不涉及冰河與技術攀登的入門目標。', 'Backcountry describes skiing outside managed terrain; ski touring emphasizes human-powered travel. Start with objectives that do not involve glaciers or technical climbing.'),
      steps: [
        [copy('滑行基礎', 'Skiing foundation'), copy('控速與停止，練習非整備雪況、背包與疲勞下的穩定滑行。', 'Control speed, stop reliably, and develop stable skiing in variable snow, with a pack, and when tired.')],
        [copy('Touring ＋ 雪崩入門', 'Touring + avalanche basics'), copy('上坡裝備、貼皮、轉換與路線移動；搭配 AST 1 或所在地的雪崩入門訓練。', 'Learn touring equipment, skins, transitions, and uphill travel alongside AST 1 or local introductory avalanche training.')],
        [copy('受指導的實地練習', 'Mentored field experience'), copy('參與行程規劃與地形選擇，練習導航、折返決策及同伴救援；可補 CRS／MAT。', 'Practice planning, terrain choice, navigation, turn-around decisions, and companion rescue. Add CRS or MAT as needed.')],
        [copy('累積後，再進階', 'Progress with experience'), copy('以實際行程問題回到 AST 2；需要冰河或技術地形時，再加入登山模組。', 'Bring real trip questions to AST 2. Add mountaineering modules when your objectives involve glaciers or technical terrain.')]
      ],
      foundation: [copy('冬季導航', 'Winter navigation'), copy('天氣判讀', 'Weather'), copy('野外急救', 'Wilderness first aid'), copy('同伴救援', 'Companion rescue')],
      note: copy('滑雪指導員證、AST 與嚮導資格各有用途。這條休閒學習路徑不要求先取得指導員或嚮導證。', 'Ski instructor, AST, and guide qualifications serve different purposes. Instructor or guide certification is not a prerequisite for this recreational pathway.'), anchor: 'outside-avalanche'
    },
    {
      id: 'ice', label: copy('攀冰', 'Ice climbing'), title: copy('從繩索基礎，走向冰瀑', 'From rope skills to waterfall ice'),
      description: copy('攀岩的繩索基礎能夠轉移，但冰況、冰爪與冰工具需要另外學習。初次頂繩攀冰不必先完成高難度攀岩。', 'Rock-climbing rope skills transfer, while ice conditions, crampons, and tools need specific training. Introductory top-rope ice does not require advanced rock grades.'),
      steps: [
        [copy('確保與冬季基礎', 'Belay + winter foundation'), copy('確保、裝備檢查、低溫管理與冰爪基本操作。', 'Belaying, equipment checks, cold management, and basic crampon skills.')],
        [copy('頂繩攀冰課程', 'Top-rope ice instruction'), copy('在教練指導下學習冰工具、腳法、站位與攀冰時的確保。', 'Learn tools, footwork, positioning, and ice-specific belaying with an instructor.')],
        [copy('保護與環境判讀', 'Protection + conditions'), copy('冰況、落冰與上方地形評估；依目標學習冰螺栓、固定點與撤退。', 'Assess ice, falling-ice exposure, and overhead terrain; learn screws, anchors, and retreat for your objectives.')],
        [copy('先鋒與多繩距', 'Lead + multi-pitch'), copy('在足夠頂繩經驗與適當指導下，加入先鋒、繩隊效率及同伴救援。', 'Build lead skills, team efficiency, and companion rescue after sufficient top-rope practice and appropriate instruction.')]
      ],
      foundation: [copy('低溫管理', 'Cold management'), copy('地形危害', 'Terrain hazards'), copy('野外急救', 'Wilderness first aid'), copy('繩索救援', 'Rope rescue')],
      note: copy('接觸雪地就建議學習雪崩基礎；若接近路線或攀登位置受雪崩地形影響，應進一步接受地形判讀與同伴救援訓練。攀冰能力不取代雪地與冰河行進能力。', 'Learn avalanche fundamentals for activities involving snow. When an approach or climb is exposed to avalanche terrain, add training in terrain assessment and companion rescue. Ice climbing does not replace snow or glacier travel skills.'), anchor: 'outside-avalanche'
    },
    {"id": "dry-tooling", "label": {"zh": "乾攀", "en": "Dry tooling"}, "title": {"zh": "以冰工具攀登，從專用場域建立精準動作", "en": "Build precise tool movement in dedicated venues"}, "description": {"zh": "乾攀是在沒有冰的人工設施或岩石上使用冰工具攀登，依場域規則使用冰爪或指定鞋具。可作為獨立活動，也能補強混合攀登的工具與動作能力。", "en": "Dry tooling uses ice tools on artificial structures or rock without ice, with crampons or footwear permitted by the venue. It can be a discipline in its own right and develop movement skills for mixed climbing."}, "steps": [[{"zh": "繩索基礎與場域選擇", "en": "Rope foundations + venue choice"}, {"zh": "先具備確保、夥伴檢查與裝備使用基礎；在允許乾攀的專用場域，由具備相應經驗的指導員帶領，熟悉冰工具、鞋具與場地要求。", "en": "Build belaying, partner-check, and equipment skills. Start with an appropriately experienced instructor at a venue that permits dry tooling, learning its requirements for tools and footwear."}], [{"zh": "頂繩工具與腳法練習", "en": "Top-rope tool + footwork practice"}, {"zh": "在頂繩環境練習工具落點判讀、身體平衡、腳步配置與動作控制；將尖銳工具管理、繩索位置及周遭人員納入練習。", "en": "Practice reading tool placements, balance, footwork, and controlled movement on top rope. Include management of sharp equipment, rope position, and people nearby."}], [{"zh": "依路線學習保護與先鋒", "en": "Route-specific protection + lead training"}, {"zh": "先建立穩定的頂繩能力，再由指導員評估是否加入先鋒。辨識固定點、墜落後果、繩索管理與撤退需求，不以攀岩級數直接判定乾攀能力。", "en": "Develop consistent top-rope skills before instructor-assessed progression to leading. Study anchors, fall consequences, rope management, and retreat; rock grades do not directly establish dry-tooling competence."}], [{"zh": "戶外倫理與混合攀登銜接", "en": "Outdoor ethics + mixed-climbing progression"}, {"zh": "查證岩場是否允許乾攀，避免在一般攀岩路線留下冰工具或冰爪痕跡。若走向混合路線，另外補上冰況、雪況、保護方式及山區環境判斷。", "en": "Confirm local dry-tooling access and avoid leaving tool or crampon scars on ordinary rock climbs. Add ice, snow, protection, and mountain judgment skills when progressing to mixed routes."}]], "foundation": [{"zh": "工具與繩索管理", "en": "Tool + rope management"}, {"zh": "動作與腳法", "en": "Movement + footwork"}, {"zh": "岩場規範與倫理", "en": "Access + ethics"}, {"zh": "夥伴溝通", "en": "Partner communication"}], "note": {"zh": "乾攀不必一定在雪地進行，因此不等同攀冰或完整混合攀登能力。活動或接近路線若涉及雪地，同樣建議學習雪崩基礎，並依地形安排進一步訓練。", "en": "Dry tooling does not require snow and does not by itself establish ice- or mixed-climbing competence. If the activity or approach involves snow, learn avalanche fundamentals and add terrain-specific training."}, "anchor": "outside-skills"},
    {"id": "mixed", "label": {"zh": "混合攀登", "en": "Mixed climbing"}, "title": {"zh": "在岩石與冰雪之間，練習判斷與轉換", "en": "Develop judgment and transitions across rock, ice, and snow"}, "description": {"zh": "混合攀登在路線中結合岩石、冰或雪，可能運用乾攀動作及攀冰技術。保護條件與冰雪狀況會隨路線及當日環境改變，需要把個人技術、保護與路線判斷整合。", "en": "Mixed climbing combines rock with ice or snow and may use both dry-tooling movement and ice-climbing techniques. Protection and conditions vary by route and day, requiring integrated movement, protection, and route judgment."}, "steps": [[{"zh": "確認岩石、冰與繩索基礎", "en": "Assess rock, ice, and rope foundations"}, {"zh": "先盤點確保、攀岩、乾攀與攀冰經驗，由指導員依目標路線安排訓練；不把乾攀或攀冰級數視為全部能力的證明。", "en": "Review belaying, rock, dry-tooling, and ice experience with an instructor, then plan training for the objective. Dry-tooling or ice grades alone do not demonstrate the full skill set."}], [{"zh": "頂繩練習地形轉換", "en": "Practice terrain transitions on top rope"}, {"zh": "在適當場域練習岩石與冰段之間的動作、工具及腳法轉換，辨識落點與支撐條件的差異，建立穩定而可控制的攀登方式。", "en": "Use a suitable venue to practice movement, tool, and footwork transitions between rock and ice. Learn to recognize different placement and support conditions and build controlled movement."}], [{"zh": "保護、先鋒與撤退", "en": "Protection, leading, and retreat"}, {"zh": "依路線學習岩石與冰上的保護選擇、固定點評估、繩索管理及撤退規劃。先在適當指導與評估下累積經驗，再逐步銜接先鋒或多繩距。", "en": "Learn route-specific rock and ice protection, anchor assessment, rope management, and retreat planning. Build assessed, supervised experience before progressing to leading or multi-pitch objectives."}], [{"zh": "山區環境與雪崩判斷", "en": "Mountain conditions + avalanche decisions"}, {"zh": "將天氣、冰況、落冰、積雪與接近路線納入規劃。涉及雪地就應學習雪崩基礎；若暴露於雪崩地形，再加入地形判讀、同伴救援及相應實地課程。", "en": "Plan for weather, ice conditions, falling ice, snow, and the approach. Learn avalanche fundamentals for snow involvement; add terrain assessment, companion rescue, and appropriate field training for avalanche exposure."}]], "foundation": [{"zh": "乾攀與攀冰技術", "en": "Dry-tooling + ice skills"}, {"zh": "岩石與冰上保護", "en": "Rock + ice protection"}, {"zh": "雪崩與環境判斷", "en": "Avalanche + conditions"}, {"zh": "撤退與同伴救援", "en": "Retreat + partner rescue"}], "note": {"zh": "完成單一乾攀或攀冰課程，不代表已能自行應付混合路線。由具備相應地形經驗的指導員或嚮導協助評估，逐步累積實地經驗。", "en": "A single dry-tooling or ice course does not establish independent mixed-climbing competence. Work with an instructor or guide experienced in the terrain to assess readiness and build field experience."}, "anchor": "outside-skills"},
    {
      id: 'alpine', label: copy('阿式登山', 'Alpine climbing'), title: copy('岩石、冰雪與冰河，在山上整合', 'Bring rock, snow, ice, and glaciers together'),
      description: copy('阿式登山涵蓋山區岩石、雪坡、冰河與混合地形。依目標結合個人移動、繩隊保護、環境判斷與撤退能力。', 'Alpine climbing spans mountain rock, snow, glaciers, and mixed terrain. Combine movement, team protection, environmental judgment, and retreat skills for the objective.'),
      steps: [
        [copy('山野基礎', 'Mountain foundation'), copy('導航、天氣、體能、裝備與撤離規劃。', 'Navigation, weather, fitness, equipment, and evacuation planning.')],
        [copy('雪地與岩石移動', 'Snow + rock movement'), copy('冰爪、冰斧、自我確保與雪坡制動；岩石路線補傳統、多繩距與下降。', 'Crampons, axe, self-belay, and self-arrest; add trad, multi-pitch, and descents for rock routes.')],
        [copy('地形與保護專項', 'Terrain-specific protection'), copy('冰河路線補結組與冰隙救援；岩稜與陡雪坡補短段確保、固定點與繩索系統。', 'Add roped travel and crevasse rescue for glaciers; short pitches, anchors, and rope systems for ridges and steep snow.')],
        [copy('整合與嚮導技能', 'Integration + guiding skills'), copy('練習不同保護方式的切換、時間管理與撤退；專業短繩技能則在指導與情境評量下學習。', 'Practice protection transitions, timing, and retreat; develop professional short-roping skills through instruction and scenario assessment.')]
      ],
      foundation: [copy('導航與氣象', 'Navigation + weather'), copy('雪崩決策', 'Avalanche decisions'), copy('野外急救', 'Wilderness first aid'), copy('露宿與通訊', 'Bivouac + communications')],
      note: copy('Alpine skiing 在滑雪指導員體系中指雙板項目；本頁的阿式登山指山區登山。攀冰、冰河結組、short roping 與 short pitching 各有不同訓練內容。', 'Alpine skiing names a ski-instruction discipline; Alpine here means mountaineering. Ice climbing, glacier travel, short roping, and short pitching each require distinct training.'), anchor: 'outside-skills'
    },
    {
      id: 'ski-mountaineering', label: copy('滑雪登山', 'Ski mountaineering'), title: copy('當滑雪與登山，在山上交會', 'Where skiing and mountaineering meet'),
      description: copy('把野外滑雪與路線所需的登山能力整合。技術難度取決於目標地形，並非所有行程都包含攀冰。', 'Combine backcountry skiing with the mountaineering skills your route needs. Technical demands depend on the objective; not every tour involves ice climbing.'),
      steps: [
        [copy('成熟的野外滑雪能力', 'Established touring skills'), copy('具備變化雪況滑行、上坡效率、冬季導航與雪崩決策經驗。', 'Develop variable-snow skiing, efficient ascent, winter navigation, and avalanche decision experience.')],
        [copy('補齊路線專項', 'Route-specific skills'), copy('依路線加入陡雪坡、冰爪冰斧、冰河結組或岩石攀登。', 'Add steep snow, crampons and axe, roped glacier travel, or rock climbing as required.')],
        [copy('系統整合', 'Integrate systems'), copy('練習滑行、bootpack、冰爪冰斧、雪地保護與繩索下降的轉換；嚮導路線另加入短繩／短繩距。', 'Integrate skiing, bootpacking, axe and crampons, snow protection, and rappelling; guiding pathways also develop short roping/pitching.')],
        [copy('循序擴大目標', 'Expand objectives gradually'), copy('在適當指導下累積不同雪況、山域與多日行程的實作。', 'Build experience across snow conditions, mountain regions, and multi-day routes with appropriate guidance.')]
      ],
      foundation: [copy('雪崩與天氣', 'Avalanche + weather'), copy('地形專項救援', 'Terrain-specific rescue'), copy('野外急救', 'Wilderness first aid'), copy('多日後勤', 'Multi-day logistics')],
      note: copy('這是兩條能力分支的交會。完成一門登山或雪崩課程後，仍需實作、回饋與經驗累積。', 'This is a meeting of skill branches. A mountaineering or avalanche course still needs follow-through with practice, feedback, and experience.'), anchor: 'outside-profession'
    },
    {
      id: 'instruction', label: copy('指導員', 'Instructor'), title: copy('在受管理的場域，建立教學能力', 'Build teaching skills in a managed setting'),
      description: copy('先選雙板、單板或岩館，再選工作地區與體系。從個人技術、示範與溝通開始，逐步累積教學經驗。', 'Choose skiing, snowboarding, or climbing-wall teaching, then your region and system. Develop personal technique, demonstrations, communication, and teaching experience.'),
      steps: [
        [copy('個人技術與場域規則', 'Technique + site rules'), copy('穩定滑行或攀登、裝備操作、學員與場域安全，達到所選課程的入學標準。', 'Build stable riding or climbing, equipment skills, and site / student management to meet course entry standards.')],
        [copy('入門指導員訓練', 'Entry instructor training'), copy('雙板如 CSIA／NZSIA；單板如 CASI／SBINZ；人工岩場如 AMGA CWI／ACMG CGI。', 'Examples: CSIA / NZSIA for skiing, CASI / SBINZ for snowboarding, and AMGA CWI / ACMG CGI for climbing walls.')],
        [copy('教學實作與回饋', 'Teaching practice + feedback'), copy('累積帶課、觀課、動作分析與教案設計，依體系要求通過技術及教學評量。', 'Log teaching and observation; practice analysis and lesson design, and pass the system’s technical and teaching assessments.')],
        [copy('進階或轉向山野', 'Advance or expand outdoors'), copy('可往高階指導員、兒童／Park 專項發展。涉及雪地就應學習雪崩基礎；轉入山野時，再深化導航、急救、雪崩決策與地形技能。', 'Progress toward higher instructor levels or children’s and park specialties. Learn avalanche fundamentals for activities involving snow, then develop navigation, first aid, avalanche decisions, and terrain skills for backcountry goals.')]
      ],
      foundation: [copy('教學與溝通', 'Teaching + communication'), copy('動作分析', 'Movement analysis'), copy('急救／CPR', 'First aid / CPR'), copy('場域與團隊管理', 'Site + group management')],
      note: copy('不同體系的級別與工作範圍分別確認；沒有必須先當雪場指導員，才能開始休閒野外滑雪的共同規定。', 'Check levels and professional scope within each system; resort instructor certification is not a universal prerequisite for recreational backcountry skiing.'), anchor: 'outside-instructors'
    },
    {
      id: 'professional', label: copy('嚮導', 'Guide'), title: copy('從自己的行程，走向帶領他人', 'From your own trips to guiding others'),
      description: copy('先選擇工作地區與專項：岩石、冰雪登山或滑雪嚮導。再核對入學所需的路線履歷、急救與雪崩資格。', 'Choose your region and discipline: rock, alpine, or ski guiding. Then check the required route résumé, first aid, and avalanche qualifications.'),
      steps: [
        [copy('建立技術履歷', 'Build a technical résumé'), copy('累積不同路線、地區與條件下的主導或共同主導經驗，保留紀錄。', 'Log lead or co-lead experience on varied routes, in different regions and conditions.')],
        [copy('達成入學條件', 'Meet entry requirements'), copy('依體系補齊 WFR／CPR、職業雪崩課程、移動測評與其他先修。', 'Complete the program-specific WFR/CPR, professional avalanche training, movement screening, and other prerequisites.')],
        [copy('嚮導課程與實習', 'Guide training + apprenticeship'), copy('通過相關課程與學徒考試，在規定的監督條件下累積帶隊經驗。', 'Complete training and apprentice assessment, then gain experience under the required supervision.')],
        [copy('專項考試與持續教育', 'Certification + ongoing learning'), copy('通過專項考試；若以 IFMGA 為目標，再完成該會員協會的完整路徑。', 'Pass discipline-specific exams. For IFMGA, complete the full pathway of the relevant member association.')]
      ],
      foundation: [copy('教學與溝通', 'Teaching + communication'), copy('風險管理', 'Risk management'), copy('專業倫理', 'Professional practice'), copy('持續教育', 'Continuing education')],
      note: copy('Ops、AvSAR 與急救是相關能力模組，不會單獨授予嚮導資格。工作接受條件需向體系與雇主確認。', 'Ops, AvSAR, and first aid are supporting modules and do not independently grant guide status. Confirm professional requirements with the program and employer.'), anchor: 'outside-profession'
    }
  ];

  const disciplines = [
    [copy('攀岩', 'Rock climbing'), 'Rock climbing', copy('確保、先鋒、固定點與下降，再依目標走向傳統、多繩距與岩場救援。', 'Belay, lead, build anchors, and descend; add trad, multi-pitch, and crag rescue for your objectives.')],
    [copy('攀冰', 'Ice climbing'), 'Ice climbing', copy('冰爪與冰工具、冰況、冰螺栓與冰上系統，逐步銜接先鋒與多繩距。', 'Crampons, tools, ice assessment, screws, and ice systems; progress toward lead and multi-pitch.')],
    [copy('滑雪／單板', 'Skiing / snowboarding'), 'Skiing / snowboarding', copy('雪場基本動作、不同雪況的控速與穩定移動，建立野外下降能力。', 'Resort fundamentals, speed control, and stable movement in variable snow build backcountry descent skills.')],
    [copy('冰雪與冰河登山', 'Snow & glacier travel'), 'Snow & glacier travel', copy('雪地行進、保護方式、冰河結組、冰隙救援與路線判讀。', 'Snow travel, protection, roped glacier travel, crevasse rescue, and route finding.')],
    [copy('野外滑雪', 'Backcountry skiing'), 'Backcountry / ski touring', copy('滑行＋自行上坡＋冬季山野技能，整合雪崩決策與同伴救援。', 'Skiing, human-powered ascent, and winter travel integrated with avalanche decisions and companion rescue.')],
    [copy('滑雪登山', 'Ski mountaineering'), 'Ski mountaineering', copy('野外滑雪與登山技術的交會；依路線加入冰河、陡雪坡與繩索段。', 'Where touring meets mountaineering; add glaciers, steep snow, and rope sections as the route requires.')]
  ];

  const lanes = {
    recreation: {
      label: copy('休閒決策', 'Recreation'), organization: 'Avalanche Canada',
      title: copy('讓每一次行程，有一套決策方法', 'A decision process for each trip'),
      description: copy('適合野外滑雪、雪鞋及其他受雪崩地形影響的休閒活動。依實際移動方式選擇課程。', 'For recreational skiing, snowshoeing, and other travel exposed to avalanche terrain. Choose a course suited to your mode of travel.'),
      flowTitle: copy('建議學習順序', 'Suggested learning sequence'),
      flow: copy('AST 1 → 實地練習，搭配 CRS／MAT → AST 2 → 持續練習與複訓', 'AST 1 → field practice, with CRS / MAT → AST 2 → ongoing practice and refreshers'),
      courses: [
        { code: 'AST 1', name: 'Avalanche Skills Training 1', tag: copy('雪崩入門', 'Introductory training'), description: copy('雪崩地形辨識、預報判讀、行程規劃與同伴救援入門。至少兩天，含課堂／線上與實地學習。', 'Avalanche terrain, forecasts, trip planning, and introductory companion rescue. At least two days with classroom/online and field learning.'), required: copy('官方不要求先有雪崩訓練經驗；活動移動能力依開課單位確認。', 'No prior avalanche training required; confirm activity-specific movement requirements with the provider.'), url: 'https://avalanche.ca/training' },
        { code: 'CRS', name: 'Companion Rescue Skills', tag: copy('同伴救援專項', 'Companion rescue practice'), description: copy('一天的實地訓練，深化搜尋器、探桿、有效挖掘與救援組織；也適合定期複習。', 'A one-day field course to refine transceiver use, probing, effective shoveling, and rescue organization; useful for regular refreshers.'), recommended: copy('已有 AST 1 所介紹的同伴救援基礎。', 'The companion rescue foundation introduced in AST 1.'), url: 'https://avalanche.ca/training' },
        { code: 'MAT / AST 1+', name: 'Managing Avalanche Terrain', tag: copy('地形與路線', 'Terrain + route choices'), description: copy('MAT 延伸 AST 1 的地形評估與路線選擇。AST 1+ 是 AST 1＋MAT 的組合，通常三天。', 'MAT extends AST 1 terrain assessment and travel choices. AST 1+ combines AST 1 with MAT, usually over three days.'), required: copy('MAT 以完成 AST 1 的參與者為對象；AST 1+ 則包含入門內容。', 'MAT is designed for AST 1 graduates; AST 1+ includes the introductory training.'), url: 'https://avalanche.ca/training' },
        { code: 'AST 2', name: 'Avalanche Skills Training 2', tag: copy('進階休閒決策', 'Advanced recreational decisions'), description: copy('深化雪況觀察、地形評估與每日決策流程。至少 9.5 小時課堂與三天實地學習。', 'Develop observations, terrain assessment, and the daily decision process. At least 9.5 classroom hours plus three field days.'), required: copy('AST 1，以及一些野外經驗。CRS／MAT 可依需要選修與練習。', 'AST 1 and some backcountry experience. Add CRS / MAT for focused practice as needed.'), url: 'https://avalanche.ca/training' }
      ],
      note: copy('AST 證書沒有到期日；Avalanche Canada 仍建議每年，或至少每 2–3 年更新訓練與練習。', 'AST certificates do not expire; Avalanche Canada still recommends refreshing learning annually, or at least every 2–3 years.')
    },
    operations: {
      label: copy('職業作業', 'Operations'), organization: 'Canadian Avalanche Association · CAA',
      title: copy('從觀測紀錄，走向職業風險管理', 'From observations to operational risk management'),
      description: copy('面向雪場、道路、產業設施、嚮導業與雪崩教育等工作。這是雪崩作業訓練，嚮導資格需另外取得。', 'For work in ski areas, roads, industry, guiding, and avalanche education. This is avalanche operations training; guide certification is separate.'),
      flowTitle: copy('主要正式先修關係', 'Key formal dependencies'),
      flow: copy('Introduction to Avalanche Operations ＋ AvSAR L1 ＋ 其他入學條件 → Ops 1 → AvSAR L2、氣象課程與作業經驗 → Ops 2', 'Introduction to Avalanche Operations + AvSAR L1 + other entry requirements → Ops 1 → AvSAR L2, weather training, and operational experience → Ops 2'),
      courses: [
        { code: 'Introduction to Avalanche Operations', name: '', tag: copy('職業入門・線上', 'Professional introduction · online'), description: copy('建立職業雪崩作業的入門知識，是 Ops 1 的必要條件之一。', 'Introduces professional avalanche operations and is a required component for Ops 1.'), required: copy('須於 Ops 1 開課前完成；依 CAA 報名流程安排。', 'Complete before starting Ops 1, following the CAA registration process.'), url: 'https://avalancheassociation.ca/itp/avalanche-operations-level-1/' },
        { code: 'Ops 1', name: 'Avalanche Operations Level 1', tag: copy('職業雪崩作業入門', 'Entry-level professional operations'), description: copy('雪崩觀測、資料蒐集、危害評估與作業決策基礎。課程約 7–8 天。', 'Avalanche observations, data collection, hazard assessment, and operational decisions. Approximately 7–8 days.'), required: copy('Introduction to Avalanche Operations＋AvSAR L1；另有進階野外移動能力、體能與年齡要求。', 'Introduction to Avalanche Operations + AvSAR L1; advanced backcountry movement, fitness, and age requirements also apply.'), recommended: copy('AST 1／AST 2。兩者目前是建議，不是 Ops 1 的強制先修。', 'AST 1 / AST 2. These are recommended, not mandatory Ops 1 prerequisites.'), url: 'https://avalancheassociation.ca/itp/avalanche-operations-level-1/' },
        { code: 'Introduction to Weather', name: '', tag: copy('氣象基礎', 'Weather foundation'), description: copy('Ops 2 要求的氣象訓練。先前的相關訓練可透過 CAA 的學習認可程序申請評估。', 'Weather training required for Ops 2. Relevant prior training can be submitted through CAA’s prior learning process.'), url: 'https://avalancheassociation.ca/training/' },
        { code: 'Ops 2', name: 'Avalanche Operations Level 2', tag: copy('進階作業與決策', 'Advanced operations + decisions'), description: copy('面向全職雪崩作業人員，深化風險管理、作業決策與團隊領導。包含課程與評量。', 'For full-time avalanche workers, developing risk management, operational decisions, and leadership. Includes a course and assessment.'), required: copy('Ops 1＋Introduction to Weather＋AvSAR L2；另需 Ops 1 後至少兩個作業季、100 個作業日、指定觀測紀錄與推薦等。', 'Ops 1 + Introduction to Weather + AvSAR L2; also at least two operational seasons and 100 operational days after Ops 1, specified observation records, references, and other conditions.'), url: 'https://avalancheassociation.ca/itp/avalanche-operations-level-2/' }
      ],
      note: copy('後續可依工作走向 Ops 3、進階氣象、雪崩地圖或其他專項。各項另有先修與經驗要求，並非休閒活動的共同必修。', 'Further work-specific options include Ops 3, advanced weather, avalanche mapping, and other specialties. Each has its own prerequisites and experience requirements; these are not universal recreational requirements.')
    },
    rescue: {
      label: copy('雪崩搜救', 'Search & rescue'), organization: 'Canadian Avalanche Association · CAA',
      title: copy('從同伴救援，走向有組織的搜救', 'From companion rescue to organized response'),
      description: copy('AvSAR 是 Avalanche Search and Rescue，聚焦雪崩事故的應變、搜索與救援團隊運作。', 'AvSAR means Avalanche Search and Rescue, focusing on avalanche incident response, searching, and rescue-team operations.'),
      flowTitle: copy('主要正式先修關係', 'Key formal dependencies'),
      flow: copy('ICS 100 ＋ 其他入學條件 → AvSAR L1 → Ops 1；Ops 1 ＋ ICS 100 ＋ 其他入學條件 → AvSAR L2', 'ICS 100 + other entry requirements → AvSAR L1 → Ops 1; Ops 1 + ICS 100 + other entry requirements → AvSAR L2'),
      courses: [
        { code: 'AvSAR L1', name: 'Avalanche Search and Rescue Level 1', tag: copy('第一線應變與隊員能力', 'Initial response + team member skills'), description: copy('第一線應變、搜尋與救援隊員的基礎技能。四天實地課程，另含線上課前學習。', 'Foundational response, searching, and rescue-team skills. Four field days plus online pre-course learning.'), required: copy('ICS 100；BC 至少 19 歲，Alberta／Québec 至少 18 歲。實地課程需要足夠的雪地移動能力與體能。', 'ICS 100; minimum age 19 in BC or 18 in Alberta / Québec. Field participation requires adequate snow-travel skills and fitness.'), recommended: copy('依 CAA 現行課程頁：AST 1、80 小時急救證書。', 'Per the current CAA course page: AST 1 and an 80-hour first-aid certificate.'), url: 'https://avalancheassociation.ca/itp/avalanche-search-and-rescue-level-1/' },
        { code: 'AvSAR L2', name: 'Avalanche Search and Rescue Level 2', tag: copy('進階策略與救援領導', 'Advanced strategy + rescue leadership'), description: copy('處理搜救中的危害與風險，運用進階策略，帶領救援情境。面向業界人員與進階搜救志工。', 'Manage rescue hazards and risk, apply advanced strategies, and lead response scenarios. For industry professionals and advanced SAR volunteers.'), required: copy('Ops 1＋ICS 100；另有進階野外移動能力、體能及年齡要求。', 'Ops 1 + ICS 100; advanced backcountry movement, fitness, and age requirements also apply.'), recommended: copy('80 小時急救證書。', 'An 80-hour first-aid certificate.'), url: 'https://avalancheassociation.ca/itp/avalanche-search-and-rescue-level-2/' }
      ],
      note: copy('版本提醒：AvSAR L1 於 2024／25 雪季引入；AvSAR L2 也自該雪季取代舊的 AvSAR Advanced Skills。舊資格的接受方式需按 CAA 規定確認。', 'Version note: AvSAR L1 was introduced in 2024/25; AvSAR L2 replaced AvSAR Advanced Skills that season. Confirm how older qualifications are accepted with CAA.')
    }
  };

  const medicine = [
    {
      code: 'WFA', name: 'Wilderness First Aid', subtitle: copy('野外急救入門', 'Introductory wilderness first aid'), hours: copy('約 16–20 小時', 'About 16–20 hours'),
      description: copy('適合較短、較容易取得醫療支援的戶外活動，建立傷病評估、基本處置與撤離判斷。', 'For shorter trips with more accessible medical support. Build patient assessment, basic care, and evacuation decisions.'),
      providers: [
        { name: 'WMAI', training: [copy('完整課程：美國 ≥16 小時；加拿大 ≥20 小時。', 'Full course: US ≥16 hours; Canada ≥20 hours.')], maintenance: [copy('效期三年；可重讀 WFA，或進修 WAFA／WFR。', 'Valid for three years; repeat WFA or progress to WAFA / WFR.')], links: [['https://wildmed.com/courses/standard/wilderness-first-aid/', copy('WFA 官方課程', 'Official WFA course')]] },
        { name: 'NOLS', training: [copy('完整課程：16 小時。', 'Full course: 16 hours.')], maintenance: [copy('效期兩年；續證與進修方式依機構規定。', 'Valid for two years; renewal and progression follow provider rules.')], links: [['https://www.nols.edu/courses/wilderness-first-aid-WFA/', copy('WFA 官方課程', 'Official WFA course')]] }
      ]
    },
    {
      code: 'WAFA', name: 'Wilderness Advanced First Aid', subtitle: copy('延伸評估與救援延遲下的照護', 'Extended assessment and care when help is delayed'), hours: copy('約 36–40 小時', 'About 36–40 hours'),
      description: copy('深化傷病評估、環境傷病、野外照護及救援通報，增加實作與延遲救援下的照護練習。', 'Develop assessment, environmental illness management, field care, and rescue reporting, with more practice caring for patients when rescue is delayed.'),
      providers: [
        { name: 'WMAI', training: [copy('完整課程：美國 ≥36 小時；加拿大 ≥40 小時。', 'Full course: US ≥36 hours; Canada ≥40 hours.')], maintenance: [copy('效期三年；可依規定重讀續證或升級。', 'Valid for three years; repeat to renew or upgrade as permitted.'), copy('WAFA → WFR Bridge：4 天，美國 ≥36 小時／加拿大 ≥40 小時；需持有效 WAFA。', 'WAFA → WFR Bridge: 4 days, US ≥36 hours / Canada ≥40 hours; a current WAFA is required.')], links: [['https://wildmed.com/courses/standard/hybrid-wilderness-advanced-first-aid/', copy('WAFA 官方課程', 'Official WAFA course')], ['https://wildmed.com/courses/standard/bridge-wafa-to-wfr/', copy('WFR 銜接課程', 'WFR bridge course')]] },
        { name: 'NOLS', training: [copy('完整課程：40 小時。', 'Full course: 40 hours.')], maintenance: [copy('可依資格參加 WFR Recertification 或 Hybrid WFR Recertification 續證；適用條件以 NOLS 公告為準。', 'Eligible graduates may renew through WFR Recertification or Hybrid WFR Recertification; NOLS determines eligibility.')], links: [['https://www.nols.edu/courses/wilderness-advanced-first-aid-WAFA/', copy('WAFA 官方課程', 'Official WAFA course')], ['https://www.nols.edu/wilderness-medicine/courses/recertify/', copy('續證規定', 'Recertification policy')]] }
      ]
    },
    {
      code: 'WFR', name: 'Wilderness First Responder', subtitle: copy('偏遠活動、長時間照護與撤離決策', 'Remote travel, extended care, and evacuation decisions'), hours: copy('約 70–80 小時', 'About 70–80 hours'),
      description: copy('適合經常進入偏遠環境、負責團隊照護，或從事戶外教育與嚮導工作的人。可直接報讀完整 WFR，並非一律需要先完成 WFA 或 WAFA。', 'For frequent remote travelers, trip leaders, outdoor educators, and guides. Direct enrollment in a full WFR is possible; WFA and WAFA are not universal prerequisites.'),
      providers: [
        { name: 'WMAI', training: [copy('完整面授：7–9 天，美國 ≥70 小時／加拿大 ≥80 小時。', 'Full in-person course: 7–9 days, US ≥70 hours / Canada ≥80 hours.'), copy('5 天形式：課前 ≥30 小時＋面授 ≥45 小時。', '5-day format: pre-course ≥30 hours + in-person ≥45 hours.')], maintenance: [copy('效期三年。3 天面授複訓 ≥24 小時。', 'Valid for three years. A 3-day in-person recertification course takes ≥24 hours.'), copy('混合複訓：線上約 12 小時＋2 天面授 16 小時；需符合證書與原課程等報讀條件。', 'Hybrid recertification: online ~12 hours + 16 hours in person over 2 days; certificate and prior-training eligibility rules apply.')], links: [['https://wildmed.com/courses/standard/wilderness-first-responder/', copy('完整 WFR', 'Full WFR')], ['https://wildmed.com/courses/standard/5-day-wilderness-first-responder/', copy('5 天 WFR', '5-day WFR')], ['https://wildmed.com/courses/recertification/wfr-wems-recertification/', copy('面授複訓', 'In-person recertification')], ['https://wildmed.com/courses/recertification/hybrid-wilderness-first-responder-recertification/', copy('混合複訓', 'Hybrid recertification')]] },
        { name: 'NOLS', training: [copy('完整課程：80 小時，通常安排為 9–10 天。', 'Full course: 80 hours, usually scheduled over 9–10 days.')], maintenance: [copy('效期兩年。WFR Recertification 為 3 天面授、24 小時。', 'Valid for two years. WFR Recertification is 24 hours over 3 in-person days.'), copy('另有 Hybrid WFR Recertification；其他續證方式及跨機構申請依 NOLS 規定。', 'Hybrid WFR Recertification is also available; other renewal options and cross-provider eligibility follow NOLS policy.')], links: [['https://www.nols.edu/courses/wilderness-first-responder-WFR/', copy('完整 WFR', 'Full WFR')], ['https://www.nols.edu/courses/wilderness-first-responder-recertification-WFRR/', copy('面授複訓', 'In-person recertification')], ['https://www.nols.edu/wilderness-medicine/courses/recertify/', copy('續證規定', 'Recertification policy')]] }
      ]
    },
    {
      code: 'WEMT', name: 'Wilderness Emergency Medical Technician', subtitle: copy('到院前救護與野外醫療的專業方向', 'A professional direction in EMS and wilderness care'), hours: copy('依 EMT 與野外模組安排', 'EMT + wilderness components'),
      description: copy('結合到院前救護與野外醫療。完整 EMT 訓練與醫療人員的野外升級課程，入學條件與授予資格不同；依自己的醫療背景選擇，也不必將其視為 WFR 後的必修下一級。', 'Combines EMS and wilderness care. Full EMT training and wilderness upgrades for medical professionals have different entry requirements and credentials. Choose for your medical background; this is not a mandatory next step after WFR.'),
      providers: [
        { name: 'WMAI · WEMS Upgrade', training: [copy('野外升級模組：≥45 小時，適合已有 EMT 或其他相應醫療資格者。', 'Wilderness upgrade: ≥45 hours, for EMTs and other appropriately qualified medical professionals.')], maintenance: [copy('效期三年，且需維持有效 EMS 或其他專業醫療資格；複訓依 WMAI 規定。', 'Valid for three years, contingent on current EMS or other professional medical certification; WMAI recertification rules apply.')], links: [['https://wildmed.com/courses/standard/wilderness-ems-upgrade/', copy('WEMS Upgrade 官方課程', 'Official WEMS Upgrade course')], ['https://wildmed.com/courses/recertification/', copy('複訓規定', 'Recertification policy')]] },
        { name: 'NOLS · WEMT', training: [copy('完整 WEMT：200 小時，約四週，涵蓋 EMT 與野外醫療訓練。', 'Full WEMT: 200 hours over about four weeks, covering EMT and wilderness medical training.')], maintenance: [copy('野外部分可依規定續證；EMT 資格的維持與複訓另按所在地要求。', 'Renew the wilderness component under provider rules; EMT renewal and refresher requirements follow the relevant jurisdiction.')], links: [['https://www.nols.edu/courses/courses/wilderness-emt-WEMT/', copy('WEMT 官方課程', 'Official WEMT course')], ['https://www.nols.edu/wilderness-medicine/courses/recertify/', copy('續證規定', 'Recertification policy')]] }
      ]
    }
  ];

  const sources = [
    ['https://avalanche.ca/start-here', 'Avalanche Canada · Avalanche Awareness'],
    ['https://avalanche.ca/training', 'Avalanche Canada · AST / CRS / MAT'],
    ['https://www.nsaa.org/nsaa/safety/', 'NSAA · Your Responsibility Code'],
    ['https://services.thebmc.co.uk/bmc-drilled-equipment-and-dry-tooling-position-statements', 'BMC · Dry Tooling & Access'],
    ['https://services.thebmc.co.uk/media/files/BMC_WinterMountainSkills_Scotland_Jan17_CourseInformation.pdf', 'BMC · Winter Mountaineering Training'],
    ['https://avalancheassociation.ca/training/', 'CAA · Industry Training Program'],
    ['https://avalancheassociation.ca/itp/avalanche-operations-level-1/', 'CAA · Avalanche Operations L1'],
    ['https://avalancheassociation.ca/itp/avalanche-operations-level-2/', 'CAA · Avalanche Operations L2'],
    ['https://avalancheassociation.ca/itp/avalanche-search-and-rescue-level-1/', 'CAA · AvSAR L1'],
    ['https://avalancheassociation.ca/itp/avalanche-search-and-rescue-level-2/', 'CAA · AvSAR L2'],
    ['https://avtraining.org/recprogram/', 'AIARE · Recreational Training'],
    ['https://www.nols.edu/wilderness-medicine/courses/recertify/', 'NOLS · Wilderness Medicine / Recertification'],
    ['https://wildmed.com/courses/', 'WMAI · Wilderness Medicine'],
    ['https://wildmed.com/courses/recertification/', 'WMAI · Recertification'],
    ['https://wildmed.asia/courses-intro', 'WMAI · Asia Course Information'],
    ['https://www.amga.com/programs/mountain-guide-programs', 'AMGA · Mountain Guide Programs'],
    ['https://acmg.ca/ski-guide-certificate/', 'ACMG · Ski Guide'],
    ['https://ifmga.net/professional-mountain-guide/training-and-assessment', 'IFMGA · Training & Assessment']
  ];

  const goalGroups = [
    {ids:['resort','backcountry'],label:copy('雪場與野外滑雪','Resort and backcountry skiing')},
    {ids:['ice','dry-tooling','mixed'],label:copy('攀冰、乾攀與混合攀登','Ice, dry tooling, and mixed climbing')},
    {ids:['alpine','ski-mountaineering'],label:copy('阿式登山與滑雪登山','Alpine climbing and ski mountaineering')},
    {ids:['instruction','professional'],label:copy('指導員與嚮導','Instructors and guides')}
  ];

  function renderGoal() {
    byId('goal-picker').innerHTML = goalGroups.map(group => `<div class="goal-row" role="group" aria-label="${e(group.label)}" style="--goal-columns:${group.ids.length}">${group.ids.map(id => { const goal=goals.find(item=>item.id===id); return `<button type="button" data-goal="${goal.id}" aria-pressed="${goal.id === selectedGoal}" aria-controls="goal-panel">${e(goal.label)}</button>`; }).join('')}</div>`).join('');
    const goal = goals.find(item => item.id === selectedGoal);
    byId('goal-panel').innerHTML = `<div class="path-topline"><div><h3>${e(goal.title)}</h3><p>${e(goal.description)}</p></div><span class="path-tag">${e(copy('學習建議', 'Learning pathway'))}</span></div><ol class="path-steps">${goal.steps.map(([title, description], index) => `<li class="path-step"><span class="step-kicker">${e(copy(`學習階段 ${index + 1}`, `STAGE ${index + 1}`))}</span><h4>${e(title)}</h4><p>${e(description)}</p></li>`).join('')}</ol><div class="path-foundation"><p>${e(copy('並行建立的共同能力', 'Build these skills alongside the activity'))}</p><div class="skill-chips">${goal.foundation.map(skill => `<span>${e(skill)}</span>`).join('')}</div></div><p class="path-note">${e(goal.note)}</p>`;
  }

  function renderLane() {
    const keys = Object.keys(lanes);
    byId('avalanche-tabs').innerHTML = keys.map(key => `<button type="button" role="tab" id="tab-${key}" aria-controls="avalanche-panel" aria-selected="${key === selectedLane}" tabindex="${key === selectedLane ? 0 : -1}" data-lane="${key}">${e(lanes[key].label)}</button>`).join('');
    const lane = lanes[selectedLane];
    const panel = byId('avalanche-panel');
    panel.setAttribute('aria-labelledby', `tab-${selectedLane}`);
    panel.innerHTML = `<div class="lane-heading"><div><h3>${e(lane.title)}</h3><p>${e(lane.description)}</p></div><span class="organization">${escape(lane.organization)}</span></div><div class="lane-flow"><strong>${e(lane.flowTitle)}</strong>${e(lane.flow)}</div><div class="course-grid">${lane.courses.map(course => `<article class="course-card"><span class="course-type">${e(course.tag)}</span><h3>${escape(course.code)}</h3>${course.name ? `<p class="course-fullname">${escape(course.name)}</p>` : ''}<p>${e(course.description)}</p>${course.required || course.recommended ? `<dl>${course.required ? `<dt>${e(copy('必要先修／入學條件', 'Prerequisites / entry requirements'))}</dt><dd>${e(course.required)}</dd>` : ''}${course.recommended ? `<dt>${e(copy('建議先備／訓練', 'Recommended preparation'))}</dt><dd>${e(course.recommended)}</dd>` : ''}</dl>` : ''}${sourceLink(course.url, copy('官方課程', 'Official program'))}</article>`).join('')}</div><p class="lane-note">${e(lane.note)}</p>`;
  }

  function renderMedicine() {
    const openCodes = [...root.querySelectorAll('.medicine-row[open]')].map(node => node.dataset.code);
    const paragraphs = items => items.map(item => `<p>${e(item)}</p>`).join('');
    byId('medicine-list').innerHTML = medicine.map(course => `<details class="medicine-row" data-code="${course.code}"${openCodes.includes(course.code) ? ' open' : ''}><summary><span class="medicine-code">${course.code}</span><span class="medicine-name">${e(course.subtitle)}<small>${escape(course.name)}</small></span><span class="medicine-hours">${e(course.hours)}</span><span class="disclosure-symbol" aria-hidden="true">＋</span></summary><div class="medicine-course-body"><p class="medicine-description">${e(course.description)}</p><table class="medicine-provider-table"><caption class="visually-hidden">${escape(course.code)} · ${e(copy('WMAI 與 NOLS 課程比較', 'WMAI and NOLS course comparison'))}</caption><thead><tr><th scope="col">${e(copy('培訓機構', 'Provider'))}</th><th scope="col">${e(copy('課程與培訓時數', 'Training and hours'))}</th><th scope="col">${e(copy('效期、銜接與複訓', 'Validity, progression, and recertification'))}</th></tr></thead><tbody>${course.providers.map(provider => `<tr><th scope="row">${escape(provider.name)}</th><td data-label="${e(copy('課程與培訓時數', 'Training and hours'))}">${paragraphs(provider.training)}</td><td data-label="${e(copy('效期、銜接與複訓', 'Validity, progression, and recertification'))}">${paragraphs(provider.maintenance)}</td></tr><tr class="medicine-provider-sources"><td colspan="3"><div class="source-links">${provider.links.map(([url, label]) => sourceLink(url, label)).join('')}</div></td></tr>`).join('')}</tbody></table></div></details>`).join('');
  }

  function render() {
    root.lang = language === 'zh' ? 'zh-Hant' : 'en';
    root.dataset.language=language;
    root.querySelectorAll('[data-zh][data-en]').forEach(node => { node.textContent = node.dataset[language]; });
    root.querySelectorAll('[data-aria-zh]').forEach(node => { node.setAttribute('aria-label', node.getAttribute(`data-aria-${language}`)); });
    root.querySelectorAll('[data-language]').forEach(button => { button.setAttribute('aria-pressed', String(button.dataset.language === language)); });
    renderGoal();
    renderLane();
    renderMedicine();
    byId('discipline-grid').innerHTML = disciplines.map(([name, english, description]) => `<article><h3>${e(name)}</h3><p class="en-name">${language === 'zh' ? escape(english) : ''}</p><p>${e(description)}</p></article>`).join('');
    byId('source-grid').innerHTML = sources.map(([url, label]) => `<a href="${escape(url)}" target="_blank" rel="noopener noreferrer">${escape(label)} ↗</a>`).join('');
    root.GWOutsideLearning.render(language);
    updateNav();
  }

  root.addEventListener('click', event => {
    const languageButton = event.target.closest('button[data-language]');
    if (languageButton) {
      language = languageButton.dataset.language;
      render();
      return;
    }
    const goalButton = event.target.closest('[data-goal]');
    if (goalButton) {
      selectedGoal = goalButton.dataset.goal;
      renderGoal();
      root.querySelector(`[data-goal="${selectedGoal}"]`).focus({ preventScroll: true });
    }
    const laneButton = event.target.closest('[data-lane]');
    if (laneButton) {
      selectedLane = laneButton.dataset.lane;
      renderLane();
      byId(`tab-${selectedLane}`).focus({ preventScroll: true });
    }
  });

  byId('avalanche-tabs').addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const keys = Object.keys(lanes);
    const index = keys.indexOf(selectedLane);
    selectedLane = keys[event.key === 'Home' ? 0 : event.key === 'End' ? keys.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + keys.length) % keys.length];
    renderLane();
    byId(`tab-${selectedLane}`).focus({ preventScroll: true });
  });

  const sections = [...root.querySelectorAll(':scope > section')];
  const navLinks = [...root.querySelectorAll('.outside-nav a')];
  let navFrame = 0;
  function updateNav() {
    let current = sections[0].id;
    const threshold = Math.min(160, window.innerHeight * .25);
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= threshold) current = section.id;
    }
    if (current === 'outside-sources') current = 'outside-profession';
    if (current === 'outside-start') current = 'outside-paths';
    navLinks.forEach(link => {
      if (link.dataset.nav === current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  window.addEventListener('scroll', () => {
    if (navFrame) return;
    navFrame = window.requestAnimationFrame(() => { updateNav(); navFrame = 0; });
  }, { passive: true });
  window.addEventListener('resize', updateNav);
  render();
  root.dataset.outsideReady='true';
  const loadStatus=root.querySelector('[data-outside-load-status]');
  if(loadStatus) loadStatus.hidden=true;
  if(document.fonts) document.fonts.ready.then(updateNav);
})();
