// VM0 Mobile DS — 修正版图标替换(替代闯祸的 08+09+10)
//
// 教训:08 用 fontSize 尺寸 + 顶左定位放图标,再靠 09(居中)/10(缩窄)硬凑 →
//   把结构性容器(tab bar 按钮圆背景、stepper 单元、segmented 选项)改坏了(塌成方块/移位/变色)。
// 正确做法:替换时读原字形的完整 footprint(尺寸+布局属性),用一个"透明 wrapper"占住同样的 footprint,
//   Tabler 图标在 wrapper 里【居中】、按自然方形尺寸(≈fontSize)显示。
//   → slot 尺寸零变化,图标天然居中,不需要任何事后对齐/缩窄。
//
// 只处理主组件里的字形(排除 INSTANCE 内,实例自动继承);每页一次 setCurrentPage;多页并行改 PAGE_NAME。

const PAGE_NAME = "Buttons"; // ← 改成目标页

const ip = figma.root.children.find(p => p.name === "Tabler Icons");
const cb = {};
for (const c of ip.children) if (c.type === "COMPONENT" && c.name.startsWith("icon/")) cb[c.name.slice(5)] = c;

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
    const inAL = parent.layoutMode && parent.layoutMode !== "NONE";
    // 捕获原字形几何
    const gW=g.width, gH=g.height, gx=g.x, gy=g.y;
    const gLPos=g.layoutPositioning, gLGrow=g.layoutGrow, gLAlign=g.layoutAlign;
    const gLH=inAL?g.layoutSizingHorizontal:null, gLV=inAL?g.layoutSizingVertical:null;
    const gConstraints = g.constraints;
    const paint = (g.fills && g.fills[0] && g.fills[0].type==="SOLID") ? Object.assign({}, g.fills[0]) : null;
    const iconSize = Math.max(12, Math.round(g.fontSize)); // 图标自然方形尺寸

    // 透明 wrapper 占住原字形 footprint,内部居中
    const wrap = figma.createFrame();
    wrap.name = "Icon";
    wrap.clipsContent = false;
    wrap.fills = [];
    parent.insertChild(idx, wrap);
    wrap.layoutMode = "HORIZONTAL";
    wrap.primaryAxisSizingMode="FIXED"; wrap.counterAxisSizingMode="FIXED";
    wrap.primaryAxisAlignItems="CENTER"; wrap.counterAxisAlignItems="CENTER";
    wrap.paddingLeft=wrap.paddingRight=wrap.paddingTop=wrap.paddingBottom=0; wrap.itemSpacing=0;
    wrap.resize(Math.max(1,gW), Math.max(1,gH));

    // 复原 wrapper 在父级里的定位/占位
    if (inAL) {
      wrap.layoutPositioning = gLPos;
      if (gLPos === "ABSOLUTE") { wrap.x=gx; wrap.y=gy; }
      else {
        try { wrap.layoutGrow = gLGrow; } catch(e){}
        try { wrap.layoutAlign = gLAlign; } catch(e){}
        try { if (gLH) wrap.layoutSizingHorizontal = gLH; } catch(e){}
        try { if (gLV) wrap.layoutSizingVertical = gLV; } catch(e){}
      }
    } else {
      wrap.x=gx; wrap.y=gy;
      try { wrap.constraints = gConstraints; } catch(e){}
    }

    // 图标居中放入 wrapper
    const icon = cb[name].createInstance();
    wrap.appendChild(icon);
    icon.layoutSizingHorizontal="FIXED"; icon.layoutSizingVertical="FIXED";
    icon.resize(iconSize, iconSize);
    icon.name = "icon/" + name;
    if (paint) {
      const isF = FILLED.has(name);
      for (const v of icon.findAll(n => n.type==="VECTOR" || n.type==="BOOLEAN_OPERATION")) {
        if (isF) v.fills=[paint]; else v.strokes=[paint];
      }
    }
    g.remove();
    replaced++;
  } catch(e) { fail++; }
}
return { page: PAGE_NAME, replaced, skipped, fail };

// 无 Tabler 对应、保留 SF:⌥ option(100195)、🐢(1004D1)、🐇(1004CF)—— 不在 MAP 里,自动跳过。
// 跑完直接就是对齐好的,不需要 09/10。验证:图标绝对中心 vs 容器中心应≈0。
