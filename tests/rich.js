// The original full-band example (10 people, two stage boxes, two distros, subs), for tests written against it
module.exports = () => {
  const p = blankPlan(); p.name = 'Example week — replace with your team'; plan = p; db.plans = { [p.id]: p }; db.currentId = p.id;
  const W = p.stage.w, D = p.stage.d;
  addItem('stagebox', 9.5, 1.4, { label: 'Stage box A 32×16' });
  addItem('stagebox', W / 2, D - 1.2, { label: 'Stage box B 16×8', ins: 16, outsMax: 8 });
  addItem('distro', 5, 1.2, { label: 'Distro SL' }); addItem('distro', W - 5, 1.2, { label: 'Distro SR' });
  addItem('iem_rack', W - 2, 3.6, { label: 'IEM rack' });
  addItem('main_spk', -3, D + 1.5, { label: 'Main L' }); addItem('main_spk', W + 3, D + 1.5, { label: 'Main R' });
  addItem('sub', W / 2 - 4, D + 2, { label: 'Sub L' }); addItem('sub', W / 2 + 4, D + 2, { label: 'Sub R' });
  addItem('foh', W / 2, D + 28, { label: 'FOH console' }); addItem('wall_outlet', W / 2 + 4.2, D + 30, { label: 'FOH outlet' });
  p.team = [['Alex Rivera', 'Worship Leader'], ['Sam Ortiz', 'Vocalist'], ['Jordan Lee', 'Vocalist'], ['Casey Brooks', 'Drums'], ['Morgan Hale', 'Bass'], ['Taylor Kim', 'Electric Guitar'],
    ['Riley Chen', 'Keys', true], ['Jamie Park', 'Tracks / MD'], ['Pastor Chris', 'Pastor / Speaker'], ['Dana Moss', 'FOH Engineer']].map(([name, role, sings]) => ({ id: uid(), name, role, sings: !!sings }));
  buildFromTeam(); autoCable(); view = 'plot'; needFit = true; save(); renderAll();
};
