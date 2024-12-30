<script setup>
import DemoContainer from "../../../components/DemoContainer.vue";

import ColorfulNumberDemo from "../../../components/ColorfulNumberDemo.vue";
import PlayfulNumberDemo from "../../../components/PlayfulNumberDemo.vue";
</script>

# 自定义样式

### 自定义颜色

为了更容易观察填充颜色变化，调大了字体。

<DemoContainer><ColorfulNumberDemo /></DemoContainer>
::: details 点击查看代码
::: code-group
<<< @/components/ColorfulNumberDemo.vue{vue} [ColorfulNumberDemo]
<<< @/components/DemoContainer.vue{vue} [DemoContainer]
:::

### 自定义字体

可以直接通过设置 CSS 属性来自定义字体的各种属性。

<DemoContainer><PlayfulNumberDemo /></DemoContainer>
::: details 点击查看代码
::: code-group
<<< @/components/PlayfulNumberDemo.vue{vue} [PlayfulNumberDemo]
<<< @/components/DemoContainer.vue{vue} [DemoContainer]
:::
