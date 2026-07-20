// VM0 Mobile DS — Step 2: 把 Apple「Colors」集合的 63 个变量重接到 VM0 值
// 分两批(此文件含两批,分开跑更稳)。Light mode = "404:0", Dark = "404:1"(如 ID 漂移请按名重取 mode)。
// 依赖 VM0 Primitives 已存在(脚本 01)。

// ===== 批次 1:Accents / Labels / Backgrounds =====
async function batch1() {
  const L = "404:0", D = "404:1";
  const cols = await figma.variables.getLocalVariableCollectionsAsync();
  const prim = cols.find(c => c.name === "VM0 Primitives");
  const pid = {};
  for (const id of prim.variableIds) { const v = await figma.variables.getVariableByIdAsync(id); pid[v.name] = v.id; }
  const alias = name => ({ type: "VARIABLE_ALIAS", id: pid[name] });
  function hex(h, a) { const n = parseInt(h.slice(1),16); const c = {r:((n>>16)&255)/255,g:((n>>8)&255)/255,b:(n&255)/255}; if(a!==undefined)c.a=a; return c; }

  // [appleVarId, light, dark, newName?] — appleVarId 来自审计;若文件重传后 ID 变了，改用按 name 查找。
  const edits = [
    ["VariableID:507:29166", alias("Primary/700"), alias("Primary/Tint Dark"), "Accents/Tint"],
    ["VariableID:509:77471", alias("Status/Destructive Light"), alias("Status/Destructive Dark")],
    ["VariableID:509:77474", alias("Status/Success Light"), alias("Status/Success Dark")],
    ["VariableID:509:77480", alias("Status/Done Light"), alias("Status/Done Dark")],
    ["VariableID:509:77472", alias("Status/Warning Light"), alias("Status/Warning Dark")],
    ["VariableID:5473:20629", hex("#EF4444",0.14), hex("#FF5C5C",0.14)],
    ["VariableID:507:29167", alias("Gray/950"), alias("Gray/50")],
    ["VariableID:507:29162", hex("#3C4351",0.6), hex("#E7EBF5",0.7)],
    ["VariableID:508:77449", hex("#3C4351",0.3), hex("#E7EBF5",0.3)],
    ["VariableID:508:77450", hex("#3C4351",0.18), hex("#E7EBF5",0.16)],
    ["VariableID:508:77440", hex("#FFFFFF"), hex("#0C0E12")],
    ["VariableID:508:77460", alias("Gray/50"), alias("Gray/900")],
    ["VariableID:508:77458", hex("#FFFFFF"), hex("#22262F")],
    ["VariableID:5719:30767", hex("#FFFFFF"), alias("Gray/900")],
    ["VariableID:5719:30768", alias("Gray/50"), hex("#22262F")],
    ["VariableID:5719:30769", hex("#FFFFFF"), hex("#2B313C")],
    ["VariableID:508:77464", alias("Gray/50"), hex("#0C0E12")],
    ["VariableID:508:77466", hex("#FFFFFF"), alias("Gray/900")],
    ["VariableID:508:77468", alias("Gray/50"), hex("#22262F")],
    ["VariableID:5719:30770", alias("Gray/50"), alias("Gray/900")],
    ["VariableID:5719:30771", hex("#FFFFFF"), hex("#22262F")],
    ["VariableID:5719:30772", alias("Gray/50"), hex("#2B313C")]
  ];
  const mutated = [];
  for (const [id, lv, dv, newName] of edits) {
    const v = await figma.variables.getVariableByIdAsync(id);
    v.setValueForMode(L, lv); v.setValueForMode(D, dv);
    if (newName) v.name = newName; mutated.push(v.name);
  }
  return mutated;
}

// ===== 批次 2:Grays / Fills / Separators / Sidebar =====
async function batch2() {
  const L = "404:0", D = "404:1";
  const cols = await figma.variables.getLocalVariableCollectionsAsync();
  const prim = cols.find(c => c.name === "VM0 Primitives");
  const pid = {};
  for (const id of prim.variableIds) { const v = await figma.variables.getVariableByIdAsync(id); pid[v.name] = v.id; }
  const alias = name => ({ type: "VARIABLE_ALIAS", id: pid[name] });
  function hex(h, a) { const n = parseInt(h.slice(1),16); const c = {r:((n>>16)&255)/255,g:((n>>8)&255)/255,b:(n&255)/255}; if(a!==undefined)c.a=a; return c; }

  const edits = [
    ["VariableID:509:77485", alias("Gray/600"), alias("Gray/600")],
    ["VariableID:509:77486", alias("Gray/500"), alias("Gray/800")],
    ["VariableID:509:77487", alias("Gray/400"), hex("#434A57")],
    ["VariableID:509:77488", alias("Gray/300"), hex("#343A45")],
    ["VariableID:509:77489", alias("Gray/100"), hex("#262B34")],
    ["VariableID:509:77490", alias("Gray/50"), alias("Gray/900")],
    ["VariableID:508:77441", hex("#788192",0.2), hex("#788192",0.36)],
    ["VariableID:509:77491", hex("#788192",0.16), hex("#788192",0.32)],
    ["VariableID:509:77493", hex("#788192",0.12), hex("#788192",0.24)],
    ["VariableID:509:77492", hex("#788192",0.08), hex("#788192",0.18)],
    ["VariableID:508:77442", hex("#C5CBD5"), hex("#333944")],
    ["VariableID:509:77495", hex("#14171D",0.12), hex("#E7EBF5",0.17)],
    ["VariableID:10473:46127", alias("Primary/100"), hex("#2E2018")],
    ["VariableID:10473:46128", alias("Gray/50"), hex("#101319")]
  ];
  const mutated = [];
  for (const [id, lv, dv] of edits) {
    const v = await figma.variables.getVariableByIdAsync(id);
    v.setValueForMode(L, lv); v.setValueForMode(D, dv); mutated.push(v.name);
  }
  return mutated;
}

return { batch1: await batch1(), batch2: await batch2() };
