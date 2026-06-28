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
