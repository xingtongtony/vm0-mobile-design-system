// VM0 Mobile DS — 修复"字形当遮罩上色"被图标替换破坏的组件
//
// 发现:Apple kit 里某些图标(仅 Tab Bars 的 3 处选中态)用【字形 isMask=true】遮罩
//   叠在上面的 tint 矩形,从而给图标形状上色。图标替换把字形删了 → 遮罩没了 →
//   tint 矩形露成整块方块(且我把 tint 从蓝改橙后更扎眼)。
// 修法:①恢复被连带缩小的 Frame 与 tint 矩形尺寸(从干净文件按 id 读回);
//   ②把替换后的图标设成 isMask=true 并移到第一子 → 恢复遮罩上色。
//
// 定位:在干净文件按 `n.type==="TEXT" && n.isMask && cp>=0x100000` 扫描,得知
//   只有 Tab Bars 用了(3 处)。其余 40 页全 0。node id 在干净↔VM0 两文件间通用,
//   所以可按 id 读干净几何、写回 VM0。
//
// 已修(2026-07-17,VM0 文件 Ens34au82o2S3M5BYyrUXO):
//   _Tab Bar Button - iPhone - Search 的 2 个选中变体(Frame 10464:35380/35381 → 38x28,
//     叠加矩形 10464:35385/35386/35388/35389 → 54x54,内部 icon/search 设 isMask);
//   layout-sidebar 选中态(Frame 10464:35410 → 22x20,叠加 10464:35439/35440 → 54x36,
//     内部 icon/layout-sidebar 设 isMask)。
//
// 关键教训:图标替换前要检测 glyph.isMask —— 是遮罩的字形不能简单替换成普通图标,
//   必须让替换件也当遮罩(或保留原字形)。geometry-preserving 脚本(11)也需加这一步。

// 通用模板(逐个 mask 组件):在 VM0 文件里,对每个 [frameId, frameW, frameH, [overlayIds], [overlayW,overlayH]]:
async function fixMaskIcon(frameId, fw, fh, overlays, ow, oh) {
  const f = await figma.getNodeByIdAsync(frameId);
  if (!f) return "frame missing";
  f.primaryAxisSizingMode="FIXED"; f.counterAxisSizingMode="FIXED";
  f.primaryAxisAlignItems="CENTER"; f.counterAxisAlignItems="CENTER";
  f.resize(fw, fh);
  const ic = f.findOne(n => n.type==="INSTANCE" && n.name && n.name.startsWith("icon/"));
  if (ic) { ic.layoutSizingHorizontal="FIXED"; ic.layoutSizingVertical="FIXED"; f.insertChild(0, ic); ic.isMask = true; }
  for (const id of overlays) { const r = await figma.getNodeByIdAsync(id); if (r) r.resize(ow, oh); }
  return "ok";
}
// 示例调用:
// await fixMaskIcon("10464:35380", 38,28, ["10464:35385","10464:35386"], 54,54);
