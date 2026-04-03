const db = require('../database/db');
const logger = require('./logger');
const fs = require('fs');
const path = require('path');
const configPath = path.join(__dirname, '../../config.json');

module.exports = {
    async evaluatePunishment(client, member, guild, reason) {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        
        // Count warnings
        const stmt = db.prepare('SELECT COUNT(*) as count FROM warnings WHERE userId = ? AND guildId = ?');
        const warningCount = stmt.get(member.id, guild.id).count;

        const punishments = config.punishments;
        const action = punishments[warningCount.toString()];

        if (!action) return; // No punishment at this threshold

        try {
            if (action === 'timeout') {
                // Timeout for 1 hour by default for auto-punish timeout
                await member.timeout(60 * 60 * 1000, `Auto Punish (Reach ${warningCount} warnings): ${reason}`);
                logger.logAction(client, {
                    action: 'TIMEOUT',
                    user: member.user,
                    moderator: client.user,
                    reason: `Auto-Timeout reached warning threshold (${warningCount})`
                });
            } else if (action === 'kick') {
                await member.kick(`Auto Punish (Reach ${warningCount} warnings): ${reason}`);
                logger.logAction(client, {
                    action: 'KICK',
                    user: member.user,
                    moderator: client.user,
                    reason: `Auto-Kick reached warning threshold (${warningCount})`
                });
            } else if (action === 'ban') {
                await member.ban({ reason: `Auto Punish (Reach ${warningCount} warnings): ${reason}` });
                logger.logAction(client, {
                    action: 'BAN',
                    user: member.user,
                    moderator: client.user,
                    reason: `Auto-Ban reached warning threshold (${warningCount})`
                });
            } else if (action === 'warn') {
                // If the punishment is a warning itself, we log another warning into the db? We probably shouldn't loop warnings.
            }
        } catch (err) {
            console.error('[AutoPunish Error]', err);
        }
    }
};
