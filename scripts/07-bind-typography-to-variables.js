// VM0 Mobile DS — 让字体真正"变量驱动"(修正 06 只改字体不绑变量的问题)
//
// 关键认知:这套 Apple kit 的字体本就该由 `Kit` 集合里的变量驱动:
//   - Typography/Font family/*  (STRING, scope FONT_FAMILY)  ← 字体族总开关
//   - Typography/Font Weight/*  (STRING, scope FONT_STYLE)   ← 字重
// 之前只改了字体族的"原始值",没动这些变量 → 有些文字仍解析成 SF Pro。
//
// 正确三步(本文件含前两步;第三步见文末)。仅在 PAID 空间可写多 mode。

// ===== Step A:改变量值(字体族→Noto Sans,字重→Noto 命名)=====
async function stepA() {
  const cols = await figma.variables.getLocalVariableCollectionsAsync();
  const kit = cols.find(c => c.name === "Kit");
  const mode = kit.modes[0].modeId;
  const bn = {};
  for (const id of kit.variableIds) { const v = await figma.variables.getVariableByIdAsync(id); bn[v.name] = v; }
  const fam = bn["Typography/Font family/SF Pro"];
  fam.setValueForMode(mode, "Noto Sans");
  fam.name = "Typography/Font family/Noto Sans";
  const weightFix = {
    "Typography/Font Weight/Regular":"Regular","Typography/Font Weight/Regular-italic":"Italic",
    "Typography/Font Weight/Medium":"Medium","Typography/Font Weight/Medium-italic":"Medium Italic",
    "Typography/Font Weight/Semibold":"SemiBold","Typography/Font Weight/Semibold-italic":"SemiBold Italic",
    "Typography/Font Weight/Bold":"Bold"
  };
  for (const [n, val] of Object.entries(weightFix)) if (bn[n]) bn[n].setValueForMode(mode, val);
  return "stepA done";
}

// ===== Step B:把 34 个 text style 的 fontFamily/fontStyle 绑到变量 =====
async function stepB() {
  const NOTO = ["Regular","Italic","Medium","Medium Italic","SemiBold","SemiBold Italic","Bold","Bold Italic"];
  for (const s of NOTO) { try { await figma.loadFontAsync({ family:"Noto Sans", style:s }); } catch(e){} }
  try { await figma.loadFontAsync({ family:"Noto Sans Symbols2", style:"Regular" }); } catch(e){}
  const cols = await figma.variables.getLocalVariableCollectionsAsync();
  const kit = cols.find(c => c.name === "Kit"); const bn = {};
  for (const id of kit.variableIds) { const v = await figma.variables.getVariableByIdAsync(id); bn[v.name] = v; }
  const fam = bn["Typography/Font family/Noto Sans"];
  const WV = {"Regular":"Typography/Font Weight/Regular","Italic":"Typography/Font Weight/Regular-italic","Medium":"Typography/Font Weight/Medium","Medium Italic":"Typography/Font Weight/Medium-italic","SemiBold":"Typography/Font Weight/Semibold","SemiBold Italic":"Typography/Font Weight/Semibold-italic","Bold":"Typography/Font Weight/Bold"};
  const styles = await figma.getLocalTextStylesAsync(); let done = 0;
  for (const s of styles) {
    try {
      try { await figma.loadFontAsync(s.fontName); } catch(e){}
      s.setBoundVariable("fontFamily", fam);
      const wv = WV[s.fontName.style]; if (wv && bn[wv]) s.setBoundVariable("fontStyle", bn[wv]);
      done++;
    } catch(e){}
  }
  return "stepB bound " + done + " styles";
}

return { a: await stepA(), b: await stepB() };

// ===== Step C(逐页跑):给未链 style 的非图标裸节点绑 fontFamily/fontStyle =====
// 对每个组件页(改 PAGE_NAME)运行:
//   const inInst=n=>{let p=n.parent;while(p){if(p.type==="INSTANCE")return true;p=p.parent;}return false;};
//   const isIcon=t=>{for(const ch of t.characters)if(ch.codePointAt(0)>=0xE000)return true;return false;};
//   遍历 TEXT 节点:跳过 icon、跳过已链 style(textStyleId 是 string);其余 setBoundVariable("fontFamily"/"fontStyle")
// 已跑过的页(2026-07-17,共 256 节点):Lists65 Buttons24 TextFields4 Examples9 Menus78
//   Toolbars38 Sidebars18 TabBars8 SegmentedControls2 PopupButtons2 EmptyStates7 ProgressIndicators1
//
// 验证:改 `Typography/Font family/Noto Sans` 变量的值 → 整个 kit 字体全局切换。
