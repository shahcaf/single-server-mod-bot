const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    category: 'moderation',
    modOnly: true,
    data: new SlashCommandBuilder()
        .setName('nickname')
        .setDescription('Update a user\'s nickname')
        .addUserOption(option => option.setName('target').setDescription('The user to rename').setRequired(true))
        .addStringOption(option => option.setName('nick').setDescription('The new nickname (blank to reset)').setRequired(false)),
    async execute(interaction, client) {
        const target = interaction.options.getMember('target');
        const nick = interaction.options.getString('nick') ?? null;

        if (!target) return interaction.editReply({ content: '❌ Target user not found.' });

        try {
            await target.setNickname(nick);
            
            const embed = new EmbedBuilder()
                .setTitle('🏷️ Identity Protocol Updated')
                .setColor('#D4AF37')
                .setDescription(`┃ User » ${target}\n┃ New Alias » **${nick || 'Original Identity Restored'}**`)
                .setFooter({ text: 'Administrative Metadata Revision' })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.editReply({ content: '❌ I do not have permission to change that user\'s nickname.' });
        }
    },
};
