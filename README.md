# TencentSports-Surge

腾讯体育 iPhone / iPad App 的 Surge 去广告模块。模块通过 MITM、Map Local 和 HTTP Response 脚本处理腾讯体育的广告配置与广告组件，主要用于去除开屏广告、首页信息流强插广告、社区文章底部广告、赛事页横幅/组件广告和体育会员弹窗等内容。

> [!IMPORTANT]
> 本项目只在 **iPhone / iPad 端腾讯体育 App + Surge** 环境下测试。Android、macOS 客户端，以及 Quantumult X、Loon、Shadowrocket、Stash 等其他代理工具均未测试，也没有提供适配配置。

> [!NOTE]
> 首次启用模块或更新规则后，需要卸载重装腾讯体育已清除app本地缓存。

## 引用基础模块

> [!IMPORTANT]
> 以下两个基础模块引用自 @QingRex 的 [LoonKissSurge](https://github.com/QingRex/LoonKissSurge) / [surge.qingr.moe](https://surge.qingr.moe/) 项目，不属于本仓库原创内容。建议先安装并在 Surge 模块列表中保持优先生效，可以去除视频播放前60秒广告

广告平台拦截器.beta.sgmodule：

```text
https://raw.githubusercontent.com/QingRex/LoonKissSurge/refs/heads/main/Surge/Beta/%E5%B9%BF%E5%91%8A%E5%B9%B3%E5%8F%B0%E6%8B%A6%E6%88%AA%E5%99%A8.beta.sgmodule
```

HTTPDNS拦截器.beta.sgmodule：

```text
https://raw.githubusercontent.com/QingRex/LoonKissSurge/refs/heads/main/Surge/Beta/HTTPDNS%E6%8B%A6%E6%88%AA%E5%99%A8.beta.sgmodule
```

## 安装

一键安装页面（包含两个基础模块和本模块）：https://hey-sayiwanna.github.io/TencentSports-Surge/

基础模块安装完成后，在 Surge 中通过模块链接安装本模块：

```text
https://raw.githubusercontent.com/Hey-sayiwanna/TencentSports-Surge/main/TencentSportsAdBlock.sgmodule
```

本模块用于去除腾讯体育开屏广告、视频前置广告、首页信息流广告、文章底部广告、专题/赛事组件广告等。

安装后确认以下设置：

1. 已安装并信任 Surge MITM 证书。
2. 已对腾讯体育相关域名开启 HTTPS 解密。
3. 已启用本模块。
4. 已开启或允许模块自动屏蔽 QUIC。
5. 强退腾讯体育后重新打开测试。
<img width="1206" height="2281" alt="IMG_0225" src="https://github.com/user-attachments/assets/55680633-0cb7-432e-bde6-57455f6b2684" />
<img width="1205" height="2260" alt="IMG_0226" src="https://github.com/user-attachments/assets/0537ce27-31c0-42f4-ae05-2cfef13851f9" />
<img width="1206" height="1973" alt="IMG_0227" src="https://github.com/user-attachments/assets/84fefdfa-0b9f-422b-99be-c5c6c5864c67" />

## 功能

- 拦截腾讯体育开屏相关广告配置
- 去除腾讯体育视频前置广告
- 移除首页/浏览页信息流中的强插广告卡片
- 清理社区文章详情底部广告字段
- 清理赛事页横幅、赛后数据页广告和运营组件
- 移除体育会员频道弹窗模块
- 尽量通过改写响应体清理广告字段，避免直接拒绝整域名导致空白框或功能异常

## 适用范围

| 项目 | 状态 |
| --- | --- |
| 腾讯体育 iPhone App | 已测试 |
| 腾讯体育 iPad App | 已测试 |
| Surge for iOS / iPadOS | 已测试 |
| Android 版腾讯体育 | 未测试 |
| Quantumult X / Loon / Shadowrocket / Stash | 未适配，未测试 |

## 文件说明

| 文件 | 作用 |
| --- | --- |
| `TencentSportsAdBlock.sgmodule` | Surge 模块入口，包含 MITM、Map Local 和脚本规则 |
| `QQSportsFeedAdBlock.js` | 处理首页信息流、赛事广告横幅和部分强插广告卡片 |
| `QQSportsArticleAdBlock.js` | 处理社区文章详情页底部广告字段 |
| `QQSportsMatchWidgetsAdBlock.js` | 处理赛事页组件中的横幅广告 |
| `QQSportsColumnWidgetBlock.js` | 处理栏目/专题相关运营悬浮组件 |
| `QQSportsVipPopupBlock.js` | 处理体育会员频道弹窗模块 |


## 调试

如果广告仍然出现，可以按下面顺序排查：

1. 在 Surge 最近请求中确认相关请求是否命中本模块脚本。
2. 确认请求详情里 HTTPS 解密正常，不是 CONNECT、QUIC 或未解密状态。
3. 确认模块是最新版本，并重新加载一次模块。
4. 强退腾讯体育后重新打开。
5. 如果广告内容已经被清掉但仍有旧广告位，优先考虑 App 缓存，卸载重装后再测试。
6. 如果最近请求里出现新的广告接口，需要重新抓包补规则。

## 说明

本项目只针对腾讯体育 App 内广告与运营组件做个人环境下的规则整理。腾讯体育接口可能随版本变化而调整，如果规则失效，需要根据新的 Surge 最近请求和抓包结果继续补充。

