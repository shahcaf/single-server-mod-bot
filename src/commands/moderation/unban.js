const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const logger = require('../../utils/logger');

module.exports = {
    category: 'moderation',
    modOnly: true,
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Unban a user by their ID')
        .addStringOption(option => option.setName('userid').setDescription('The ID of the user to unban').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Reason for the unban').setRequired(false)),
    async execute(interaction, client) {
        
        const userId = interaction.options.getString('userid');
        const reason = interaction.options.getString('reason') ?? 'Protocol Overturned';

        const errorEmbed = (msg) => new EmbedBuilder().setColor('#D4AF37').setDescription(`» » ⚠️ ${msg}`);
        
        try {
            await interaction.guild.members.unban(userId, reason);
            
            const successEmbed = new EmbedBuilder()
                .setAuthor({ name: 'Security Protocol: Unban', iconURL: client.user.displayAvatarURL() })
                .setColor('#D4AF37')
                .addFields(
                    { name: '┃ Enforcement Revoked', value: `» <@${userId}> (\`${userId}\`)`, inline: true },
                    { name: '┃ Authorized By', value: `» ${interaction.user.tag}`, inline: true },
                    { name: '┃ Rationale', value: `» ${reason}` }
                )
                .setFooter({ text: 'Administrative Access Restored' })
                .setTimestamp();

            await interaction.followUp({ embeds: [successEmbed] });
            
            // For logger we need a user object. We'll try to fetch or just use ID.
            const userObj = { id: userId, tag: `User ID: ${userId}` };
            logger.logAction(client, { action: 'UNBAN', user: userObj, moderator: interaction.user, reason });

        } catch(e) {
            console.error(e);
            return interaction.followUp({ embeds: [errorEmbed('Failed to unban user. Make sure the ID is correct and they are banned.')] });
        }
    },
};
