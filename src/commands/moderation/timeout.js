const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const logger = require('../../utils/logger');
const ms = require('ms');

module.exports = {
    modOnly: true,
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Timeout a user')
        .addUserOption(option => option.setName('target').setDescription('The user to timeout').setRequired(true))
        .addStringOption(option => option.setName('duration').setDescription('Duration (e.g. 10m, 1h, 1d)').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Reason for the timeout').setRequired(false)),
    async execute(interaction, client) {
        const target = interaction.options.getUser('target');
        const durationStr = interaction.options.getString('duration');
        const reason = interaction.options.getString('reason') ?? 'No reason provided';
        const member = interaction.guild.members.cache.get(target.id);

        const errorEmbed = (msg) => new EmbedBuilder().setColor('#D4AF37').setDescription(`» ⚠️ ${msg}`);
        const successEmbed = new EmbedBuilder()
            .setTitle('⏳ Member Timed Out')
            .setColor('#D4AF37')
            .setThumbnail(target.displayAvatarURL())
            .addFields(
                { name: 'User', value: `${target.tag}`, inline: true },
                { name: 'Duration', value: `${durationStr}`, inline: true },
                { name: 'Moderator', value: `${interaction.user.tag}`, inline: true },
                { name: 'Reason', value: reason }
            )
            .setTimestamp();

        if (!member) return interaction.editReply({ embeds: [errorEmbed('That user is not in the server.')], ephemeral: false });

        const durationMs = ms(durationStr);
        if (!durationMs || durationMs < 10000 || durationMs > 2419200000) {
            return interaction.editReply({ embeds: [errorEmbed('Invalid duration. Use formats like `10m`, `1h`, or `1d`.')], ephemeral: false });
        }

        if (member.roles.highest.position >= interaction.member.roles.highest.position) {
            return interaction.editReply({ embeds: [errorEmbed("I cannot timeout this user.")], ephemeral: false });
        }

        try {
            await member.timeout(durationMs, reason);
            await interaction.editReply({ embeds: [successEmbed] });
            logger.logAction(client, { action: 'TIMEOUT', user: target, moderator: interaction.user, reason: `${reason} (Duration: ${durationStr})` });
        } catch (error) {
            console.error(error);
            await interaction.editReply({ embeds: [errorEmbed('There was a technical error timing out this user.')], ephemeral: false });
        }
    },
};
