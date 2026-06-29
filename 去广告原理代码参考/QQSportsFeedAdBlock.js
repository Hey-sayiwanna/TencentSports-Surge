let body;

try {
  body = JSON.parse($response.body);

  const data = body?.data;
  let removedCount = 0;

  function isAdItem(item) {
    if (!item || typeof item !== "object") return false;

    const report =
      typeof item.report === "string"
        ? item.report
        : JSON.stringify(item.report || {});

    const infoReport =
      typeof item.info?.report === "string"
        ? item.info.report
        : JSON.stringify(item.info?.report || {});

    const jumpUrl =
      item.info?.jumpData?.param?.url ||
      item.info?.jumpData?.param?.iosUrl ||
      "";

    return (
      item.id === "ad" ||
      item.type === 613 ||
      item.reason === "强插" ||
      /"rec_type":"613"/.test(report) ||
      /"is_force_insert":"1"/.test(report) ||
      /"module":"internalbanner"/.test(report) ||
      /"sub_ei":"banner"/.test(report) ||
      /ad\.sports|gdt|advert|internalbanner/i.test(report) ||
      /ad\.sports|gdt|advert|internalbanner/i.test(infoReport) ||
      /waimai\.meituan\.com|gdt\.qq\.com/i.test(jumpUrl)
    );
  }

  /*
   * 首页、资讯流、社区流中的强插广告
   */
  if (data && Array.isArray(data.list)) {
    data.list = data.list.filter((item) => {
      if (isAdItem(item)) {
        removedCount += 1;
        return false;
      }
      return true;
    });
  }

  /*
   * 常规信息流广告候选包
   */
  if (data && Object.prototype.hasOwnProperty.call(data, "adList")) {
    data.adList = "";
  }

  /*
   * NBA、F1 等赛事详情页广告。
   * 当前抓到的特征：
   * text = 广告
   * type = 41
   * ad.adListPB 存在
   * mod_id = mod_banner_ad
   */
  if (data && Array.isArray(data.stats)) {
    data.stats = data.stats.filter((item) => {
      const isMatchBannerAd =
        item &&
        (
          item.text === "广告" ||
          String(item.type) === "41" ||
          typeof item.ad?.adListPB === "string" ||
          item.ad?.adListPB
        );

      if (isMatchBannerAd) {
        removedCount += 1;
        return false;
      }

      return true;
    });
  }

  /*
   * 赛事页可能出现的悬浮广告/图标广告。
   * 只处理 match/adBanner 这类广告专用响应中的字段，
   * 不影响正常文章图片、球队图标和视频封面。
   */
  if (data && Object.prototype.hasOwnProperty.call(data, "iconAd")) {
    data.iconAd = {};
  }

  if (data && Object.prototype.hasOwnProperty.call(data, "topWidget")) {
    data.topWidget = {};
  }
console.log(
  `QQSports Ad Block: removed ${removedCount} ad module(s).`
);
  $done({
    body: JSON.stringify(body)
  });
} catch (error) {
  console.log(`QQSports Ad Block error: ${error}`);
  $done({});
}
