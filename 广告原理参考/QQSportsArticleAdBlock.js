let body;

try {
  body = JSON.parse($response.body);

  const data = body?.data;
  let cleared = [];

  if (data && typeof data.adListPB === "string" && data.adListPB.length > 0) {
    console.log(`QQSports Article Ad Block: cleared adListPB (${data.adListPB.length} chars).`);
    data.adListPB = "";
    cleared.push("adListPB");
  }

  // 兼容后续接口可能改用的普通广告字段；只在字段确实存在时才处理
  if (data && Array.isArray(data.adList) && data.adList.length > 0) {
    data.adList = [];
    cleared.push("adList");
  }

  if (data && Array.isArray(data.adInfos) && data.adInfos.length > 0) {
    data.adInfos = [];
    cleared.push("adInfos");
  }

  console.log(
    cleared.length
      ? `QQSports Article Ad Block: cleared ${cleared.join(", ")}.`
      : "QQSports Article Ad Block: no article ad field found."
  );

  $done({
    body: JSON.stringify(body)
  });
} catch (error) {
  console.log(`QQSports Article Ad Block error: ${error}`);
  $done({});
}
