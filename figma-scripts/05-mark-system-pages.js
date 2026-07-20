// VM0 Mobile DS — 给系统级组件页加 [System] 前缀(参考、不碰)。可逆:去掉前缀即还原。

const systemPages = [
  "Keyboards", "Alerts", "Action Sheets", "Activity Views", "Face ID",
  "Notifications", "Color Pickers", "Date and Time Pickers", "Contextual Menus",
  "Status Bars and Menu Bars", "Widgets", "Windows", "App Icons"
];
const renamed = [], notFound = [];
for (const name of systemPages) {
  const page = figma.root.children.find(p => p.name === name);
  if (!page) { notFound.push(name); continue; }
  if (page.name.startsWith("[System]")) { renamed.push(name + " (already)"); continue; }
  page.name = "[System] " + name;
  renamed.push(page.name);
}
return { renamedCount: renamed.length, renamed, notFound };
