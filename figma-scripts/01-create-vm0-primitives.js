// VM0 Mobile DS — Step 1: 创建 VM0 Primitives 变量集
// 在 Figma MCP (VM0 连接器, fileKey Ens34au82o2S3M5BYyrUXO) 的 use_figma 里运行。
// 幂等提示:重跑会重复创建集合;仅在集合不存在时运行。

const col = figma.variables.createVariableCollection("VM0 Primitives");
col.renameMode(col.modes[0].modeId, "Value");
const mode = col.modes[0].modeId;

function hex(h) {
  const n = parseInt(h.slice(1), 16);
  return { r: ((n >> 16) & 255) / 255, g: ((n >> 8) & 255) / 255, b: (n & 255) / 255 };
}

const SCOPES = ["FRAME_FILL", "SHAPE_FILL", "TEXT_FILL", "STROKE_COLOR"];
const defs = [
  ["Primary/0","#FFFBF7"],["Primary/50","#FCF3F0"],["Primary/100","#FDE7DF"],["Primary/200","#FFD5C5"],
  ["Primary/300","#FFC5B0"],["Primary/400","#FFB69E"],["Primary/500","#F4A288"],["Primary/600","#EB8868"],
  ["Primary/700","#ED4E01"],["Primary/800","#DE3F00"],["Primary/900","#D03200"],["Primary/950","#5C2918"],
  ["Primary/Tint Dark","#FF6321"],["Primary/Tint Dark Pressed","#FF7A45"],
  ["Gray/0","#FAFBFC"],["Gray/50","#F3F5F8"],["Gray/100","#E7EBF0"],["Gray/200","#DCE1E8"],
  ["Gray/300","#D1D7E0"],["Gray/400","#C5CCD7"],["Gray/500","#B2BAC8"],["Gray/600","#9BA3B3"],
  ["Gray/700","#788192"],["Gray/800","#525B68"],["Gray/900","#1A1E26"],["Gray/950","#14171D"],
  ["Status/Success Light","#2A7A4B"],["Status/Success Dark","#34B368"],
  ["Status/Destructive Light","#EF4444"],["Status/Destructive Dark","#FF5C5C"],
  ["Status/Done Light","#6A5ACD"],["Status/Done Dark","#9A8CF0"],
  ["Status/Warning Light","#B35A00"],["Status/Warning Dark","#E8912E"],
  ["Status/Link Light","#2E6FC2"],["Status/Link Dark","#5B9BF0"],
  ["Dataviz/Credit/Free","#3EB7B8"],["Dataviz/Credit/Promotional","#E88033"],
  ["Dataviz/Credit/Pay-as-you-go","#97918A"],["Dataviz/Credit/Plan Pro","#EDC43E"],["Dataviz/Credit/Plan Team","#6B8DE3"],
  ["Dataviz/Usage/Model","#5E6AD2"],["Dataviz/Usage/Image","#EC70A5"],["Dataviz/Usage/Video","#358A8E"],
  ["Dataviz/Usage/Connector","#98928B"],["Dataviz/Usage/Other","#E1C43C"],
  ["Dataviz/Card Accent/1","#D4956A"],["Dataviz/Card Accent/2","#E24B6A"],["Dataviz/Card Accent/3","#E1C43C"],
  ["Dataviz/Card Accent/4","#98928B"],["Dataviz/Card Accent/5","#EC70A5"],["Dataviz/Card Accent/6","#358A8E"],
  ["Dataviz/Avatar/1","#ED4E01"],["Dataviz/Avatar/2","#E0B376"],["Dataviz/Avatar/3","#E26C9E"],
  ["Dataviz/Avatar/4","#45A7A8"],["Dataviz/Avatar/5","#E0BB3C"],["Dataviz/Avatar/6","#FF990A"]
];

const idMap = {};
for (const [name, h] of defs) {
  const v = figma.variables.createVariable(name, col, "COLOR");
  v.scopes = SCOPES;
  v.setValueForMode(mode, hex(h));
  idMap[name] = v.id;
}
return { collectionId: col.id, modeId: mode, created: defs.length, idMap };
