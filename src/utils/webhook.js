const { WebhookClient, EmbedBuilder } = require('discord.js');
require('dotenv').config();

module.exports = {
    async sendUpdateNotification(type, details) {
        const webhookUrl = process.env.UPDATE_WEBHOOK;
        if (!webhookUrl) return;

        try {
            const webhookClient = new WebhookClient({ url: webhookUrl });
            const embed = new EmbedBuilder()
                .setTitle(`🚀 System Update: ${type}`)
                .setColor('#D4AF37')
                .setThumbnail('https://cdn.discordapp.com/emojis/1042127271810531328.webp?size=128')
                .setDescription(details)
                .setFooter({ text: 'Automated Update Distribution Protocol' })
                .setTimestamp();

            await webhookClient.send({
                username: 'Bot Development Matrix',
                avatarURL: 'https://cdn.discordapp.com/emojis/1042127271810531328.webp?size=128',
                embeds: [embed]
            });
        } catch (error) {
            console.error('[Webhook Error]', error);
        }
    }
};
