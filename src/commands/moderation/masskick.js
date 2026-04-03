const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    category: 'moderation',
    modOnly: true,
    data: new SlashCommandBuilder()
        .setName('masskick')
        .setDescription('Kick all users with a specific role')
        .addRoleOption(option => option.setName('role').setDescription('The role target for mass-eviction').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('The reason for the mass kick').setRequired(false)),
    async execute(interaction, client) {
        const role = interaction.options.getRole('role');
        const reason = interaction.options.getString('reason') ?? 'Mass Liquidation Protocol';

        const members = interaction.guild.members.cache.filter(m => m.roles.cache.has(role.id));
        let count = 0;

        for (const [id, member] of members) {
            try {
                if (member.kickable) {
                    await member.kick(`Mass Kick by ${interaction.user.tag}: ${reason}`);
                    count++;
                }
            } catch (e) {
                console.error(`Failed to kick ${member.user.tag}`);
            }
        }

        const embed = new EmbedBuilder()
            .setTitle('☢️ Mass Kick Executed')
            .setColor('#D4AF37')
            .setDescription(`┃ Target Role » ${role}\n┃ Successfully Evicted » **${count}** members.\n┃ Protocol Reason » ${reason}`)
            .setFooter({ text: 'Administrative Protocol: Level 5 Enforcement' })
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
    },
};
