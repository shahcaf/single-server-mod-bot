const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    category: 'moderation',
    modOnly: true,
    data: new SlashCommandBuilder()
        .setName('slowmode')
        .setDescription('Sets the slowmode for the current channel')
        .addIntegerOption(option => option.setName('seconds').setDescription('Slowmode duration in seconds (0 to disable)').setRequired(true)),
    async execute(interaction, client) {
        const seconds = interaction.options.getInteger('seconds');

        try {
            await interaction.channel.setRateLimitPerUser(seconds);
            
            const embed = new EmbedBuilder()
                .setTitle('⏳ Channel Pace Adjusted')
                .setColor('#D4AF37')
                .setDescription(`┃ Slowmode has been set to **${seconds}** seconds.\n┃ Applied to » ${interaction.channel}`)
                .setFooter({ text: 'Administrative Traffic Control' })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.editReply({ content: '❌ Failed to adjust channel slowmode.' });
        }
    },
};
