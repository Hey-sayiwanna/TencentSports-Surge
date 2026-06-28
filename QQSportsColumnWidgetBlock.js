let body;

try {
  body = JSON.parse($response.body);

  const data = body?.data;
  const title = data?.jumpData?.param?.title || "";
  const url = data?.jumpData?.param?.url || "";

  /*
   * ColumnWidget 是腾讯体育首页的悬浮运营/活动入口。
   * 例如：绿茵巅峰答题场、会员推广、赛事活动等。
   */
  if (data && (data.img || title || url)) {
    console.log(
      `QQSports ColumnWidget Block: removed "${title || "floating widget"}".`
    );

    // 返回空数据，使 App 不创建悬浮组件
    body.data = null;
  }

  $done({
    body: JSON.stringify(body)
  });
} catch (error) {
  console.log(`QQSports ColumnWidget Block error: ${error}`);
  $done({});
}
