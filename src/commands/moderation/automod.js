const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const configPath = path.join(__dirname, '../../../config.json');

module.exports = {
    category: 'moderation',
    modOnly: true,
    data: new SlashCommandBuilder()
        .setName('automod')
        .setDescription('Toggles specific automod features')
        .addStringOption(option => 
            option.setName('feature')
            .setDescription('The automod feature to toggle')
            .addChoices(
                { name: 'Anti-Spam', value: 'antiSpam' },
                { name: 'Anti-Links', value: 'antiLinks' },
                { name: 'Anti-Invites', value: 'antiInvites' },
                { name: 'Bad words', value: 'badWords' },
                { name: 'Caps-Spam', value: 'capsSpam' }
            )
            .setRequired(true))
        .addBooleanOption(option => 
            option.setName('status')
            .setDescription('Toggles the feature on/off')
            .setRequired(true)),
    async execute(interaction, client) {
        const feature = interaction.options.getString('feature');
        const status = interaction.options.getBoolean('status');

        try {
            const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
            config.automod[feature].enabled = status;
            fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

            const embed = new EmbedBuilder()
                .setColor('#D4AF37')
                .setTitle(`🛡️ Automod Config Updated`)
                .setDescription(`Feature **${feature}** has been successfully turned **${status ? 'on' : 'off'}**.`)
                .setTimestamp();
            
            await interaction.editReply({ embeds: [embed], ephemeral: false });
        } catch (error) {
            console.error(error);
            const errorEmbed = new EmbedBuilder().setColor('#D4AF37').setDescription('❌ An error occurred while updating the configuration.');
            await interaction.editReply({ embeds: [errorEmbed], ephemeral: false });
        }
    },
};
