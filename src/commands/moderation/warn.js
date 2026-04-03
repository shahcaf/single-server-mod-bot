const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const logger = require('../../utils/logger');
const db = require('../../database/db');
const autoPunish = require('../../utils/autoPunish');

module.exports = {
    modOnly: true,
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Warn a user')
        .addUserOption(option => option.setName('target').setDescription('The user to warn').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Reason for the warning').setRequired(true)),
    async execute(interaction, client) {
        
        const target = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason');
        const member = interaction.guild.members.cache.get(target.id);

        const errorEmbed = (msg) => new EmbedBuilder().setColor('#D4AF37').setDescription(`» » ⚠️ ${msg}`);
        const successEmbed = new EmbedBuilder()
            .setAuthor({ name: 'Security Protocol: Warning', iconURL: client.user.displayAvatarURL() })
            .setColor('#D4AF37')
            .setThumbnail(target.displayAvatarURL())
            .addFields(
                { name: '┃ Enforcement', value: `» ${target.tag}`, inline: true },
                { name: '┃ Authorized By', value: `» ${interaction.user.tag}`, inline: true },
                { name: '┃ Rationale', value: `» ${reason}` }
            )
            .setFooter({ text: 'Administrative Protocol: Notice Issued' })
            .setTimestamp();

        if (!member) return interaction.followUp({ embeds: [errorEmbed('That user is not in the server.')] });

        if (member.user.bot) return interaction.followUp({ embeds: [errorEmbed('You cannot warn a bot.')] });

        try {
            const insertStmt = db.prepare(`INSERT INTO warnings (userId, guildId, moderatorId, reason) VALUES (?, ?, ?, ?)`);
            insertStmt.run(target.id, interaction.guild.id, interaction.user.id, reason);

            const dmEmbed = new EmbedBuilder()
                .setTitle(`Warned in ${interaction.guild.name}`)
                .setColor('#D4AF37')
                .setDescription(`Reason: ${reason}`)
                .setTimestamp();

            await member.send({ embeds: [dmEmbed] }).catch(() => null);
            await interaction.followUp({ embeds: [successEmbed] });
            
            logger.logAction(client, { action: 'WARN', user: target, moderator: interaction.user, reason });

            // Check if triggers auto punish
            await autoPunish.evaluatePunishment(client, member, interaction.guild, `Accumulated warning: ${reason}`);

        } catch (error) {
            console.error(error);
            await interaction.followUp({ embeds: [errorEmbed('An unexpected error occurred during warning enrollment.')] });
        }
    },
};
