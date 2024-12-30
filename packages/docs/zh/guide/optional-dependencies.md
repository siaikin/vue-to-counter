<script setup>
import DemoContainer from "../../components/DemoContainer.vue";
import NumberAdapterDemo from "../../components/NumberAdapterDemo.vue";
</script>

# 限制及如何解决

## 字符长度限制

> TL;DR: [解决方案](#如何解除字符长度限制)。

[//]: # "你可能已经注意到了，在[安装](../guide/getting-started#前置准备)的时候，我们提到了两个可选依赖。"

`VueToCounter` 实现原理是将字符串视为某个进制的数字，然后将其转换为十进制数字。这样做的目的是为了方便采样数字制作滚动列表。

这种方式在大多数情况下都是可行的，但是当数字太大或太小时，就会出现问题。

在 ECMA 规范中，当 `number < 10^-5 || number > 10^21` 时，数字将使用科学记数法表示[^1][^2]。

这样问题就来了，数字将使用科学记数法表示后会丢失部分精度。

```
    1234567891012131415161
=>  1.2345678910121315e+21 // 丢失了后 6 位精度
```

由于实现方式的原因，这种情况在 `VueToCounterString` 上较为容易出现。
因为进制数基本上是字符串中不重复字符的个数，这将很容易得到一个超过 `10^21` 的数字。

类似的，当我们使用 `VueToCounterNumber` 时，如果数值小于 `10^-5`，数字也将使用科学记数法表示。

### 如何解除字符长度限制

要解决这个问题，我们可以使用 `bigint` 或第三方高精度计算库，如 [decimal.js](https://mikemcl.github.io/decimal.js)。`VueToCounter` 提供了两个适配器：

1. `BuildInNumberAdapter`（默认）： 使用 `Number`。
2. `BuildInBigintAdapter`： 使用 `BigInt`，但**不支持小数**。
3. `DecimalJsAdapter`： 使用 `decimal.js`，需要安装 [decimal.js](https://mikemcl.github.io/decimal.js)。

在下方示例中你可以切换适配器查看效果。

> `{{ Number.MAX_SAFE_INTEGER }}` 是 JavaScript 中能够精确表示的最大整数，大于该值时将会丢失精度。你可以尝试输入：
>
> 1. `{{ BigInt(Number.MAX_SAFE_INTEGER) + 1n }}`：{{ Number.MAX_SAFE_INTEGER }} **+ 1**
> 2. `{{ BigInt(Number.MAX_SAFE_INTEGER) + 10n }}`：{{ Number.MAX_SAFE_INTEGER }} **+ 10**
> 3. `{{ BigInt(Number.MAX_SAFE_INTEGER) + 100n }}`：{{ Number.MAX_SAFE_INTEGER }} **+ 100**
>
> 观察精度丢失的情况。

<DemoContainer>
<NumberAdapterDemo />

::: details 点击查看代码
::: code-group
<<< @/components/NumberAdapterDemo.vue{vue} [NumberAdapterDemo]
<<< @/components/DemoContainer.vue{vue} [DemoContainer]
:::
</DemoContainer>

## 支持 emoji 分词

[^1]: https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-number-tostring

[^2]: https://medium.com/@anna7/large-numbers-in-js-4feb6269d29b
