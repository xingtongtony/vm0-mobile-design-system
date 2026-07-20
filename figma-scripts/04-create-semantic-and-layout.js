// VM0 Mobile DS — Step 4: 建 VM0 Semantic(Light/Dark)+ VM0 Layout(数值 token)
// 依赖 VM0 Primitives 已存在(脚本 01)。

const cols = await figma.variables.getLocalVariableCollectionsAsync();
const prim = cols.find(c => c.name === "VM0 Primitives");
const pid = {};
for (const id of prim.variableIds) { const v = await figma.variables.getVariableByIdAsync(id); pid[v.name] = v.id; }
const alias = name => ({ type: "VARIABLE_ALIAS", id: pid[name] });
function hex(h, a) { const n = parseInt(h.slice(1),16); const c = {r:((n>>16)&255)/255,g:((n>>8)&255)/255,b:(n&255)/255}; if(a!==undefined)c.a=a; return c; }

// --- VM0 Semantic ---
const sem = figma.variables.createVariableCollection("VM0 Semantic");
sem.renameMode(sem.modes[0].modeId, "Light");
const SL = sem.modes[0].modeId;
const SD = sem.addMode("Dark");
const CSCOPES = ["FRAME_FILL", "SHAPE_FILL", "TEXT_FILL", "STROKE_COLOR"];
const semDefs = [
  ["Link", alias("Status/Link Light"), alias("Status/Link Dark")],
  ["Tint Pressed", alias("Primary/800"), alias("Primary/Tint Dark Pressed")],
  ["Tint Subtle BG", alias("Primary/100"), hex("#FF6321",0.16)],
  ["Subtle BG/Success", hex("#E4F1EA"), hex("#34B368",0.18)],
  ["Subtle BG/Destructive", hex("#FDECEC"), hex("#FF5C5C",0.18)],
  ["Subtle BG/Done", hex("#ECE9FA"), hex("#9A8CF0",0.18)],
  ["Subtle BG/Warning", hex("#FBEEDD"), hex("#E8912E",0.18)],
  ["Subtle BG/Link", hex("#E5EEF9"), hex("#5B9BF0",0.18)]
];
for (const [name, lv, dv] of semDefs) {
  const v = figma.variables.createVariable(name, sem, "COLOR");
  v.scopes = CSCOPES; v.setValueForMode(SL, lv); v.setValueForMode(SD, dv);
}

// --- VM0 Layout ---
const lay = figma.variables.createVariableCollection("VM0 Layout");
lay.renameMode(lay.modes[0].modeId, "Value");
const LM = lay.modes[0].modeId;
const radiusDefs = [["Radius/xs",4],["Radius/sm",6],["Radius/md",8],["Radius/lg",12],["Radius/card",16],["Radius/xl",20],["Radius/full",999]];
const spaceDefs = [["Spacing/2",2],["Spacing/4",4],["Spacing/8",8],["Spacing/12",12],["Spacing/16",16],["Spacing/20",20],["Spacing/24",24],["Spacing/32",32],["Spacing/40",40],["Spacing/48",48],["Rule/Touch Target Min",44],["Rule/Screen Margin",16]];
for (const [name, val] of radiusDefs) { const v = figma.variables.createVariable(name, lay, "FLOAT"); v.scopes = ["CORNER_RADIUS"]; v.setValueForMode(LM, val); }
for (const [name, val] of spaceDefs) { const v = figma.variables.createVariable(name, lay, "FLOAT"); v.scopes = ["GAP","WIDTH_HEIGHT"]; v.setValueForMode(LM, val); }

return { semantic: semDefs.length, layout: radiusDefs.length + spaceDefs.length };
