<script setup lang="ts">
import { ref } from "vue";

const debug = ref(true);
const value = ref(0);
const duration = ref(1000);
const color = ref(
  "linear-gradient(135deg, rgba(30,87,153,0) 0%,rgba(30,87,153,0.8) 15%,rgba(30,87,153,1) 19%,rgba(30,87,153,1) 20%,rgba(41,137,216,1) 50%,rgba(30,87,153,1) 80%,rgba(30,87,153,1) 81%,rgba(30,87,153,0.8) 85%,rgba(30,87,153,0) 100%)"
);
const locale = ref("zh-CN");
const localeNumber = ref(true);
const prefix = ref("Remaining");
const suffix = ref("!");
const minPlaces = ref<[number, number]>([0, 0]);
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
</script>

<template>
  <div class="w-full mt-16 flex flex-col justify-center items-center">
    <VueToCounter
      class="text-2xl bg-gray-300"
      :value="[value]"
      :duration="duration"
      :debug="debug"
      :color="color"
      :locale="locale"
      :min-places="minPlaces"
      :digit-to-char="digitToChar"
    >
      <template #prefix>{{ prefix }}</template>
      <template #suffix>{{ suffix }}</template>
    </VueToCounter>

    <div class="flex flex-col mt-4 border w-96 p-2">
      <label class="border-b p-1">
        debug:
        <input type="checkbox" v-model="debug" />
      </label>
      <fieldset class="flex flex-col border">
        <legend>datetime</legend>
        <label class="border-b p-1">
          value:
          <input type="number" v-model="value" />
        </label>
        <label class="p-1">
          duration:
          <input type="number" v-model="duration" :step="100" :min="0" />
        </label>
      </fieldset>
      <fieldset class="flex flex-col border">
        <legend>color</legend>
        <label class="border-b p-1">
          gradient:
          <textarea v-model="color" class="w-full" rows="5"></textarea>
        </label>
        <a
          class="text-blue-600"
          href="https://www.colorzilla.com/gradient-editor/"
          target="_blank"
        >
          Gradient Generator
        </a>
      </fieldset>
      <fieldset class="flex flex-col border">
        <legend>slot</legend>
        <label class="border-b p-1">
          prefix:
          <input type="text" v-model="prefix" />
        </label>
        <label class="p-1">
          suffix:
          <input type="text" v-model="suffix" />
        </label>
      </fieldset>
      <fieldset class="flex flex-col border">
        <legend>locale</legend>
        <label class="border-b p-1">
          locale:
          <select v-model="locale">
            <optgroup label="CN">
              <option value="zh-CN-u-nu-hans">zh-CN</option>
              <option value="zh-HK">zh-HK</option>
              <option value="zh-TW">zh-TW</option>
            </optgroup>
            <optgroup label="EN">
              <option value="en-US">en-US</option>
              <option value="en-GB">en-GB</option>
            </optgroup>
            <option value="ja-JP">ja-JP</option>
            <option value="ko-KR">ko-KR</option>
            <option value="de-DE">de-DE</option>
            <option value="fr-FR">fr-FR</option>
          </select>
        </label>
        <label class="p-1">
          use locale number:
          <input type="checkbox" v-model="localeNumber" />
        </label>
      </fieldset>
      <fieldset class="flex flex-col border">
        <legend>min places</legend>
        <label class="border-b p-1">
          integer:
          <input type="number" v-model="minPlaces[0]" />
        </label>
        <label class="p-1">
          decimal:
          <input type="number" v-model="minPlaces[1]" />
        </label>
      </fieldset>
    </div>
  </div>
</template>

<style scoped></style>
