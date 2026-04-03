const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    category: 'developer',
    devOnly: true,
    data: new SlashCommandBuilder()
        .setName('backup')
        .setDescription('Creates a backup of the current database and configuration.'),
    async execute(interaction, client) {
        const dbPath = path.join(__dirname, '../../../database.sqlite');
        const configPath = path.join(__dirname, '../../../config.json');

        try {
            const dbAttachment = new AttachmentBuilder(dbPath);
            const configAttachment = new AttachmentBuilder(configPath);

            const embed = new EmbedBuilder()
                .setTitle('⚙️ System Backup Generated')
                .setColor('#D4AF37')
                .setDescription('┃ Database and Environment snapshot successfully exported for security.')
                .setTimestamp();

            await interaction.editReply({ 
                embeds: [embed], 
                files: [dbAttachment, configAttachment] 
            });
        } catch (error) {
            console.error(error);
            await interaction.editReply({ content: '❌ Failed to generate system backup.' });
        }
    },
};
