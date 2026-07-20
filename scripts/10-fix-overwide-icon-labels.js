// VM0 Mobile DS — 修复"过宽标签导致图标水平偏移"(08 图标替换的第二类后遗症)
//
// 症状:图标在按钮/工具栏里水平偏左 ~4px(垂直是正的)。
// 根因:原 SF 字形比 Tabler 图标宽,标签(_Label 类实例)带着旧的固定宽度覆盖;
//   主组件内容缩到 ~19px 后,标签实例没跟着缩(HUG/layoutGrow=0 都压不动固定覆盖),
//   图标在过宽标签里贴左 → 整体视觉中心偏移。
// 修法:把"只含 1 个图标、无真实文字、却比图标宽 >2px"的标签实例,强制 FIXED 并 resize 到图标宽度;
//   父级 auto-layout 的 CENTER 就会把它连图标一起居中。
// 只处理不在其它实例内的标签(inInst 过滤);每页一次 setCurrentPage(多页循环实测可用,略慢)。

const PAGES = ["Buttons","Toolbars","Tab Bars","Sidebars","Lists","Menus","Steppers"]; // 有命中的页

const inInst = n => { let p=n.parent; while(p){ if(p.type==="INSTANCE") return true; p=p.parent; } return false; };
const results = {};
for (const pn of PAGES) {
  const pg = figma.root.children.find(p => p.name === pn);
  await figma.setCurrentPageAsync(pg);
  const wraps = pg.findAll(n => n.type==="INSTANCE" && !inInst(n) && n.name && !n.name.startsWith("icon/"));
  let fixed = 0;
  for (const label of wraps) {
    const icons = label.findAll(x => x.type==="INSTANCE" && x.name && x.name.startsWith("icon/"));
    if (icons.length !== 1) continue;
    // 有真实文字(码点 < 0x100000 且非空)→ 不是纯图标标签,跳过
    const realText = label.findAll(x => x.type==="TEXT" && x.characters && x.characters.trim().length>0 && x.characters.codePointAt(0) < 0x100000);
    if (realText.length > 0) continue;
    const ic = icons[0];
    if (label.width > ic.width + 2) {
      try { label.layoutSizingHorizontal = "FIXED"; label.resize(Math.round(ic.width), label.height); fixed++; } catch(e) {}
    }
  }
  results[pn] = fixed;
}
return results;

// 已跑(2026-07-17,0 fail,共 92):Toolbars49 TabBars18 Lists10 Buttons8(Liquid Glass Symbol)
//   Sidebars4 Steppers2 Menus1。其余页扫描均 0(TextFields/Segmented/Sheets/Sliders/Toggles/
//   PageControls/PopupButtons/Popovers/Progress/EmptyStates)。
// 关键教训:图标替换后要按"图标绝对中心 vs 容器绝对中心"量化验证,不能只看单张截图。
