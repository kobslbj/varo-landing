import type { Article } from "../types";

import { A, Callout, CompareTable, Steps } from "@/components/articles/blocks";
import { ColorCircuit, GradeLadder } from "@/components/articles/diagrams";
import { holdColors } from "@/components/landing/ui";

export const boulderingGrades: Article = {
  slug: "bouldering-grades",
  category: "routes",
  title: "抱石 V0、V1 是什麼？難度分級與顏色怎麼看",
  seoTitle: "抱石等級 V0、V1 是什麼？抱石難度分級、顏色與 Font 對照表",
  description:
    "抱石 V0、V1 代表什麼？VB 是什麼、哪個顏色最簡單、V 級和 Font 怎麼對照？一篇看懂抱石等級與色票，新手從哪一級開始、怎麼看見自己的進步。",
  keywords: [
    "抱石等級",
    "抱石顏色",
    "抱石 V 級數",
    "抱石 V0",
    "VB",
    "Font 分級",
    "抱石難度",
    "抱石色票",
  ],
  cover: {
    art: "grades",
    alt: "插畫：六顆不同顏色的岩點站在階梯上，從 V0 一路往上到 V5",
  },
  publishedAt: "2026-10-17",
  updatedAt: "2026-10-17",
  summary: [
    "V0、V1、V2 是抱石的難度標示，數字越大越難；VB 是比 V0 更簡單的入門級，不是每間館都有。",
    "顏色沒有全台通用的意思：岩點顏色常用來找路線，難度要看膠帶、標籤或館內色票。",
    "V 級和 Font（6A、6B…）是兩套分級，只能約略對照；同樣是 V1，換一間館感覺不同很正常。",
    "新手從 VB、V0 或館員推薦的路線開始，用踩點、讀線、重爬的品質看進步，不用跟別人比級數。",
  ],
  sections: [
    {
      id: "v-scale",
      title: "抱石 V0、V1 是什麼？先認識 V 級數",
      body: (
        <>
          <p>
            第一次走進抱石館，牆上有紅、黃、藍色的岩點，旁邊又貼著色帶和
            V0、V1。到底要跟哪個顏色？數字又代表什麼？
          </p>
          <p>
            先記住：<strong>V 級數的數字越大，代表路線整體越難。</strong>
            同一套評定下，V1 通常比 V0 難，V2 又比 V1
            難。這個數字不是岩點數量、牆的高度，也不是要做幾下引體向上；路線可能難在平衡、抓點、身體位置，或幾個動作連在一起。
          </p>
          <h3>VB、V0 到 V17</h3>
          <ul>
            <li>
              <strong>VB</strong>：B 是 Beginner，比 V0
              更簡單的入門路線，不是每間館都有。
            </li>
            <li>
              <strong>V0、V1、V2…</strong>：數字依序往上加，越來越難。
            </li>
            <li>
              <strong>V0−、V0+</strong>
              ：有些館會把同一級再細分，用法不完全一樣。
            </li>
            <li>
              <strong>V17</strong>
              ：目前世界上已經有這個等級的路線，但分級沒有固定上限。
            </li>
          </ul>
          <p>
            V 級數又叫 Hueco scale，來自美國德州的 Hueco Tanks 抱石區，由 John
            Sherman 和朋友們發展出來，「V」取自他的綽號 Vermin。
          </p>
          <p>
            V0
            的「0」不代表零難度。第一次學踩點、轉身、移重心，連起步都要摸索，很正常。
          </p>
        </>
      ),
    },
    {
      id: "colors",
      title: "抱石顏色怎麼看？先分清楚岩點和色票",
      body: (
        <>
          <p>
            台灣的岩館常看到 V
            級標示，也常用膠帶或標籤標出路線資訊。在現場，把這三件事分開看：
          </p>
          <CompareTable
            caption="抱石館的顏色和數字代表什麼"
            head={["標示", "可能代表", "要確認的事"]}
            rows={[
              ["岩點本身的顏色", "哪些點是同一條路線", "手腳是不是只能用同色"],
              [
                "膠帶、色帶或標籤",
                "起點、終點、難度或路線編號",
                "顏色和位置各代表什麼",
              ],
              [
                "V 級或其他數字",
                "難度、館內等級，也可能是編號",
                "有沒有對照表",
              ],
            ]}
          />
          <p>
            也有館直接用岩點顏色區分難度。
            <strong>台灣沒有通用的「白色最簡單、黑色最難」規則</strong>
            ，不能單看顏色深淺判斷。下面是一種色票的排法，只是示意：
          </p>
          <ColorCircuit
            steps={[
              { name: "白", color: "#F5F3EE", range: "VB–V0" },
              { name: "黃", color: holdColors.yellow, range: "V0–V1" },
              { name: "綠", color: holdColors.green, range: "V1–V2" },
              { name: "藍", color: holdColors.blue, range: "V2–V3" },
              { name: "紅", color: holdColors.red, range: "V3–V5" },
              { name: "黑", color: "#0b0c0d", range: "V5 以上", dark: true },
            ]}
          />
          <p>
            看到「1、2、3」或「Level
            3」，先確認那是館內等級還是路線編號。沒有館方的對照，不要把「3」當成
            V3。
          </p>
          <h3>進館後，四步看懂一條線</h3>
          <Steps
            items={[
              {
                title: "找難度表",
                body: <p>確認最簡單的是哪一級、色票怎麼排。</p>,
              },
              {
                title: "找起點和終點",
                body: <p>看標籤怎麼指定手腳的位置，以及在哪裡完成。</p>,
              },
              {
                title: "確認能用的點",
                body: <p>腳點、牆面、地形點能不能用，各館不同。</p>,
              },
              {
                title: "先看完整條，再上牆",
                body: <p>找出腳點和往下爬的方式，再開始嘗試。</p>,
              },
            ]}
          />
          <p>
            起點、終點和地形點的細節，在
            <A href="/articles/how-to-read-bouldering-routes">抱石路線怎麼看</A>
            有完整圖解。
          </p>
        </>
      ),
    },
    {
      id: "font",
      title: "Font 分級是什麼？V 級對照表",
      body: (
        <>
          <p>
            Font 是 Fontainebleau 的簡稱，來自法國楓丹白露的抱石區，寫法像
            4、5、5+、6A、6A+。以 6 級為例，順序是：
            <strong>6A → 6A+ → 6B → 6B+ → 6C → 6C+ → 7A</strong>。
          </p>
          <GradeLadder />
          <p>完整的常見對照：</p>
          <CompareTable
            caption="V 級數與 Font 的約略對照"
            head={["V 級數", "Font 約略對照", "V 級數", "Font 約略對照"]}
            rows={[
              ["VB", "（不對應單一級）", "V9", "7C"],
              ["V0", "4", "V10", "7C+"],
              ["V1", "5", "V11", "8A"],
              ["V2", "5+", "V12", "8A+"],
              ["V3", "6A／6A+", "V13", "8B"],
              ["V4", "6B／6B+", "V14", "8B+"],
              ["V5", "6C／6C+", "V15", "8C"],
              ["V6", "7A", "V16", "8C+"],
              ["V7", "7A+", "V17", "9A"],
              ["V8", "7B／7B+", "", ""],
            ]}
          />
          <p>
            這是常見的<strong>約略對照，不是精確換算</strong>
            。尤其在低階區間，不同對照表可能差一格。另外，抱石的 Font
            分級和上攀用的法式分級（也寫 6a、6b）是不同的東西，別混在一起。
          </p>
        </>
      ),
    },
    {
      id: "different-gyms",
      title: "為什麼同樣是 V1，換一間館就爬不上去？",
      body: (
        <>
          <p>
            在熟悉的館爬完
            V1，到另一間卻連第一步都做不出來，不代表你退步了。分級是人對難度的判斷，不是儀器量出來的，不同館、不同定線員會有落差。
          </p>
          <ul>
            <li>
              <strong>牆的角度</strong>
              ：仰角需要的身體控制，和平衡為主的俯角牆完全不同。想知道差在哪，可以看
              <A href="/articles/bouldering-wall-angles">抱石牆型圖解</A>。
            </li>
            <li>
              <strong>動作熟不熟</strong>
              ：同一級，你可能很會踩點站起來，卻不熟悉側身移動。
            </li>
            <li>
              <strong>身高和臂展</strong>：同一段距離，不同身形需要不同解法。
            </li>
            <li>
              <strong>當天狀態</strong>：疲勞、手皮、緊張，都會讓會的動作變難。
            </li>
          </ul>
          <p>
            換館時，先從比較簡單的路線重新感受，不用把原本的最高級數當成當天的最低標準。室內和戶外的差異更大，也不適合直接照搬級數。
          </p>
        </>
      ),
    },
    {
      id: "where-to-start",
      title: "新手從哪一級開始？多久能到 V2、V3？",
      body: (
        <>
          <p>
            剛開始抱石的前幾次，建議先試{" "}
            <strong>VB、V0，或館員推薦的入門路線</strong>
            。一條 V0 爬不上去，換另一條 V0
            試試，請人幫你看腳的位置，不用因此覺得「連最低級都不行」。
          </p>
          <p>
            至於多久能到 V2、V3，<strong>沒有適用每個人的時間表</strong>
            。練習頻率、運動背景、有沒有人教、恢復狀況和館內定線都不同。而且「完成一條
            V3」和「穩定完成不同風格的 V3」，本來就是不同的進展。
          </p>
          <h3>用三個小任務看見進步</h3>
          <ol>
            <li>
              <strong>踩點更準</strong>
              ：在簡單的路線上，看著腳尖踩穩再移動，減少反覆找位置。
            </li>
            <li>
              <strong>上牆前多看一步</strong>
              ：先想好起步後第一個腳點，和下一手要去哪裡。
            </li>
            <li>
              <strong>重爬一條熟悉的線</strong>
              ：觀察是不是少了停頓、少了亂抓，或找到更省力的站法。
            </li>
          </ol>
          <Callout tone="safety">
            <p>
              路線標
              VB，也一樣要先學會往下爬和落地。第一次進館，記得完成館方的安全說明。
            </p>
          </Callout>
        </>
      ),
    },
    {
      id: "terms",
      title: "Flash、Onsight、Redpoint、Project 怎麼分？",
      body: (
        <>
          <p>
            這些詞是在描述「怎麼完成」或「正在練什麼」，跟路線本身的難度是兩回事。
          </p>
          <CompareTable
            caption="抱石常見的完攀用語"
            head={["名詞", "意思"]}
            rows={[
              ["Flash", "第一次嘗試就完攀；事先可以看別人爬、聽解法。"],
              [
                "Onsight",
                "沒看過任何人示範、沒聽解法，第一次就完攀；可以自己在地面觀察。",
              ],
              [
                "Redpoint",
                "練過或失敗過之後，再從起點一次完整完攀。原本是上攀用語。",
              ],
              ["Project", "正在反覆練習、想完成的目標路線。"],
            ]}
          />
          <p>
            例如，你先看朋友示範，自己第一次上牆就成功，這是
            flash。第一次掉下來、第二次才成功，就不是 flash
            了。抱石日常最常聽到的是 flash、send（完攀）和 project。
          </p>
        </>
      ),
    },
    {
      id: "beyond-numbers",
      title: "讓分級幫你選線，也記下數字以外的進步",
      body: (
        <>
          <p>
            對剛入門的你，分級最實用的地方，是幫你找到今天適合練的路線。記錄時，除了「最高爬到幾級」，也可以寫下：
          </p>
          <ul>
            <li>今天第一次自己看懂起步。</li>
            <li>同一條線，腳沒有一直滑掉。</li>
            <li>上次卡住的地方，這次多做了一個動作。</li>
            <li>累了知道休息，再試一次。</li>
          </ul>
          <p>
            朋友先爬到 V3，不會減少你完成第一條 V0 的成就感。VARO
            會記下每條路線的級數、嘗試次數和完攀，也想陪你看見這些數字以外的進步。
          </p>
        </>
      ),
    },
  ],
  faq: [
    {
      q: "抱石 V0 和 V1 差在哪裡？",
      a: "V1 整體評定通常比 V0 難，但不是固定多一種動作，也不是要多一倍力氣。兩條路線風格不同時，你可能反而覺得某條 V1 比 V0 順手。",
    },
    {
      q: "VB 是什麼？一定比 V0 簡單嗎？",
      a: "VB 的 B 是 Beginner，通常是比 V0 更簡單的入門路線，但不是每間館都有。找不到 VB 時，可以請館員推薦適合新手的路線。",
    },
    {
      q: "抱石哪個顏色最簡單？",
      a: "沒有全台通用的答案。岩點顏色常用來找路線，膠帶或標籤才是難度；也有館直接用岩點顏色分級。每次換館，先看現場的色票。",
    },
    {
      q: "岩館標示「3」，就是 V3 嗎？",
      a: "不一定。數字可能是館內自己的等級，也可能只是路線編號。先找難度表，確認數字代表什麼；沒有館方對照，不要直接換算成 V3。",
    },
    {
      q: "新手連 V0 都爬不上去，正常嗎？",
      a: "正常，V0 也需要技巧。換一條腳點清楚、好起步的路線，請館員幫你看手腳位置。能穩穩起步、多完成一個動作，都是值得記下的進步。",
    },
    {
      q: "抱石多久可以進步到 V2、V3？",
      a: "沒有適用所有人的時間表。練習頻率、運動背景和岩館定線都會影響。先看踩點、讀線和重爬的品質，不用拿別人的速度要求自己。",
    },
    {
      q: "Font 6A 大約是 V 幾？",
      a: "常見的對照中，Font 6A 和 6A+ 都約落在 V3。這是約略比較，不是精確換算，不同對照表在低階區間可能差一格。",
    },
    {
      q: "看過別人爬，再第一次就成功，算 flash 嗎？",
      a: "算。Flash 可以先看示範或聽解法，重點是自己第一次嘗試就完攀。已經失敗過一次，之後成功就不算 flash。",
    },
  ],
  sources: [
    {
      label: "BMC：Indoor climbing grades explained（V 級由來與上限）",
      url: "https://www.thebmc.co.uk/cy/indoor-climbing-grades-explained",
    },
    {
      label: "REI：Climbing and Bouldering Ratings",
      url: "https://www.rei.com/learn/expert-advice/climbing-bouldering-rating.html",
    },
    {
      label:
        "REI：Rock Climbing Terms & Lingo Guide（flash、onsight、redpoint）",
      url: "https://www.rei.com/learn/expert-advice/rock-climbing-glossary.html",
    },
    {
      label: "Rockfax：Grade Conversions（分級對照）",
      url: "https://rockfax.com/climbing-guides/grades/",
    },
    {
      label: "Mountain Project：International Climbing Grade Comparison",
      url: "https://www.mountainproject.com/international-climbing-grades",
    },
    {
      label: "Mountain Training：Bouldering guidance（分級的主觀性）",
      url: "https://www.mountain-training.org/media/sv4hbbvm/bouldering_guidance_on_session_delivery_and_supervision.pdf",
    },
    {
      label: "原岩攀岩館：抱石級數認證公告（台灣岩館使用 V 級的例子）",
      url: "https://tupclimbing.tw/news/announcement/208",
    },
    {
      label: "HANCHOR：認識抱石與路線辨識",
      url: "https://tw.hanchor.com/pages/climb01",
    },
  ],
  related: ["how-to-read-bouldering-routes", "bouldering-wall-angles"],
};
