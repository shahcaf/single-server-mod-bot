const webhook = require('../src/utils/webhook');

(async () => {
    console.log('Sending boot update via webhook...');
    await webhook.sendUpdateNotification('System Online', 'Successfully implemented Automated Update Distribution System. \nLuxury Gold Theme integrated across 25+ modules. \nDeveloper Terminal active.');
    console.log('Update sent!');
})();
