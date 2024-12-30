<script setup>
import { onMounted, ref } from "vue";
import MatchMaker_phone from "../assets/MatchMaker_phone.png";
import MatchingSpinnerTiles from "../assets/MatchingSpinnerTiles1.png";
import GBJenLei from "../assets/GBJenLei-Medium.woff2";

const digitToChar = ref([
  "派对捣蛋鬼",
  "卖糖术神",
  "潜行开锁者",
  "柔情信仰战",
  "德鲁伊阿缺",
  "五棍萨满",
  "圣光流浪者",
  "暴怒猎人",
  "有爱牧师",
  "恶魔劣手",
  "魔幻唤魔师",
  "泰坦巨神",
  "迪亚波罗！！",
  "砰砰技师",
  "地精状侏儒",
  "低语的上古之神",
  "污手党徒",
  "初阶探险者",
  "试炼冠军",
  "丧气的狗头人",
  "竞技场大神",
  "怪盗喽罗",
  "庆典煞星",
  "探险佣兵",
  "暴雪研发人员",
  "通灵学园学生",
  "阴郁的温西尔",
  "哈斯的表亲",
  "血滴铠甲死亡骑士",
  "扫地僧",
  "萨齐",
  "米尔豪斯·法力风暴",
  "派对爱好者",
  "行走的活段子",
  "气球杀手",
  "传奇独演者",
  "炎灿法师",
  "守汪联赛战队",
  "炉石开发团队",
  "部落勇士",
  "联盟勇士",
  "上古之神",
  "伊利达雷",
  "风行者姐妹",
  "战棋爱好者",
  "七个小矮人",
  "豪勇七巨龙",
  "一串鱼人",
  "鼠王子",
  "侏儒七怒汉",
  "怪盗军团",
  "探险者协会",
  "迦拉克隆后援团",
  "劫匪霸主",
  "癫狂的谋士",
  "咖啡店路人",
  "天才神童",
  "战略指挥家",
  "你的老铁",
  "未知玩家",
  "调酒师鲍勃的朋友",
  "饥饿游戏玩家",
  "健身七子",
  "云玩家",
  "培根修士",
  "恶魔领主",
  "动物园园长",
  "机械工程师",
  "鱼人先知",
]);
const animationOptions = ref({
  ease: (x) => {
    const n1 = 7.5625;
    const d1 = 2.75;

    if (x < 1 / d1) {
      return n1 * x * x;
    } else if (x < 2 / d1) {
      return n1 * (x -= 1.5 / d1) * x + 0.75;
    } else if (x < 2.5 / d1) {
      return n1 * (x -= 2.25 / d1) * x + 0.9375;
    } else {
      return n1 * (x -= 2.625 / d1) * x + 0.984375;
    }
  },
});
const keyframes = ({ value, direction }) => {
  const from = direction === "up" ? Math.max(...value) : Math.min(...value);
  const to = direction === "up" ? Math.min(...value) : Math.max(...value);
  return {
    transform: [
      `rotateX(-${from * (360 / 69)}deg)`,
      `rotateX(-${to * (360 / 69)}deg)`,
    ],
  };
};

const value = ref(0);

const partDataOptions = ref({
  sampleCount: digitToChar.value.length,
  sampling: () => digitToChar.value.map((_, index) => index),
});

function switchString() {
  value.value = Math.floor(Math.random() * 1000) % digitToChar.value.length;
}

onMounted(() => {
  document.fonts.add(
    new FontFace("GBJenLei", `url(${GBJenLei})`, {
      style: "normal",
      weight: "normal",
    })
  );
});
</script>

<template>
  <div class="hearthstone-demo relative text-center bg-black">
    <div class="overflow-hidden">
      <vue-to-counter
        class="font-bold pt-40 pb-48 mb-8 -mt-2"
        :style="{
          fontSize: '16px',
          lineHeight: '1',
          textShadow: `
            -0.5px -0.5px 0.5px #000,
            0.5px -0.5px 0.5px #000,
            -0.5px 0.5px 0.5px #000,
            0.5px 0.5px 0.5px #000
          `,
          fontFamily: 'GBJenLei',
        }"
        :value="[value]"
        :digit-to-char="digitToChar"
        :min-places="[0, 0]"
        :duration="2"
        color="white"
        :part-data-options="partDataOptions"
        :animation-options="animationOptions"
        :keyframes="keyframes"
        :digit-style="
          ({ data }) =>
            data.map((partData) =>
              partData.digits.map((digit) =>
                digit.data.map((_, i, array) => ({
                  position: 'absolute',
                  opacity: 1,
                  top: 0,
                  bottom: 'auto',
                  backgroundImage: `url(${MatchingSpinnerTiles})`,
                  backgroundSize: 'cover',
                  backgroundPositionY:
                    i % 3 === 0 ? '-1px' : i % 3 === 1 ? '-24px' : '-48px',
                  // backgroundPositionY: '-1px',
                  transform: `rotateX(${(i * 360) / array.length}deg) translateZ(264px)`,
                }))
              )
            )
        "
      />
    </div>
    <img
      class="absolute top-0 w-full h-full object-contain"
      :src="MatchMaker_phone"
      alt="bg"
    />
  </div>
  <hr />
  <div class="flex gap-4">
    <input class="border border-solid p-1" v-model="value" type="number" />
    <button class="border border-solid p-1" @click="switchString">切换</button>
    <span class="flex-auto" />
  </div>
  <hr />
</template>

<style lang="scss">
.hearthstone-demo {
  .vue-to-counter {
    @apply overflow-x-visible overflow-y-clip;

    .roller-part__wrapper {
      perspective: 1200px;

      & > span {
        display: block;
        transform-style: preserve-3d;
      }

      .roll-list {
        display: block !important;
        transform-style: preserve-3d;
        //height: 28px;
        transform: rotateX(0deg);

        .roll-item {
          display: block !important;
          padding: 4px 0;
        }
      }
    }
  }
}
</style>
