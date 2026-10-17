import type { Article } from "../types";

import { A, Callout, CompareTable, Steps } from "@/components/articles/blocks";
import { WallAngles } from "@/components/articles/diagrams";

export const boulderingWallAngles: Article = {
  slug: "bouldering-wall-angles",
  category: "routes",
  title: "Slab、垂直牆、Overhang 差在哪？抱石牆型圖解",
  seoTitle: "Slab 是什麼？抱石牆型圖解：俯角、垂直牆、仰角 Overhang 怎麼爬",
  description:
    "Slab 是什麼？俯角、垂直牆、仰角 overhang 和屋簷差在哪？用側面圖看懂抱石牆型，學會每種牆的腳法與重心，以及新手該先爬哪一種。",
  keywords: [
    "抱石牆型",
    "slab 是什麼",
    "overhang",
    "俯角",
    "仰角",
    "垂直牆",
    "屋簷 roof",
    "外角 arete",
    "內角",
  ],
  cover: {
    src: "/shots/climb-3.jpg",
    alt: "攀岩者在往外傾的仰角牆上，手抓橘色岩點、身體懸在牆下",
    width: 900,
    height: 1125,
  },
  publishedAt: "2026-10-17",
  updatedAt: "2026-10-17",
  summary: [
    "Slab（俯角）往後倒，像斜坡；垂直牆筆直向上；Overhang（仰角）往你頭上倒；屋簷接近水平的天花板。",
    "Slab 靠腳和重心：看準腳點、先移重心再站高。垂直牆練用腳推身體上去。",
    "Overhang 要手腳一起出力：腳持續踩住、轉髖讓身體靠牆，進階會用到勾腳跟和勾腳尖。",
    "新手先找大點、好往下爬的 slab 或垂直牆，再試簡單的輕仰角；牆型不是難度排名。",
  ],
  sections: [
    {
      id: "angles",
      title: "抱石牆型怎麼分？從側面看牆往哪裡倒",
      body: (
        <>
          <p>
            同樣是入門路線，這條站得很穩，那條才爬兩步手就快沒力？除了岩點大小，
            <strong>牆的角度也會改變身體出力的方式</strong>。
          </p>
          <p>
            從側面看就很好分：牆頂往後退的是
            slab，筆直向上的是垂直牆，牆頂往你頭上伸出來的是 overhang。
          </p>
          <WallAngles />
          <CompareTable
            caption="抱石牆型對照"
            head={["牆型", "中文說法", "看起來", "主要在練"]}
            rows={[
              ["Slab", "俯角牆、內傾", "像斜坡，牆往後倒", "平衡、腳底施力"],
              ["Vertical", "垂直牆", "筆直向上", "踩點、移重心"],
              ["Overhang", "仰角牆、外傾", "牆往頭上突出", "手腳配合、核心"],
              ["Roof", "屋簷、天花板", "接近水平，人在下面", "身體張力、勾腳"],
            ]}
          />
          <h3>為什麼「仰角 30 度」也可能寫成 120 度？</h3>
          <p>
            角度有兩種講法。從地面量起，垂直是 90 度，slab 小於 90 度、overhang
            大於 90 度；很多岩館和訓練板則是把<strong>垂直當成 0 度</strong>
            ，說「仰角 30 度」就是比垂直多傾 30 度，等於從地面量的 120
            度。看到數字時，先確認是用哪一種基準。
          </p>
        </>
      ),
    },
    {
      id: "slab",
      title: "Slab 是什麼？俯角牆先練站穩",
      body: (
        <>
          <p>
            Slab
            是比垂直更「躺」的牆，牆頂往後退。腳可以承擔比較多重量，但手點少、腳點小的時候，非常考驗平衡。它適合練「怎麼站」，不代表每條都簡單。
          </p>
          <Steps
            items={[
              {
                title: "看準腳點再踩",
                body: <p>眼睛跟著腳，直到鞋底放穩才移開。</p>,
              },
              {
                title: "先移重心",
                body: (
                  <p>下一步要用右腳站起來，就先把屁股慢慢移到右腳正上方。</p>
                ),
              },
              {
                title: "用腿站高，再移手",
                body: <p>感覺像踩上一階樓梯，腿推上去之後，手再往上找點。</p>,
              },
              {
                title: "步伐小一點",
                body: <p>不必一次跨很高，小步比較容易控制。</p>,
              },
            ]}
          />
          <p>
            沒有明顯腳點時，會用到<strong>摩擦踩點（smearing）</strong>
            ：用前腳掌的鞋底壓住牆面，靠摩擦力撐住。腳跟稍微放低通常比較貼得住，但踩小邊緣時腳踝角度不同，別把「腳跟越低越好」當成通則。
          </p>
          <Callout title="在 slab 上，身體不一定要貼牆" tone="tip">
            <p>
              胸口和屁股一直往牆上壓，重心反而會離開腳底。目標是讓重量落在腳上，屁股和牆的距離要跟著動作調整。
            </p>
          </Callout>
        </>
      ),
    },
    {
      id: "vertical",
      title: "垂直牆怎麼爬？讓腳把身體推上去",
      body: (
        <>
          <p>
            垂直牆最適合檢查自己是不是一直在用手拉。先挑大點的路線，把每一步拆成：
          </p>
          <ol>
            <li>找下一個腳點。</li>
            <li>用鞋尖準確踩住。</li>
            <li>移動屁股，讓這隻腳開始承重。</li>
            <li>用腿推身體，再伸手抓下一顆點。</li>
          </ol>
          <p>
            站穩時，手臂可以打直、像掛在岩點上，減少一直彎著手吊住的負擔。要往側邊移動時，試著轉髖，讓一側的屁股靠近牆面。
          </p>
          <p>
            一個好用的小練習是「安靜踩點」：讓鞋子輕輕落在目標位置，少踢牆、少在點上磨來磨去。慢一點沒關係，先把每一步踩清楚。
          </p>
        </>
      ),
    },
    {
      id: "overhang",
      title: "Overhang 仰角怎麼爬？手腳一起出力",
      body: (
        <>
          <p>
            仰角會讓身體一直被往外拉，腳一鬆，手就會突然吃下更多重量。所以爬
            overhang
            要注意肚子、背、屁股、腿和腳一起配合。先從大點、腳點清楚的輕仰角開始：
          </p>
          <ul>
            <li>
              <strong>腳持續施力</strong>
              ：踩到點之後繼續推住或勾住，不是碰到就好。
            </li>
            <li>
              <strong>移手前先穩住身體</strong>
              ：避免屁股突然往下掉，連帶讓腳滑掉。
            </li>
            <li>
              <strong>試著側身</strong>
              ：合適時轉髖，讓身體離牆近一點，比較省力。
            </li>
            <li>
              <strong>先看下一步腳</strong>：伸手之前，想好腳接下來要去哪裡。
            </li>
          </ul>
          <h3>勾腳跟和勾腳尖</h3>
          <p>兩種都是讓腳也幫忙「拉住」身體：</p>
          <ul>
            <li>
              <strong>勾腳跟（heel hook）</strong>
              ：用鞋跟掛住岩點或邊緣，幫忙把身體拉近、穩住。
            </li>
            <li>
              <strong>勾腳尖（toe hook）</strong>
              ：用鞋頭上方的橡膠勾住岩點，抵抗身體擺盪或往外翻。
            </li>
          </ul>
          <p>
            新手先請教練在低處示範，別急著做很高的勾腳或用力猛拉；落地前如果腳還勾著，也會影響落地的方向。
          </p>
        </>
      ),
    },
    {
      id: "shapes",
      title: "屋簷、外角、內角和凸牆怎麼認？",
      body: (
        <>
          <p>
            <strong>屋簷（roof）</strong>
            像天花板，人在接近水平的牆面下方爬。可以把它想成非常斜的仰角，通常更需要安排腳步、控制身體擺動，剛開始不用急著挑戰。
          </p>
          <p>另外三個詞描述的是形狀，不是角度：</p>
          <ul>
            <li>
              <strong>外角（arete）</strong>
              ：兩面牆向外形成的稜邊，像建築物的外轉角。常需要側拉、左右換邊。
            </li>
            <li>
              <strong>內角（dihedral）</strong>
              ：兩面牆向內交會，像打開的書。可以用雙腳往兩側推撐。
            </li>
            <li>
              <strong>凸牆</strong>
              ：往外鼓起的牆面，沒有固定角度，也不等於外角。
            </li>
          </ul>
          <p>
            所以同一條路線可以同時是「仰角＋外角」。外角、牆邊和地形點能不能用，各館、各路線不同，看標示或問館員；細節可以看
            <A href="/articles/how-to-read-bouldering-routes">抱石路線怎麼看</A>
            。
          </p>
        </>
      ),
    },
    {
      id: "where-to-start",
      title: "新手先爬哪一種？一次去岩館的練習順序",
      body: (
        <>
          <p>
            前幾次抱石，建議先找
            <strong>大點、步距適中、好往下爬的 slab 或垂直牆</strong>
            ，再試簡單的輕仰角。這是練習順序，不是一定要過的關卡；小點的 slab
            也可能比大點的輕仰角更難。
          </p>
          <Steps
            items={[
              {
                title: "暖身，複習落地",
                body: <p>請館員確認往下爬的方式，從低處開始。</p>,
              },
              {
                title: "選兩條簡單的線",
                body: <p>一條練安靜踩點，一條練先移重心再伸手。</p>,
              },
              {
                title: "試一條輕仰角",
                body: <p>只觀察腳能不能一直踩住，不要求完攀。</p>,
              },
              {
                title: "休息後重爬",
                body: <p>比比看是不是少補一次腳、少硬拉一次。</p>,
              },
            ]}
          />
          <p>
            同一級的路線換了牆型，感覺不同很正常，級數要怎麼看，可以參考
            <A href="/articles/bouldering-grades">抱石 V0、V1 是什麼</A>。
          </p>
        </>
      ),
    },
    {
      id: "safety",
      title: "不同牆型要注意什麼？",
      body: (
        <>
          <p>下面整理的是要留意的狀況，不是哪種牆比較危險的排名。</p>
          <CompareTable
            caption="不同牆型的注意事項"
            head={["牆型／動作", "要留意", "怎麼做"]}
            rows={[
              [
                "Slab",
                "滑下來時小腿、膝蓋擦到牆或岩點",
                "先在低處練，上牆前看好往下爬的路",
              ],
              [
                "垂直牆",
                "落地不穩扭到腳踝、膝蓋；用手撐地傷到手腕",
                "還有力氣時就往下爬，落地動作請館員教",
              ],
              [
                "仰角、屋簷",
                "腳滑掉後身體擺盪，肩膀和手指突然吃力",
                "手腳失控前就下來休息，不要累了硬撐",
              ],
              [
                "勾腳、轉髖",
                "用力拉或扭太大，膝蓋和大腿後側負擔大",
                "從輕的開始練，痛就停",
              ],
            ]}
          />
          <p>
            每次上牆前，確認落地區沒有人或東西，也避開和別人交錯的路線。出現尖銳疼痛就停下；如果腫脹、活動受限或無法承重，應該就醫評估。
          </p>
        </>
      ),
    },
    {
      id: "shoes",
      title: "比賽常見哪些牆型？岩鞋要怎麼選？",
      body: (
        <>
          <p>
            抱石比賽會同時用到
            slab、垂直、仰角和地形點，考驗平衡、力量和協調，不是只有大仰角和跳躍動作。
          </p>
          <p>挑岩鞋可以先知道這三個方向：</p>
          <ul>
            <li>
              <strong>Slab、摩擦踩點</strong>：鞋底能不能順著斜面貼住。
            </li>
            <li>
              <strong>垂直牆、小腳點</strong>：鞋尖準不準、踩小邊撐不撐得住。
            </li>
            <li>
              <strong>仰角、勾腳</strong>
              ：下彎的鞋型、貼合的後跟和鞋面橡膠會有幫助。
            </li>
          </ul>
          <p>
            但第一雙鞋還是以<strong>合腳、穩定、不會痛</strong>
            為優先，不用依牆型各買一雙，也不用為了仰角馬上換最激進的鞋款。下次去岩館，先退一步看牆頂往哪裡倒，再挑一條適合自己的線。
          </p>
        </>
      ),
    },
  ],
  faq: [
    {
      q: "Slab 是什麼？跟垂直牆差在哪？",
      a: "Slab 是比垂直更平緩、牆頂往後退的牆，中文常叫俯角牆，從地面量小於 90 度。垂直牆是 90 度。兩種都需要腳法，但 slab 更講究平衡和移重心。",
    },
    {
      q: "俯角、平板、內傾都是 slab 嗎？",
      a: "俯角、內傾常用來說 slab，也有人叫平板。不過「平板」有時只是在形容牆面平整，不是全台統一的說法，看牆往哪邊倒最準。",
    },
    {
      q: "Overhang 是什麼？仰角 30 度怎麼算？",
      a: "Overhang 是往攀爬者突出、超過垂直的牆，也叫仰角或外傾。「仰角 30 度」通常是從垂直算起多傾 30 度，換成從地面量就是 120 度。",
    },
    {
      q: "新手應該先爬 slab 還是垂直牆？",
      a: "大點、步距適中、好往下爬的 slab 或垂直牆都可以先試。選線要看整體難度和落地環境，小點的 slab 不一定比大點的輕仰角簡單。",
    },
    {
      q: "爬仰角一定要很有力，或會勾腳嗎？",
      a: "仰角通常比較吃手和核心，但腳一直踩住、轉髖也能省很多力。簡單的仰角不一定要勾腳，先學穩定踩點，再在教練指導下練勾腳跟和勾腳尖。",
    },
    {
      q: "抱石時，身體越貼牆越好嗎？",
      a: "不一定。垂直牆和仰角適時讓屁股靠牆，可以減少手的負擔；slab 則更重視重量有沒有落在腳上。身體和牆的距離要跟著動作調整。",
    },
    {
      q: "屋簷、外角和凸牆是同一種牆嗎？",
      a: "不是。屋簷是接近水平、人在下面爬的牆面；外角是兩面牆向外形成的稜邊；凸牆是往外鼓起的形狀。它們可能出現在同一條路線上。",
    },
    {
      q: "爬 slab 和仰角，需要不同的岩鞋嗎？",
      a: "不同鞋型各有擅長，但新手不用依牆型買很多雙。先選合腳、不痛、後跟穩的鞋，等經驗多了，再依摩擦、小點或勾腳的需求挑選。",
    },
  ],
  sources: [
    {
      label: "REI：Rock Climbing Techniques & Moves（踩點、摩擦踩點、轉髖）",
      url: "https://www.rei.com/learn/expert-advice/climbing-techniques.html",
    },
    {
      label: "REI：How to Choose Rock Climbing Shoes",
      url: "https://www.rei.com/learn/expert-advice/rock-shoes.html",
    },
    {
      label: "REI：Rock Climbing Glossary（內角、外角等術語）",
      url: "https://www.rei.com/learn/expert-advice/rock-climbing-glossary.html",
    },
    {
      label: "BMC：FUNdamentals of Climbing（重心、髖部位置與腳法）",
      url: "https://services.thebmc.co.uk/media/files/Skills/FUNdamentals%20Docs/FUNdamentals%201%2C%202%20and%203%20-%20Guidance%20Notes.pdf",
    },
    {
      label: "BMC：Climbing Injury Symposium 2018 Report（勾腳與下肢負荷）",
      url: "https://services.thebmc.co.uk/bmc-climbing-injury-symposium-2018-report",
    },
    {
      label: "Climbing：Tips for slabs from Hazel Findlay",
      url: "https://www.climbing.com/skills/friction-slabs-tips-from-hazel-findlay/",
    },
    {
      label: "World Climbing（IFSC）：比賽牆面規格",
      url: "https://images.ifsc-climbing.org/ifsc/image/private/t_q_good/prd/zyoowsp9iiywlszflw99.pdf",
    },
    {
      label: "原岩攀岩館：安全守則與個人責任聲明",
      url: "https://tupclimbing.tw/terms-and-conditions/76",
    },
  ],
  related: ["how-to-read-bouldering-routes", "bouldering-grades"],
};
