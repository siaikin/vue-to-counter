<script setup>
import DemoContainer from "../../../components/DemoContainer.vue";

import LocaleNumberDemo from "../../../components/LocaleNumberDemo.vue";
import LocaleDatetimeDurationDemo from "../../../components/LocaleDatetimeDurationDemo.vue";

</script>

# 本地化（国际化）

VueToCounter 提供了本地化功能，用于处理数字和时间间隔的本地化。

[VueToCounterNumber](#数字本地化) 和 [VueToCounterDatetimeDuration](#时间间隔本地化) 组件支持本地化，你可以通过 `locale` 属性来设置本地化的配置。

大多数情况下，你只需要将 `locale` 属性设置为 **语言代码**（如 `en`，`en-US`，`zh`，`zh-CN`）即可。
VueToCounter 内部将调用 [Intl](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl) API 来处理本地化。

## 时间间隔本地化

<DemoContainer title="时间间隔本地化">
<LocaleDatetimeDurationDemo />
<hr />

::: details 点击查看代码
::: code-group
<<< @/components/LocaleDatetimeDurationDemo.vue{vue} [LocaleDatetimeDurationDemo]
<<< @/components/DemoContainer.vue{vue} [DemoContainer]
:::

</DemoContainer>

## 数字本地化

特别的，`VueToCounterNumber` 组件还需要设置 `locale-number` 属性。

- 你可以将其设置为 `true` ，这将使用默认配置启用数字本地化。
- 也可以设置为 [Intl.NumberFormat 支持的选项](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat#options)。

<DemoContainer title="数字本地化">
<LocaleNumberDemo />
<hr />

::: details 点击查看代码
::: code-group
<<< @/components/LocaleNumberDemo.vue{vue} [LocaleNumberDemo]
<<< @/components/DemoContainer.vue{vue} [DemoContainer]
:::

</DemoContainer>
