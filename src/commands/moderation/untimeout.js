const { SlashCommandBuilder } = require('discord.js');
const logger = require('../../utils/logger');

module.exports = {
    modOnly: true,
    data: new SlashCommandBuilder()
        .setName('untimeout')
        .setDescription('Remove a timeout from a user')
        .addUserOption(option => option.setName('target').setDescription('The user to untimeout').setRequired(true)),
    async execute(interaction, client) {
        const target = interaction.options.getUser('target');
        const member = interaction.guild.members.cache.get(target.id);

        if (!member) return interaction.editReply({ content: 'That user is not in the server.', ephemeral: false });

        if (!member.isCommunicationDisabled()) {
            return interaction.editReply({ content: "This user is not timed out.", ephemeral: false });
        }

        try {
            await member.timeout(null, `Removed by ${interaction.user.tag}`);
            await interaction.editReply({ content: `Removed timeout from ${target.tag}.` });
            logger.logAction(client, { action: 'UNTIMEOUT', user: target, moderator: interaction.user, reason: 'Manual Untimeout' });
        } catch (error) {
            console.error(error);
            await interaction.editReply({ content: 'There was an error untiming out this user.', ephemeral: false });
        }
    },
};
