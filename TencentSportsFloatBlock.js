const url = $request.url;

/*
 * 首页“做任务免费看比赛 / 看广告得会员”金币任务弹层。
 *
 * 目标接口：
 * https://matchweb.sports.qq.com/trpc.dorae.coin.Coin/CoinLayer
 *
 * task-layer-v2 页面只有在接口返回有效 data 时，
 * 才会将弹层 visible 设为 true。
 *
 * 返回 data:null 后，页面会自行判定没有可展示内容，
 * 不显示弹窗，也不会因为直接 reject 而留下灰色遮罩或空白框。
 */
if (
  /^https:\/\/matchweb\.sports\.qq\.com\/trpc\.dorae\.coin\.Coin\/CoinLayer(?:\?.*)?$/.test(
    url
  )
) {
  console.log(
    "TencentSportsFloatBlock: CoinLayer membership task popup blocked."
  );

  $done({
    body: JSON.stringify({
      code: 0,
      data: null,
      traceID: ""
    })
  });
} else if (
  /^https:\/\/sports\.qq\.com\/sapp\/h5msg\.htm(?:\?.*)?$/.test(url)
) {
  /*
   * 通用全屏图片跳转页：
   * 仙逆战天道及后续同类游戏/运营整屏弹窗。
   */
  closeH5MessagePopup();
} else {
  try {
    const body = JSON.parse($response.body);
    const data = body?.data;
    let removed = 0;

    if (
      /^https:\/\/app\.sports\.qq\.com\/trpc\.sports_resource\.cgi\.ResourceCGI\/MatchWidgets(?:\?.*)?$/.test(
        url
      )
    ) {
      /*
       * 比赛页横幅推广。
       */
      if (Array.isArray(data?.bannerList)) {
        removed = data.bannerList.length;
        data.bannerList = [];
      }
    } else if (
      /^https:\/\/app\.sports\.qq\.com\/vaccess\/trpc\.sports_resource\.cgi\.ResourceCGI\/ColumnWidget(?:\?.*)?$/.test(
        url
      )
    ) {
      /*
       * 首页悬浮运营入口、活动组件。
       */
      const title = data?.jumpData?.param?.title || "";
      const widgetUrl = data?.jumpData?.param?.url || "";

      if (data && (data.img || title || widgetUrl)) {
        body.data = null;
        removed = 1;
      }
    } else if (
      /^https:\/\/app\.sports\.qq\.com\/user\/homePageV2(?:\?.*)?$/.test(
        url
      )
    ) {
      /*
       * 首页原生活动强制弹窗：
       * 温网、世界杯及后续赛事专题推广均由 forceNotice 下发。
       */
      if (Array.isArray(data?.forceNotice) && data.forceNotice.length > 0) {
        removed = data.forceNotice.length;
        data.forceNotice = [];
      }
    }

    console.log(`TencentSportsFloatBlock: removed ${removed} item(s).`);

    $done({
      body: JSON.stringify(body)
    });
  } catch (error) {
    console.log(`TencentSportsFloatBlock error: ${error}`);
    $done({});
  }
}

/*
 * 通用 H5 整屏运营弹窗自动关闭函数。
 */
function closeH5MessagePopup() {
  const closePage = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title></title>
</head>
<body>
<script>
(function () {
  function closeNativePage() {
    try {
      var frame = document.createElement("iframe");
      frame.style.cssText =
        "display:none;width:0;height:0;border:0;position:fixed;left:0;top:0;";
      frame.src = "http://sports.qq.com/jsBridge/close?";
      document.documentElement.appendChild(frame);
    } catch (error) {}

    setTimeout(function () {
      try {
        history.back();
      } catch (error) {}
    }, 150);
  }

  closeNativePage();
}());
</script>
</body>
</html>`;

  console.log("TencentSportsFloatBlock: H5 popup closed.");

  $done({
    body: closePage
  });
}
