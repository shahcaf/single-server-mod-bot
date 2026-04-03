const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const logger = require('../../utils/logger');

module.exports = {
    modOnly: true,
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick a user from the server')
        .addUserOption(option => option.setName('target').setDescription('The user to kick').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Reason for the kick').setRequired(false)),
    async execute(interaction, client) {
        const target = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason') ?? 'No reason provided';
        const member = interaction.guild.members.cache.get(target.id);

        const errorEmbed = (msg) => new EmbedBuilder().setColor('#D4AF37').setDescription(`» » ⚠️ ${msg}`);
        const successEmbed = new EmbedBuilder()
            .setAuthor({ name: 'Security Protocol: Kick', iconURL: client.user.displayAvatarURL() })
            .setColor('#D4AF37')
            .setThumbnail(target.displayAvatarURL())
            .addFields(
                { name: '┃ Enforcement', value: `» ${target.tag}`, inline: true },
                { name: '┃ Authorized By', value: `» ${interaction.user.tag}`, inline: true },
                { name: '┃ Rationale', value: `» ${reason}` }
            )
            .setFooter({ text: 'Administrative Authorization Granted' })
            .setTimestamp();

        if (!member) return interaction.editReply({ embeds: [errorEmbed('That user is not in the server.')], ephemeral: false });

        if (!member.kickable || member.roles.highest.position >= interaction.member.roles.highest.position) {
            return interaction.editReply({ embeds: [errorEmbed("I cannot kick this user.")], ephemeral: false });
        }

        try {
            const dmEmbed = new EmbedBuilder()
                .setTitle(`Kicked from ${interaction.guild.name}`)
                .setColor('#D4AF37')
                .setDescription(`Reason: ${reason}`)
                .setTimestamp();

            await member.send({ embeds: [dmEmbed] }).catch(() => null);
            await member.kick(reason);
            await interaction.editReply({ embeds: [successEmbed] });
            logger.logAction(client, { action: 'KICK', user: target, moderator: interaction.user, reason });
        } catch (error) {
            console.error(error);
            await interaction.editReply({ embeds: [errorEmbed('There was a technical error kicking this user.')], ephemeral: false });
        }
    },
};
