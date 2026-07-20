// VM0 Mobile DS — 把组件里的 SF Symbol 字形替换成 Tabler 图标实例
// 前置:先在文件里建好 `icon/*` Tabler 组件(见 assets/tabler/ + 建组件的三批脚本)。
// 关键点:
//  - SF Symbols = SF Pro 字体的私用区字形,codepoint >= 0x100000(emoji 在 0x1F000 段,天然排除)
//  - 只处理主组件里的节点(排除 INSTANCE 内),实例会自动跟随
//  - 尺寸取字形 fontSize;颜色从字形 fill 搬到矢量(outline→stroke, filled→fill),
//    并保留 boundVariables(图标继续跟随主题)
//  - 无 Tabler 对应的保留 SF:⌥ option(U+100195)、🐢 turtle(U+1004D1)、🐇 rabbit(U+1004CF)
// 每页一次 setCurrentPage;多页并行(改 PAGE_NAME)。

const PAGE_NAME = "Buttons"; // ← 改成目标页

const ip = figma.root.children.find(p => p.name === "Tabler Icons");
const cb = {};
for (const c of ip.children) if (c.type === "COMPONENT" && c.name.startsWith("icon/")) cb[c.name.slice(5)] = c;

// codepoint(hex, 大写) → Tabler 图标名
const MAP = {
  "100000":"circle","100054":"circle","100157":"typography","100174":"info-circle","100176":"text-size",
  "100184":"x","100185":"check","100188":"chevron-down","100194":"command","100211":"trash","100215":"folder",
  "100243":"copy","100307":"menu-2","1004DE":"circle-dashed","10017D":"minus","10017C":"plus","1002C2":"star",
  "10018F":"selector","10018A":"chevron-right","10020E":"edit","10012B":"arrow-right","1004D4":"square-dashed",
  "10018D":"chevron-up","10019D":"arrow-up","1002AB":"search","10042B":"clock","100B9F":"layout-grid",
  "10019B":"backspace","100C4D":"arrow-back-up","100C53":"arrow-forward-up","1003B8":"mood-smile",
  "100BF6":"chevron-left","1002B1":"microphone","1002B0":"microphone","100C31":"layout-sidebar",
  "100284":"player-play-filled","100173":"info-circle","1007C8":"diamond","1003DA":"layout-sidebar-right",
  "1002C3":"star-filled","1007C9":"diamond-filled","100001":"circle-filled","1006E4":"triangle-filled",
  "1007C7":"rosette-filled","100093":"square-rounded-filled","100061":"circle-x-filled","100128":"arrow-up"
};
const FILLED = new Set(["circle-filled","circle-x-filled","diamond-filled","player-play-filled",
  "rosette-filled","square-rounded-filled","star-filled","triangle-filled"]);

const page = figma.root.children.find(p => p.name === PAGE_NAME);
await figma.setCurrentPageAsync(page);
try { await figma.loadFontAsync({ family:"SF Pro", style:"Regular" }); } catch(e) {}
try { await figma.loadFontAsync({ family:"SF Pro", style:"Semibold" }); } catch(e) {}

const inInst = n => { let p=n.parent; while(p){ if(p.type==="INSTANCE") return true; p=p.parent; } return false; };
const glyphs = page.findAllWithCriteria({ types:["TEXT"] })
  .filter(t => !inInst(t) && t.characters.length && t.characters.codePointAt(0) >= 0x100000);

let replaced=0, skipped=0, fail=0;
for (const g of glyphs) {
  const cp = g.characters.codePointAt(0).toString(16).toUpperCase();
  const name = MAP[cp];
  if (!name || !cb[name]) { skipped++; continue; }
  try {
    const parent = g.parent, idx = parent.children.indexOf(g);
    const size = Math.max(14, Math.round(g.fontSize));
    const paint = (g.fills && g.fills[0] && g.fills[0].type === "SOLID") ? Object.assign({}, g.fills[0]) : null;
    const inst = cb[name].createInstance();
    parent.insertChild(idx, inst);
    inst.resize(size, size);
    inst.name = "icon/" + name;
    if (paint) {
      const isF = FILLED.has(name);
      for (const v of inst.findAll(n => n.type === "VECTOR" || n.type === "BOOLEAN_OPERATION")) {
        if (isF) v.fills = [paint]; else v.strokes = [paint];
      }
    }
    if (parent.layoutMode && parent.layoutMode !== "NONE") {
      try { inst.layoutSizingHorizontal = "FIXED"; inst.layoutSizingVertical = "FIXED"; } catch(e) {}
    } else { inst.x = g.x; inst.y = g.y; }
    g.remove();
    replaced++;
  } catch(e) { fail++; }
}
return { page: PAGE_NAME, replaced, skipped, fail };

// 已跑(2026-07-17,0 fail,共 ~288):Steppers6 Buttons84 Lists16 Menus91(skip12) Toolbars40
// Sidebars34 TabBars12 TextFields1 PopupButtons2 EmptyStates2;Sliders skip30(龟兔保留)。
// Sheets/Toggles/Popovers/PageControls/Progress = 0(图标来自其他页组件实例,自动跟随)。
// 未做:Examples(演示屏,含 emoji + 一次性图标);[System] 13 页(不需要)。
