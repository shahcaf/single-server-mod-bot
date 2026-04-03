const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const configPath = path.join(__dirname, '../../../config.json');

module.exports = {
    category: 'developer',
    devOnly: true,
    data: new SlashCommandBuilder()
        .setName('maintenance')
        .setDescription('Toggles global maintenance mode')
        .addBooleanOption(option => option.setName('status').setDescription('Toggle on/off').setRequired(true)),
    async execute(interaction, client) {
        const status = interaction.options.getBoolean('status');

        try {
            const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
            config.maintenanceMode = status;
            fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

            const embed = new EmbedBuilder()
                .setTitle('⚙️ Maintenance System')
                .setColor('#D4AF37')
                .setDescription(`┃ Global Maintenance Mode has been set to: **${status ? 'ENABLED' : 'DISABLED'}**.`)
                .setFooter({ text: 'System-Wide Protocol Updated' })
                .setTimestamp();
            
            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.editReply({ content: '❌ Error updating maintenance configuration.' });
        }
    },
};
