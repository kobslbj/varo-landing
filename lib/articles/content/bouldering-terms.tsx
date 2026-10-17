import type { Article } from "../types";

import Link from "next/link";

import {
  A,
  Callout,
  Glossary,
  type GlossaryTerm,
  GymTalk,
  termId,
} from "@/components/articles/blocks";

const routes: GlossaryTerm[] = [
  {
    term: "Bouldering",
    zh: "抱石",
    def: "不用繩索、在比較矮的牆上攀爬，靠軟墊降低落地的衝擊。",
  },
  {
    term: "Boulder",
    zh: "岩塊／抱石路線",
    def: "原意是大石頭；看語境，也可以指一條抱石題目。",
  },
  {
    term: "Problem",
    zh: "路線／題目",
    def: "一條要用身體解開的抱石題目，英文常說 boulder problem。",
  },
  {
    term: "Route",
    zh: "路線",
    def: "攀爬路線的泛稱。抱石也會用，但英文更常說 problem。",
  },
  {
    term: "Move",
    zh: "動作／一手",
    def: "攀爬中的一個動作，不一定只有移動手。",
  },
  { term: "Sequence", zh: "動作順序", def: "手、腳和身體依序怎麼移動。" },
  {
    term: "Beta",
    zh: "解法／路線資訊",
    def: "怎麼爬這條路線的資訊：腳踩哪、動作順序、重心放在哪。",
  },
  { term: "Beta video", zh: "解線影片", def: "示範某條路線怎麼爬的影片。" },
  { term: "Route reading", zh: "讀線", def: "上牆前觀察岩點，推想動作順序。" },
  { term: "Crux", zh: "難關／關鍵動作", def: "一條路線最難的那一步或那一段。" },
  {
    term: "Attempt / Go",
    zh: "嘗試／一把",
    def: "一次攀爬嘗試，例如「再給我一把」。",
  },
  {
    term: "Session",
    zh: "一次攀爬",
    def: "從進館到離開的這一趟，通常包含很多次嘗試。",
  },
  {
    term: "Project",
    zh: "正在挑戰的路線",
    def: "還沒完成、想持續研究和嘗試的路線。",
  },
  { term: "Projecting", zh: "練線", def: "反覆拆解、練習同一條路線。" },
  {
    term: "Link",
    zh: "串動作／連段",
    def: "把原本分開完成的動作，接起來一次做完。",
  },
  { term: "Send", zh: "完攀", def: "照路線的規則，成功完成整條路線。" },
];

const sends: GlossaryTerm[] = [
  {
    term: "Flash",
    zh: "一次完攀",
    def: "第一次嘗試就完攀；事先可以看別人爬或聽 beta。",
  },
  {
    term: "Onsight",
    zh: "看過就上、一次完攀",
    def: "沒有事先取得解法、沒看別人爬，第一次就完攀；可以自己在地面讀線。",
  },
  {
    term: "Redpoint",
    zh: "練過後完攀",
    def: "練習或研究過之後，再從起點一次不中斷地完攀；在先鋒攀登特別常用。",
  },
  { term: "Repeat", zh: "重爬", def: "再次完成自己已經爬過的路線。" },
  {
    term: "FA / First ascent",
    zh: "首攀",
    def: "某條路線第一次被人完成，通常指戶外路線。你自己第一次爬完，說 send 就好。",
  },
  {
    term: "Top",
    zh: "終點／完成",
    def: "可以指終點，也可以指成功完成，看語境。",
  },
  {
    term: "Top out",
    zh: "翻頂",
    def: "爬過岩塊頂端，最後站上去。室內路線通常不用翻頂。",
  },
];

const grades: GlossaryTerm[] = [
  { term: "Grade", zh: "級數／難度", def: "對路線整體難度的評估。" },
  {
    term: "V-scale",
    zh: "V 級數",
    def: "常見的抱石分級，例如 V0、V1、V2；數字越大通常越難。",
  },
  { term: "VB", zh: "入門級", def: "有些館或指南用來標示比 V0 更簡單的路線。" },
  {
    term: "Font",
    zh: "楓丹白露分級",
    def: "另一套抱石分級，例如 6A、6B+、7A。",
  },
  {
    term: "Circuit",
    zh: "路線組",
    def: "一組難度相近的路線，也可以指串起來的訓練路線。",
  },
  { term: "Soft", zh: "偏軟、偏甜", def: "比標示的級數感覺簡單。" },
  { term: "Stiff / Hard", zh: "偏硬", def: "比標示的級數感覺難。" },
  {
    term: "Sandbag",
    zh: "級數給太低",
    def: "實際難度明顯高於標示，帶點調侃的口語。",
  },
  {
    term: "Upgrade / Downgrade",
    zh: "調高／調低級數",
    def: "重新評估路線的難度。",
  },
];

const rules: GlossaryTerm[] = [
  { term: "Start hold", zh: "起點", def: "路線指定的起始岩點。" },
  {
    term: "Four-point start",
    zh: "四點起攀",
    def: "用標記指定雙手、雙腳的起始位置，比賽常見。",
  },
  { term: "Finish hold", zh: "終點", def: "路線指定的最後一顆岩點。" },
  {
    term: "Control",
    zh: "控制住",
    def: "穩穩掌握岩點或姿勢，不是碰一下就算。",
  },
  { term: "Zone", zh: "區域點", def: "比賽中用來認定階段成績的指定岩點。" },
  { term: "Out of bounds", zh: "界外", def: "不允許使用的牆面或範圍。" },
  {
    term: "Dab",
    zh: "碰地",
    def: "攀爬中途碰到地面、墊子或其他東西，會影響是否算有效完攀。",
  },
  { term: "Sit start / SDS", zh: "坐姿起攀", def: "從坐在墊子上的姿勢開始。" },
  { term: "Jump start", zh: "跳起攀", def: "用跳的方式抓到起點。" },
  { term: "Downclimb", zh: "往下爬、倒攀", def: "沿著岩點往下爬回地面。" },
  {
    term: "Eliminate",
    zh: "限定玩法",
    def: "刻意排除某些岩點或地形，變成另一個挑戰。",
  },
];

const holds: GlossaryTerm[] = [
  { term: "Hold", zh: "岩點", def: "手抓、腳踩或身體接觸的攀爬支點。" },
  { term: "Foothold", zh: "腳點", def: "主要給腳用的岩點。" },
  {
    term: "Jug",
    zh: "大把手、好點",
    def: "可以整隻手深深抓住、很有安全感的岩點。",
  },
  { term: "Edge", zh: "邊緣點", def: "有一道邊可以抓或踩。" },
  {
    term: "Crimp",
    zh: "小點、摳點",
    def: "只放得下指尖的小邊；也可以指一種抓法。",
  },
  {
    term: "Sloper",
    zh: "圓點、摩擦點",
    def: "沒有明顯的邊可以扣，靠摩擦和施力方向抓住。",
  },
  { term: "Pinch", zh: "捏點", def: "用拇指和其他手指相對夾住的岩點。" },
  {
    term: "Pocket",
    zh: "洞點",
    def: "手指伸進洞裡抓。只放得下一根手指的叫 mono。",
  },
  { term: "Undercling", zh: "反抓", def: "從岩點下方抓住、往上拉。" },
  { term: "Sidepull", zh: "側拉", def: "往側邊拉住岩點。" },
  { term: "Gaston", zh: "反側拉", def: "手肘朝外，像撐開電梯門一樣往外推。" },
  {
    term: "Volume",
    zh: "地形點",
    def: "改變牆面形狀的大型立體造型，上面也可能裝別的岩點。",
  },
  {
    term: "Macro",
    zh: "大型岩點",
    def: "尺寸很大的岩點，和 volume 的分類在業界不完全一致。",
  },
  {
    term: "Dual-tex",
    zh: "雙材質",
    def: "同一顆岩點有粗糙和光滑兩種表面，能抓的位置不同。",
  },
];

const grips: GlossaryTerm[] = [
  { term: "Open hand", zh: "開掌抓", def: "手指比較伸展，拇指沒有扣住食指。" },
  {
    term: "Half crimp",
    zh: "半摳",
    def: "手指中間關節大約彎成直角，拇指通常不鎖住。",
  },
  {
    term: "Full crimp",
    zh: "全摳",
    def: "手指彎起來抓邊，拇指再壓住食指鎖住。手指負擔大，新手少用。",
  },
  {
    term: "Match",
    zh: "並手",
    def: "兩隻手放在同一顆岩點上。終點通常要並手。",
  },
  {
    term: "Bump",
    zh: "同手再出",
    def: "同一隻手先抓一顆中繼點，再往下一顆點移動。",
  },
  { term: "Cross", zh: "交叉手", def: "一隻手跨過另一隻手去抓點。" },
  {
    term: "Lock-off",
    zh: "鎖手",
    def: "彎著手臂撐住位置，讓另一隻手去抓下一顆。",
  },
  { term: "Palm press", zh: "掌壓", def: "用手掌往下推壓岩點或牆面。" },
  {
    term: "Layback",
    zh: "側拉對抗",
    def: "手往外拉、腳往反方向推，靠對抗的力量移動。",
  },
];

const feet: GlossaryTerm[] = [
  { term: "Footwork", zh: "腳法", def: "選腳點、踩點和移動腳的技巧。" },
  { term: "Edging", zh: "踩邊", def: "用岩鞋的內側或外側邊緣踩住腳點。" },
  {
    term: "Smearing",
    zh: "摩擦踩點",
    def: "沒有明顯腳點時，靠鞋底和牆面的摩擦撐住。",
  },
  { term: "Foot swap", zh: "換腳", def: "同一個腳點，從一隻腳換成另一隻腳。" },
  {
    term: "Backstep",
    zh: "外側踩",
    def: "用鞋子外側踩點、轉動身體，改變站法。",
  },
  {
    term: "Flag",
    zh: "掛旗、伸腿平衡",
    def: "把一隻腳伸出去當配重，不讓身體轉開。",
  },
  {
    term: "Drop knee",
    zh: "落膝",
    def: "轉髖、讓一側膝蓋往內往下，把重心拉近牆。不是硬把膝蓋扭下去。",
  },
  { term: "High step", zh: "高踩", def: "把腳抬到很高的腳點。" },
  {
    term: "Rock-over",
    zh: "移重心站上",
    def: "把身體重心移到高腳上，再站起來。",
  },
  {
    term: "Heel hook",
    zh: "勾腳跟",
    def: "用腳跟勾住岩點，幫忙拉住或穩住身體。",
  },
  { term: "Toe hook", zh: "勾腳尖", def: "用鞋頭上方勾住岩點。" },
  {
    term: "Bicycle",
    zh: "腳對夾",
    def: "一腳推、一腳勾，用相反的力量夾住岩點。",
  },
  {
    term: "Knee bar",
    zh: "卡膝",
    def: "用腳和膝蓋附近的對抗壓力，把身體卡住。",
  },
  {
    term: "Stemming",
    zh: "撐開",
    def: "手腳往不同的牆面推，靠對抗的力量撐住，常見於內角。",
  },
  {
    term: "Mantle",
    zh: "撐上",
    def: "像從游泳池爬上岸，用手推起身體，把重心移到平台上。",
  },
];

const dynamic: GlossaryTerm[] = [
  {
    term: "Static",
    zh: "靜態動作",
    def: "主要靠穩定支撐和控制移動，不太借衝力。",
  },
  {
    term: "Dynamic",
    zh: "動態動作",
    def: "利用身體的動量移動，不一定四肢都離開牆。",
  },
  {
    term: "Dyno",
    zh: "跳點、飛點",
    def: "跳向下一顆岩點，會短暫離開原本的支點。",
  },
  {
    term: "Deadpoint",
    zh: "死點出手",
    def: "趁身體往上到最高點、快要停住的那一瞬間去抓點。",
  },
  {
    term: "Coordination",
    zh: "協調動作",
    def: "要精準配合手、腳、時機和動量的連續動作，比賽很常見。",
  },
  { term: "Campus", zh: "純手爬", def: "不用腳，只靠雙手在岩點間移動。" },
  {
    term: "Cut feet",
    zh: "甩腳、腳離點",
    def: "雙腳離開支點，身體由手吊著。不一定是失誤，有些動作本來就要放腳。",
  },
  {
    term: "Barn door",
    zh: "開門",
    def: "身體像門片一樣往側邊轉開，通常是支點和重心沒有對齊。",
  },
  {
    term: "Body tension",
    zh: "身體張力",
    def: "軀幹和四肢一起出力，讓腳不會從點上掉下來。",
  },
  { term: "Compression", zh: "夾抱", def: "雙手或四肢往內夾住地形或岩點。" },
];

const style: GlossaryTerm[] = [
  {
    term: "Slab",
    zh: "俯角牆",
    def: "牆頂往後退、比垂直還「躺」，考驗平衡和踩點。",
  },
  { term: "Vertical", zh: "垂直牆", def: "大致和地面垂直。" },
  {
    term: "Overhang",
    zh: "仰角牆",
    def: "牆頂往攀爬者突出，身體容易懸在牆下。",
  },
  { term: "Roof", zh: "屋簷", def: "接近水平、要在下方攀爬的地形。" },
  { term: "Arête", zh: "外角", def: "兩面牆向外形成的稜邊。" },
  { term: "Dihedral", zh: "內角", def: "兩面牆向內交會形成的角落。" },
  { term: "Traverse", zh: "橫移", def: "主要往側邊移動的路線或動作。" },
  { term: "Technical", zh: "技術型", def: "腳法、姿勢和重心特別重要。" },
  { term: "Powerful", zh: "力量型", def: "很吃力量或全身出力。" },
  { term: "Balancey", zh: "平衡型", def: "主要挑戰是重心和平衡。" },
  { term: "Reachy", zh: "長距離", def: "點和點之間很遠，很吃手長或身高。" },
];

const training: GlossaryTerm[] = [
  { term: "Warm-up", zh: "暖身", def: "慢慢讓身體和動作進入狀況。" },
  {
    term: "Volume（訓練量）",
    zh: "訓練量",
    def: "完成的攀爬總量。跟地形點的 volume 同一個字，意思不同。",
  },
  {
    term: "Limit bouldering",
    zh: "極限抱石",
    def: "嘗試接近自己能力上限的短路線或動作。",
  },
  {
    term: "Power endurance",
    zh: "力量耐力",
    def: "連續完成高強度動作的能力。",
  },
  {
    term: "Hangboard",
    zh: "指力板",
    def: "有各種邊緣的懸吊訓練器材。新手不急著練。",
  },
  {
    term: "Campus board",
    zh: "Campus 板",
    def: "裝有橫條的板子，練上肢力量和動態。負擔大，新手先別碰。",
  },
  {
    term: "Spray wall",
    zh: "密集岩點牆",
    def: "岩點很密的牆，可以自己組合路線。",
  },
  {
    term: "Board climbing",
    zh: "訓練板",
    def: "在固定配置的訓練板上爬，例如 MoonBoard、Kilter Board，用 App 選線。",
  },
  {
    term: "Benchmark",
    zh: "基準路線",
    def: "訓練板上被選出來、拿來參考難度的路線。",
  },
];

const gear: GlossaryTerm[] = [
  {
    term: "Climbing shoes",
    zh: "岩鞋",
    def: "用特殊橡膠和鞋型，幫助踩點和勾點的鞋。",
  },
  {
    term: "Downturn",
    zh: "下彎",
    def: "鞋頭往下彎的程度，越彎越適合仰角和勾腳。",
  },
  { term: "Resole", zh: "換底", def: "更換磨壞的岩鞋鞋底橡膠。" },
  {
    term: "Chalk",
    zh: "止滑粉、鎂粉",
    def: "吸手汗用的粉，主要成分通常是碳酸鎂。",
  },
  {
    term: "Liquid chalk",
    zh: "液態粉",
    def: "用酒精等液體混合的止滑粉，抹上後會乾。",
  },
  { term: "Chalk bucket", zh: "粉桶", def: "放在地上的大粉袋，抱石常見。" },
  { term: "Brush", zh: "刷點", def: "用刷子清掉岩點上多餘的粉和髒污。" },
  { term: "Crash pad", zh: "抱石墊", def: "戶外抱石用的可攜式軟墊。" },
  { term: "Pumped", zh: "爆手、前臂脹", def: "前臂又脹又緊，開始抓不住。" },
  { term: "Flapper", zh: "翻皮", def: "手皮磨破或撕開，留下一片掀起來的皮。" },
  {
    term: "Spotter",
    zh: "保護者",
    def: "戶外抱石時協助引導落地方向的人，不是徒手接住整個人。",
  },
  {
    term: "Landing zone",
    zh: "落地區",
    def: "攀爬者可能落下的範圍，要保持淨空。",
  },
];

const community: GlossaryTerm[] = [
  { term: "Setter", zh: "定線員", def: "設計岩點配置、動作和路線的人。" },
  { term: "Reset", zh: "換線", def: "拆掉一區原本的路線，重新定線。" },
  { term: "Forerunning", zh: "試爬", def: "定線時先試爬，調整動作和難度。" },
  {
    term: "Comp-style",
    zh: "比賽風格",
    def: "協調動作、平衡和地形點比較多的定線風格。",
  },
  {
    term: "Beta break",
    zh: "破解",
    def: "用定線員沒預期的方式完成。有不有效，看路線規則。",
  },
  {
    term: "Beta spraying",
    zh: "沒人問就報 beta",
    def: "對方沒問，就一直告訴他應該怎麼爬。",
  },
  { term: "Tick", zh: "打勾、完攀紀錄", def: "記下完成過或想完成的路線。" },
  { term: "Crag", zh: "岩場", def: "戶外攀岩的地點。" },
  { term: "Topo", zh: "路線圖", def: "標出路線位置和走向的示意圖。" },
  {
    term: "Highball",
    zh: "高抱石",
    def: "很高、摔下來後果明顯更嚴重的抱石，沒有統一的高度界線。",
  },
  {
    term: "Conditions",
    zh: "條件",
    def: "溫度、濕度和岩面狀態對攀爬的影響，戶外常說 condi。",
  },
];

const firstTwelve = [
  "Beta",
  "Project",
  "Send",
  "Flash",
  "Crux",
  "Match",
  "Jug",
  "Crimp",
  "Sloper",
  "Slab",
  "Overhang",
  "Dyno",
];

const all = [
  ...routes,
  ...sends,
  ...grades,
  ...rules,
  ...holds,
  ...grips,
  ...feet,
  ...dynamic,
  ...style,
  ...training,
  ...gear,
  ...community,
];

export const boulderingTerms: Article = {
  slug: "bouldering-terms",
  category: "routes",
  title: "Beta、Flash、Send、Project 是什麼？岩館常見術語",
  seoTitle:
    "Beta 是什麼意思？抱石術語大全：Flash、Send、Project 與岩館常見用語",
  description:
    "Beta 是什麼意思？Flash、Send、Project、Crux 又是什麼？一次整理 130 多個抱石術語：英文、常見中文和白話解釋，還有岩館對話翻譯，聽懂岩友在說什麼。",
  keywords: [
    "抱石術語",
    "beta 意思",
    "攀岩術語",
    "flash 攀岩",
    "send 攀岩",
    "project 攀岩",
    "crux",
    "dyno",
  ],
  cover: {
    art: "terms",
    alt: "插畫：岩友的聊天泡泡，寫著「這條 beta 是？」「先 flag 再並手」「我的 project 卡在 crux」「Send！」",
  },
  publishedAt: "2026-10-17",
  updatedAt: "2026-10-17",
  summary: [
    "Beta 是一條路線「怎麼爬」的資訊：腳踩哪、動作順序、重心放哪。想要別人的 beta，先問一聲最有禮貌。",
    "Project 是你正在練的路線，Crux 是最難的那一步，Send 是完攀，Flash 是第一次嘗試就完攀。",
    "先認識 Beta、Project、Send、Flash、Crux、Match、Jug、Crimp、Sloper、Slab、Overhang、Dyno，就能聽懂大半岩友對話。",
    "中文譯名沒有統一，同一個動作在不同館可能有不同叫法；規則還是以各館標示為準。",
  ],
  sections: [
    {
      id: "what-is-beta",
      title: "Beta 是什麼意思？",
      body: (
        <>
          <p>
            <strong>Beta 是一條路線「怎麼爬」的資訊</strong>
            ：哪隻腳踩哪個點、手的順序、在哪裡轉身、重心要放哪。岩友說「這條的
            beta 是先勾腳跟再並手」，就是在分享解法。
          </p>
          <p>
            這個詞一般認為來自 1980 年代美國的攀岩者 Jack Mileski，和當時的
            Betamax
            錄影帶有關：有一說是他把攀爬過程錄下來給朋友看，另一說是一句玩笑話，說法不一。
          </p>
          <p>
            Beta 沒有標準答案。身高、臂展、柔軟度不同，最適合的 beta
            也不同，看別人爬可以參考，但不用照抄。
          </p>
          <h3>怎麼跟別人要 beta？</h3>
          <ul>
            <li>
              <strong>想要提示</strong>
              ：直接問「這步你怎麼過的？」或「可以給我一點 beta 嗎？」
            </li>
            <li>
              <strong>想自己解</strong>
              ：先說「我想自己試試看，卡住再問你」，大家都懂。
            </li>
            <li>
              <strong>想給別人 beta</strong>
              ：先問一句「要不要 beta？」對方說好再講。沒人問就一直講解法，叫做{" "}
              <Link href={`#${termId("Beta spraying")}`}>beta spraying</Link>
              ，很多人不喜歡。
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "first-twelve",
      title: "先認識這 12 個，就能聽懂大半對話",
      body: (
        <>
          <p>點一下就會跳到那個術語的解釋：</p>
          <ul className="not-prose my-6 flex flex-wrap gap-2.5">
            {firstTwelve.map((t) => (
              <li key={t}>
                <Link
                  className="inline-flex h-10 items-center rounded-full border border-line bg-ink-2 px-4 text-[15px] font-bold text-cream transition-colors hover:border-lime hover:text-lime"
                  href={`#${termId(t)}`}
                >
                  {t}
                </Link>
              </li>
            ))}
          </ul>
          <p>
            Beta 是資訊，Crux 是難關，Project
            是你正在努力的目標，這三個詞常常出現在同一句話裡：「我的 project
            卡在 crux，有人有 beta 嗎？」
          </p>
          <Callout tone="note">
            <p>
              中文譯名沒有完全統一，同一個動作在不同岩館可能有不同叫法。下面的中文是常見說法，聽到不一樣的叫法也很正常。
            </p>
          </Callout>
        </>
      ),
    },
    {
      id: "routes-and-attempts",
      title: "路線與嘗試：Problem、Crux、Project、Send",
      body: <Glossary terms={routes} />,
    },
    {
      id: "sends",
      title: "完攀的不同說法：Flash、Onsight、Redpoint",
      body: (
        <>
          <Glossary terms={sends} />
          <p>幾個容易搞混的地方：</p>
          <ul>
            <li>
              <strong>Flash 不等於沒看過解法</strong>
              ：看過影片或別人爬，第一次上牆就成功，仍然是 flash。
            </li>
            <li>
              <strong>FA 不是你個人第一次爬完</strong>：你第一次完成，說 send。
            </li>
            <li>
              <strong>Top 不一定要翻頂</strong>
              ：多數室內路線是雙手穩穩抓住終點就算完成。
            </li>
          </ul>
          <p>
            抱石日常最常聽到的是 flash 和 send；onsight、redpoint
            比較常在上攀出現。
          </p>
        </>
      ),
    },
    {
      id: "grades",
      title: "難度與級數：V0、Sandbag、Soft",
      body: (
        <>
          <Glossary terms={grades} />
          <p>
            級數有主觀成分，各館的顏色也沒有統一對照。V 級和顏色怎麼看，可以讀
            <A href="/articles/bouldering-grades">抱石 V0、V1 是什麼</A>。
          </p>
        </>
      ),
    },
    {
      id: "starts-and-rules",
      title: "起點、終點與規則：SDS、Dab、Downclimb",
      body: (
        <>
          <Glossary terms={rules} />
          <p>
            終點要不要雙手、牆面和地形點能不能用，都看路線規定；沒有適用所有岩館的「摸三秒就算」規則。圖解在
            <A href="/articles/how-to-read-bouldering-routes">抱石路線怎麼看</A>
            。
          </p>
        </>
      ),
    },
    {
      id: "holds",
      title: "岩點名稱：Jug、Crimp、Sloper、Pinch",
      body: (
        <>
          <Glossary terms={holds} />
          <p>
            這些分類不互斥。一顆岩點可以同時是 pinch 的形狀，又用 sidepull
            的方向去抓。每種岩點長什麼樣、怎麼抓，看
            <A href="/articles/bouldering-holds">抱石岩點種類圖解</A>。
          </p>
        </>
      ),
    },
    {
      id: "grips",
      title: "抓法與手部動作：Match、Crimp、Lock-off",
      body: (
        <>
          <Glossary terms={grips} />
          <p>
            Crimp 同時可以指岩點和抓法：「這條很多 crimp」是說小點很多；「用
            half crimp 抓」是在講手指的姿勢。
          </p>
        </>
      ),
    },
    {
      id: "footwork",
      title: "腳法與重心：Smearing、Flag、Heel hook、Mantle",
      body: (
        <>
          <Glossary terms={feet} />
          <p>
            這些名詞是在描述動作，實際姿勢要配合岩點方向和自己的活動範圍。不同牆型怎麼用腳，在
            <A href="/articles/bouldering-wall-angles">抱石牆型圖解</A>
            有更多說明。
          </p>
        </>
      ),
    },
    {
      id: "dynamic",
      title: "動態與身體控制：Dyno、Deadpoint、開門",
      body: (
        <>
          <Glossary terms={dynamic} />
          <p>
            <strong>Dynamic 不等於 dyno</strong>
            ：動態動作只是借了身體的衝力，dyno 才是真的跳過去。
          </p>
        </>
      ),
    },
    {
      id: "walls-and-styles",
      title: "牆型與路線風格：Slab、Overhang、Technical",
      body: (
        <>
          <Glossary terms={style} />
          <p>
            Slab、overhang 是牆型；technical、powerful
            是風格。所以一條線可以同時是「仰角＋技術型」。
          </p>
        </>
      ),
    },
    {
      id: "training",
      title: "訓練用語：Hangboard、MoonBoard、Spray wall",
      body: (
        <>
          <Glossary terms={training} />
          <Callout tone="safety">
            <p>
              這裡只是介紹名詞，不代表新手要開始做指力板或 campus
              板訓練。手指的肌腱需要時間適應，前幾個月先好好爬就夠了。
            </p>
          </Callout>
        </>
      ),
    },
    {
      id: "gear",
      title: "裝備與身體狀態：Chalk、Pumped、Flapper",
      body: <Glossary terms={gear} />,
    },
    {
      id: "community",
      title: "岩館與社群：Setter、Reset、Beta spraying",
      body: (
        <>
          <Glossary terms={community} />
          <p>
            Beta break 不一定是作弊；beta spraying
            則是社交禮貌的問題。想分享解法前，先問一句「你要不要
            beta？」就很好用。
          </p>
        </>
      ),
    },
    {
      id: "gym-talk",
      title: "岩館對話翻譯：這些話是什麼意思？",
      body: (
        <>
          <p>把術語放回岩館的對話裡，就會變成這樣：</p>
          <GymTalk
            lines={[
              {
                say: "這條 beta 是先勾腳跟，再並手。",
                means: "先用腳跟勾住岩點，再讓雙手放到同一顆點上。",
              },
              {
                say: "我昨天終於 send 那條 project！",
                means: "我終於完成那條一直在練的路線。",
              },
              {
                say: "這條 flash，下一條卡在 crux。",
                means: "這條第一次就完成，下一條卡在最難的那一步。",
              },
              {
                say: "右腳 flag，不然會開門。",
                means: "右腳伸出去平衡，不然身體會往側邊轉開。",
              },
              {
                say: "這顆是 sloper，不要一直想摳它。",
                means: "這顆要靠摩擦和身體位置，沒有邊可以扣。",
              },
              {
                say: "前面都可以，最後 mantle 上不去。",
                means: "前段都能完成，但最後撐上平台的動作做不到。",
              },
              {
                say: "今天不拚級數，爬點 volume。",
                means: "今天主要累積攀爬量，不挑戰難的路線。",
              },
            ]}
          />
          <p>
            聽不懂的時候，直接問「那是什麼意思？」岩友大多很樂意解釋。把你的
            project、flash 和 send 記下來，VARO 會幫你看見自己一路的進步。
          </p>
        </>
      ),
    },
  ],
  faq: [
    {
      q: "攀岩的 beta 是什麼意思？",
      a: "Beta 是一條路線怎麼爬的資訊，包括腳踩哪裡、手的順序和重心位置。每個人身形不同，適合的 beta 也不同，別人的 beta 可以參考，不用照抄。",
    },
    {
      q: "Flash 和 Onsight 差在哪？",
      a: "兩個都是第一次嘗試就完攀。Flash 可以事先看別人爬或聽 beta；onsight 則是完全沒有事先取得解法，只靠自己在地面讀線。",
    },
    {
      q: "Send 是什麼意思？",
      a: "Send 就是完攀：照路線規則從起點完成到終點。不管第幾次嘗試成功都可以說 send，第一次就成功則特別叫 flash。",
    },
    {
      q: "Project 是什麼？",
      a: "Project 是你還沒完成、想持續練習的路線。「這條是我的 project」代表你打算反覆研究它，直到完攀。",
    },
    {
      q: "Crux 是什麼意思？",
      a: "Crux 是一條路線最難的那一步或那一段。很多人會說「卡在 crux」，就是前面都會，只差最難的那個動作。",
    },
    {
      q: "Dyno 是什麼？跟動態動作一樣嗎？",
      a: "Dyno 是跳向下一顆岩點、短暫離開原本支點的動作。動態動作是借身體的衝力移動，不一定要跳，所以 dyno 是動態動作的一種。",
    },
    {
      q: "什麼是 beta spraying？",
      a: "對方沒有問，就一直告訴他應該怎麼爬，叫 beta spraying。很多人想自己解題，想分享前先問一句「要不要 beta？」比較有禮貌。",
    },
    {
      q: "Sandbag 是什麼意思？",
      a: "Sandbag 是說一條路線的級數給得太低，實際爬起來比標示難很多，帶點調侃的意味。反過來覺得比標示簡單，就說 soft。",
    },
  ],
  sources: [
    {
      label: "Wikipedia：Beta (climbing)（字源）",
      url: "https://en.wikipedia.org/wiki/Beta_(climbing)",
    },
    {
      label: "REI：Rock Climbing Terms & Lingo Guide",
      url: "https://www.rei.com/learn/expert-advice/rock-climbing-glossary.html",
    },
    {
      label: "REI：Rock Climbing Techniques & Moves",
      url: "https://www.rei.com/learn/expert-advice/climbing-techniques.html",
    },
    {
      label: "BMC：Indoor bouldering – the lowdown",
      url: "https://www.thebmc.co.uk/en/indoor-bouldering-the-lowdown",
    },
    {
      label: "World Climbing（IFSC）：競賽規則",
      url: "https://www1.ifsc-climbing.org/resources/competitions",
    },
    {
      label: "Lattice Training：訓練相關用語與指力訓練",
      url: "https://latticetraining.com/blog/",
    },
  ],
  glossary: all,
  related: ["how-to-read-bouldering-routes", "bouldering-grades"],
};
