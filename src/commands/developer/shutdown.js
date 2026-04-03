const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    category: 'developer',
    devOnly: true,
    data: new SlashCommandBuilder()
        .setName('shutdown')
        .setDescription('Stop the bot process (Developer Only)'),
    async execute(interaction, client) {
        const embed = new EmbedBuilder()
            .setTitle('⚙️ System Shutdown')
            .setColor('#D4AF37')
            .setDescription('┃ Terminating the process. Initializing offline sequence...')
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
        
        console.log(`[System] Shutdown initiated by ${interaction.user.tag}`);
        process.exit(0);
    },
};
