// VM0 Mobile DS — Step 3: 34 个 Text Styles 从 SF Pro → Noto Sans(字号/行高不动)
// 字重映射:Regular/Bold 直译,Semibold→SemiBold,*Italic 对应斜体。

const MAP = {
  "Regular": "Regular", "Bold": "Bold", "Semibold": "SemiBold",
  "Semibold Italic": "SemiBold Italic", "Regular Italic": "Italic",
  "Bold Italic": "Bold Italic", "Italic": "Italic"
};

for (const style of [...new Set(Object.values(MAP))]) {
  await figma.loadFontAsync({ family: "Noto Sans", style });
}

const styles = await figma.getLocalTextStylesAsync();
const changed = [], skipped = [];
for (const s of styles) {
  if (s.fontName.family !== "SF Pro") { skipped.push(s.name + " (" + s.fontName.family + ")"); continue; }
  const target = MAP[s.fontName.style];
  if (!target) { skipped.push(s.name + " (unmapped: " + s.fontName.style + ")"); continue; }
  s.fontName = { family: "Noto Sans", style: target };
  changed.push(s.name);
}
return { changedCount: changed.length, changed, skipped };
