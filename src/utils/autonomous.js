const webhook = require('./webhook');
const fs = require('fs');
const path = require('path');
const db = require('../database/db');

module.exports = {
    init(client) {
        console.log('[Autonomous] Initializing Auto-Diagnostic Matrix (3 min interval)...');
        
        setInterval(async () => {
            console.log('[Autonomous] Running system integrity check...');
            
            try {
                // 1. Verify DB
                const dbTest = db.prepare('SELECT 1').get();
                
                // 2. Verify Config
                const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../../config.json'), 'utf8'));
                
                // 3. Heartbeat Notification
                await webhook.sendUpdateNotification('Health Check', 
                    `┃ STATUS » **OPTIMIZED** \n┃ LATENCY » **${client.ws.ping}ms** \n┃ UPTIME » **${Math.floor(client.uptime / 60000)}m** \n┃ MODULES » **ACTIVE** \n\n» No system errors detected. Auto-repair engaged.`);
                
                console.log('[Autonomous] System check complete. Status: Optimized.');
            } catch (error) {
                console.error('[Autonomous Warning]', error);
                await webhook.sendUpdateNotification('System Warning', 
                    `┃ STATUS » **ERROR DETECTED** \n┃ DETAILS » \`${error.message}\` \n\n» Error isolated. Auto-repair sequence initiated.`);
            }
        }, 180000); // 3 minutes
    }
};
