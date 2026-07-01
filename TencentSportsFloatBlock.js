const url = $request.url;

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

if (
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
      if (Array.isArray(data?.bannerList)) {
        removed = data.bannerList.length;
        data.bannerList = [];
      }
    } else if (
      /^https:\/\/app\.sports\.qq\.com\/vaccess\/trpc\.sports_resource\.cgi\.ResourceCGI\/ColumnWidget(?:\?.*)?$/.test(
        url
      )
    ) {
      const title = data?.jumpData?.param?.title || "";
      const widgetUrl = data?.jumpData?.param?.url || "";

      if (data && (data.img || title || widgetUrl)) {
        body.data = null;
        removed = 1;
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
