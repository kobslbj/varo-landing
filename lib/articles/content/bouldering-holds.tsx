import type { Article } from "../types";

import { A, Callout, CompareTable, Steps } from "@/components/articles/blocks";
import { GripTypes, HoldTypes } from "@/components/articles/diagrams";

export const boulderingHolds: Article = {
  slug: "bouldering-holds",
  category: "routes",
  title: "抱石岩點種類圖解：Jug、Crimp、Sloper、Pinch 怎麼抓？",
  seoTitle: "抱石岩點種類圖解：Jug、Crimp、Sloper、Pinch 是什麼？怎麼抓才省力",
  description:
    "岩點有哪些種類？Jug、Crimp、Sloper、Pinch、Pocket 長什麼樣、手要怎麼放、往哪裡用力？用圖解看懂 10 種抱石岩點，還有開掌、半摳、全摳三種抓法和新手的手指保護。",
  keywords: [
    "岩點種類",
    "抱石岩點",
    "sloper",
    "crimp",
    "jug",
    "pinch 岩點",
    "抓法",
    "半摳",
  ],
  cover: {
    src: "/shots/climb-3.jpg",
    alt: "攀岩者在仰角牆上伸手抓住橘色岩點",
    width: 900,
    height: 1125,
  },
  publishedAt: "2026-10-17",
  updatedAt: "2026-10-17",
  summary: [
    "岩點依形狀和用力方向分類：Jug 大把手、Edge 和 Crimp 是邊緣、Sloper 是沒邊的圓點、Pinch 要捏、Pocket 是洞。",
    "每顆點都先問「它的好抓面朝哪裡」，身體就要站到相反方向去用力，例如反抓要腳踩高、側拉要身體往另一側傾。",
    "抓法有開掌、半摳、全摳。越彎越有力，手指韌帶負擔也越大，新手以開掌和半摳為主。",
    "新手最常見的問題是抓太用力。用剛好不會掉的力氣抓，前臂才撐得久。",
  ],
  sections: [
    {
      id: "why",
      title: "為什麼要認識岩點？",
      body: (
        <>
          <p>
            新手常卡在同一個地方：手明明摸到點了，卻怎麼抓都掉。很多時候不是力氣不夠，是
            <strong>抓錯方向</strong>
            ——把圓圓的點當成邊緣用力摳，或站在錯的位置拉一顆側面的點。
          </p>
          <p>
            岩點的名字主要描述兩件事：<strong>它長什麼樣</strong>，以及
            <strong>要往哪裡用力</strong>
            。這兩種分類不互斥，一顆點可以同時是捏點，又要用側拉的方向去抓。
          </p>
          <p>
            看懂岩點之後，讀線會快很多。還不熟起點、終點和路線規則，可以先看
            <A href="/articles/how-to-read-bouldering-routes">抱石路線怎麼看</A>
            。
          </p>
        </>
      ),
    },
    {
      id: "hold-types",
      title: "10 種常見岩點：長什麼樣、怎麼抓",
      body: (
        <>
          <HoldTypes
            holds={[
              {
                kind: "jug",
                name: "Jug",
                zh: "大把手",
                how: "有很深的凹槽，整隻手都能握進去，往下拉就好。",
                tip: "最好抓的點，新手路線很多。累了可以掛在這裡休息。",
              },
              {
                kind: "edge",
                name: "Edge",
                zh: "邊緣點",
                how: "上面有一道平的邊，手指放上去往下拉。",
                tip: "邊夠寬時可以開掌抓，比較省手指。",
              },
              {
                kind: "crimp",
                name: "Crimp",
                zh: "小點、摳點",
                how: "很窄的邊，只放得下指尖，通常用半摳抓。",
                tip: "手指負擔大，前幾個月別在小點上硬拉。",
              },
              {
                kind: "sloper",
                name: "Sloper",
                zh: "圓點、摩擦點",
                how: "圓圓的沒有邊，手掌和手指整片貼住，靠摩擦抓。",
                tip: "身體要待在點的下方，手臂打直；一往上拉就容易滑掉。",
              },
              {
                kind: "pinch",
                name: "Pinch",
                zh: "捏點",
                how: "拇指和其他手指從兩側夾住，像捏住一本書。",
                tip: "拇指要出力；比摳小邊對手指溫和。",
              },
              {
                kind: "pocket",
                name: "Pocket",
                zh: "洞點",
                how: "手指伸進洞裡抓，洞的大小決定能放幾根手指。",
                tip: "只放得下一兩根手指的小洞，對手指負擔很大，新手先避開。",
              },
              {
                kind: "undercling",
                name: "Undercling",
                zh: "反抓",
                how: "好抓的面朝下，手心朝上從下面抓住，往上拉。",
                tip: "腳要踩高、身體往後靠，才拉得住；站得越低越難用。",
              },
              {
                kind: "sidepull",
                name: "Sidepull",
                zh: "側拉",
                how: "好抓的面朝側邊，手從側面勾住，往身體方向拉。",
                tip: "身體往點的反方向傾，腳踩住對抗，才不會被甩開。",
              },
              {
                kind: "gaston",
                name: "Gaston",
                zh: "反側拉",
                how: "好抓的面朝向你，手肘朝外，像撐開電梯門一樣往外推。",
                tip: "很吃肩膀，進階一點的動作，先在低處試。",
              },
              {
                kind: "volume",
                name: "Volume",
                zh: "地形點",
                how: "鎖在牆上的大型立體造型，可以踩、可以推，上面也會裝別的岩點。",
                tip: "能不能用、上面別色的點能不能用，依各館規定。",
              },
            ]}
          />
          <p>
            這些名字在
            <A href="/articles/bouldering-terms#holds">岩館常見術語</A>
            裡也有整理，還有 macro、dual-tex 等比較少見的岩點。
          </p>
        </>
      ),
    },
    {
      id: "grips",
      title: "開掌、半摳、全摳：三種抓法",
      body: (
        <>
          <p>
            同一顆邊緣點，手指可以用不同的彎曲方式抓。抓法越彎，越有力，但手指的負擔也越大。
          </p>
          <GripTypes />
          <p>
            生物力學研究指出，全摳時手指中間關節彎曲、末端關節反折，手指的滑車韌帶（特別是
            A2）受力最大；開掌時受力最小。攀岩者常見的手指受傷，就和這些韌帶過度負荷有關。
          </p>
          <Callout title="新手的手指保護" tone="safety">
            <p>
              手指的韌帶和肌腱，適應得比肌肉慢。前幾個月以開掌和半摳為主，少用全摳；手指出現刺痛或「啪」一聲，立刻停下來，持續疼痛就去看醫生。
            </p>
          </Callout>
        </>
      ),
    },
    {
      id: "direction",
      title: "看懂用力方向：好抓的面朝哪，身體就往反方向",
      body: (
        <>
          <p>
            判斷一顆點怎麼用，最快的方法是找它
            <strong>好抓的那一面朝哪裡</strong>
            ，然後讓身體站到能往那個方向用力的位置。
          </p>
          <CompareTable
            caption="好抓的面朝向與身體位置"
            head={["好抓的面朝", "怎麼用", "身體怎麼配合"]}
            rows={[
              ["朝上", "往下拉（jug、edge）", "最直覺，身體在點的下方就好"],
              ["朝下", "往上拉（反抓）", "腳踩高、身體往後靠"],
              ["朝側邊", "往身體拉（側拉）", "身體往反方向傾，腳踩住對抗"],
              ["朝向你", "往外推（反側拉）", "手肘朝外，肩膀出力"],
              ["沒有邊", "整片貼住（sloper）", "身體壓低待在點下方，手臂打直"],
            ]}
          />
        </>
      ),
    },
    {
      id: "as-footholds",
      title: "拿來踩的時候呢？",
      body: (
        <>
          <p>同樣的形狀，用腳踩的時候也有不同的用法：</p>
          <ul>
            <li>
              <strong>大點、邊緣</strong>
              ：用鞋尖或鞋子內側邊緣踩在上面（踩邊）。
            </li>
            <li>
              <strong>圓點、地形點</strong>
              ：沒有邊可以踩，用前腳掌整片壓住，靠摩擦撐住（摩擦踩點）。腳跟稍微放低，鞋底貼得比較多。
            </li>
            <li>
              <strong>很小的點</strong>
              ：踩準最重要，眼睛看著腳放好，再把重心移過去。
            </li>
          </ul>
          <p>
            不同牆型怎麼用腳，可以看
            <A href="/articles/bouldering-wall-angles">抱石牆型圖解</A>。
          </p>
        </>
      ),
    },
    {
      id: "read-a-hold",
      title: "上牆前，怎麼判斷一顆點怎麼抓？",
      body: (
        <>
          <Steps
            items={[
              {
                title: "看形狀",
                body: <p>有沒有凹槽、邊緣、洞？還是整顆圓圓的？</p>,
              },
              {
                title: "看好抓的面朝哪",
                body: <p>朝上、朝下、朝側邊，決定你要往哪裡用力。</p>,
              },
              {
                title: "看粉的痕跡",
                body: (
                  <p>
                    白白的粉通常留在別人抓過的地方，是很好的提示。但粉多不一定是最好的位置，只是最多人摸過。
                  </p>
                ),
              },
              {
                title: "想好身體要在哪",
                body: <p>伸手之前，先想抓到時身體和腳在哪裡，才拉得住。</p>,
              },
            ]}
          />
          <h3>用剛好的力氣抓</h3>
          <p>
            新手最常見的問題是<strong>抓太用力</strong>
            ：每一顆點都死命握，前臂很快就脹到抓不住（爆手）。試著用「剛好不會掉」的力氣抓，手臂盡量打直、像掛在點上，讓腳分擔重量。
          </p>
          <p>
            把每次在小點、圓點上的嘗試記下來，VARO
            會幫你看見自己在哪一種岩點上越來越穩。
          </p>
        </>
      ),
    },
  ],
  faq: [
    {
      q: "抱石岩點有哪些種類？",
      a: "常見的有 jug 大把手、edge 邊緣點、crimp 小點、sloper 圓點、pinch 捏點、pocket 洞點，以及依用力方向分的反抓、側拉、反側拉，還有大型的地形點 volume。",
    },
    {
      q: "Sloper 是什麼？怎麼抓？",
      a: "Sloper 是圓圓的、沒有明顯邊緣的岩點。用手掌和手指整片貼住，靠摩擦抓；身體要待在點的下方、手臂打直，一往上拉就容易滑掉。",
    },
    {
      q: "Crimp 是什麼？",
      a: "Crimp 是只放得下指尖的小邊點，也可以指摳的抓法。小點對手指負擔大，新手以半摳為主，避免長時間全摳。",
    },
    {
      q: "Jug 是什麼？",
      a: "Jug 是有深凹槽、整隻手都能握進去的大把手，是最好抓的岩點。新手路線很多 jug，累了也可以掛在上面休息。",
    },
    {
      q: "半摳和全摳差在哪？",
      a: "半摳是手指中間關節彎成約直角、拇指不鎖住；全摳是手指更彎，拇指壓在食指上鎖住。全摳更有力，但手指韌帶負擔最大。",
    },
    {
      q: "反抓 undercling 要怎麼用？",
      a: "反抓的好抓面朝下，手心朝上從下面抓住往上拉。腳要踩高、身體往後靠才拉得住，站得越低越難用。",
    },
    {
      q: "新手抓點為什麼前臂很快就沒力？",
      a: "通常是抓太用力。每顆點都死命握，前臂很快就脹。試著用剛好不會掉的力氣抓，手臂打直、讓腳分擔重量，就能撐更久。",
    },
  ],
  sources: [
    {
      label: "REI：Rock Climbing Techniques & Moves（岩點與抓法）",
      url: "https://www.rei.com/learn/expert-advice/climbing-techniques.html",
    },
    {
      label: "Climbing：How to climb and practice slopers",
      url: "https://www.climbing.com/skills/how-to-climb-practice-slopers/",
    },
    {
      label: "MDPI Bioengineering（2024）：抓法與手指滑車韌帶受力",
      url: "https://www.mdpi.com/2306-5354/11/4/370",
    },
    {
      label:
        "BMC Sports Science, Medicine and Rehabilitation（2022）：攀岩手指受傷與抓法回顧",
      url: "https://doi.org/10.1186/s13102-022-00539-6",
    },
    {
      label: "Advnture：9 rock climbing holds you need to know",
      url: "https://advnture.com/features/climbing-holds",
    },
  ],
  related: ["bouldering-terms", "bouldering-wall-angles"],
};
