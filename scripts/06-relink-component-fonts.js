// VM0 Mobile DS — 组件字体重链:把主组件里"真文字"节点的 SF Pro → Noto Sans
// 关键:跳过 SF Symbols 图标节点(字符码点 >= U+E000),否则图标字形会碎。
// 只改主组件(排除 INSTANCE 内节点),保证传播到所有实例。
// 每页一次 setCurrentPage;多页请一页一个 use_figma 调用并行跑(改 PAGE_NAME)。

const PAGE_NAME = "Lists"; // ← 换成目标页名

const NOTO = ["Regular","Italic","Medium","Medium Italic","SemiBold","SemiBold Italic","Bold","Bold Italic","Light","Light Italic","Black","Thin","ExtraLight","ExtraBold"];
for (const s of NOTO) await figma.loadFontAsync({ family: "Noto Sans", style: s });

const MAP = {
  "Regular":"Regular","Italic":"Italic","Text":"Regular","Regular Italic":"Italic",
  "Medium":"Medium","Medium Italic":"Medium Italic",
  "Semibold":"SemiBold","Semibold Italic":"SemiBold Italic",
  "Bold":"Bold","Bold Italic":"Bold Italic",
  "Light":"Light","Light Italic":"Light Italic",
  "Thin":"Thin","Ultralight":"ExtraLight","Heavy":"Black","Black":"Black"
};

const inInstance = n => { let p = n.parent; while (p) { if (p.type === "INSTANCE") return true; p = p.parent; } return false; };
const isIcon = t => { for (const ch of t.characters) if (ch.codePointAt(0) >= 0xE000) return true; return false; }; // SF Symbols

const page = figma.root.children.find(p => p.name === PAGE_NAME);
await figma.setCurrentPageAsync(page);

let fixed = 0, skippedIcon = 0, unmapped = [];
for (const t of page.findAllWithCriteria({ types: ["TEXT"] }).filter(n => !inInstance(n))) {
  if (isIcon(t)) { skippedIcon++; continue; }
  for (const seg of t.getStyledTextSegments(["fontName"])) {
    if (seg.fontName.family !== "SF Pro") continue;
    const tgt = MAP[seg.fontName.style];
    if (!tgt) { if (!unmapped.includes(seg.fontName.style)) unmapped.push(seg.fontName.style); continue; }
    t.setRangeFontName(seg.start, seg.end, { family: "Noto Sans", style: tgt });
    fixed++;
  }
}
return { page: PAGE_NAME, fixedSegments: fixed, skippedIcon, unmapped };

// 已跑过的页(2026-07-17): Buttons24 TextFields4 Lists65 Examples9 Menus78 SegmentedControls2
// TabBars8 Toolbars38 PopupButtons2 ProgressIndicators1 Sidebars18 EmptyStates7 = 256 段。
