const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../../database/db');

module.exports = {
    modOnly: true,
    data: new SlashCommandBuilder()
        .setName('warnings')
        .setDescription('Check the warnings of a user')
        .addUserOption(option => option.setName('target').setDescription('The user to check').setRequired(true)),
    async execute(interaction, client) {
        
        const target = interaction.options.getUser('target');

        try {
            const stmt = db.prepare('SELECT * FROM warnings WHERE userId = ? AND guildId = ? ORDER BY id DESC LIMIT 10');
            const warnings = stmt.all(target.id, interaction.guild.id);

            const stmtCount = db.prepare('SELECT COUNT(*) as count FROM warnings WHERE userId = ? AND guildId = ?');
            const dataResult = stmtCount.get(target.id, interaction.guild.id);
            const count = dataResult ? dataResult.count : 0;

            const embed = new EmbedBuilder()
                .setTitle(`📜 Warnings for ${target.tag}`)
                .setDescription(`┃ Total Warnings Recorded » **${count}**`)
                .setColor('#D4AF37')
                .setThumbnail(target.displayAvatarURL());

            if (warnings.length === 0) {
                embed.addFields({ name: '✧ Clean Record', value: 'This user has no historical warnings.' });
            } else {
                for (const warn of warnings) {
                    const mod = await client.users.fetch(warn.moderatorId).catch(() => null);
                    const modTag = mod ? mod.tag : 'System Handler';
                    embed.addFields({ 
                        name: `┃ Warn ID: ${warn.id} » <t:${Math.floor(new Date(warn.timestamp).getTime() / 1000)}:R>`, 
                        value: `**Reason:** ${warn.reason}\n**Authorized By:** ${modTag}` 
                    });
                }
            }

            await interaction.followUp({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.followUp({ content: '» » ⚠️ There was an error fetching administrative warnings.' });
        }
    },
};
