let body = $response.body;

try {
  const marker = '"moduleType":"module_popup_page"';
  const markerIndex = body.indexOf(marker);

  if (markerIndex === -1) {
    console.log("QQSports VIP Popup Block: popup module not found.");
    $done({ body });
  } else {
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

    const objectStack = [];
    let inString = false;
    let escaped = false;

    for (let i = 0; i <= markerIndex; i++) {
      const ch = body[i];

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
        objectStack.push(i);
      } else if (ch === "}") {
        objectStack.pop();
      }
    }

    let moduleStart = -1;
    let moduleEnd = -1;

    for (let i = objectStack.length - 1; i >= 0; i--) {
      const start = objectStack[i];
      const end = findMatchingBrace(body, start);

      if (end === -1) continue;

      const moduleText = body.slice(start, end + 1);

      if (
        moduleText.includes(marker) &&
        moduleText.includes('"moduleId"') &&
        moduleText.includes('"itemDataLists"')
      ) {
        moduleStart = start;
        moduleEnd = end;
        break;
      }
    }

    if (moduleStart === -1 || moduleEnd === -1) {
      console.log("QQSports VIP Popup Block: module range not found.");
      $done({ body });
    } else {
      let removeStart = moduleStart;
      let removeEnd = moduleEnd;

      let left = moduleStart - 1;
      while (left >= 0 && /\s/.test(body[left])) left -= 1;

      if (body[left] === ",") {
        removeStart = left;
      } else {
        let right = moduleEnd + 1;
        while (right < body.length && /\s/.test(body[right])) right += 1;

        if (body[right] === ",") {
          removeEnd = right;
        }
      }

      body = body.slice(0, removeStart) + body.slice(removeEnd + 1);

      console.log(
        "QQSports VIP Popup Block: removed module_popup_page successfully."
      );

      $done({ body });
    }
  }
} catch (error) {
  console.log(`QQSports VIP Popup Block error: ${error}`);
  $done({});
}
