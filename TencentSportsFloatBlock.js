const url = $request.url;

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
