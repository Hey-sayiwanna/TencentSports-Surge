 let body;

try {
  body = JSON.parse($response.body);

  const data = body?.data;
  let removedCount = 0;

  /*
   * 比赛页右下角会员横幅
   */
  if (data && Array.isArray(data.bannerList)) {
    removedCount += data.bannerList.length;
    data.bannerList = [];
  }

  /*
   * 直播间进入广告 / 飘窗广告
   * 字段里会带 logo: "广告"、lottieUrl、picUrl
   */
  if (data && Array.isArray(data.enterAdList)) {
    removedCount += data.enterAdList.length;
    data.enterAdList = [];
  }
/*
 * 直播聊天区广告背景
 * 例如右侧的 Monster 饮料罐广告
 */
if (
  data &&
  data.chatBackground &&
  Object.prototype.hasOwnProperty.call(data.chatBackground, "adImgNew")
) {
  data.chatBackground.adImgNew = "";
  removedCount += 1;
}
  console.log(
    `QQSports Match Widgets Ad Block: removed ${removedCount} ad item(s).`
  );

  $done({
    body: JSON.stringify(body)
  });
} catch (error) {
  console.log(`QQSports Match Widgets Ad Block error: ${error}`);
  $done({});
}
