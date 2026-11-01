// Where the app lives and which Playwright to use. Set PW to a Playwright install if it isn't a dependency here.
const path = require('path');
const dir = path.resolve(__dirname, '..');
module.exports = { dir, root: 'file://' + dir + '/', url: 'file://' + dir + '/index.html', pw: process.env.PW || 'playwright' };
