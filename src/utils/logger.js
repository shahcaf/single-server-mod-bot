const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../../config.json');

module.exports = {
    async logAction(client, { action, user, moderator, reason }) {
        try {
            const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
            const logChannelId = config.channels?.modLogs;

            if (!logChannelId) return;

            const channel = client.channels.cache.get(logChannelId);
            if (!channel) return;

            const guild = client.guilds.cache.get(process.env.GUILD_ID);
            const embed = new EmbedBuilder()
                .setAuthor({ name: action, iconURL: client.user.displayAvatarURL() })
                .setColor(this.getColor(action))
                .addFields(
                    { name: '┃ Target', value: `» ${user.tag} (\`${user.id}\`)`, inline: false },
                    { name: '┃ Moderator', value: `» ${moderator.tag}`, inline: true },
                    { name: '┃ Reason', value: `» ${reason || 'Not documented'}`, inline: true }
                )
                .setFooter({ text: 'Administrative Logs', iconURL: guild?.iconURL() })
                .setTimestamp();

            await channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('[Logger Error]', error);
        }
    },

    getColor(action) {
        const colors = {
            'BAN': '#ff0000',
            'KICK': '#ff8800',
            'TIMEOUT': '#ffff00',
            'UNTIMEOUT': '#00ff00',
            'WARN': '#ffcc00',
            'CLEAR_WARNINGS': '#00ffaa'
        };
        return colors[action.toUpperCase()] || '#808080';
    }
};
