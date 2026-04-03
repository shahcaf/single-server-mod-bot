const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    category: 'general',
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Check the bot latency'),
    async execute(interaction, client) {
        const pingEmbed = new EmbedBuilder()
            .setColor('#D4AF37')
            .setTitle('🏓 Pong!')
            .addFields(
                { name: 'Gateway Latency', value: `\`${client.ws.ping}ms\``, inline: true },
                { name: 'API Latency', value: `\`${Date.now() - interaction.createdTimestamp}ms\``, inline: true }
            )
            .setTimestamp();

        await interaction.editReply({ embeds: [pingEmbed] });
    },
};
