const url = $request.url;
let body = $response.body;

function isFeedAd(item) {
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

function removeVipPopup(html) {
  const marker = '"moduleType":"module_popup_page"';
  const markerIndex = html.indexOf(marker);

  if (markerIndex === -1) {
    console.log("Aegis: VIP popup not found.");
    return html;
  }

  function findMatchingBrace(text, start) {
    let depth = 0;
    let inString = false;
    let escaped = false;

    for (let i = start; i < text.length; i++) {
      const ch = text[i];

      if (inString) {
        if (escaped) {
          escaped = false;
        } else if (ch === "\\") {
          escaped = true;
        } else if (ch === '"') {
          inString = false;
        }
        continue;
      }

      if (ch === '"') {
        inString = true;
      } else if (ch === "{") {
        depth += 1;
      } else if (ch === "}") {
        depth -= 1;
        if (depth === 0) return i;
      }
    }

    return -1;
  }

  const stack = [];
  let inString = false;
  let escaped = false;

  for (let i = 0; i <= markerIndex; i++) {
    const ch = html[i];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (ch === "\\") {
        escaped = true;
      } else if (ch === '"') {
        inString = false;
      }
      continue;
    }

    if (ch === '"') {
      inString = true;
    } else if (ch === "{") {
      stack.push(i);
    } else if (ch === "}") {
      stack.pop();
    }
  }

  for (let i = stack.length - 1; i >= 0; i--) {
    const start = stack[i];
    const end = findMatchingBrace(html, start);

    if (end === -1) continue;

    const moduleText = html.slice(start, end + 1);

    if (
      moduleText.includes(marker) &&
      moduleText.includes('"moduleId"') &&
      moduleText.includes('"itemDataLists"')
    ) {
      let removeStart = start;
      let removeEnd = end;

      let left = start - 1;
      while (left >= 0 && /\s/.test(html[left])) left -= 1;

      if (html[left] === ",") {
        removeStart = left;
      } else {
        let right = end + 1;
        while (right < html.length && /\s/.test(html[right])) right += 1;

        if (html[right] === ",") {
          removeEnd = right;
        }
      }

      console.log("Aegis: VIP popup removed.");
      return html.slice(0, removeStart) + html.slice(removeEnd + 1);
    }
  }

  console.log("Aegis: VIP popup range not found.");
  return html;
}

try {
  if (/^https:\/\/film\.video\.qq\.com\/x\/sports-vip-channel\//.test(url)) {
    $done({
      body: removeVipPopup(body)
    });
  }

  const obj = JSON.parse(body);
  const data = obj?.data;
  let removed = 0;

  if (
    /^https:\/\/app\.sports\.qq\.com\/(?:feeds\/list|m\/matchAfter\/stats|match\/adBanner)\?/.test(
      url
    )
  ) {
    if (Array.isArray(data?.list)) {
      data.list = data.list.filter((item) => {
        if (!isFeedAd(item)) return true;
        removed += 1;
        return false;
      });
    }

    if (data && Object.prototype.hasOwnProperty.call(data, "adList")) {
      data.adList = "";
    }

    if (Array.isArray(data?.stats)) {
      data.stats = data.stats.filter((item) => {
        const isMatchAd =
          item &&
          (
            item.text === "广告" ||
            String(item.type) === "41" ||
            typeof item.ad?.adListPB === "string" ||
            item.ad?.adListPB
          );

        if (!isMatchAd) return true;

        removed += 1;
        return false;
      });
    }

    if (data && Object.prototype.hasOwnProperty.call(data, "iconAd")) {
      data.iconAd = {};
    }

    if (data && Object.prototype.hasOwnProperty.call(data, "topWidget")) {
      data.topWidget = {};
    }
  } else if (
    /^https:\/\/shequ\.sports\.qq\.com\/topic\/detail\?/.test(url)
  ) {
    if (typeof data?.adListPB === "string" && data.adListPB.length > 0) {
      data.adListPB = "";
      removed += 1;
    }

    if (Array.isArray(data?.adList) && data.adList.length > 0) {
      data.adList = [];
      removed += 1;
    }

    if (Array.isArray(data?.adInfos) && data.adInfos.length > 0) {
      data.adInfos = [];
      removed += 1;
    }
  } else if (
    /\/ResourceCGI\/MatchWidgets(?:\?.*)?$/.test(url)
  ) {
    if (Array.isArray(data?.bannerList)) {
      removed = data.bannerList.length;
      data.bannerList = [];
    }
  } else if (
    /\/ResourceCGI\/ColumnWidget(?:\?.*)?$/.test(url)
  ) {
    const title = data?.jumpData?.param?.title || "";
    const widgetUrl = data?.jumpData?.param?.url || "";

    if (data && (data.img || title || widgetUrl)) {
      obj.data = null;
      removed = 1;
    }
  }

  console.log(`Aegis: removed ${removed} item(s).`);

  $done({
    body: JSON.stringify(obj)
  });
} catch (error) {
  console.log(`Aegis error: ${error}`);
  $done({});
}
