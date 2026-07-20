// VM0 Mobile DS — 修复 08 图标替换引入的错位 + 给图标槽加 auto-layout
//
// 背景:08 把字形换成固定尺寸图标实例时,在 layout=NONE 的父级里用了 x=g.x/y=g.y
// (字形左上角),但 SF Symbol 是在更高的文本框里居中渲染的,所以图标偏到了左上角。
// (auto-layout 父级里的图标不受影响 —— Toolbars/TabBars/TextFields 全 OK。)
//
// 两步,均只处理主组件里的图标(排除 INSTANCE 内,实例自动继承);每页一次 setCurrentPage。

const PAGE_NAME = "Buttons"; // ← 改成目标页

const page = figma.root.children.find(p => p.name === PAGE_NAME);
await figma.setCurrentPageAsync(page);
const inInst = n => { let p=n.parent; while(p){ if(p.type==="INSTANCE") return true; p=p.parent; } return false; };
const icons = page.findAll(n => n.type==="INSTANCE" && n.name && n.name.startsWith("icon/") && !inInst(n));

// --- Step 1:NONE 父级里的图标在父级内居中 ---
// 小父级(≤64px 双向,即图标槽)→ 水平+垂直居中;宽父级(行)→ 仅垂直居中、保留 x
let centered = 0;
for (const ic of icons) {
  const p = ic.parent;
  if (p.layoutMode && p.layoutMode !== "NONE") continue;
  try {
    const pW=p.width, pH=p.height;
    if (pW<=64 && pH<=64) { ic.x=Math.round((pW-ic.width)/2); ic.y=Math.round((pH-ic.height)/2); }
    else { ic.y=Math.round((pH-ic.height)/2); }
    centered++;
  } catch(e) {}
}

// --- Step 2:把"单子节点的图标槽"父级转成 auto-layout 居中(永久稳固) ---
// 只转单子节点(避免打乱有背景等多子节点的容器);多子节点保留 Step 1 的居中。
let al = 0;
const seen = new Set();
for (const ic of icons) {
  const p = ic.parent;
  if (!p || seen.has(p.id)) continue; seen.add(p.id);
  if (p.layoutMode && p.layoutMode !== "NONE") continue;
  if (p.children.length !== 1 || p.width > 64 || p.height > 64) continue;
  try {
    const w=p.width, h=p.height;
    p.layoutMode="HORIZONTAL";
    p.primaryAxisSizingMode="FIXED"; p.counterAxisSizingMode="FIXED";
    p.primaryAxisAlignItems="CENTER"; p.counterAxisAlignItems="CENTER";
    p.paddingLeft=p.paddingRight=p.paddingTop=p.paddingBottom=0; p.itemSpacing=0;
    p.resize(w,h);
    ic.layoutSizingHorizontal="FIXED"; ic.layoutSizingVertical="FIXED";
    al++;
  } catch(e) {}
}
return { page: PAGE_NAME, centered, autoLayoutSlots: al };

// 已跑(2026-07-17,0 fail):居中 61(Buttons36 Menus8 Sidebars6 Steppers6 Lists4 EmptyStates1);
// 图标槽转 auto-layout 59(Buttons36 Menus8 Sidebars6 Steppers6 Lists3);2 个多子节点槽保留居中。
// NOTE:setBoundVariable / x 在"实例内的节点"上会抛错 —— 必须 inInst 过滤只改主组件。
