const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../../database/db');

module.exports = {
    category: 'moderation',
    modOnly: true,
    data: new SlashCommandBuilder()
        .setName('audit')
        .setDescription('Shows the 10 most recent warnings given in the server'),
    async execute(interaction, client) {
        
        try {
            const rows = db.prepare('SELECT * FROM warnings WHERE guildId = ? ORDER BY timestamp DESC LIMIT 10').all(interaction.guild.id);

            if (rows.length === 0) {
                const emptyEmbed = new EmbedBuilder().setColor('#D4AF37').setDescription('» ⚠️ No administrative audit logs found in the database.');
                return interaction.followUp({ embeds: [emptyEmbed] });
            }

            const embed = new EmbedBuilder()
                .setTitle('📜 Recent Administrative Audit')
                .setColor('#D4AF37')
                .setTimestamp();

            const auditList = rows.map((row, index) => {
                return `**${index + 1}.** <@${row.userId}> » \`${row.reason}\`\n┗ By <@${row.moderatorId}> • <t:${Math.floor(new Date(row.timestamp).getTime() / 1000)}:R>`;
            }).join('\n\n');

            embed.setDescription(auditList);
            await interaction.followUp({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.followUp({ content: '❌ Failed to fetch audit logs.' });
        }
    },
};
