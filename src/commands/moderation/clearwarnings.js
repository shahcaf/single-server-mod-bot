const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../../database/db');
const logger = require('../../utils/logger');

module.exports = {
    modOnly: true,
    data: new SlashCommandBuilder()
        .setName('clearwarnings')
        .setDescription('Clear all warnings for a user')
        .addUserOption(option => option.setName('target').setDescription('The user whose warnings to clear').setRequired(true)),
    async execute(interaction, client) {
        const target = interaction.options.getUser('target');

        const errorEmbed = (msg) => new EmbedBuilder().setColor('#D4AF37').setDescription(`» » ⚠️ ${msg}`);
        const successEmbed = (msg) => new EmbedBuilder().setColor('#D4AF37').setDescription(`» ✅ ${msg}`);

        try {
            const stmt = db.prepare(`DELETE FROM warnings WHERE userId = ? AND guildId = ?`);
            const info = stmt.run(target.id, interaction.guild.id);

            if (info.changes > 0) {
                await interaction.editReply({ embeds: [successEmbed(`Cleared ${info.changes} warning(s) for ${target.tag}.`)] });
                logger.logAction(client, { action: 'CLEAR_WARNINGS', user: target, moderator: interaction.user, reason: `Cleared ${info.changes} warnings` });
            } else {
                await interaction.editReply({ embeds: [errorEmbed(`${target.tag} has no warnings to clear.`)], ephemeral: false });
            }
        } catch (error) {
            console.error(error);
            await interaction.editReply({ embeds: [errorEmbed('There was a technical error clearing warnings.')], ephemeral: false });
        }
    },
};
