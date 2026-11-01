// Where the app lives and which Playwright to use. Set PW to a Playwright install if it isn't a dependency here.
const path = require('path');
const dir = process.env.STAGEHAND_DIR ? path.resolve(process.env.STAGEHAND_DIR) : path.resolve(__dirname, '..');   // STAGEHAND_DIR=dist tests the release build
module.exports = { dir, root: 'file://' + dir + '/', url: 'file://' + dir + '/index.html', pw: process.env.PW || 'playwright' };
