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

  if (data && Array.isArray(data.list)) {
    data.list = data.list.filter((item) => {
      if (isAdItem(item)) {
        removedCount += 1;
        return false;
      }

      return true;
    });
  }

  // 清空当前 Feed 响应附带的广告候选包
  if (data && Object.prototype.hasOwnProperty.call(data, "adList")) {
    data.adList = "";
  }

  console.log(
    `QQSports Feed Ad Block: removed ${removedCount} feed ad item(s), cleared adList.`
  );

  $done({
    body: JSON.stringify(body)
  });
} catch (error) {
  console.log(`QQSports Feed Ad Block error: ${error}`);
  $done({});
}
