// test helper: the old mood looks, rebuilt from the app's own pieces, so lighting tests can set up a scene in one line
window.moodLook = m => {
  const MOODS = [['Calm', 80, ['Blue', 'Congo'], 70], ['Celebration', 100, ['Amber', 'Magenta', 'Cyan'], 100], ['Reflective', 55, ['Blue'], 45], ['Christmas', 90, ['Red', 'Amber'], 85], ['Easter', 95, ['Pink', 'Yellow', 'Cyan'], 75]];
  const [name, frontD, cols, d] = MOODS.find(x => x[0] === m), others = deskLights().filter(i => !isFrontLight(i)).sort((a, b) => a.x - b.x), fx = {};
  for (const it of deskLights()) if (isFrontLight(it)) fx[it.id] = { ...DESK_PRESETS[0][1], d: frontD };
  others.forEach((it, k) => { fx[it.id] = { ...DESK_PRESETS.find(p => p[0] === cols[k % cols.length])[1], d }; });
  fadeLooksFrom(); desk.add = false; desk.prevLook = curLook()?.id;
  mutate(() => { plan.looks ||= []; const n = plan.looks.filter(l => l.name === name || l.name.startsWith(name + ' ')).length, L = { id: uid(), name: n ? `${name} ${n + 1}` : name, fx }; plan.looks.push(L); plan.lookId = L.id; }, `${name} look added`);
  renderDesk();
};
