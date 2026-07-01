
# TencentSports-Surge

腾讯体育 iPhone / iPad App 的 Surge 去广告模块。主要用于去除开屏广告、首页信息流强插广告、社区文章底部广告、赛事页横幅/组件广告和体育会员弹窗等内容。需卸载重装软件哦！！！

> [!IMPORTANT]
> 本项目只在 **iPhone / iPad 端腾讯体育 App + Surge** 环境下测试。Android、macOS 客户端，以及 Quantumult X、Loon、Shadowrocket、Stash 等其他代理工具均未测试，也没有提供适配配置。

> [!NOTE]
> 首次启用模块或更新规则后，需要卸载重装腾讯体育已清除app本地缓存。并安装信任 Surge MITM 证书、开启 HTTPS 解密并开启屏蔽 QUIC

## 一、基础模块引用

> [!CAUTION]
> 以下两个基础模块引用自 @QingRex 的 [LoonKissSurge](https://github.com/QingRex/LoonKissSurge) / [surge.qingr.moe](https://surge.qingr.moe/) 项目，不属于本仓库原创内容。建议先安装并在 Surge 模块列表中保持优先生效，以去除视频播放前60秒广告

广告平台拦截器.beta.sgmodule：

```text
https://raw.githubusercontent.com/QingRex/LoonKissSurge/refs/heads/main/Surge/Beta/%E5%B9%BF%E5%91%8A%E5%B9%B3%E5%8F%B0%E6%8B%A6%E6%88%AA%E5%99%A8.beta.sgmodule
```

HTTPDNS拦截器.beta.sgmodule：

```text
https://raw.githubusercontent.com/QingRex/LoonKissSurge/refs/heads/main/Surge/Beta/HTTPDNS%E6%8B%A6%E6%88%AA%E5%99%A8.beta.sgmodule
```

## 二、安装

一键安装页面（包含两个基础模块和Surge模块）：https://hey-sayiwanna.github.io/TencentSports-Surge/

基础模块安装完成后，在 Surge 中通过模块链接安装本模块：

```text
https://raw.githubusercontent.com/Hey-sayiwanna/TencentSports-Surge/main/TencentSportsAdBlock.sgmodule
```

Quantumult X / 圈x 测试配置链接：

```text
https://raw.githubusercontent.com/Hey-sayiwanna/TencentSports-Surge/main/TencentSportsAdBlock.conf
```


## 三、更新日志

### v1.1.0 · 2026-07-01

- 新增首页会员推广清理：移除首页置顶的“新用户首开特惠 / 立即开通”运营推广位。
- 新增通用全屏图片跳转弹窗处理：关闭通过 sports.qq.com/sapp/h5msg.htm 打开的游戏及运营推广弹窗，例如“仙逆战天道”等。
- 优化脚本职责划分：
  - TencentSportsAdBlock.js 仅处理首页信息流、社区文章、赛事页和首页会员推广等常规广告；
  - TencentSportsFloatBlock.js 仅处理比赛页横幅、首页悬浮入口和独立全屏运营弹窗。
- 每个接口响应仅由一个脚本处理，避免多个脚本同时改写同一响应导致规则覆盖、广告失效或重新出现。

### v1.0.0 · 2026-06-29

- 将原先分散的首页信息流、社区文章、赛事横幅、悬浮活动入口和会员弹窗等五个外部脚本整合精简。
- 模块最终仅保留两个外部脚本：
  - TencentSportsAdBlock.js：处理首页信息流、文章页、赛事页及会员相关广告；
  - TencentSportsFloatBlock.js：处理比赛页横幅和首页悬浮运营组件。
- 提供统一的 TencentSportsAdBlock.sgmodule 作为 Surge 安装入口，降低外部脚本数量，便于后续更新和排查规则。

### Surge 更新方式

本项目脚本与模块文件会持续更新；发现广告重新出现、模块新增功能或规则修复后，按以下方式更新：

1. 打开 Surge，进入 **模块** 页面。
2. 找到“腾讯体育去广告”模块。
3. 点击模块右侧的“立即更新”按钮，即可完成更新。

> [!WARNING]
> `TencentSportsAdBlock.js` 与 `TencentSportsFloatBlock.js` 已设置自动更新，检查周期约为 6 小时。
>
> 但当更新涉及模块本身的 MITM 域名、接口匹配规则或新增脚本时，需要在 Surge 模块页面手动更新本模块，随后强制退出并重新打开腾讯体育。
   
## 四、适用范围

| 软件 | 前置模块 | 本模块 |
| --- | --- | --- |
| surge | ✅ | ✅ |
| 圈x | ❌ | 测试 |
| loon | ❌ | ❌ |


> [!TIP]
> **关于前置基础模块与多平台适配说明**
>
> 前置基础模块可拦截腾讯体育视频播放前约 60 秒广告，与本项目模块配合使用，以获得更完整的去广告效果。
>
> 前置基础模块由原作者维护，目前主要适配 **Surge** 与 **Stash**，本项目不对其进行二次适配。
>
> 由于暂缺 **Loon** 测试环境，本项目暂无法提供 Loon 版本的验证与适配支持。相关去广告接口字段、响应结构与处理逻辑已整理至 `去广告原理代码参考` 文件夹，供 Loon 及其他平台规则爱好者参考、改写与自行适配。
>
> **Quantumult X** 与 Surge 的规则结构较为接近，因此本项目提供 Quantumult X 测试链接，用户可根据自身环境自行测试可用性。



## 五、相关文件说明

| 文件 | 作用 |
| --- | --- |
| `TencentSportsAdBlock.sgmodule` | Surge 模块文件，安装本项目时的使用入口。 |
| `TencentSportsAdBlock.js` | 本项目核心去广告脚本，负责处理腾讯体育主要广告响应：清理开屏、视频前置、信息流、文章、赛事组件等广告字段。 |
| `TencentSportsFloatBlock.js` | 本项目辅助去广告脚本，负责处理浮层、弹窗、悬浮运营位等页面组件 |
| `TencentSportsAdBlock.conf` | 圈x适配测试文件 |
| `去广告原理代码参考` | 腾讯体育首页信息流、浏览页、赛事横幅等广告接口与字段处理参考，保留给其他平台去广告爱好者按需取用、改写和二次开发。 |
| `index.html` | GitHub Pages 一键安装页面，提供两个基础模块和本项目 Surge 模块的快捷导入入口。 |


## 六、相关调试

如果广告仍然出现，可以按下面顺序排查：

1. 在 Surge 最近请求中确认相关请求是否命中本模块脚本。
2. 确认请求详情里 HTTPS 解密正常，不是 CONNECT、QUIC 或未解密状态。
3. 确认模块是最新版本，并重新加载一次模块。。
4. 如果广告内容已经被清掉但仍有旧广告位，优先考虑 App 缓存，卸载重装后再测试。
5. 如果最近请求里出现新的广告接口，需要重新抓包补规则。

本项目只针对腾讯体育 App 内广告与运营组件做个人环境下的规则整理。腾讯体育接口可能随版本变化而调整，如果规则失效，需要根据新的 Surge 最近请求和抓包结果继续补充。


