const fs = require('fs');
const path = require('path');
const configPath = path.join(__dirname, '../../config.json');
const db = require('../database/db');
const autoPunish = require('../utils/autoPunish');
const logger = require('../utils/logger');

const userMessages = new Map();

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if (message.author.bot || !message.guild || !message.member) return;

        // Skip automod for admins/mods
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        const hasModPerm = message.member?.roles?.cache?.has(config.roles.admin) || 
                           message.member?.roles?.cache?.has(config.roles.moderator) || 
                           message.member?.permissions?.has('Administrator');
        
        if (hasModPerm) return;

        const { automod } = config;
        let violation = null;

        // 1. Anti Spam
        if (automod.antiSpam.enabled) {
            const { messageLimit, timeWindowMs } = automod.antiSpam;
            const now = Date.now();

            if (!userMessages.has(message.author.id)) {
                userMessages.set(message.author.id, []);
            }

            const timestamps = userMessages.get(message.author.id);
            timestamps.push(now);

            // Filter out old messages
            const validTimestamps = timestamps.filter(t => now - t < timeWindowMs);
            userMessages.set(message.author.id, validTimestamps);

            if (validTimestamps.length > messageLimit) {
                violation = 'Spamming';
                userMessages.set(message.author.id, []); // reset
            }
        }

        // 2. Bad Words
        if (!violation && automod.badWords.enabled) {
            const lowerMessage = message.content.toLowerCase();
            const badWords = automod.badWords.words;
            const isBad = badWords.some(word => lowerMessage.includes(word));
            if (isBad) violation = 'Bad Word usage';
        }

        // 3. Anti Invites
        if (!violation && automod.antiInvites.enabled) {
            if (message.content.match(/(discord\.gg\/|discord\.com\/invite\/)/i)) {
                violation = 'Posting Discord Invites';
            }
        }

        // 4. Anti Links
        if (!violation && automod.antiLinks.enabled) {
            const hasLink = message.content.match(/https?:\/\//i);
            if (hasLink) {
                const whitelisted = automod.antiLinks.whitelist.some(wLink => message.content.includes(wLink));
                if (!whitelisted) {
                    violation = 'Posting Unauthorized Links';
                }
            }
        }

        // 5. Caps Spam
        if (!violation && automod.capsSpam.enabled && message.content.length >= automod.capsSpam.minLength) {
            const textOnly = message.content.replace(/[^a-zA-Z]/g, '');
            if (textOnly.length > 0) {
                const upperCount = (textOnly.match(/[A-Z]/g) || []).length;
                if ((upperCount / textOnly.length) >= automod.capsSpam.threshold) {
                    violation = 'Caps Spam';
                }
            }
        }

        // Punish if violation occurred
        if (violation) {
            try {
                await message.delete();
            } catch (err) { } // Ignore delete errors

            // Add auto warning
            const insertStmt = db.prepare(`INSERT INTO warnings (userId, guildId, moderatorId, reason) VALUES (?, ?, ?, ?)`);
            insertStmt.run(message.author.id, message.guild.id, client.user.id, `Automod: ${violation}`);

            await message.channel.send({ content: `${message.author}, Please refrain from rule-breaking acts (${violation}). You have been warned.` }).then(m => {
                setTimeout(() => m.delete().catch(()=>null), 5000);
            });

            logger.logAction(client, {
                action: 'WARN',
                user: message.author,
                moderator: client.user,
                reason: `Automod: ${violation}`
            });

            // Check if escalate
            await autoPunish.evaluatePunishment(client, message.member, message.guild, `Automod escalation: ${violation}`);
        }
    },
};
