<script setup>
import DemoContainer from "../../../components/DemoContainer.vue";
import AdvancedDelayDemo from "../../../components/AdvancedDelayDemo.vue";
import AdvancedEasingDemo from "../../../components/AdvancedEasingDemo.vue";
</script>

# 自定义动画

> 此章节假设你对 [CSS 动画](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_animations) 或 [CSS 过渡](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_transitions)有一定了解。
>
> 如果你不了解 CSS 动画或 CSS 过渡，建议先学习相关内容。

## 延时

<DemoContainer><AdvancedDelayDemo /></DemoContainer>
::: details 点击查看代码
::: code-group
<<< @/components/AdvancedDelayDemo.vue{vue} [AdvancedDelayDemo]
<<< @/components/DemoContainer.vue{vue} [DemoContainer]
:::

## 缓动

为了更容易观察缓动效果，可调整动画时长并调大了字体。

<DemoContainer><AdvancedEasingDemo /></DemoContainer>
::: details 点击查看代码
::: code-group
<<< @/components/AdvancedEasingDemo.vue{vue} [AdvancedEasingDemo]
<<< @/components/EasingView.vue{vue} [EasingView]
<<< @/components/DemoContainer.vue{vue} [DemoContainer]
:::
