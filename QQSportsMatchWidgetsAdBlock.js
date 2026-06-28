let body;

try {
  body = JSON.parse($response.body);

  const data = body?.data;
  let removedCount = 0;

  if (data && Array.isArray(data.bannerList)) {
    removedCount = data.bannerList.length;
    data.bannerList = [];
  }

  console.log(
    `QQSports Match Widgets Ad Block: removed ${removedCount} VIP banner item(s).`
  );

  $done({
    body: JSON.stringify(body)
  });
} catch (error) {
  console.log(`QQSports Match Widgets Ad Block error: ${error}`);
  $done({});
}
