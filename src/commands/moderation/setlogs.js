const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js');
const fs = require('fs');
const path = require('path');
const configPath = path.join(__dirname, '../../../config.json');

module.exports = {
    category: 'moderation',
    modOnly: true,
    data: new SlashCommandBuilder()
        .setName('setlogs')
        .setDescription('Sets the channel for moderation logs')
        .addChannelOption(option => 
            option.setName('channel')
            .setDescription('The channel to send server logs to')
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)),
    async execute(interaction, client) {
        const channel = interaction.options.getChannel('channel');

        try {
            const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
            config.channels.modLogs = channel.id;
            fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

            const embed = new EmbedBuilder()
                .setTitle('⚖️ Log Channel Updated')
                .setColor('#D4AF37')
                .setDescription(`┃ All moderation system events will now be logged to ${channel}.`)
                .setFooter({ text: 'Administrative Protocol Updated' })
                .setTimestamp();
            
            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            const errorEmbed = new EmbedBuilder().setColor('#D4AF37').setDescription('» ⚠️ Failed to update log channel configuration.');
            await interaction.editReply({ embeds: [errorEmbed], ephemeral: false });
        }
    },
};
