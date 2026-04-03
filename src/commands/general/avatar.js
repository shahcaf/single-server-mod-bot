const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    category: 'general',
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Displays a user\'s profile picture')
        .addUserOption(option => option.setName('target').setDescription('The user whose avatar to display').setRequired(false)),
    async execute(interaction, client) {
        const user = interaction.options.getUser('target') || interaction.user;

        const embed = new EmbedBuilder()
            .setTitle(`📸 Identity Visualization: ${user.tag}`)
            .setColor('#D4AF37')
            .setImage(user.displayAvatarURL({ dynamic: true, size: 1024 }))
            .setFooter({ text: 'Administrative Vision Protocol' })
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
    },
};
