const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const webhook = require('../../utils/webhook');

module.exports = {
    category: 'developer',
    devOnly: true,
    data: new SlashCommandBuilder()
        .setName('logupdate')
        .setDescription('Announce a new bot update via the public webhook.')
        .addStringOption(option => option.setName('type').setDescription('The update title (e.g. New Command, Bug Fix)').setRequired(true))
        .addStringOption(option => option.setName('details').setDescription('The specifics of the update (use \\n for new lines)').setRequired(true)),
    async execute(interaction, client) {
        const type = interaction.options.getString('type');
        const details = interaction.options.getString('details').replace(/\\n/g, '\n');

        try {
            await webhook.sendUpdateNotification(type, details);
            
            const successEmbed = new EmbedBuilder()
                .setTitle('🚀 Update Log Distributed')
                .setColor('#D4AF37')
                .setDescription(`┃ The update has been successfully broadcast to the public channel via your webhook.`)
                .setTimestamp();
            
            await interaction.editReply({ embeds: [successEmbed] });
        } catch (error) {
            console.error(error);
            await interaction.editReply({ content: '❌ Failed to distribute update via webhook.' });
        }
    },
};
